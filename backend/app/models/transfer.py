from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class InternalTransfer(Base):
    __tablename__ = "internal_transfers"

    id = Column(Integer, primary_key=True, index=True)
    transfer_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. TRF-2026-001
    source_location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    dest_location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    status = Column(String(30), default="DRAFT", index=True) # DRAFT, SCHEDULED, COMPLETED, CANCELLED
    scheduled_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    source_location = relationship("Location", foreign_keys=[source_location_id])
    dest_location = relationship("Location", foreign_keys=[dest_location_id])
    items = relationship("TransferItem", back_populates="transfer", cascade="all, delete-orphan")


class TransferItem(Base):
    __tablename__ = "transfer_items"

    id = Column(Integer, primary_key=True, index=True)
    transfer_id = Column(Integer, ForeignKey("internal_transfers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)

    # Relationships
    transfer = relationship("InternalTransfer", back_populates="items")
    product = relationship("Product", back_populates="transfer_items")
