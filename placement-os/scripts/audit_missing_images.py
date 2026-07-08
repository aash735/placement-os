import os
import json

base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os"
public_dir = os.path.join(base_dir, "public")
data_dir = os.path.join(base_dir, "src", "data", "aptitude")

# Load TS questions via python using json loader for the raw categories
categories = ["quantitative", "logical", "verbal", "data-interpretation", "puzzles"]

print("Auditing image assets...")
missing_count = 0
for cat in categories:
    json_path = os.path.join(data_dir, cat, "questions.json")
    if not os.path.exists(json_path):
        continue
    with open(json_path, 'r', encoding='utf-8') as f:
        qs = json.load(f)
    for q in qs:
        mode = q.get("renderMode")
        img = q.get("questionImage")
        q_id = q.get("id")
        if mode in ["IMAGE", "HYBRID"] or img:
            if not img:
                print(f"  [MISSING IMG FIELD] {q_id} (mode={mode})")
                missing_count += 1
            else:
                img_path = os.path.join(public_dir, img.lstrip("/"))
                if not os.path.exists(img_path):
                    print(f"  [MISSING FILE] {q_id} -> {img} (exists={os.path.exists(img_path)})")
                    missing_count += 1

print(f"Total missing assets found in category JSONs: {missing_count}")
