from typing import List, Optional
from pydantic import BaseModel
from app.schemas.product import ProductOut
from app.schemas.ledger import StockLedgerOut


class CategoryStock(BaseModel):
    category_name: str
    product_count: int
    total_quantity: int


class MovementTrend(BaseModel):
    date: str
    receipts: int
    deliveries: int
    transfers: int


class DashboardKPI(BaseModel):
    total_products: int
    total_units_in_stock: int
    low_stock_count: int
    out_of_stock_count: int
    pending_receipts: int
    pending_deliveries: int
    scheduled_transfers: int


class DashboardSummary(BaseModel):
    kpis: DashboardKPI
    low_stock_items: List[ProductOut] = []
    category_distribution: List[CategoryStock] = []
    recent_movements: List[StockLedgerOut] = []
