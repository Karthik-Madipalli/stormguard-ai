# stormguard-ai

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_HgsiUEu5GrdIFOx1Xj6ex0tIxu1h)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## StormGuard ML workflow

The repository now includes a reproducible ML workspace under `ml/`. The UNSW-NB15 CSVs are intentionally not committed because of their size; `ml/download_unsw.py` downloads the official train/test files on demand from a public mirror of the UNSW Canberra Cyber dataset.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r ml/requirements.txt
python ml/download_unsw.py
python ml/train.py
```

Training produces `ml/artifacts/metrics.json` and `ml/artifacts/unsw_nb15_model.joblib` locally. The training script performs categorical one-hot encoding, numeric standardization, and binary intrusion classification with `HistGradientBoostingClassifier`; it reports accuracy, precision, recall, F1, ROC-AUC, row counts, and a confusion matrix. The Next.js model endpoint reports `TRAINING_REQUIRED` with an explicit demo fallback until these generated artifacts exist, so the app no longer claims that hardcoded demo metrics are a trained model.

Dataset provenance: [UNSW-NB15 official project](https://research.unsw.edu.au/projects/unsw-nb15-dataset). The model is for research/demo use, not autonomous blocking. Production deployment should add signed artifact storage, authenticated inference, drift monitoring, calibration, and a review process for response actions.

## Submission checklist

- Working prototype: Next.js SOC dashboard with Neon-backed incidents, threats, events, analyst actions, and phishing analysis.
- AI model: run the commands above and include the generated metrics in the demo/report.
- Demo video: record a 3–5 minute flow covering the dashboard, incident investigation, analyst analysis, phishing scoring, and model provenance.
- Documentation: this README plus the generated metrics artifact and architecture pages.
- Optional deck: use the architecture, explainability, and model pages as the basis for 5–8 slides.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
