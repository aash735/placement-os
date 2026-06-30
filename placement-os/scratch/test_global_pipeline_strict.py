import pypdf
import re
import sys
import json

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

# Time and Work pages: 534 to 570
start_page, end_page = 534, 570

print("--- RUNNING STRICT GLOBAL PIPELINE FOR TIME & WORK ---")

# Step 1: Density-Based Page Classification
page_types = {}
for p in range(start_page, min(end_page + 1, len(reader.pages))):
    text = reader.pages[p].extract_text()
    ans_matches = len(re.findall(r"\d+\.\s*\([a-e]\)", text))
    opt_matches = len(re.findall(r"\(\s*[a-e]\s*\)", text))
    
    if ans_matches > 8:
        ptype = "ans"
    elif opt_matches > 5 and "SOLUTIONS" not in text.upper() and "HINTS" not in text.upper():
        ptype = "q"
    else:
        ptype = "sol"
    page_types[p] = ptype

# Step 2: Global Question Parsing (Only on 'q' pages)
questions_by_exercise = []
current_ex_qs = {}
prev_q_num = 0

# We track which pages belong to which exercise to separate them
q_pages_by_exercise = []
current_q_pages = []

for p in range(start_page, min(end_page + 1, len(reader.pages))):
    if page_types[p] != "q":
        continue
    
    text = reader.pages[p].extract_text()
    lines = text.split("\n")
    current_block = None
    
    # Check if this page starts a new exercise questions set
    # (e.g. if we had pages before, and this page has a lower number than previous page max)
    # Actually, we can check if number resets or if we have a gap in pages
    for line in lines:
        q_match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
        if q_match:
            num = int(q_match.group(1))
            if num == 1 or num < prev_q_num:
                if current_ex_qs:
                    questions_by_exercise.append(current_ex_qs)
                    current_ex_qs = {}
                    q_pages_by_exercise.append(current_q_pages)
                    current_q_pages = []
            
            # Simple option parsing for the block
            current_block = {
                "num": num,
                "text_lines": [q_match.group(2)],
                "options": []
            }
            current_ex_qs[num] = current_block
            prev_q_num = num
            if p not in current_q_pages:
                current_q_pages.append(p)
        else:
            if current_block:
                current_block["text_lines"].append(line)

if current_ex_qs:
    questions_by_exercise.append(current_ex_qs)
    q_pages_by_exercise.append(current_q_pages)

print(f"Parsed {len(questions_by_exercise)} question exercises:")
for idx, ex in enumerate(questions_by_exercise):
    print(f"  Ex {idx+1}: {len(ex)} questions (Min: {min(ex.keys())}, Max: {max(ex.keys())}) on pages {q_pages_by_exercise[idx]}")

# Step 3: Global Answer Parsing (Only on 'ans' pages)
answers_by_exercise = []
current_ex_ans = {}
prev_ans_num = 0

for p in range(start_page, min(end_page + 1, len(reader.pages))):
    if page_types[p] != "ans":
        continue
        
    text = reader.pages[p].extract_text()
    ans_matches = re.findall(r"(\d+)\.\s*\(\s*([a-e])\s*\)", text)
    
    for num_str, val in ans_matches:
        num = int(num_str)
        if num == 1 or num < prev_ans_num:
            if current_ex_ans:
                answers_by_exercise.append(current_ex_ans)
                current_ex_ans = {}
        current_ex_ans[num] = val.strip().lower()
        prev_ans_num = num

if current_ex_ans:
    answers_by_exercise.append(current_ex_ans)

print(f"Parsed {len(answers_by_exercise)} answer exercises:")
for idx, ex in enumerate(answers_by_exercise):
    print(f"  Ex {idx+1}: {len(ex)} answers (Min: {min(ex.keys())}, Max: {max(ex.keys())})")

# Step 4: Global Solution Parsing (Only on 'sol' pages)
solutions_by_exercise = []
current_ex_sols = {}
prev_sol_num = 0
current_text = []
current_num = 0

# We ignore solved examples in 'sol' pages (intro pages) by checking if we have started parsing a question exercise.
# Since solutions are after question pages, we only start parsing solutions on 'sol' pages if they appear after the first 'q' page.
first_q_page = min([p for p, t in page_types.items() if t == "q"])

for p in range(start_page, min(end_page + 1, len(reader.pages))):
    if page_types[p] != "sol" or p < first_q_page:
        continue
        
    text = reader.pages[p].extract_text()
    lines = text.split("\n")
    
    for line in lines:
        match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
        if match:
            num = int(match.group(1))
            is_valid = False
            if current_num == 0:
                if num <= 5:
                    is_valid = True
            else:
                if current_num < num <= current_num + 10:
                    is_valid = True
            
            if is_valid:
                if current_num > 0:
                    current_ex_sols[current_num] = " ".join(current_text).strip()
                current_num = num
                current_text = [match.group(2)]
            else:
                current_text.append(line.strip())
        else:
            if current_num > 0:
                current_text.append(line.strip())

if current_num > 0:
    current_ex_sols[current_num] = " ".join(current_text).strip()
# Since we have Data Sufficiency solutions at the end, they reset to 1.
# Let's split solutions_by_exercise by finding where numbering resets
reconstructed_sols = []
temp_sols = {}
prev_num = 0
for k in sorted(current_ex_sols.keys()):
    if k == 1 or k < prev_num:
        if temp_sols:
            reconstructed_sols.append(temp_sols)
            temp_sols = {}
    temp_sols[k] = current_ex_sols[k]
    prev_num = k
if temp_sols:
    reconstructed_sols.append(temp_sols)

print(f"Parsed {len(reconstructed_sols)} solution exercises:")
for idx, ex in enumerate(reconstructed_sols):
    print(f"  Ex {idx+1}: {len(ex)} solutions (Min: {min(ex.keys()) if ex else 0}, Max: {max(ex.keys()) if ex else 0})")
