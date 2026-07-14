import sys
import os
import pandas as pd

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(PROJECT_ROOT, "yield_model", "data", "yield_data", "combined", "final_master_yield_dataset.csv")

print("Loading dataset...")
chunks = []
for chunk in pd.read_csv(DATA_PATH, low_memory=False, chunksize=200_000):
    if 'Yield' in chunk.columns:
        sub = chunk[chunk['Yield'].notna()].copy()
    elif 'Element' in chunk.columns and 'Value' in chunk.columns:
        sub = chunk[chunk['Element'] == 'Yield'].copy()
        sub = sub.rename(columns={'Value': 'Yield'})
    else:
        continue
    sub['Yield'] = pd.to_numeric(sub['Yield'], errors='coerce')
    sub = sub[sub['Yield'] > 0]
    if len(sub) > 0:
        chunks.append(sub)

df = pd.concat(chunks, ignore_index=True)
print(df['Yield'].describe())
print("\nSample values:")
print(df[['Area', 'Item', 'Year', 'Yield']].head(20))
