from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class StockLedger(Base):
    __tablename__ = "stock_ledger"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False, index=True)
    change_qty = Column(Integer, nullable=False) # e.g. +10, -5
    balance_after = Column(Integer, nullable=False)
    action_type = Column(String(50), nullable=False, index=True) # RECEIPT, DELIVERY, TRANSFER_IN, TRANSFER_OUT, ADJUSTMENT, INITIAL
    reference_doc_type = Column(String(50), nullable=True) # Receipt, Delivery, Transfer, Adjustment
    reference_doc_number = Column(String(100), nullable=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)

    # Relationships
    product = relationship("Product", back_populates="ledger_entries")
    location = relationship("Location", back_populates="ledger_entries")
    user = relationship("User", back_populates="ledger_entries")
