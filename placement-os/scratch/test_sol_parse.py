import pypdf
import re
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

# Time and Work solution pages: 549 to 563
sol_text = ""
for p in range(549, 564):
    sol_text += reader.pages[p].extract_text()

sol_start = sol_text.find("SOLUTIONS")
if sol_start == -1:
    sol_start = sol_text.find("HINTS & SOLUTIONS")

if sol_start != -1:
    sol_content = sol_text[sol_start:]
    sol_lines = sol_content.split("\n")
    
    # Let's test different parsing rules
    print("--- TESTING ROBUST PARSER ---")
    solutions_map = {}
    current_num = 0  # Start at 0, expect next to be 1, 2, ...
    current_text = []
    
    for line in sol_lines:
        line_upper = line.upper()
        if "DATA" in line_upper and "SUFFICIENCY" in line_upper:
            break
        
        match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
        if match:
            num = int(match.group(1))
            # Rule: num must be in range [current_num + 1, current_num + 5]
            # (or if current_num is 0, we allow any num <= 5 to start)
            is_valid_next = False
            if current_num == 0:
                if num <= 5:
                    is_valid_next = True
            else:
                if current_num < num <= current_num + 5:
                    is_valid_next = True
            
            if is_valid_next:
                if current_num > 0:
                    solutions_map[current_num] = " ".join(current_text).strip()
                current_num = num
                current_text = [match.group(2)]
            else:
                # Treat as normal line inside the current solution
                current_text.append(line.strip())
        else:
            if current_num > 0:
                current_text.append(line.strip())
                
    if current_num > 0:
        solutions_map[current_num] = " ".join(current_text).strip()
        
    keys = sorted(solutions_map.keys())
    print(f"Parsed {len(keys)} solutions.")
    print("Keys:", keys)
    
    # Find gaps
    gaps = []
    for idx in range(len(keys) - 1):
        diff = keys[idx+1] - keys[idx]
        if diff > 1:
            gaps.append((keys[idx], keys[idx+1]))
    print("Gaps:", gaps)
