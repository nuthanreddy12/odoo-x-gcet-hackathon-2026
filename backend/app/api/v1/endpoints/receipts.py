from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.receipt import Receipt, ReceiptItem
from app.models.user import User
from app.schemas.movement import ReceiptCreate, ReceiptOut, ReceiptItemOut
from app.services.inventory_engine import validate_receipt

router = APIRouter()


def build_receipt_out(rec: Receipt) -> ReceiptOut:
    return ReceiptOut(
        id=rec.id,
        receipt_number=rec.receipt_number,
        supplier_name=rec.supplier_name,
        status=rec.status,
        receipt_date=rec.receipt_date,
        notes=rec.notes,
        created_at=rec.created_at,
        validated_at=rec.validated_at,
        items=[
            ReceiptItemOut(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product.name if item.product else "",
                product_sku=item.product.sku if item.product else "",
                location_id=item.location_id,
                location_name=item.location.name if item.location else "",
                quantity=item.quantity,
                unit_cost=item.unit_cost
            )
            for item in rec.items
        ]
    )


@router.get("", response_model=List[ReceiptOut])
def list_receipts(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Receipt)
    if status_filter:
        query = query.filter(Receipt.status == status_filter.upper())
    receipts = query.order_by(Receipt.created_at.desc()).all()
    return [build_receipt_out(r) for r in receipts]


@router.post("", response_model=ReceiptOut, status_code=status.HTTP_201_CREATED)
def create_receipt(receipt_in: ReceiptCreate, db: Session = Depends(get_db)):
    if not receipt_in.items:
        raise HTTPException(status_code=400, detail="Receipt must contain at least one product item")

    count = db.query(Receipt).count() + 1
    rec_num = f"REC-{datetime.utcnow().year}-{count:04d}"

    receipt = Receipt(
        receipt_number=rec_num,
        supplier_name=receipt_in.supplier_name,
        status="DRAFT",
        receipt_date=receipt_in.receipt_date or datetime.utcnow(),
        notes=receipt_in.notes
    )
    db.add(receipt)
    db.flush()

    for item in receipt_in.items:
        r_item = ReceiptItem(
            receipt_id=receipt.id,
            product_id=item.product_id,
            location_id=item.location_id,
            quantity=item.quantity,
            unit_cost=item.unit_cost
        )
        db.add(r_item)

    db.commit()
    db.refresh(receipt)
    return build_receipt_out(receipt)


@router.post("/{receipt_id}/validate", response_model=ReceiptOut)
def validate_receipt_endpoint(
    receipt_id: int,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user)
):
    """
    Validates a receipt:
    - Atomically updates location stock levels
    - Generates immutable StockLedger audit records
    - Updates status to VALIDATED
    """
    updated_receipt = validate_receipt(db=db, receipt_id=receipt_id, user_id=user.id if user else None)
    return build_receipt_out(updated_receipt)
