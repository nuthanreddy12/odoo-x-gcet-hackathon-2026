from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, dashboard, products, warehouses,
    receipts, deliveries, transfers, adjustments, ledger
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(products.router, prefix="/products", tags=["Products & Categories"])
api_router.include_router(warehouses.router, prefix="/warehouses", tags=["Warehouses & Locations"])
api_router.include_router(receipts.router, prefix="/receipts", tags=["Receipts"])
api_router.include_router(deliveries.router, prefix="/deliveries", tags=["Deliveries"])
api_router.include_router(transfers.router, prefix="/transfers", tags=["Internal Transfers"])
api_router.include_router(adjustments.router, prefix="/adjustments", tags=["Stock Adjustments"])
api_router.include_router(ledger.router, prefix="/ledger", tags=["Stock Ledger"])
