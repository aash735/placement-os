import pypdf
import re
import sys
import json

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

# Problems on Numbers: 248 to 272
start_page, end_page = 248, 272

print("--- TESTING SEQUENTIAL QUESTION PARSING ON PROBLEMS ON NUMBERS ---")

# Step 1: Classify pages
page_types = {}
for p in range(start_page, min(end_page + 1, len(reader.pages))):
    text = reader.pages[p].extract_text()
    ans_matches = len(re.findall(r"\d+\.\s*\([a-e]\)", text))
    opt_matches = len(re.findall(r"\(\s*[a-e]\s*\)", text))
    
    if ans_matches > 8:
        page_types[p] = "ans"
    elif opt_matches > 5 and "SOLUTIONS" not in text.upper() and "HINTS" not in text.upper():
        page_types[p] = "q"
    else:
        page_types[p] = "sol"

# Step 2: Segment into Q runs
# A Q run is a sequence of consecutive 'q' pages
q_runs = []
current_run = []
for p in range(start_page, min(end_page + 1, len(reader.pages))):
    if page_types[p] == "q":
        current_run.append(p)
    else:
        if current_run:
            q_runs.append(current_run)
            current_run = []
if current_run:
    q_runs.append(current_run)

print(f"Found {len(q_runs)} question runs:")
for idx, run in enumerate(q_runs):
    print(f"  Run {idx+1}: pages {run}")

# Step 3: Parse questions in each run sequentially
for idx, run in enumerate(q_runs):
    print(f"\nParsing Run {idx+1}:")
    questions = {}
    current_block = None
    prev_q_num = 0
    
    for p in run:
        text = reader.pages[p].extract_text()
        lines = text.split("\n")
        for line in lines:
            match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
            if match:
                num = int(match.group(1))
                # Validate if it's a sequential next question
                is_valid = False
                if prev_q_num == 0:
                    if num <= 5: # Allow start
                        is_valid = True
                else:
                    # Allow small jumps to handle skipped/misread questions
                    if prev_q_num < num <= prev_q_num + 3:
                        is_valid = True
                        
                if is_valid:
                    if current_block:
                        questions[current_block["num"]] = current_block
                    current_block = {
                        "num": num,
                        "lines": [match.group(2)]
                    }
                    prev_q_num = num
                else:
                    if current_block:
                        current_block["lines"].append(line)
            else:
                if current_block:
                    current_block["lines"].append(line)
                    
    if current_block:
        questions[current_block["num"]] = current_block
        
    print(f"  Parsed {len(questions)} questions. Keys: {sorted(questions.keys())[:10]} ... {sorted(questions.keys())[-5:]}")
