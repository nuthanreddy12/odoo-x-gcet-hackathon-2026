import asyncio
from main import app, init_db
from app.core.database import SessionLocal
from app.api.v1.endpoints.adjustments import create_stock_adjustment
from app.api.v1.endpoints.receipts import create_receipt, validate_receipt_endpoint
from app.api.v1.endpoints.deliveries import create_delivery, update_delivery_status, validate_delivery_endpoint
from app.schemas.movement import AdjustmentCreate, ReceiptCreate, ReceiptItemCreate, DeliveryCreate, DeliveryItemCreate

# Run table migrations
init_db()

db = SessionLocal()
try:
    # 1. Test adjustments endpoint without auth header (user=None)
    adj_in = AdjustmentCreate(
        product_id=1,
        location_id=1,
        counted_qty=45,
        reason="Routine Audit Check"
    )
    adj_out = create_stock_adjustment(adj_in=adj_in, db=db, user=None)
    print("1. Adjustment successfully created without auth:")
    print(f"   Adj Number: {adj_out.adjustment_number}, Diff: {adj_out.diff_qty}, By: {adj_out.adjusted_by}")
    assert adj_out.adjustment_number.startswith("ADJ-")
    assert adj_out.adjusted_by == "Inventory Staff"

    # 2. Test Receipt creation with WH/IN/#### reference and scheduled_date
    rec_in = ReceiptCreate(
        supplier_name="Steel Mill Direct",
        scheduled_date="2026-10-01T10:00:00",
        items=[
            ReceiptItemCreate(product_id=1, location_id=1, quantity=30, unit_cost=120.0)
        ]
    )
    rec_out = create_receipt(receipt_in=rec_in, db=db, user=None)
    print("\n2. Receipt created:")
    print(f"   Receipt Number: {rec_out.receipt_number}")
    print(f"   Status: {rec_out.status}")
    print(f"   Scheduled Date: {rec_out.scheduled_date}")
    assert "/IN/" in rec_out.receipt_number
    assert rec_out.status == "DRAFT"

    # 3. Test Receipt validation -> status DONE
    rec_val = validate_receipt_endpoint(receipt_id=rec_out.id, db=db, user=None)
    print("\n3. Receipt validated:")
    print(f"   Status after validation: {rec_val.status}")
    assert rec_val.status == "DONE"

    # 4. Test Delivery creation with WH/OUT/#### reference and scheduled_date
    del_in = DeliveryCreate(
        customer_name="Industrial Solutions Ltd",
        scheduled_date="2026-10-02T14:00:00",
        shipping_address="Building 4B, Sector 9",
        items=[
            DeliveryItemCreate(product_id=1, location_id=1, quantity=10)
        ]
    )
    del_out = create_delivery(delivery_in=del_in, db=db, user=None)
    print("\n4. Delivery created:")
    print(f"   Delivery Number: {del_out.delivery_number}")
    print(f"   Status: {del_out.status}")
    print(f"   Scheduled Date: {del_out.scheduled_date}")
    assert "/OUT/" in del_out.delivery_number
    assert del_out.status == "DRAFT"

    # 5. Test Delivery status progression to READY then DONE
    del_ready = update_delivery_status(delivery_id=del_out.id, new_status="READY", db=db)
    print("\n5. Delivery advanced to READY:")
    print(f"   Status: {del_ready.status}")
    assert del_ready.status == "READY"

    del_done = validate_delivery_endpoint(delivery_id=del_out.id, db=db, user=None)
    print("\n6. Delivery validated/completed:")
    print(f"   Status after dispatch: {del_done.status}")
    assert del_done.status == "DONE"

    print("\n=======================================================")
    print(">>> ALL PHASE 1 BACKEND VERIFICATION TESTS PASSED! <<<")
    print("=======================================================")
finally:
    db.close()
