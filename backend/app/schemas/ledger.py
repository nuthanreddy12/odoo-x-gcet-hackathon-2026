from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class StockLedgerOut(BaseModel):
    id: int
    timestamp: datetime
    product_id: int
    product_name: Optional[str] = None
    product_sku: Optional[str] = None
    location_id: int
    location_name: Optional[str] = None
    warehouse_name: Optional[str] = None
    change_qty: int
    balance_after: int
    action_type: str
    reference_doc_type: Optional[str] = None
    reference_doc_number: Optional[str] = None
    user_id: Optional[int] = None
    user_email: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True
