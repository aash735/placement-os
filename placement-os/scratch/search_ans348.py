import pypdf
import re
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

# Scan pages 549 to 563
for p in range(549, 564):
    text = reader.pages[p].extract_text()
    lines = text.split("\n")
    for idx, line in enumerate(lines):
        if "141" in line or "161" in line:
            print(f"\n--- Page {p}, Line {idx} ---")
            start = max(0, idx - 3)
            end = min(len(lines), idx + 4)
            for i in range(start, end):
                prefix = "-> " if i == idx else "   "
                print(f"{prefix}{i}: {lines[i]}")
