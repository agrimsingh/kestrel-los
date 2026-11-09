from handler import export_csv


def test_export_includes_header():
    csv_text = export_csv()
    assert "loan_id" in csv_text.splitlines()[0]
    assert "deferral_active" in csv_text.splitlines()[0]
