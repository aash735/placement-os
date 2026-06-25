import re
import json
import os

ts_file_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude-questions.ts"
base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"

# Map of existing topic IDs to subtopic names and clean topic names
topic_info = {
    "percentages": {"topic": "percentages", "subtopic": "Percentages & Profit-Loss"},
    "ratios": {"topic": "ratios", "subtopic": "Ratio & Proportion"},
    "time-work": {"topic": "time-work", "subtopic": "Time & Work"},
    "speed": {"topic": "speed", "subtopic": "Time, Speed & Distance"},
    "series": {"topic": "series", "subtopic": "Number & Letter Series"},
    "coding-decoding": {"topic": "coding-decoding", "subtopic": "Coding-Decoding"},
    "blood-relations": {"topic": "blood-relations", "subtopic": "Blood Relations"},
    "syllogism": {"topic": "syllogism", "subtopic": "Syllogism"},
    "grammar": {"topic": "grammar", "subtopic": "Grammar & Sentence Correction"},
    "rc": {"topic": "rc", "subtopic": "Reading Comprehension"},
    "vocab": {"topic": "vocab", "subtopic": "Vocabulary & Para Jumbles"},
    "di": {"topic": "di", "subtopic": "Charts & Tables"},
    "puzzles": {"topic": "puzzles", "subtopic": "Seating & Arrangement"}
}

def migrate():
    with open(ts_file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract baseAptitudeQuestions array text
    match = re.search(r"const baseAptitudeQuestions: AptitudeQuestion\[\] = \[(.*?)\];\s*export const aptitudeQuestions", content, re.DOTALL)
    if not match:
        print("Could not parse baseAptitudeQuestions from file.")
        return

    array_text = match.group(1)

    # Let's write a simple parser or use regex to extract question blocks
    question_blocks = re.findall(r"\{\s*id:\s*\"([^\"]+)\",.*?\}\s*(?=,\s*\{|\s*$)", array_text + "\n", re.DOTALL)
    print(f"Found {len(question_blocks)} question blocks in typescript file.")

    # We can also parse them by using a JS engine or custom regex
    # Since we know the exact 17 questions, let's write a python regex parser for the key-value pairs
    parsed_questions = []
    
    # We split by '},\n  {' to isolate blocks
    blocks = re.split(r"\},\s*\{", array_text)
    
    for i, block in enumerate(blocks):
        # clean block
        block = block.strip()
        if not block.startswith("{"):
            block = "{" + block
        if not block.endswith("}"):
            block = block + "}"
            
        # extract fields
        def get_field_str(name):
            m = re.search(fr"{name}:\s*\"([^\"]*)\"", block)
            if m:
                return m.group(1)
            # check single quotes
            m = re.search(fr"{name}:\s*'([^']*)'", block)
            if m:
                return m.group(1)
            return None

        def get_field_array(name):
            m = re.search(fr"{name}:\s*\[(.*?)\]", block, re.DOTALL)
            if m:
                arr_str = m.group(1)
                # find all strings inside quotes
                return [s.strip(' "\'') for s in re.findall(r"\"[^\"]+\"|'[^']+'", arr_str)]
            return []

        def get_field_num(name):
            m = re.search(fr"{name}:\s*([0-9]+)", block)
            if m:
                return int(m.group(1))
            return None

        q_id = get_field_str("id")
        if not q_id:
            # try to parse without quotes around key
            m = re.search(r"id:\s*\"([^\"]+)\"", block)
            if m:
                q_id = m.group(1)
                
        question = get_field_str("question")
        if not question:
            # check multiline double quotes
            m = re.search(r"question:\s*\"\"\"(.*?)\"\"\"", block, re.DOTALL)
            if m:
                question = m.group(1)
            else:
                m = re.search(r"question:\s*\"(.*?)\"(?=\s*,)", block, re.DOTALL)
                if m:
                    question = m.group(1)
        
        # fix backslashes or escaped quotes
        if question:
            question = question.replace('\\"', '"').replace('\\n', '\n')
            
        options = get_field_array("options")
        answer = get_field_str("answer")
        explanation = get_field_str("explanation")
        if explanation:
            explanation = explanation.replace('\\"', '"').replace('\\n', '\n')
        shortcuts = get_field_array("shortcuts")
        difficulty = get_field_num("difficulty")
        topic = get_field_str("topic")
        category = get_field_str("category")
        estimatedTime = get_field_num("estimatedTime")
        companyRelevance = get_field_array("companyRelevance")

        if not q_id or not question:
            continue

        # Map category to new folder name
        cat_folder = {
            "quant": "quantitative",
            "logical": "logical",
            "verbal": "verbal",
            "di": "data-interpretation",
            "puzzles": "puzzles"
        }.get(category, category)

        # Merge with syllabus info
        t_info = topic_info.get(topic, {"topic": topic, "subtopic": "General"})

        # Build schema compliant object
        diff_str = {1: "Easy", 2: "Medium", 3: "Hard"}.get(difficulty, "Medium")
        
        q_obj = {
            "id": q_id,
            "category": category,
            "topic": topic,
            "subtopic": t_info["subtopic"],
            "difficulty": difficulty, # Keep as number for backward compatibility
            "difficultyStr": diff_str, # Add string difficulty
            "question": question,
            "options": options,
            "answer": answer,
            "explanation": explanation,
            "shortcuts": shortcuts,
            "estimatedTime": estimatedTime or 60,
            "companyRelevance": companyRelevance,
            "tags": [topic, t_info["subtopic"].lower()],
            "companyTags": companyRelevance
        }
        parsed_questions.append((cat_folder, q_obj))

    # Read existing generated questions in JSON, and append
    for cat in ["quantitative", "logical", "verbal", "data-interpretation", "puzzles"]:
        json_path = os.path.join(base_dir, cat, "questions.json")
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                existing_qs = json.load(f)
        except Exception:
            existing_qs = []

        # Find migrated questions for this category
        mig_qs = [q for c, q in parsed_questions if c == cat]
        
        # Merge, avoiding duplicates by id
        merged = {q["id"]: q for q in existing_qs}
        for q in mig_qs:
            merged[q["id"]] = q

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(list(merged.values()), f, indent=2)
            
        print(f"Updated {json_path} - total questions now: {len(merged)}")

if __name__ == "__main__":
    migrate()
