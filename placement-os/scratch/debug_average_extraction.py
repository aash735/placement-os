import pypdf
import re
import sys
import json

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

import sys
import os
sys.path.insert(0, os.path.abspath("scripts"))
from extract_rs_aggarwal import parse_chapter_questions

print("Running parse_chapter_questions for Average...")
qs = parse_chapter_questions(reader, "Average", 214, 248)
print(f"Extracted {len(qs)} questions.")
if qs:
    print("First 3 questions:")
    for q in qs[:3]:
        print(f"ID: {q['id']}")
        print(f"Q: {q['question']}")
        print(f"Options: {q['options']}")
        print(f"Ans: {q['answer']}")
        print(f"Exp: {q['explanation'][:100]}...")
        print("-" * 30)
