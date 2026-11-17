#!/usr/bin/env python3
"""
Write essays/manifest.json: the list the live site reads to know which PDFs
exist. The deploy workflow runs this for you on every push, so normally you
never touch it. Run it yourself only to check what the site will show:

    python3 tools/build-manifest.py            # writes essays/manifest.json
    python3 tools/build-manifest.py some/dir   # a different folder

For each PDF it records the filename, size, page count, and the Title and
Subject stored inside the PDF (used when the filename has no title, and as
the summary line). Page count and the stored fields need `pdfinfo`
(poppler-utils); without it you still get a working list from filenames.

Needs nothing but Python 3.
"""
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
folder = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "essays")
HAVE_PDFINFO = shutil.which("pdfinfo") is not None


def pdf_info(path):
    if not HAVE_PDFINFO:
        return {}
    try:
        out = subprocess.run(["pdfinfo", "-enc", "UTF-8", path],
                             capture_output=True, text=True, timeout=30).stdout
    except (OSError, subprocess.SubprocessError):
        return {}
    info = {}
    for line in out.splitlines():
        key, _, val = line.partition(":")
        info[key.strip()] = val.strip()
    return info


essays = []
for name in sorted(os.listdir(folder)):
    if not re.search(r"\.pdf$", name, re.I) or name.startswith("."):
        continue
    path = os.path.join(folder, name)
    info = pdf_info(path)
    entry = {"file": name, "size": os.path.getsize(path)}
    if info.get("Pages", "").isdigit():
        entry["pages"] = int(info["Pages"])
    # Editors often fill Title with junk like "Microsoft Word - draft3.docx"
    # or the bare filename. Skip those.
    title = info.get("Title", "")
    if title and not re.search(r"\.(docx?|tex|pdf|odt)$|^untitled", title, re.I):
        entry["title"] = title
    if info.get("Subject"):
        entry["summary"] = info["Subject"]
    essays.append(entry)

with open(os.path.join(folder, "manifest.json"), "w", encoding="utf-8") as fh:
    json.dump(essays, fh, indent=1, ensure_ascii=False)
print(f"{len(essays)} essay(s) written to {os.path.relpath(os.path.join(folder, 'manifest.json'))}"
      + ("" if HAVE_PDFINFO else " (pdfinfo not found: no page counts or stored titles)"))
