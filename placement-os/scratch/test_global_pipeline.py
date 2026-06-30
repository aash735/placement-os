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

print("--- RUNNING GLOBAL SEQUENTIAL PIPELINE FOR TIME & WORK ---")

# Step 1: Extract all lines and categorize
all_page_texts = []
for p in range(start_page, min(end_page + 1, len(reader.pages))):
    all_page_texts.append((p, reader.pages[p].extract_text()))

# Step 2: Global Question Parsing
# Find all lines matching question blocks
questions_by_exercise = []
current_ex_qs = {}
prev_q_num = 0

for p, text in all_page_texts:
    # Skip solution-only pages to avoid matching numbers in solutions
    text_upper = text.upper()
    if "SOLUTIONS" in text_upper or "HINTS & SOLUTIONS" in text_upper:
        # But wait, page 549 has answers, not solutions.
        if p > 549:  # Pages 550+ are solutions
            continue
            
    lines = text.split("\n")
    current_block = None
    
    for line in lines:
        q_match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
        if q_match:
            num = int(q_match.group(1))
            # Check if this line actually contains options, or if it's the start of a question
            # Questions usually have options on the same line or subsequent lines.
            # To be safe, if we see a number reset or sequential increase, we start a new block.
            if num == 1 or num < prev_q_num:
                if current_ex_qs:
                    questions_by_exercise.append(current_ex_qs)
                    current_ex_qs = {}
            
            current_block = {
                "num": num,
                "lines": [q_match.group(2)]
            }
            current_ex_qs[num] = current_block
            prev_q_num = num
        else:
            if current_block:
                current_block["lines"].append(line)

if current_ex_qs:
    questions_by_exercise.append(current_ex_qs)

print(f"Parsed {len(questions_by_exercise)} question exercises:")
for idx, ex in enumerate(questions_by_exercise):
    print(f"  Ex {idx+1}: {len(ex)} questions (Min: {min(ex.keys())}, Max: {max(ex.keys())})")

# Step 3: Global Answer Parsing
answers_by_exercise = []
current_ex_ans = {}
prev_ans_num = 0

for p, text in all_page_texts:
    # We only parse answer pages (pages containing dense answers)
    ans_matches = re.findall(r"(\d+)\.\s*\(\s*([a-e])\s*\)", text)
    if len(ans_matches) > 5:
        # Check if we should start a new exercise
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

# Step 4: Global Solution Parsing
solutions_by_exercise = []
current_ex_sols = {}
prev_sol_num = 0
current_text = []
current_num = 0

for p, text in all_page_texts:
    text_upper = text.upper()
    # Only parse pages that are solutions
    if "SOLUTIONS" in text_upper or "HINTS & SOLUTIONS" in text_upper or p >= 550:
        if p == 549: # Skip answer page
            continue
        lines = text.split("\n")
        for line in lines:
            if "DATA" in line.upper() and "SUFFICIENCY" in line.upper():
                # Data Sufficiency starts a new section
                if current_ex_sols:
                    solutions_by_exercise.append(current_ex_sols)
                    current_ex_sols = {}
                    current_num = 0
                    current_text = []
            
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
if current_ex_sols:
    solutions_by_exercise.append(current_ex_sols)

print(f"Parsed {len(solutions_by_exercise)} solution exercises:")
for idx, ex in enumerate(solutions_by_exercise):
    print(f"  Ex {idx+1}: {len(ex)} solutions (Min: {min(ex.keys()) if ex else 0}, Max: {max(ex.keys()) if ex else 0})")
