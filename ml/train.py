"""Train a reproducible UNSW-NB15 binary intrusion classifier.

Usage: python ml/download_unsw.py && python ml/train.py
Artifacts are intentionally generated locally and ignored by git.
"""
from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import HistGradientBoostingClassifier

ROOT = Path(__file__).parent
DATA = ROOT / "data"
ARTIFACTS = ROOT / "artifacts"
ARTIFACTS.mkdir(exist_ok=True)

DROP = {"id", "attack_cat", "label"}
def load(path: Path):
    frame = pd.read_csv(path)
    y = frame["label"].astype(int)
    X = frame.drop(columns=[c for c in DROP if c in frame.columns], errors="ignore")
    return X, y

train_x, train_y = load(DATA / "UNSW_NB15_training-set.csv")
test_x, test_y = load(DATA / "UNSW_NB15_testing-set.csv")
cat = train_x.select_dtypes(include=["object", "string"]).columns.tolist()
num = [c for c in train_x.columns if c not in cat]
prep = ColumnTransformer([("num", Pipeline([("scale", StandardScaler())]), num), ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), cat)])
model = HistGradientBoostingClassifier(max_iter=180, learning_rate=0.08, max_leaf_nodes=31, random_state=42)
pipeline = Pipeline([("preprocess", prep), ("classifier", model)])
pipeline.fit(train_x, train_y)
pred = pipeline.predict(test_x)
prob = pipeline.predict_proba(test_x)[:, 1]
cm = confusion_matrix(test_y, pred).tolist()
metrics = {"model":"HistGradientBoostingClassifier", "version":"unsw-nb15-v1", "dataset":"UNSW-NB15", "dataset_source":"UNSW Canberra Cyber official project", "train_rows":int(len(train_y)), "test_rows":int(len(test_y)), "features":int(train_x.shape[1]), "accuracy":round(float(accuracy_score(test_y,pred)),4), "precision":round(float(precision_score(test_y,pred,zero_division=0)),4), "recall":round(float(recall_score(test_y,pred,zero_division=0)),4), "f1":round(float(f1_score(test_y,pred,zero_division=0)),4), "roc_auc":round(float(roc_auc_score(test_y,prob)),4), "confusion":cm, "trained_at":"generated locally"}
joblib.dump(pipeline, ARTIFACTS / "unsw_nb15_model.joblib")
(ARTIFACTS / "metrics.json").write_text(json.dumps(metrics, indent=2))
print(json.dumps(metrics, indent=2))
