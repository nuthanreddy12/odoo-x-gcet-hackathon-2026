from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.product import Product, StockLevel
from app.models.category import Category
from app.models.receipt import Receipt
from app.models.delivery import Delivery
from app.models.transfer import InternalTransfer
from app.models.ledger import StockLedger
from app.schemas.dashboard import DashboardKPI, DashboardSummary, CategoryStock
from app.schemas.product import ProductOut, StockLevelOut
from app.schemas.ledger import StockLedgerOut


def get_dashboard_summary(db: Session) -> DashboardSummary:
    # 1. Total products
    total_products = db.query(Product).count()

    # 2. Total units in stock
    total_units = db.query(func.coalesce(func.sum(StockLevel.quantity_on_hand), 0)).scalar()

    # 3. Pending operational documents
    pending_receipts = db.query(Receipt).filter(Receipt.status == "DRAFT").count()
    pending_deliveries = db.query(Delivery).filter(Delivery.status.in_(["DRAFT", "PICKING", "PACKING"])).count()
    scheduled_transfers = db.query(InternalTransfer).filter(InternalTransfer.status.in_(["DRAFT", "SCHEDULED"])).count()

    # 4. Product stock aggregations
    products = db.query(Product).all()
    low_stock_count = 0
    out_of_stock_count = 0
    low_stock_items: List[ProductOut] = []

    for p in products:
        prod_stock = sum(sl.quantity_on_hand for sl in p.stock_levels)
        status = "IN_STOCK"
        if prod_stock == 0:
            status = "OUT_OF_STOCK"
            out_of_stock_count += 1
        elif prod_stock <= p.min_stock_alert:
            status = "LOW_STOCK"
            low_stock_count += 1

        if status in ["LOW_STOCK", "OUT_OF_STOCK"]:
            p_out = ProductOut(
                id=p.id,
                name=p.name,
                sku=p.sku,
                category_id=p.category_id,
                category_name=p.category.name if p.category else "Uncategorized",
                uom=p.uom,
                unit_price=p.unit_price,
                initial_stock=p.initial_stock,
                min_stock_alert=p.min_stock_alert,
                reorder_quantity=p.reorder_quantity,
                description=p.description,
                total_stock=prod_stock,
                stock_status=status,
                created_at=p.created_at,
                updated_at=p.updated_at,
                stock_levels=[
                    StockLevelOut(
                        id=sl.id,
                        location_id=sl.location_id,
                        location_code=sl.location.code if sl.location else "",
                        location_name=sl.location.name if sl.location else "",
                        warehouse_name=sl.location.warehouse.name if (sl.location and sl.location.warehouse) else "",
                        quantity_on_hand=sl.quantity_on_hand,
                        reserved_quantity=sl.reserved_quantity
                    )
                    for sl in p.stock_levels
                ]
            )
            low_stock_items.append(p_out)

    # 5. Category distribution
    categories = db.query(Category).all()
    category_distribution: List[CategoryStock] = []
    for c in categories:
        count = len(c.products)
        qty = sum(
            sum(sl.quantity_on_hand for sl in prod.stock_levels)
            for prod in c.products
        )
        category_distribution.append(
            CategoryStock(
                category_name=c.name,
                product_count=count,
                total_quantity=qty
            )
        )

    # 6. Recent movements
    recent_ledger = (
        db.query(StockLedger)
        .order_by(StockLedger.timestamp.desc())
        .limit(10)
        .all()
    )
    recent_movements = [
        StockLedgerOut(
            id=entry.id,
            timestamp=entry.timestamp,
            product_id=entry.product_id,
            product_name=entry.product.name if entry.product else "",
            product_sku=entry.product.sku if entry.product else "",
            location_id=entry.location_id,
            location_name=entry.location.name if entry.location else "",
            warehouse_name=entry.location.warehouse.name if (entry.location and entry.location.warehouse) else "",
            change_qty=entry.change_qty,
            balance_after=entry.balance_after,
            action_type=entry.action_type,
            reference_doc_type=entry.reference_doc_type,
            reference_doc_number=entry.reference_doc_number,
            user_id=entry.user_id,
            user_email=entry.user.email if entry.user else "System",
            notes=entry.notes
        )
        for entry in recent_ledger
    ]

    return DashboardSummary(
        kpis=DashboardKPI(
            total_products=total_products,
            total_units_in_stock=total_units,
            low_stock_count=low_stock_count,
            out_of_stock_count=out_of_stock_count,
            pending_receipts=pending_receipts,
            pending_deliveries=pending_deliveries,
            scheduled_transfers=scheduled_transfers
        ),
        low_stock_items=low_stock_items,
        category_distribution=category_distribution,
        recent_movements=recent_movements
    )
