from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    uom = Column(String(30), default="Units", nullable=False)  # Unit of Measure: Units, Boxes, Kg, Liters
    unit_price = Column(Numeric(10, 2), default=0.00)
    initial_stock = Column(Integer, default=0)
    min_stock_alert = Column(Integer, default=10)  # Reorder alert threshold
    reorder_quantity = Column(Integer, default=50) # Suggested reorder quantity
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    category = relationship("Category", back_populates="products")
    stock_levels = relationship("StockLevel", back_populates="product", cascade="all, delete-orphan")
    receipt_items = relationship("ReceiptItem", back_populates="product")
    delivery_items = relationship("DeliveryItem", back_populates="product")
    transfer_items = relationship("TransferItem", back_populates="product")
    adjustments = relationship("StockAdjustment", back_populates="product")
    ledger_entries = relationship("StockLedger", back_populates="product")


class StockLevel(Base):
    __tablename__ = "stock_levels"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False, index=True)
    quantity_on_hand = Column(Integer, default=0, nullable=False)
    reserved_quantity = Column(Integer, default=0, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("product_id", "location_id", name="uq_product_location"),
    )

    # Relationships
    product = relationship("Product", back_populates="stock_levels")
    location = relationship("Location", back_populates="stock_levels")
