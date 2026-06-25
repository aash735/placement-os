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
    
    # Clean excessive spaces
    text = re.sub(r"[ \t]+", " ", text)
    # Join broken hyphenated words
    text = re.sub(r"(\w+)-\s*\n\s*(\w+)", r"\1\2", text)
    return text.strip()

def parse_chapter_questions(reader, topic, start_page, end_page):
    exercise_pages = []
    answers_page = None
    solutions_pages = []
    
    # 1. Classify pages
    for p in range(start_page, min(end_page + 1, len(reader.pages))):
        text = reader.pages[p].extract_text()
        text_upper = text.upper()
        if "ANSWERS" in text_upper and "1. (" in text_upper:
            answers_page = p
            # Solutions often start on the same page
            solutions_pages.append(p)
        elif "SOLUTIONS" in text_upper or "HINTS & SOLUTIONS" in text_upper:
            solutions_pages.append(p)
        else:
            if answers_page is None:
                exercise_pages.append(p)
            else:
                solutions_pages.append(p)
                
    if answers_page is None:
        # Fallback if answers page wasn't flagged perfectly
        return []
        
    # 2. Extract Answers Map
    answers_map = {}
    ans_text = ""
    for p in solutions_pages:
        ans_text += reader.pages[p].extract_text()
    
    ans_start = ans_text.find("ANSWERS")
    if ans_start != -1:
        ans_block = ans_text[ans_start:ans_start + 4000]
        ans_matches = re.findall(r"(\d+)\.\s*\(\s*([a-e])\s*\)", ans_block)
        for num, ans in ans_matches:
            answers_map[int(num)] = ans.strip().lower()
            
    # 3. Extract Solutions Map
    solutions_map = {}
    sol_start = ans_text.find("SOLUTIONS")
    if sol_start == -1:
        sol_start = ans_text.find("HINTS & SOLUTIONS")
        
    if sol_start != -1:
        sol_content = ans_text[sol_start:]
        sol_lines = sol_content.split("\n")
        current_num = None
        current_text = []
        for line in sol_lines:
            # Stop if we hit a different section
            if "EXERCISE" in line and "DATA-SUFFICIENCY" in line.upper():
                break
            if "DATA–SUFFICIENCY" in line or "DATA-SUFFICIENCY" in line or "DATA – SUFFICIENCY" in line:
                break
            match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
            if match:
                num = int(match.group(1))
                if current_num is not None:
                    solutions_map[current_num] = " ".join(current_text).strip()
                current_num = num
                current_text = [match.group(2)]
            else:
                if current_num is not None:
                    current_text.append(line.strip())
        if current_num is not None:
            solutions_map[current_num] = " ".join(current_text).strip()
            
    # 4. Extract Questions Map
    ex_text = ""
    for p in exercise_pages:
        ex_text += reader.pages[p].extract_text()
        
    ex_start = ex_text.find("EXERCISE")
    questions = []
    if ex_start != -1:
        ex_content = ex_text[ex_start:]
        lines = ex_content.split("\n")
        
        current_q_num = None
        current_q_text = []
        current_options = []
        
        for line in lines:
            q_match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
            if q_match:
                if current_q_num is not None:
                    questions.append({
                        "num": current_q_num,
                        "text": " ".join(current_q_text).strip(),
                        "options": current_options
                    })
                current_q_num = int(q_match.group(1))
                current_q_text = [q_match.group(2)]
                current_options = []
            else:
                opt_matches = re.findall(r"\(\s*([a-e])\s*\)\s*([^(\n]*)", line)
                if opt_matches:
                    for letter, val in opt_matches:
                        current_options.append(val.strip())
                else:
                    if current_q_num is not None:
                        current_q_text.append(line.strip())
                        
        if current_q_num is not None:
            questions.append({
                "num": current_q_num,
                "text": " ".join(current_q_text).strip(),
                "options": current_options
            })
            
    # 5. Merge and return
    topic_id = TOPIC_MAP.get(topic, "general")
    category = CATEGORY_MAP.get(topic, "quant")
    
    merged = []
    for q in questions:
        num = q["num"]
        ans_letter = answers_map.get(num)
        sol = solutions_map.get(num)
        
        if not ans_letter or len(q["options"]) < 2:
            # Skip invalid or incomplete questions
            continue
            
        idx = ord(ans_letter) - ord('a')
        if idx >= len(q["options"]):
            continue
            
        correct_ans_text = q["options"][idx]
        
        q_obj = {
            "id": f"{category}-{topic_id}-{num}",
            "question": clean_text(q["text"]),
            "options": [clean_text(o) for o in q["options"]],
            "answer": clean_text(correct_ans_text),
            "explanation": clean_text(sol) if sol else "No explanation available.",
            "topic": topic_id,
            "category": category,
            "difficulty": 2, # Default medium
            "estimatedTime": 60,
            "companyRelevance": ["TCS", "Accenture", "Infosys"]
        }
        merged.append(q_obj)
        
    return merged

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
        qs = parse_chapter_questions(reader, topic, page_range[0], page_range[1])
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

    di_existing_map = {q["id"]: q for q in all_extracted["data-interpretation"]}
    for q in di_seeds:
        di_existing_map[q["id"]] = q
    all_extracted["data-interpretation"] = list(di_existing_map.values())

    # Write back all JSON files
    for cat, qs in all_extracted.items():
        json_path = os.path.join(base_dir, cat, "questions.json")
        os.makedirs(os.path.dirname(json_path), exist_ok=True)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(qs, f, indent=2)
        print(f"Saved {len(qs)} questions to {json_path}")
        
    print("\nExtraction complete.")

if __name__ == "__main__":
    main()
