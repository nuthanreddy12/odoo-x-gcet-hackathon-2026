from typing import Optional, List
from pydantic import BaseModel


class LocationBase(BaseModel):
    name: str
    code: str
    is_active: Optional[bool] = True


class LocationCreate(LocationBase):
    warehouse_id: int


class LocationUpdate(BaseModel):
    warehouse_id: Optional[int] = None
    name: Optional[str] = None
    code: Optional[str] = None
    is_active: Optional[bool] = None


class LocationOut(LocationBase):
    id: int
    warehouse_id: int

    class Config:
        from_attributes = True


class WarehouseBase(BaseModel):
    name: str
    code: str
    address: Optional[str] = None
    is_active: Optional[bool] = True


class WarehouseCreate(WarehouseBase):
    pass


class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    address: Optional[str] = None
    is_active: Optional[bool] = None


class WarehouseOut(WarehouseBase):
    id: int
    locations: List[LocationOut] = []

    class Config:
        from_attributes = True
