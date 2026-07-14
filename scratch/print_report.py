import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
REPORT_PATH = os.path.join(PROJECT_ROOT, "yield_model", "reports", "regression_report_phase3.txt")

if os.path.exists(REPORT_PATH):
    with open(REPORT_PATH, 'r') as f:
        print(f.read())
else:
    print("Report not found.")
