import re
import json

def parse_percentage():
    # 1. Read exercise text (pages 325-349 in PDF, but we'll read scratch/percentage_pages.txt for a subset)
    with open("scratch/percentage_pages.txt", "r", encoding="utf-8") as f:
        pages_text = f.read()

    # 2. Read solutions text (pages 350-377 in PDF, we'll read scratch/percentage_solutions.txt)
    with open("scratch/percentage_solutions.txt", "r", encoding="utf-8") as f:
        solutions_text = f.read()

    # Parse Answers Map from page 350
    # Answers block: 1. (c) 2. (d) 3. (d) etc.
    answers_map = {}
    ans_matches = re.findall(r"(\d+)\.\s*\(\s*([a-e])\s*\)", solutions_text[:2000])
    for num, ans in ans_matches:
        answers_map[int(num)] = ans.strip()

    print(f"Parsed {len(answers_map)} answers. E.g., 1 -> {answers_map.get(1)}, 2 -> {answers_map.get(2)}")

    # Parse Solutions Map
    # Solutions start after answers block. Let's find "SOLUTIONS" in text.
    sol_start = solutions_text.find("SOLUTIONS")
    solutions_map = {}
    if sol_start != -1:
        sol_content = solutions_text[sol_start:]
        # Match each solution block: e.g. " 1. 3/4 expressed..."
        # We can split by lines and look for " \d+\. " at the start of a line.
        sol_lines = sol_content.split("\n")
        current_num = None
        current_text = []
        for line in sol_lines:
            match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
            if match:
                if current_num is not None:
                    solutions_map[current_num] = " ".join(current_text).strip()
                current_num = int(match.group(1))
                current_text = [match.group(2)]
            else:
                if current_num is not None:
                    current_text.append(line.strip())
        if current_num is not None:
            solutions_map[current_num] = " ".join(current_text).strip()

    print(f"Parsed {len(solutions_map)} solutions. E.g., 1 -> {solutions_map.get(1)}")

    # Parse Questions
    # Exercise starts after "EXERCISE (OBJECTIVE TYPE QUESTIONS)"
    ex_start = pages_text.find("EXERCISE")
    questions = []
    if ex_start != -1:
        ex_content = pages_text[ex_start:]
        ex_lines = ex_content.split("\n")
        
        current_q_num = None
        current_q_text = []
        current_options = []
        
        for line in ex_lines:
            # Check for new question
            # Questions look like: " 1. How is 3"
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
                # Check for options: (a), (b), (c), (d), (e)
                # Options can be inline: e.g., "  ( a) 0.75% (b) 7.5%"
                opt_matches = re.findall(r"\(\s*([a-e])\s*\)\s*([^(\n]*)", line)
                if opt_matches:
                    for opt_letter, opt_val in opt_matches:
                        current_options.append(opt_val.strip())
                else:
                    if current_q_num is not None:
                        current_q_text.append(line.strip())
                        
        if current_q_num is not None:
            questions.append({
                "num": current_q_num,
                "text": " ".join(current_q_text).strip(),
                "options": current_options
            })

    print(f"Parsed {len(questions)} questions from pages text.")
    
    # Merge and print samples
    merged = []
    for q in questions[:10]:
        num = q["num"]
        ans_letter = answers_map.get(num)
        sol = solutions_map.get(num)
        
        # Options map
        options_list = q["options"]
        correct_ans_text = ""
        if ans_letter and len(options_list) > 0:
            idx = ord(ans_letter) - ord('a')
            if idx < len(options_list):
                correct_ans_text = options_list[idx]
        
        merged.append({
            "id": f"quant-pct-{num}",
            "question": q["text"],
            "options": options_list,
            "answer": correct_ans_text,
            "explanation": sol or "",
            "topic": "percentages",
            "category": "quant",
            "difficulty": 2
        })
        
    print("\nSample Merged Question 1:")
    print(json.dumps(merged[0], indent=2))
    
if __name__ == "__main__":
    parse_percentage()
