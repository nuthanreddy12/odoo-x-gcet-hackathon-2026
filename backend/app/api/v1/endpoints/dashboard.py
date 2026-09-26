from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard_service import get_dashboard_summary

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def read_dashboard_summary(
    warehouse_id: Optional[int] = Query(None, description="Filter by warehouse ID"),
    location_id: Optional[int] = Query(None, description="Filter by location ID"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    document_type: Optional[str] = Query(None, description="Filter by document type (receipt, delivery, internal, adjustment)"),
    status: Optional[str] = Query(None, description="Filter by status (DRAFT, WAITING, READY, DONE, CANCELLED)"),
    db: Session = Depends(get_db)
):
    """
    Get aggregated dashboard summary including KPI counts, operations summaries,
    low stock alerts, category distribution, movement trends, and recent ledger entries.
    """
    return get_dashboard_summary(
        db,
        warehouse_id=warehouse_id,
        location_id=location_id,
        category_id=category_id,
        document_type=document_type,
        status=status
    )
