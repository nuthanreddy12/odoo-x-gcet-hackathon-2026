from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    receipt_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. REC-2026-001
    supplier_name = Column(String(200), nullable=False)
    status = Column(String(30), default="DRAFT", index=True) # DRAFT, READY, DONE, CANCELLED
    receipt_date = Column(DateTime, default=datetime.utcnow)
    scheduled_date = Column(DateTime, default=datetime.utcnow)
    responsible_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    validated_at = Column(DateTime, nullable=True)

    # Relationships
    responsible_user = relationship("User", foreign_keys=[responsible_user_id])
    items = relationship("ReceiptItem", back_populates="receipt", cascade="all, delete-orphan")


class ReceiptItem(Base):
    __tablename__ = "receipt_items"

    id = Column(Integer, primary_key=True, index=True)
    receipt_id = Column(Integer, ForeignKey("receipts.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_cost = Column(Numeric(10, 2), default=0.00)

    # Relationships
    receipt = relationship("Receipt", back_populates="items")
    product = relationship("Product", back_populates="receipt_items")
    location = relationship("Location", back_populates="receipt_items")
