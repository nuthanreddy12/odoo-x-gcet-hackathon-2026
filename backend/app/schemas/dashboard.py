from datetime import datetime
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
    # Phase 3 required KPI additions
    receipts_to_receive: int = 0
    deliveries_to_deliver: int = 0
    late_operations: int = 0
    waiting_operations: int = 0


class OperationSummary(BaseModel):
    operation_type: str  # "Receipts", "Deliveries", "Internal Transfers"
    total_count: int = 0
    to_process: int = 0
    late_count: int = 0
    waiting_count: int = 0


class DashboardDocumentItem(BaseModel):
    id: int
    document_type: str  # "Receipt", "Delivery", "Internal", "Adjustment"
    document_number: str
    status: str  # "DRAFT", "WAITING", "READY", "DONE", "CANCELLED"
    partner_or_reference: Optional[str] = None
    warehouse_id: Optional[int] = None
    warehouse_name: Optional[str] = None
    location_id: Optional[int] = None
    location_name: Optional[str] = None
    category_id: Optional[int] = None
    category_name: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    is_late: bool = False
    items_count: int = 0
    total_quantity: int = 0
    created_at: datetime


class DashboardSummary(BaseModel):
    kpis: DashboardKPI
    operation_summaries: List[OperationSummary] = []
    operations: List[DashboardDocumentItem] = []
    low_stock_items: List[ProductOut] = []
    category_distribution: List[CategoryStock] = []
    movement_trends: List[MovementTrend] = []
    recent_movements: List[StockLedgerOut] = []
