from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., WH-MAIN, WH-NORTH
    address = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    locations = relationship("Location", back_populates="warehouse", cascade="all, delete-orphan")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    name = Column(String(100), nullable=False)  # e.g., "Zone A - Rack 01", "Receiving Dock"
    code = Column(String(50), index=True, nullable=False)  # e.g., "WH1-R01"
    is_active = Column(Boolean, default=True)

    # Relationships
    warehouse = relationship("Warehouse", back_populates="locations")
    stock_levels = relationship("StockLevel", back_populates="location")
    receipt_items = relationship("ReceiptItem", back_populates="location")
    delivery_items = relationship("DeliveryItem", back_populates="location")
    adjustments = relationship("StockAdjustment", back_populates="location")
    ledger_entries = relationship("StockLedger", back_populates="location")
