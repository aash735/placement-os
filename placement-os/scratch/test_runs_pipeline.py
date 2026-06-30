import pypdf
import re
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

def count_option_declarations(text):
    count = 0
    for letter in ['a', 'b', 'c', 'd', 'e']:
        if re.search(r'\(\s*' + letter + r'\s*\)', text):
            count += 1
    return count

def extract_question_blocks_from_page(lines, p):
    blocks = []
    current_block = None
    for line in lines:
        match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
        if match:
            if current_block:
                blocks.append(current_block)
            current_block = {
                "num": int(match.group(1)),
                "lines": [match.group(2)],
                "page": p
            }
        else:
            if current_block:
                current_block["lines"].append(line)
    if current_block:
        blocks.append(current_block)
    return blocks

def test_chapter(topic, start_page, end_page):
    print(f"\n================ CHAPTER: {topic} (PDF Pages {start_page}-{end_page}) ================")
    
    # 1. Classify all pages
    page_types = {}
    pages = list(range(start_page, min(end_page + 1, len(reader.pages))))
    
    for p in pages:
        text = reader.pages[p].extract_text()
        ans_matches = len(re.findall(r"\d+\.\s*\([a-e]\)", text))
        opt_matches = len(re.findall(r"\(\s*[a-e]\s*\)", text))
        
        if ans_matches > 8:
            page_types[p] = "ans"
        elif opt_matches > 5 and "SOLUTIONS" not in text.upper() and "HINTS" not in text.upper():
            page_types[p] = "q"
        else:
            page_types[p] = "sol"
            
    # Clean classifications
    for i in range(1, len(pages) - 1):
        p = pages[i]
        prev_p = pages[i-1]
        next_p = pages[i+1]
        if page_types[p] in ["ans", "sol"] and page_types[prev_p] == "q" and page_types[next_p] == "q":
            page_types[p] = "q"
            
    # 2. Group into runs
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
    
    if q_runs:
        first_q_page = q_runs[0]["pages"][0]
        sol_runs = [r for r in sol_runs if r["pages"][0] >= first_q_page]
        
    print(f"Segmented Runs: Q-runs={len(q_runs)}, ANS-runs={len(ans_runs)}, SOL-runs={len(sol_runs)}")
    
    # 3. Parse each run
    print("\n--- Parsing Questions ---")
    for idx, r in enumerate(q_runs):
        questions = {}
        prev_q_num = 0
        current_question = None
        
        raw_blocks = []
        for p in r["pages"]:
            text = reader.pages[p].extract_text()
            raw_blocks.extend(extract_question_blocks_from_page(text.split("\n"), p))
            
        for b in raw_blocks:
            num = b["num"]
            full_text = " ".join(b["lines"]).strip()
            opt_count = count_option_declarations(full_text)
            
            is_new_q = False
            if opt_count >= 3:
                if current_question is None:
                    is_new_q = True
                elif prev_q_num < num <= prev_q_num + 35:
                    is_new_q = True
                    
            if is_new_q:
                if current_question:
                    questions[current_question["num"]] = current_question
                current_question = b
                prev_q_num = num
            else:
                if current_question:
                    current_question["lines"].append(f"{num}. " + " ".join(b["lines"]))
                    
        if current_question:
            questions[current_question["num"]] = current_question
            
        print(f"  Q Exercise {idx+1}: {len(questions)} questions (Min: {min(questions.keys()) if questions else 0}, Max: {max(questions.keys()) if questions else 0})")

    print("\n--- Parsing Answers ---")
    for idx, r in enumerate(ans_runs):
        answers = {}
        for p in r["pages"]:
            text = reader.pages[p].extract_text()
            ans_matches = re.findall(r"(\d+)\.\s*\(\s*([a-e])\s*\)", text)
            for num_str, val in ans_matches:
                answers[int(num_str)] = val.strip().lower()
        print(f"  ANS Exercise {idx+1}: {len(answers)} answers (Min: {min(answers.keys()) if answers else 0}, Max: {max(answers.keys()) if answers else 0})")

    print("\n--- Parsing Solutions ---")
    for idx, r in enumerate(sol_runs):
        solutions = {}
        current_num = 0
        current_text = []
        for p in r["pages"]:
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
        print(f"  SOL Exercise {idx+1}: {len(solutions)} solutions (Min: {min(solutions.keys()) if solutions else 0}, Max: {max(solutions.keys()) if solutions else 0})")

test_chapter("Average", 214, 248)
test_chapter("Problems on Numbers", 248, 272)
