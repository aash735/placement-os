import json
import re

raw_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude\quantitative\quarantine.json"
with open(raw_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Quarantined quantitative questions: {len(data)}")

# Print details of the first 5 quarantined questions that have "Average" in their ID
count = 0
for q in data:
    qid = q["question"]["id"]
    if "average" in qid:
        print(f"\n--- {qid} ---")
        print("Issues:", q["issues"])
        print("Explanation:", q["question"]["explanation"])
        count += 1
        if count >= 5:
            break
