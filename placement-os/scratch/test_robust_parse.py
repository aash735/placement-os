import re
import json

def test_robust_parse():
    # Read exercise text
    with open("scratch/percentage_pages.txt", "r", encoding="utf-8") as f:
        pages_text = f.read()

    # Read solutions text
    with open("scratch/percentage_solutions.txt", "r", encoding="utf-8") as f:
        solutions_text = f.read()

    # Parse Answers Map from page 350
    answers_map = {}
    # Search for Answers block
    ans_start = solutions_text.find("ANSWERS")
    if ans_start != -1:
        ans_block = solutions_text[ans_start:ans_start + 4000]
        # Match all \b\d+\.\s*\([a-e]\)
        ans_matches = re.findall(r"(\d+)\.\s*\(\s*([a-e])\s*\)", ans_block)
        for num, ans in ans_matches:
            answers_map[int(num)] = ans.strip()

    print(f"Total Answers parsed: {len(answers_map)}")

    # Parse Solutions Map
    # Solutions start after answers block.
    sol_start = solutions_text.find("SOLUTIONS")
    solutions_map = {}
    if sol_start != -1:
        sol_content = solutions_text[sol_start:]
        # Let's match solution items: e.g. " 1. 3/4 expressed..."
        # To avoid matching data sufficiency or other sections, we can limit to matching up to the end of solutions page range
        # Let's split by lines and look for " \d+\. " at the start of a line.
        sol_lines = sol_content.split("\n")
        current_num = None
        current_text = []
        for line in sol_lines:
            # We want to match " 1. " at the start of a line, but avoid matching lines from section 11B (Data Sufficiency)
            # Section 11B starts around page 378.
            if "Ex. 25." in line or "Sumit's present salary" in line or "11B" in line or "DATA–SUFFICIENCY" in line or "DATA-SUFFICIENCY" in line or "DATA – SUFFICIENCY" in line:
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

    print(f"Total Solutions parsed: {len(solutions_map)}")

    # Parse Questions
    # Find start of exercise
    ex_start = pages_text.find("EXERCISE")
    questions = []
    if ex_start != -1:
        ex_content = pages_text[ex_start:]
        # Split by question numbers
        # A question starts with a number at the start of a line like " 1. " or "1. "
        lines = ex_content.split("\n")
        
        current_q_num = None
        current_q_text = []
        current_options = []
        
        for line in lines:
            q_match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
            if q_match:
                # Save previous question
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
                # Extract options
                opt_matches = re.findall(r"\(\s*([a-e])\s*\)\s*([^(\n]*)", line)
                if opt_matches:
                    for letter, val in opt_matches:
                        # Clean up value
                        val_clean = val.strip()
                        # Sometimes pypdf puts other text in options. Clean it up.
                        current_options.append(val_clean)
                else:
                    if current_q_num is not None:
                        current_q_text.append(line.strip())
                        
        if current_q_num is not None:
            questions.append({
                "num": current_q_num,
                "text": " ".join(current_q_text).strip(),
                "options": current_options
            })

    print(f"Total Questions parsed: {len(questions)}")

    # Sample check
    for idx in range(5):
        if idx < len(questions):
            q = questions[idx]
            num = q["num"]
            ans = answers_map.get(num)
            sol = solutions_map.get(num)
            print(f"\n--- QUESTION {num} ---")
            print(f"Text: {q['text']}")
            print(f"Options: {q['options']}")
            print(f"Correct Answer: {ans}")
            print(f"Solution: {sol}")

if __name__ == "__main__":
    test_robust_parse()
