from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.warehouse import Warehouse, Location
from app.schemas.warehouse import (
    WarehouseCreate, WarehouseOut, LocationCreate, LocationOut
)

router = APIRouter()


@router.get("", response_model=List[WarehouseOut])
def list_warehouses(db: Session = Depends(get_db)):
    return db.query(Warehouse).filter(Warehouse.is_active == True).all()


@router.post("", response_model=WarehouseOut, status_code=status.HTTP_201_CREATED)
def create_warehouse(wh_in: WarehouseCreate, db: Session = Depends(get_db)):
    existing = db.query(Warehouse).filter(Warehouse.code == wh_in.code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Warehouse code '{wh_in.code}' already exists")
    wh = Warehouse(name=wh_in.name, code=wh_in.code, address=wh_in.address, is_active=wh_in.is_active)
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return wh


@router.get("/locations", response_model=List[LocationOut])
def list_locations(warehouse_id: int = None, db: Session = Depends(get_db)):
    query = db.query(Location).filter(Location.is_active == True)
    if warehouse_id:
        query = query.filter(Location.warehouse_id == warehouse_id)
    return query.all()


@router.post("/locations", response_model=LocationOut, status_code=status.HTTP_201_CREATED)
def create_location(loc_in: LocationCreate, db: Session = Depends(get_db)):
    wh = db.query(Warehouse).filter(Warehouse.id == loc_in.warehouse_id).first()
    if not wh:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    loc = Location(warehouse_id=loc_in.warehouse_id, name=loc_in.name, code=loc_in.code, is_active=loc_in.is_active)
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc
