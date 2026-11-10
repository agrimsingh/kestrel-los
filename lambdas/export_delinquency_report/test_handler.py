import logging

from handler import FIXTURE_ROWS, export_csv


def test_export_includes_header():
    csv_text = export_csv()
    assert "loan_id" in csv_text.splitlines()[0]
    assert "deferral_active" in csv_text.splitlines()[0]


def test_debug_log_redacts_loan_number(caplog):
    with caplog.at_level(logging.DEBUG, logger="handler"):
        export_csv()

    assert caplog.records
    for row in FIXTURE_ROWS:
        assert row["loan_number"] not in caplog.text
        assert row["loan_id"] in caplog.text
        assert row["loan_number"][-4:] in caplog.text
