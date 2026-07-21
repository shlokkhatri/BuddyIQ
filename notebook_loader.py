import re
import json
from pathlib import Path
from pypdf import PdfReader
from pypdf.errors import PdfReadError
from pypdf.filters import LimitReachedError



NOTEBOOK_ROOT = Path("NOTEBOOKS")
CACHE_FILE = Path("notebook_index.json")

CHAPTER_FILE_PATTERN = re.compile(r"^Chapter (\d+) - (.+)$", re.IGNORECASE)



def extract_chapter_text(pdf_path: str, max_chars: int = 15000) -> str:
    reader = PdfReader(str(pdf_path))
    full_text = ""
    for i, page in enumerate(reader.pages):
        try:
            full_text += (page.extract_text() or "") + "\n"
        except (LimitReachedError, PdfReadError) as e:
            print(f"  (warning: couldn't read page {i + 1}, skipping — {e})")
            continue
    return full_text.strip()[:max_chars]

def discover_notebook(root: Path = NOTEBOOK_ROOT) -> dict:
    """
    Scans NOTEBOOKS/XII-<Subject>[ Part N]/Chapter N - Title.pdf and returns:
    {
      "Physics": [{"chapter_num": 1, "part": 1, "title": "...", "path": "..."}],
      ...
    }
    """
    subjects = {}

    for folder in sorted(root.iterdir()):
        if not folder.is_dir() or folder.name == "_extras":
            continue

        name = folder.name.replace("XII-", "")
        part_match = re.search(r"Part (\d)", name)
        part = int(part_match.group(1)) if part_match else 1
        subject = re.sub(r"\s*Part \d", "", name).strip()

        subjects.setdefault(subject, [])

        for pdf_file in sorted(folder.glob("*.pdf")):
            match = CHAPTER_FILE_PATTERN.match(pdf_file.stem)
            if not match:
                continue

            chapter_num, title = match.groups()
            subjects[subject].append({
                "chapter_num": int(chapter_num),
                "part": part,
                "title": title.strip(),
                "path": str(pdf_file),
            })

    for subject in subjects:
        subjects[subject].sort(key=lambda c: (c["part"], c["chapter_num"]))

    return subjects


def get_notebook_index(force_refresh: bool = False) -> dict:
    if CACHE_FILE.exists() and not force_refresh:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)

    index = discover_notebook()
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, ensure_ascii=False)

    return index