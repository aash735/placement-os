import os
import re
import json
import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"

# Map of PDF chapters/topics to practice room topicIds
TOPIC_MAP = {
    "Number System": "number-system",
    "H.C.F. and L.C.M. of Numbers": "hcf-lcm",
    "Decimal Fractions": "simplification",
    "Simplification": "simplification",
    "Square Roots and Cube Roots": "simplification",
    "Average": "average",
    "Problems on Numbers": "number-system",
    "Problems on Ages": "ages",
    "Surds and Indices": "simplification",
    "Logarithms": "simplification",
    "Percentage": "percentages",
    "Profit and Loss": "profit-loss",
    "Ratio and Proportion": "ratios",
    "Partnership": "ratios",
    "Chain Rule": "ratios",
    "Pipes and Cisterns": "pipes-cisterns",
    "Time and Work": "time-work",
    "Time & Distance": "speed",
    "Boats and Streams": "speed",
    "Problems on Trains": "speed",
    "Alligation or Mixture": "ratios",
    "Simple Interest": "simple-interest",
    "Compound Interest": "compound-interest",
    "Area": "percentages", # fallback or general
    "Volume and Surface Areas": "percentages", # fallback or general
    "Races and Games of Skill": "speed",
    "Calendar": "calendar",
    "Clocks": "clocks",
    "Stocks and Shares": "simple-interest",
    "Permutation and Combination": "permutation-combination",
    "Probability": "probability",
    "True Discount": "simple-interest",
    "Banker's Discount": "simple-interest",
    "Heights and Distances": "speed",
    "Odd Man Out and Series": "series",
    "Tabulation": "tables",
    "Bar Graphs": "bar-graphs",
    "Pie Chart": "pie-charts",
    "Line Graphs": "line-graphs"
}

CATEGORY_MAP = {
    "Tabulation": "di",
    "Bar Graphs": "di",
    "Pie Chart": "di",
    "Line Graphs": "di",
    "Calendar": "logical",
    "Clocks": "logical",
    "Odd Man Out and Series": "logical"
}

def clean_text(text):
    if not text:
        return ""
    # Clean OCR noises and symbols
    text = text.replace("\u2234", "Therefore ")
    text = text.replace("\u21d2", " => ")
    text = text.replace("\u00f7", " / ")
    text = text.replace("\u00d7", " * ")
    text = text.replace("\u2212", " - ")
    text = text.replace("`", "Rs. ") # Currency symbol often extracts as `
    text = text.replace("\u20b9", "Rs. ")
    
    # Rebuild corrupted fractions from OCR layout displacement
    # Pattern 1: e.g. "15 days3" -> "5 1/3 days" or "24 days5" -> "4 2/5 days" or "214% gain7" -> "14 2/7 % gain"
    def replace_fraction_with_unit(match):
        num = int(match.group(1))
        whole = match.group(2)
        unit = match.group(3)
        den = int(match.group(4))
        if num < den:
            return f"{whole} {num}/{den} {unit}"
        return match.group(0)
    text = re.sub(r'\b(\d)(\d+)\s*([a-zA-Z%\s/]+[a-zA-Z%])(\d+)\b', replace_fraction_with_unit, text)

    # Pattern 2: e.g. "31 4 times" or "17 2" -> "1 3/4 times", "7 1/2"
    def replace_fraction_pure(match):
        num = match.group(1)
        whole = match.group(2)
        den = match.group(3)
        if int(num) < int(den):
            return f"{whole} {num}/{den}"
        return match.group(0)
    text = re.sub(r'\b(\d)(\d+)\s+(\d+)\b', replace_fraction_pure, text)

    # Pattern 3: e.g. "7 th8" -> "7/8 th"
    text = re.sub(r'\b(\d+)\s*([a-zA-Z]+)\s*(\d+)\b', r'\1/\3 \2', text)
    
    # Pattern 4: e.g. "3 4 th" -> "3/4th"
    text = re.sub(r'\b(\d+)\s+(\d+)\s*([a-zA-Z]+)\b', r'\1/\2\3', text)

    # Math symbol / notation fixes
    text = text.replace(" * ", " × ")
    text = text.replace("Rs. ", "₹").replace("Rs.", "₹").replace("Rs ", "₹")
    text = re.sub(r'([^a-zA-Z]|^)pa2\b', r'\1πa²', text)
    text = re.sub(r'([^a-zA-Z]|^)pr2\b', r'\1πr²', text)
    text = re.sub(r'([^a-zA-Z]|^)pR2\b', r'\1πR²', text)
    text = re.sub(r'\bcm2\b', 'cm²', text)
    text = re.sub(r'\bcm3\b', 'cm³', text)
    text = re.sub(r'\bm2\b', 'm²', text)
    text = re.sub(r'\bm3\b', 'm³', text)
    text = re.sub(r'\bunits2\b', 'units²', text)
    text = re.sub(r'\bunits3\b', 'units³', text)

    # Clean excessive spaces
    text = re.sub(r"[ \t]+", " ", text)
    # Join broken hyphenated words
    text = re.sub(r"(\w+)-\s*\n\s*(\w+)", r"\1\2", text)
    return text.strip()

def parse_block_content(lines):
    """
    Robust inline option parser.
    Identifies sequential chains of options: (a)->(b)->(c)->(d) or (a)->(b)->(c)->(d)->(e)
    which are furthest to the right to avoid matching variables inside the question body.
    """
    joined_text = " ".join(lines)
    
    # Find all start positions of each option label
    patterns = {
        'a': [m.start() for m in re.finditer(r'\(\s*[aA]\s*\)|\[\s*[aA]\s*\]', joined_text)],
        'b': [m.start() for m in re.finditer(r'\(\s*[bB]\s*\)|\[\s*[bB]\s*\]', joined_text)],
        'c': [m.start() for m in re.finditer(r'\(\s*[cC]\s*\)|\[\s*[cC]\s*\]', joined_text)],
        'd': [m.start() for m in re.finditer(r'\(\s*[dD]\s*\)|\[\s*[dD]\s*\]', joined_text)],
        'e': [m.start() for m in re.finditer(r'\(\s*[eE]\s*\)|\[\s*[eE]\s*\]', joined_text)],
    }
    
    # Try 5-option chain first
    best_chain_5 = None
    for a in sorted(patterns['a'], reverse=True):
        b = next((x for x in sorted(patterns['b']) if x > a), None)
        if b is None: continue
        c = next((x for x in sorted(patterns['c']) if x > b), None)
        if c is None: continue
        d = next((x for x in sorted(patterns['d']) if x > c), None)
        if d is None: continue
        e = next((x for x in sorted(patterns['e']) if x > d), None)
        if e is None: continue
        best_chain_5 = (a, b, c, d, e)
        break
        
    if best_chain_5:
        a, b, c, d, e = best_chain_5
        q_text = joined_text[:a].strip()
        
        # Get start indices of option text (after the labels)
        match_a = re.match(r'\(\s*[aA]\s*\)|\[\s*[aA]\s*\]', joined_text[a:])
        match_b = re.match(r'\(\s*[bB]\s*\)|\[\s*[bB]\s*\]', joined_text[b:])
        match_c = re.match(r'\(\s*[cC]\s*\)|\[\s*[cC]\s*\]', joined_text[c:])
        match_d = re.match(r'\(\s*[dD]\s*\)|\[\s*[dD]\s*\]', joined_text[d:])
        match_e = re.match(r'\(\s*[eE]\s*\)|\[\s*[eE]\s*\]', joined_text[e:])
        
        opt_a = joined_text[a + match_a.end():b].strip() if match_a else joined_text[a:b].strip()
        opt_b = joined_text[b + match_b.end():c].strip() if match_b else joined_text[b:c].strip()
        opt_c = joined_text[c + match_c.end():d].strip() if match_c else joined_text[c:d].strip()
        opt_d = joined_text[d + match_d.end():e].strip() if match_d else joined_text[d:e].strip()
        opt_e = joined_text[e + match_e.end():].strip() if match_e else joined_text[e:].strip()
        
        return q_text, [opt_a, opt_b, opt_c, opt_d, opt_e]
        
    # Try 4-option chain
    best_chain_4 = None
    for a in sorted(patterns['a'], reverse=True):
        b = next((x for x in sorted(patterns['b']) if x > a), None)
        if b is None: continue
        c = next((x for x in sorted(patterns['c']) if x > b), None)
        if c is None: continue
        d = next((x for x in sorted(patterns['d']) if x > c), None)
        if d is None: continue
        best_chain_4 = (a, b, c, d)
        break
        
    if best_chain_4:
        a, b, c, d = best_chain_4
        q_text = joined_text[:a].strip()
        
        match_a = re.match(r'\(\s*[aA]\s*\)|\[\s*[aA]\s*\]', joined_text[a:])
        match_b = re.match(r'\(\s*[bB]\s*\)|\[\s*[bB]\s*\]', joined_text[b:])
        match_c = re.match(r'\(\s*[cC]\s*\)|\[\s*[cC]\s*\]', joined_text[c:])
        match_d = re.match(r'\(\s*[dD]\s*\)|\[\s*[dD]\s*\]', joined_text[d:])
        
        opt_a = joined_text[a + match_a.end():b].strip() if match_a else joined_text[a:b].strip()
        opt_b = joined_text[b + match_b.end():c].strip() if match_b else joined_text[b:c].strip()
        opt_c = joined_text[c + match_c.end():d].strip() if match_c else joined_text[c:d].strip()
        opt_d = joined_text[d + match_d.end():].strip() if match_d else joined_text[d:].strip()
        
        return q_text, [opt_a, opt_b, opt_c, opt_d]
        
    return joined_text.strip(), []

def parse_chapter_questions(reader, topic, start_page, end_page, existing_questions=None):
    topic_id = TOPIC_MAP.get(topic, "general")
    category = CATEGORY_MAP.get(topic, "quant")
    
    # 1. Decoupled page classification
    q_pages = []
    ans_pages = []
    sol_pages = []
    
    pages = list(range(start_page, min(end_page + 1, len(reader.pages))))
    for p in pages:
        text = reader.pages[p].extract_text()
        ans_matches = len(re.findall(r"\d+\.\s*\([a-e]\)", text))
        opt_matches = len(re.findall(r"\(\s*[a-e]\s*\)", text))
        is_sol = "SOLUTIONS" in text.upper() or "HINTS" in text.upper()
        
        if ans_matches > 8:
            ans_pages.append(p)
        if opt_matches > 5 and not is_sol:
            q_pages.append(p)
        if is_sol or (ans_matches <= 8 and opt_matches <= 5):
            sol_pages.append(p)
            
    # Helper to group consecutive page numbers into runs
    def group_pages_to_runs(page_list, rtype):
        runs = []
        if not page_list:
            return runs
        current_pages = [page_list[0]]
        for p in page_list[1:]:
            if p == current_pages[-1] + 1:
                current_pages.append(p)
            else:
                runs.append({"type": rtype, "pages": current_pages})
                current_pages = [p]
        if current_pages:
            runs.append({"type": rtype, "pages": current_pages})
        return runs

    q_runs = group_pages_to_runs(q_pages, "q")
    ans_runs = group_pages_to_runs(ans_pages, "ans")
    sol_runs = group_pages_to_runs(sol_pages, "sol")
    
    # Filter solved examples / intro pages
    if q_runs:
        first_q_page = q_runs[0]["pages"][0]
        sol_runs = [r for r in sol_runs if r["pages"][0] >= first_q_page]
        
    # Helper to count option declarations
    def count_option_declarations(text):
        count = 0
        for letter in ['a', 'b', 'c', 'd', 'e']:
            if re.search(r'\(\s*' + letter + r'\s*\)', text):
                count += 1
        return count

    # Helper to extract question blocks from lines of a page
    def extract_question_blocks_from_page(lines, p):
        blocks = []
        current_block = None
        last_q_num = 0
        for line in lines:
            match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
            if match:
                num = int(match.group(1))
                is_valid_next = False
                if last_q_num == 0:
                    is_valid_next = True
                elif last_q_num < num <= last_q_num + 10:
                    is_valid_next = True
                    
                if is_valid_next:
                    if current_block:
                        blocks.append(current_block)
                    current_block = {
                        "num": num,
                        "lines": [match.group(2)],
                        "page": p
                    }
                    last_q_num = num
                else:
                    if current_block:
                        current_block["lines"].append(line)
            else:
                if current_block:
                    current_block["lines"].append(line)
        if current_block:
            blocks.append(current_block)
        return blocks

    # 3. Parse each type of run into exercise lists
    question_exercises = []
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
        question_exercises.append(questions)

    answer_exercises = []
    for idx, r in enumerate(ans_runs):
        answers = {}
        prev_ans_num = 0
        current_eans = {}
        for p in r["pages"]:
            text = reader.pages[p].extract_text()
            ans_matches = re.findall(r"(\d+)\.\s*\(\s*([a-e])\s*\)", text)
            for num_str, val in ans_matches:
                num = int(num_str)
                if num == 1 or num < prev_ans_num:
                    if current_eans:
                        answer_exercises.append(current_eans)
                        current_eans = {}
                current_eans[num] = val.strip().lower()
                prev_ans_num = num
        if current_eans:
            answer_exercises.append(current_eans)

    solution_exercises = []
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
            
        # Split solutions by resets into individual exercises
        prev_sol_num = 0
        temp_sols = {}
        for num in sorted(solutions.keys()):
            if num == 1 or num < prev_sol_num:
                if temp_sols:
                    solution_exercises.append(temp_sols)
                    temp_sols = {}
            temp_sols[num] = solutions[num]
            prev_sol_num = num
        if temp_sols:
            solution_exercises.append(temp_sols)

    # 4. Reconcile and Merge
    all_merged = []
    
    print(f"    Reconciled {topic}: Q exercises={len(question_exercises)}, Ans={len(answer_exercises)}, Sol={len(solution_exercises)}")
    
    # Fallback mapper for chapters missing separate answer key pages
    if len(answer_exercises) == 0 and len(solution_exercises) > 0 and existing_questions:
        print(f"      Running explanation recovery fallback for {topic}...")
        sol_ex = solution_exercises[0] if solution_exercises else {}
        for q in existing_questions:
            if q.get("topic") == topic_id:
                # Find trailing number from question ID
                match = re.search(r'-(\d+)$', q.get("id", ""))
                if match:
                    num = int(match.group(1))
                    sol = sol_ex.get(num)
                    if sol:
                        q["explanation"] = clean_text(sol)
                        # Metadata
                        q["sourceBook"] = "dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
                        # Search page in question exercises if possible
                        for q_ex in question_exercises:
                            if num in q_ex:
                                q["sourcePage"] = q_ex[num].get("page")
    
    for idx, q_ex in enumerate(question_exercises):
        ans_ex = answer_exercises[idx] if idx < len(answer_exercises) else {}
        sol_ex = solution_exercises[idx] if idx < len(solution_exercises) else {}
        
        for num in sorted(q_ex.keys()):
            q_block = q_ex[num]
            ans_letter = ans_ex.get(num)
            sol = sol_ex.get(num)
            
            q_text, opts = parse_block_content(q_block["lines"])
            
            if not ans_letter or len(opts) < 2:
                continue
                
            idx_ans = ord(ans_letter) - ord('a')
            if idx_ans >= len(opts):
                continue
                
            correct_ans_text = opts[idx_ans]
            
            chapter_slug = re.sub(r'[^a-z0-9]+', '-', topic.lower()).strip('-')
            suffix = f"exercise-{idx+1}"
            if idx == 0:
                suffix = "exercise-a"
            elif idx == 1 and len(question_exercises) == 2:
                is_ds = False
                if sol_ex and 1 in sol_ex:
                    is_ds = "SUFFICIENCY" in sol_ex[1].upper()
                if not is_ds and q_block["lines"]:
                    is_ds = "SUFFICIENCY" in q_block["lines"][0].upper()
                suffix = "data-sufficiency" if is_ds else "exercise-b"
            
            q_id = f"{category}-{chapter_slug}-{suffix}-{num}"
            if suffix == "exercise-a":
                q_id = f"{category}-{chapter_slug}-{num}"
                
            q_obj = {
                "id": q_id,
                "question": clean_text(q_text),
                "options": [clean_text(o) for o in opts],
                "answer": clean_text(correct_ans_text),
                "explanation": clean_text(sol) if sol else "Detailed explanation is currently being prepared and will be available in a future update.",
                "topic": topic_id,
                "category": category,
                "difficulty": 2,
                "estimatedTime": 60,
                "companyRelevance": ["TCS", "Accenture", "Infosys"],
                "optionsSourceId": q_id,
                "answerSourceId": q_id,
                "explanationSourceId": q_id,
                "sourcePage": q_block.get("page"),
                "sourceBook": "dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
            }
            all_merged.append(q_obj)
            
    return all_merged

def main():
    print("Loading RS Aggarwal PDF...")
    reader = pypdf.PdfReader(pdf_path)
    
    with open("scratch/syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)
        
    all_extracted = {
        "quantitative": [],
        "logical": [],
        "verbal": [],
        "data-interpretation": [],
        "puzzles": []
    }
    
    # We will also load existing questions to merge them
    for cat in all_extracted.keys():
        json_path = os.path.join(base_dir, cat, "questions.json")
        if os.path.exists(json_path):
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    all_extracted[cat] = json.load(f)
                print(f"Loaded {len(all_extracted[cat])} existing questions for {cat}")
            except Exception:
                pass

    print("\nExtracting questions from PDF by chapter...")
    for item in syllabus:
        topic = item["topic"]
        page_range = item["pageRange"]
        
        # Don't try to parse verbal or puzzles since they are not in the quant PDF
        category = CATEGORY_MAP.get(topic, "quant")
        cat_folder = {
            "quant": "quantitative",
            "logical": "logical",
            "verbal": "verbal",
            "di": "data-interpretation",
            "puzzles": "puzzles"
        }.get(category)
        
        if cat_folder in ["verbal", "puzzles"] or (cat_folder == "logical" and topic not in ["Calendar", "Clocks", "Odd Man Out and Series"]):
            continue
            
        print(f"  Scanning chapter: {topic} (pages {page_range[0]}-{page_range[1]})...")
        qs = parse_chapter_questions(reader, topic, page_range[0], page_range[1], all_extracted[cat_folder])
        print(f"    Extracted {len(qs)} questions.")
        
        # Merge questions by id (avoid duplicates)
        existing_map = {q["id"]: q for q in all_extracted[cat_folder]}
        for q in qs:
            existing_map[q["id"]] = q
        all_extracted[cat_folder] = list(existing_map.values())
        
    # Seed rich DI and logical questions with visual assets if they are empty or low count
    print("\nSeeding visual DI structured data...")
    di_path = os.path.join(base_dir, "data-interpretation", "questions.json")
    
    # We will seed some beautiful Data Interpretation questions with tableData/chartData
    di_seeds = [
        {
            "id": "di-tables-1",
            "question": "The following table shows the sales of five branches (B1, B2, B3, B4, B5) of a publishing company during two consecutive years 2023 and 2024. Study the table and answer:\n\nWhat is the ratio of the total sales of branch B2 for both years to the total sales of branch B4 for both years?",
            "options": ["7:9", "4:5", "7:8", "3:4"],
            "answer": "7:8",
            "explanation": "Total sales of B2 = 75 (2023) + 65 (2024) = 140.\nTotal sales of B4 = 85 (2023) + 75 (2024) = 160.\nRatio = 140 / 160 = 7/8.",
            "topic": "tables",
            "category": "di",
            "difficulty": 2,
            "estimatedTime": 90,
            "companyRelevance": ["TCS", "Deloitte"],
            "tableData": {
                "headers": ["Branch", "Sales 2023 (in Thousands)", "Sales 2024 (in Thousands)"],
                "rows": [
                    ["B1", "80", "105"],
                    ["B2", "75", "65"],
                    ["B3", "95", "110"],
                    ["B4", "85", "75"],
                    ["B5", "75", "95"]
                ]
            }
        },
        {
            "id": "di-pie-charts-1",
            "question": "The pie chart shows the percentage distribution of the expenditure incurred in publishing a book. Study the chart and answer:\n\nIf for a certain quantity of books, the publisher has to pay Rs. 30,600 as printing cost, then what will be amount of royalty to be paid for these books?",
            "options": ["Rs. 19,450", "Rs. 21,200", "Rs. 22,950", "Rs. 26,150"],
            "answer": "Rs. 22,950",
            "explanation": "Let total expenditure be X.\nPrinting Cost = 20% of X = Rs. 30,600 => X = Rs. 153,000.\nRoyalty = 15% of X = 15% of 153,000 = Rs. 22,950.",
            "topic": "pie-charts",
            "category": "di",
            "difficulty": 2,
            "estimatedTime": 90,
            "companyRelevance": ["Infosys", "Wipro"],
            "chartType": "pie",
            "chartData": [
                {"name": "Paper Cost", "value": 25},
                {"name": "Printing Cost", "value": 20},
                {"name": "Royalty", "value": 15},
                {"name": "Binding & Promotion", "value": 20},
                {"name": "Transportation", "value": 10},
                {"name": "Other Cost", "value": 10}
            ]
        },
        {
            "id": "di-bar-graphs-1",
            "question": "The bar graph shows the production of fertilizers (in lakh tonnes) by a company over six years (2018-2023). Study the graph and answer:\n\nIn how many of the given years was the production of fertilizers more than the average production of the given years?",
            "options": ["1", "2", "3", "4"],
            "answer": "3",
            "explanation": "Average production = (25 + 40 + 60 + 45 + 65 + 50) / 6 = 285 / 6 = 47.5 lakh tonnes.\nYears with production > 47.5 are 2020 (60), 2022 (65), and 2023 (50). Total = 3 years.",
            "topic": "bar-graphs",
            "category": "di",
            "difficulty": 2,
            "estimatedTime": 90,
            "companyRelevance": ["Capgemini", "Accenture"],
            "chartType": "bar",
            "chartData": [
                {"name": "2018", "value": 25},
                {"name": "2019", "value": 40},
                {"name": "2020", "value": 60},
                {"name": "2021", "value": 45},
                {"name": "2022", "value": 65},
                {"name": "2023", "value": 50}
            ]
        },
        {
            "id": "di-line-graphs-1",
            "question": "The line graph shows the percentage profit earned by a company over six years. Study the graph and answer:\n\nIf the income of the company in 2021 was Rs. 264 crores, what was its expenditure in that year?",
            "options": ["Rs. 185 crores", "Rs. 200 crores", "Rs. 220 crores", "Rs. 240 crores"],
            "answer": "Rs. 220 crores",
            "explanation": "Profit % in 2021 = 20%.\nProfit = (Income - Expenditure) / Expenditure * 100\n20 = (264 - E) / E * 100\n0.2 = (264 - E) / E => 0.2E = 264 - E => 1.2E = 264 => E = 220 crores.",
            "topic": "line-graphs",
            "category": "di",
            "difficulty": 3,
            "estimatedTime": 120,
            "companyRelevance": ["TCS Digital", "Infosys"],
            "chartType": "line",
            "chartData": [
                {"name": "2019", "value": 30},
                {"name": "2020", "value": 40},
                {"name": "2021", "value": 20},
                {"name": "2022", "value": 50},
                {"name": "2023", "value": 45},
                {"name": "2024", "value": 60}
            ]
        }
    ]

    import datetime
    import_batch = datetime.datetime.utcnow().isoformat() + "Z"

    di_existing_map = {q["id"]: q for q in all_extracted["data-interpretation"]}
    for q in di_seeds:
        di_existing_map[q["id"]] = q
    all_extracted["data-interpretation"] = list(di_existing_map.values())

    # Write back all JSON files as raw questions
    for cat, qs in all_extracted.items():
        # Add metadata fields
        for q in qs:
            q["importBatch"] = import_batch
            if "sourceFile" not in q:
                if q["id"].startswith("di-") and "tables-1" not in q["id"] and "pie-charts-1" not in q["id"] and "bar-graphs-1" not in q["id"] and "line-graphs-1" not in q["id"]:
                    q["sourceFile"] = "rs_aggarwal_tabulation_chapter"
                elif q["id"].startswith("quant-") or q["id"].startswith("logical-"):
                    q["sourceFile"] = "dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
                else:
                    q["sourceFile"] = "manual_seed"
            
        json_path = os.path.join(base_dir, cat, "questions_raw.json")
        os.makedirs(os.path.dirname(json_path), exist_ok=True)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(qs, f, indent=2)
        print(f"Saved {len(qs)} raw questions to {json_path}")
        
    print("\nExtraction complete.")

if __name__ == "__main__":
    main()
