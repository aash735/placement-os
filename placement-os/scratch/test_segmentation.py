import pypdf
import re
import json
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

with open("scratch/syllabus.json", "r", encoding="utf-8") as f:
    syllabus = json.load(f)

for item in syllabus:
    topic = item["topic"]
    page_range = item["pageRange"]
    
    if topic in ["Synonyms", "Antonyms", "Sentence Improvement", "Comprehension", "Error Detection", "Vocabulary"]:
        continue
        
    print(f"\n--- Chapter: {topic} (PDF pages {page_range[0]}-{page_range[1]}) ---")
    
    # 1. Classify each page
    page_types = {}
    for p in range(page_range[0], min(page_range[1] + 1, len(reader.pages))):
        text = reader.pages[p].extract_text()
        ans_matches = len(re.findall(r"\d+\.\s*\([a-e]\)", text))
        opt_matches = len(re.findall(r"\(\s*[a-e]\s*\)", text))
        
        # Check if page is predominantly answers
        if ans_matches > 8:
            ptype = "ans"
        # Check if page has options (questions)
        elif opt_matches > 5 and "SOLUTIONS" not in text.upper() and "HINTS" not in text.upper():
            ptype = "q"
        # Otherwise it's solutions (or intro/solved examples)
        else:
            ptype = "sol"
        page_types[p] = ptype
        
    # 2. Segment into sections
    sections = []
    current_sec = None
    
    for p in range(page_range[0], min(page_range[1] + 1, len(reader.pages))):
        ptype = page_types[p]
        
        # We start a new section if we see 'q' and (we don't have a section, or the previous page was 'sol')
        # Actually, let's just group pages:
        # A section is a sequence of Q pages, followed by ANS pages, followed by SOL pages.
        if ptype == "q":
            if current_sec is None or current_sec["sol_pages"]:
                if current_sec:
                    sections.append(current_sec)
                current_sec = {
                    "name": f"Exercise {len(sections)+1}",
                    "q_pages": [],
                    "ans_pages": [],
                    "sol_pages": []
                }
            current_sec["q_pages"].append(p)
        elif ptype == "ans":
            if current_sec:
                current_sec["ans_pages"].append(p)
        elif ptype == "sol":
            if current_sec:
                current_sec["sol_pages"].append(p)
                
    if current_sec:
        sections.append(current_sec)
        
    for sec in sections:
        print(f"  {sec['name']}:")
        print(f"    Q pages  ({len(sec['q_pages'])}): {sec['q_pages']}")
        print(f"    ANS pages({len(sec['ans_pages'])}): {sec['ans_pages']}")
        print(f"    SOL pages({len(sec['sol_pages'])}): {sec['sol_pages']}")
