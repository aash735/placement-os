import pypdf
import re
import sys
import os

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.abspath("scripts"))
import extract_rs_aggarwal

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

# Let's run a custom check
topic = "Average"
start_page, end_page = 214, 248

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

# Clean classifications
for i in range(1, len(pages) - 1):
    p = pages[i]
    prev_p = pages[i-1]
    next_p = pages[i+1]
    if page_types[p] in ["ans", "sol"] and page_types[prev_p] == "q" and page_types[next_p] == "q":
        page_types[p] = "q"
        
# Group runs
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

q_runs = [r for r in runs if r["type"] == "q"]
ans_runs = [r for r in runs if r["type"] == "ans"]
sol_runs = [r for r in runs if r["type"] == "sol"]

print(f"Q runs: {[r['pages'] for r in q_runs]}")
print(f"Ans runs: {[r['pages'] for r in ans_runs]}")
print(f"Sol runs: {[r['pages'] for r in sol_runs]}")

# Let's inspect the solution parsing of run 0
sol_pages = sol_runs[0]["pages"]
print(f"\nParsing solutions from pages: {sol_pages}")
solutions = {}
current_num = 0
current_text = []
for p in sol_pages:
    text = reader.pages[p].extract_text()
    lines = text.split("\n")
    for line in lines:
        match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
        if match:
            num = int(match.group(1))
            is_valid = False
            if current_num == 0:
                is_valid = True
            else:
                if current_num < num <= current_num + 10:
                    is_valid = True
                    
            if is_valid:
                if current_num > 0:
                    solutions[current_num] = " ".join(current_text).strip()
                current_num = num
                current_text = [match.group(2)]
            else:
                current_text.append(line.strip())
        else:
            if current_num > 0:
                current_text.append(line.strip())
if current_num > 0:
    solutions[current_num] = " ".join(current_text).strip()

print(f"Parsed {len(solutions)} solutions. Keys: {sorted(solutions.keys())[:10]} ... {sorted(solutions.keys())[-10:]}")
