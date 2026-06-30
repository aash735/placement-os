import pypdf
import re
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

# Time and Work pages: 534 to 570
# We segment them
start_page, end_page = 534, 570

sections = []
current_section = None

for p in range(start_page, min(end_page + 1, len(reader.pages))):
    text = reader.pages[p].extract_text()
    text_upper = text.upper()
    
    is_ds = "EXERCISE" in text_upper and ("DATA-SUFFICIENCY" in text_upper or "DATA–SUFFICIENCY" in text_upper or "DATA SUFFICIENCY" in text_upper or "DATA - SUFFICIENCY" in text_upper)
    is_ex = "EXERCISE" in text_upper and not is_ds
    is_ans = "ANSWERS" in text_upper and ("1. (" in text_upper or "1.(" in text_upper)
    is_sol = "SOLUTIONS" in text_upper or "HINTS & SOLUTIONS" in text_upper
    
    if is_ds:
        current_section = {
            "name": "Data Sufficiency",
            "type": "ds_exercise",
            "pages": [p],
            "ans_pages": [],
            "sol_pages": []
        }
        sections.append(current_section)
    elif is_ex:
        match = re.search(r"EXERCISE\s+\d+([A-Z])", text_upper)
        suffix = match.group(1) if match else "A"
        current_section = {
            "name": f"Exercise {suffix}",
            "type": "exercise",
            "pages": [p],
            "ans_pages": [],
            "sol_pages": []
        }
        sections.append(current_section)
    elif is_ans:
        if not current_section:
            current_section = {
                "name": "Default Exercise",
                "type": "exercise",
                "pages": [],
                "ans_pages": [],
                "sol_pages": []
            }
            sections.append(current_section)
        current_section["ans_pages"].append(p)
        current_section["sol_pages"].append(p)
    elif is_sol:
        if not current_section:
            current_section = {
                "name": "Default Exercise",
                "type": "exercise",
                "pages": [],
                "ans_pages": [],
                "sol_pages": []
            }
            sections.append(current_section)
        current_section["sol_pages"].append(p)
    else:
        if current_section:
            if current_section["sol_pages"]:
                current_section["sol_pages"].append(p)
            elif current_section["ans_pages"]:
                current_section["ans_pages"].append(p)
            else:
                current_section["pages"].append(p)

for sec in sections:
    print(f"Section: {sec['name']} | type: {sec['type']}")
    print(f"  pages: {sec['pages']}")
    print(f"  ans_pages: {sec['ans_pages']}")
    print(f"  sol_pages: {sec['sol_pages']}")
    
    if sec["type"] == "ds_exercise":
        continue
        
    # Let's inspect solutions map
    solutions_map = {}
    sol_text = ""
    for p in sec["sol_pages"]:
        sol_text += reader.pages[p].extract_text()
        
    sol_start = sol_text.find("SOLUTIONS")
    if sol_start == -1:
        sol_start = sol_text.find("HINTS & SOLUTIONS")
        
    if sol_start != -1:
        sol_content = sol_text[sol_start:]
        sol_lines = sol_content.split("\n")
        # Create a set of valid question numbers for this section
        valid_q_nums = set(range(1, 200))

        current_num = None
        current_text = []
        for line in sol_lines:
            line_upper = line.upper()
            if "DATA" in line_upper and "SUFFICIENCY" in line_upper:
                break
            if "EXERCISE" in line_upper and "DATA" in line_upper:
                break
            match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
            if match:
                num = int(match.group(1))
                if num in valid_q_nums and (current_num is None or num > current_num):
                    if current_num is not None:
                        solutions_map[current_num] = " ".join(current_text).strip()
                    current_num = num
                    current_text = [match.group(2)]
                else:
                    if current_num is not None:
                        current_text.append(line.strip())
            else:
                if current_num is not None:
                    current_text.append(line.strip())
        if current_num is not None:
            solutions_map[current_num] = " ".join(current_text).strip()
            
        print("Parsed keys in solutions_map:", sorted(solutions_map.keys()))
        for k in [1, 2, 3, 4, 5]:
            print(f"  Key {k}: {solutions_map.get(k, 'NOT FOUND')[:200]}")
