from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.delivery import Delivery, DeliveryItem
from app.models.user import User
from app.schemas.movement import DeliveryCreate, DeliveryOut, DeliveryItemOut
from app.services.inventory_engine import validate_delivery

router = APIRouter()


def build_delivery_out(deliv: Delivery) -> DeliveryOut:
    return DeliveryOut(
        id=deliv.id,
        delivery_number=deliv.delivery_number,
        customer_name=deliv.customer_name,
        status=deliv.status,
        delivery_date=deliv.delivery_date,
        shipping_address=deliv.shipping_address,
        notes=deliv.notes,
        created_at=deliv.created_at,
        validated_at=deliv.validated_at,
        items=[
            DeliveryItemOut(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product.name if item.product else "",
                product_sku=item.product.sku if item.product else "",
                location_id=item.location_id,
                location_name=item.location.name if item.location else "",
                quantity=item.quantity
            )
            for item in deliv.items
        ]
    )


@router.get("", response_model=List[DeliveryOut])
def list_deliveries(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Delivery)
    if status_filter:
        query = query.filter(Delivery.status == status_filter.upper())
    deliveries = query.order_by(Delivery.created_at.desc()).all()
    return [build_delivery_out(d) for d in deliveries]


@router.post("", response_model=DeliveryOut, status_code=status.HTTP_201_CREATED)
def create_delivery(delivery_in: DeliveryCreate, db: Session = Depends(get_db)):
    if not delivery_in.items:
        raise HTTPException(status_code=400, detail="Delivery order must contain at least one item")

    count = db.query(Delivery).count() + 1
    del_num = f"DEL-{datetime.utcnow().year}-{count:04d}"

    delivery = Delivery(
        delivery_number=del_num,
        customer_name=delivery_in.customer_name,
        status="DRAFT",
        delivery_date=delivery_in.delivery_date or datetime.utcnow(),
        shipping_address=delivery_in.shipping_address,
        notes=delivery_in.notes
    )
    db.add(delivery)
    db.flush()

    for item in delivery_in.items:
        d_item = DeliveryItem(
            delivery_id=delivery.id,
            product_id=item.product_id,
            location_id=item.location_id,
            quantity=item.quantity
        )
        db.add(d_item)

    db.commit()
    db.refresh(delivery)
    return build_delivery_out(delivery)


@router.put("/{delivery_id}/status", response_model=DeliveryOut)
def update_delivery_status(delivery_id: int, new_status: str, db: Session = Depends(get_db)):
    valid_statuses = ["DRAFT", "PICKING", "PACKING", "CANCELLED"]
    if new_status.upper() not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid intermediate status. Allowed: {valid_statuses}")

    delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery order not found")
    if delivery.status == "VALIDATED":
        raise HTTPException(status_code=400, detail="Cannot alter status of a validated/shipped order")

    delivery.status = new_status.upper()
    db.commit()
    db.refresh(delivery)
    return build_delivery_out(delivery)


@router.post("/{delivery_id}/validate", response_model=DeliveryOut)
def validate_delivery_endpoint(
    delivery_id: int,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user)
):
    """
    Validates a delivery:
    - Verifies item availability
    - Atomically deducts quantity from location stock levels
    - Generates immutable StockLedger audit records
    - Updates status to VALIDATED
    """
    updated_delivery = validate_delivery(db=db, delivery_id=delivery_id, user_id=user.id if user else None)
    return build_delivery_out(updated_delivery)
