import os
import pandas as pd

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
YIELD2_PATH = os.path.join(PROJECT_ROOT, "yield_model", "data", "yield_data", "cleaned", "yield2_clean.csv")

if os.path.exists(YIELD2_PATH):
    df = pd.read_csv(YIELD2_PATH)
    print("Yield2 stats:")
    print(df['Yield'].describe())
    print("\nSample values:")
    print(df[['Area', 'Item', 'Year', 'Season', 'Area', 'Production', 'Yield']].head(20))
else:
    print("yield2_clean.csv not found.")
