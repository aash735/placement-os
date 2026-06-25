import json
import os

base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
categories = ["quantitative", "logical", "verbal", "data-interpretation", "puzzles"]

difficulty_map = {
    "Easy": 1,
    "Medium": 2,
    "Hard": 3,
    "easy": 1,
    "medium": 2,
    "hard": 3,
    1: 1,
    2: 2,
    3: 3
}

category_code_map = {
    "quantitative": "quant",
    "logical": "logical",
    "verbal": "verbal",
    "data-interpretation": "di",
    "puzzles": "puzzles",
    "quant": "quant",
    "di": "di"
}

def normalize():
    for cat in categories:
        json_path = os.path.join(base_dir, cat, "questions.json")
        if not os.path.exists(json_path):
            continue
        
        with open(json_path, "r", encoding="utf-8") as f:
            questions = json.load(f)
            
        normalized_questions = []
        for q in questions:
            # Map difficulty
            diff_raw = q.get("difficulty", 2)
            diff_num = difficulty_map.get(diff_raw, 2)
            
            # Map category code
            cat_raw = q.get("category", "quant")
            cat_code = category_code_map.get(cat_raw, "quant")
            
            # Ensure estimatedTime is a number
            est_time = q.get("estimatedTime", q.get("estimatedTimeSec", 60))
            try:
                est_time = int(est_time)
            except Exception:
                est_time = 60

            # Ensure companyRelevance exists and is a list
            company_rel = q.get("companyRelevance", q.get("companyTags", []))
            if not isinstance(company_rel, list):
                company_rel = [company_rel] if company_rel else []
            company_rel = [str(x) for x in company_rel]
            
            # Ensure shortcuts is a list of strings
            shortcuts = q.get("shortcuts", [])
            if not isinstance(shortcuts, list):
                shortcuts = [shortcuts] if shortcuts else []
            shortcuts = [str(x) for x in shortcuts]
            
            # Ensure tags is a list of strings
            tags = q.get("tags", [])
            if not isinstance(tags, list):
                tags = [tags] if tags else []
            tags = [str(x) for x in tags]

            # Build standardized object
            normalized_q = {
                "id": str(q.get("id")),
                "question": str(q.get("question")),
                "options": [str(x) for x in q.get("options", [])],
                "answer": str(q.get("answer")),
                "explanation": str(q.get("explanation", "")),
                "shortcuts": shortcuts,
                "difficulty": diff_num,
                "topic": str(q.get("topic", "general")),
                "category": cat_code,
                "estimatedTime": est_time,
                "companyRelevance": company_rel,
                "subtopic": str(q.get("subtopic", "General")),
                "tags": tags,
                "companyTags": company_rel
            }
            normalized_questions.append(normalized_q)
            
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(normalized_questions, f, indent=2)
        print(f"Normalized {json_path} - count: {len(normalized_questions)}")

if __name__ == "__main__":
    normalize()
