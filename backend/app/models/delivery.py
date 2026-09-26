from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)
    delivery_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. DEL-2026-001
    customer_name = Column(String(200), nullable=False)
    status = Column(String(30), default="DRAFT", index=True) # DRAFT, PICKING, PACKING, VALIDATED, CANCELLED
    delivery_date = Column(DateTime, default=datetime.utcnow)
    shipping_address = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    validated_at = Column(DateTime, nullable=True)

    # Relationships
    items = relationship("DeliveryItem", back_populates="delivery", cascade="all, delete-orphan")


class DeliveryItem(Base):
    __tablename__ = "delivery_items"

    id = Column(Integer, primary_key=True, index=True)
    delivery_id = Column(Integer, ForeignKey("deliveries.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    quantity = Column(Integer, nullable=False)

    # Relationships
    delivery = relationship("Delivery", back_populates="items")
    product = relationship("Product", back_populates="delivery_items")
    location = relationship("Location", back_populates="delivery_items")
