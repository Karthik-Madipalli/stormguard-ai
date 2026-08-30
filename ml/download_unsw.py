"""Download the official UNSW-NB15 train/test CSVs without committing the dataset."""
from pathlib import Path
from urllib.request import urlretrieve

DATA_DIR = Path(__file__).parent / "data"
FILES = {
    "UNSW_NB15_training-set.csv": "https://raw.githubusercontent.com/ushukkla/nospammers/master/UNSW_NB15_training-set.csv",
    "UNSW_NB15_testing-set.csv": "https://raw.githubusercontent.com/oshoyemi/project/master/UNSW_NB15_testing-set.csv",
}
for name, url in FILES.items():
    target = DATA_DIR / name
    if target.exists():
        print(f"exists: {target}")
        continue
    print(f"downloading {name} from {url}")
    urlretrieve(url, target)
    print(f"saved: {target}")
print("Dataset source: UNSW Canberra Cyber, UNSW-NB15")
