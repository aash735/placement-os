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
    
    # We only parse chapters present in the PDF (Quant, Logical, DI)
    # (Skip Verbal and Puzzles)
    if topic in ["Synonyms", "Antonyms", "Sentence Improvement", "Comprehension", "Error Detection", "Vocabulary"]:
        continue
    
    print(f"\nChecking chapter: {topic} (pages {page_range[0]}-{page_range[1]})")
    
    # Extract text from solution pages
    # Let's find solution pages
    sol_text = ""
    for p in range(page_range[0], min(page_range[1] + 1, len(reader.pages))):
        text = reader.pages[p].extract_text()
        text_upper = text.upper()
        if "SOLUTIONS" in text_upper or "HINTS & SOLUTIONS" in text_upper:
            sol_text += text
            
    sol_start = sol_text.find("SOLUTIONS")
    if sol_start == -1:
        sol_start = sol_text.find("HINTS & SOLUTIONS")
        
    if sol_start != -1:
        sol_content = sol_text[sol_start:]
        sol_lines = sol_content.split("\n")
        
        # Test window sizes: 10
        solutions_map = {}
        current_num = 0
        current_text = []
        
        for line in sol_lines:
            line_upper = line.upper()
            if "DATA" in line_upper and "SUFFICIENCY" in line_upper:
                break
            
            match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
            if match:
                num = int(match.group(1))
                is_valid = False
                if current_num == 0:
                    if num <= 10:
                        is_valid = True
                else:
                    if current_num < num <= current_num + 10:
                        is_valid = True
                
                if is_valid:
                    if current_num > 0:
                        solutions_map[current_num] = " ".join(current_text).strip()
                    current_num = num
                    current_text = [match.group(2)]
                else:
                    current_text.append(line.strip())
            else:
                if current_num > 0:
                    current_text.append(line.strip())
                    
        if current_num > 0:
            solutions_map[current_num] = " ".join(current_text).strip()
            
        keys = sorted(solutions_map.keys())
        if keys:
            print(f"  Success: Parsed {len(keys)} solutions. Max key: {keys[-1]}. Min key: {keys[0]}")
            # Check gaps
            gaps = []
            for idx in range(len(keys) - 1):
                diff = keys[idx+1] - keys[idx]
                if diff > 1:
                    gaps.append((keys[idx], keys[idx+1]))
            if gaps:
                print(f"  Gaps found: {gaps}")
        else:
            print("  No solutions parsed.")
