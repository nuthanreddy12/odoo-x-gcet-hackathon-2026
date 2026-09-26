from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard_service import get_dashboard_summary

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def read_dashboard_summary(db: Session = Depends(get_db)):
    """
    Get aggregated dashboard summary including KPI counts, low stock alerts,
    category distribution, and recent ledger entries.
    """
    return get_dashboard_summary(db)
