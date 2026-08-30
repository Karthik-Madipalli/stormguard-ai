from pathlib import Path
import json

import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

ROOT = Path(__file__).parent
DATA = ROOT / "data"
ARTIFACTS = ROOT / "artifacts"

ARTIFACTS.mkdir(exist_ok=True)

train_file = DATA / "UNSW_NB15_training-set.csv"

df = pd.read_csv(train_file)

drop = [
    c for c in ["id", "label", "attack_cat"]
    if c in df.columns
]

X = df.drop(columns=drop)

categorical = X.select_dtypes(
    include=["object", "string"]
).columns

X = pd.get_dummies(
    X,
    columns=categorical,
    dummy_na=True
)

X = X.replace([float("inf"), float("-inf")], 0)
X = X.fillna(0)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

pca = PCA(n_components=2, random_state=42)
embedding = pca.fit_transform(X_scaled)

clusters = KMeans(
    n_clusters=6,
    random_state=42,
    n_init=10
).fit_predict(X_scaled)

output = []

for i in range(min(len(df), 1000)):
    output.append({
        "index": int(i),
        "cluster": int(clusters[i]),
        "x": round(float(embedding[i, 0]), 4),
        "y": round(float(embedding[i, 1]), 4),
        "attack": str(
            df.iloc[i]["attack_cat"]
            if "attack_cat" in df.columns
            else "unknown"
        )
    })

result = {
    "algorithm": "KMeans",
    "clusters": 6,
    "projection": "PCA",
    "samples": len(df),
    "points": output,
}

(ARTIFACTS / "clusters.json").write_text(
    json.dumps(result, indent=2)
)

print(json.dumps({
    "status": "complete",
    "clusters": 6,
    "samples": len(df)
}, indent=2))