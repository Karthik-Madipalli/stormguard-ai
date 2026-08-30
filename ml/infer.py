import json
import os
from pathlib import Path

import joblib
import pandas as pd

MODEL = Path(__file__).parent / "artifacts" / "unsw_nb15_model.joblib"


def predict(features: dict):
    if not MODEL.exists():
        raise FileNotFoundError(
            "Train the model first: python ml/download_unsw.py && python ml/train.py"
        )

    pipe = joblib.load(MODEL)
    row = pd.DataFrame([features])

    probability = float(pipe.predict_proba(row)[0, 1])

    return {
        "malicious_probability": round(probability, 4),
        "risk_score": round(probability * 100),
        "verdict": "MALICIOUS" if probability >= 0.5 else "NORMAL",
        "model": "UNSW-NB15 HistGradientBoosting v1",
    }


if __name__ == "__main__":
    raw = os.environ.get("STORMGUARD_FEATURES")

    if not raw:
        raise ValueError("STORMGUARD_FEATURES is required")

    features = json.loads(raw)
    print(json.dumps(predict(features)))