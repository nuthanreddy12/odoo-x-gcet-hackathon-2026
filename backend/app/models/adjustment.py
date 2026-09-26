from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class StockAdjustment(Base):
    __tablename__ = "stock_adjustments"

    id = Column(Integer, primary_key=True, index=True)
    adjustment_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. ADJ-2026-001
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    recorded_qty = Column(Integer, nullable=False)
    counted_qty = Column(Integer, nullable=False)
    diff_qty = Column(Integer, nullable=False) # counted_qty - recorded_qty
    reason = Column(String(255), nullable=False) # Damage, Cycle Count, Expiry, Theft, Found Stock
    notes = Column(Text, nullable=True)
    adjusted_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="adjustments")
    location = relationship("Location", back_populates="adjustments")
