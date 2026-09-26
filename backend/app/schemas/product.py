from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from decimal import Decimal


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class StockLevelOut(BaseModel):
    id: int
    location_id: int
    location_code: Optional[str] = None
    location_name: Optional[str] = None
    warehouse_name: Optional[str] = None
    quantity_on_hand: int
    reserved_quantity: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    sku: str
    category_id: Optional[int] = None
    uom: str = "Units"
    unit_price: Decimal = Decimal("0.00")
    min_stock_alert: int = 10
    reorder_quantity: int = 50
    description: Optional[str] = None


class ProductCreate(ProductBase):
    initial_stock: int = 0
    initial_location_id: Optional[int] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    uom: Optional[str] = None
    unit_price: Optional[Decimal] = None
    min_stock_alert: Optional[int] = None
    reorder_quantity: Optional[int] = None
    description: Optional[str] = None


class ProductOut(ProductBase):
    id: int
    initial_stock: int
    total_stock: int = 0
    stock_status: str = "IN_STOCK"  # IN_STOCK, LOW_STOCK, OUT_OF_STOCK
    category_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    stock_levels: List[StockLevelOut] = []

    class Config:
        from_attributes = True
