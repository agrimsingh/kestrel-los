"""Nightly delinquency roll-forward export for reporting."""

from __future__ import annotations

import csv
import io
import logging
from typing import Iterable

logger = logging.getLogger(__name__)

FIXTURE_ROWS = [
    {
        "loan_id": "loan-uuid-1",
        "loan_number": "1234567890",
        "days_delinquent": 45,
        "deferral_active": False,
    },
    {
        "loan_id": "loan-uuid-2",
        "loan_number": "9876543210",
        "days_delinquent": 12,
        "deferral_active": False,
    },
]


def export_csv(rows: Iterable[dict] | None = None) -> str:
    rows = list(FIXTURE_ROWS if rows is None else rows)
    buf = io.StringIO()
    writer = csv.DictWriter(
        buf,
        fieldnames=["loan_id", "loan_number", "days_delinquent", "deferral_active"],
    )
    writer.writeheader()
    for row in rows:
        logger.debug(
            "Exporting delinquency row for loanId=%s loan_number_last4=%s",
            row["loan_id"],
            str(row["loan_number"])[-4:],
        )
        writer.writerow(row)
    return buf.getvalue()
