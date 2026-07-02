import pypdf
import re
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

def analyze_chapter(topic, start_page, end_page):
    print(f"\n==================================================")
    print(f"ANALYZING CHAPTER: {topic} (pages {start_page} to {end_page})")
    print(f"==================================================")
    
    pages = list(range(start_page, min(end_page + 1, len(reader.pages))))
    page_types = {}
    
    for p in pages:
        text = reader.pages[p].extract_text()
        ans_matches = len(re.findall(r"\d+\.\s*\([a-e]\)", text))
        opt_matches = len(re.findall(r"\(\s*[a-e]\s*\)", text))
        
        ptype = "sol"
        if ans_matches > 8:
            ptype = "ans"
        elif opt_matches > 5 and "SOLUTIONS" not in text.upper() and "HINTS" not in text.upper():
            ptype = "q"
            
        page_types[p] = ptype
        print(f"Page {p:02d}: ans_matches={ans_matches:2d}, opt_matches={opt_matches:2d}, ptype={ptype} | First 40 chars: {repr(text.strip()[:40])}")
        
    # Clean classifications to remove out-of-place single pages
    for i in range(1, len(pages) - 1):
        p = pages[i]
        prev_p = pages[i-1]
        next_p = pages[i+1]
        if page_types[p] in ["ans", "sol"] and page_types[prev_p] == "q" and page_types[next_p] == "q":
            page_types[p] = "q"
            
    # Group into runs of consecutive page types
    runs = []
    current_run = {"type": None, "pages": []}
    for p in pages:
        ptype = page_types[p]
        if current_run["type"] is None:
            current_run = {"type": ptype, "pages": [p]}
        elif current_run["type"] == ptype:
            current_run["pages"].append(p)
        else:
            runs.append(current_run)
            current_run = {"type": ptype, "pages": [p]}
    if current_run["pages"]:
        runs.append(current_run)
        
    print("\nPage Runs:")
    for r in runs:
        print(f"  Type: {r['type']:4s} | Pages: {r['pages']}")

analyze_chapter("Average", 214, 248)
analyze_chapter("Time and Work", 534, 570)
