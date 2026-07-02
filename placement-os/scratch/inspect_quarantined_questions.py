import json
import re
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

quarantine_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude\quantitative\quarantine.json"

with open(quarantine_path, "r", encoding="utf-8") as f:
    qs = json.load(f)

print(f"Loaded {len(qs)} quarantined questions.")

corrupt_opt_regex = r'\b[a-zA-Z]{2,}\d\b'

count = 0
for entry in qs:
    q = entry["question"]
    issues = entry["issues"]
    
    # Check if this question has corrupted options
    has_corrupt_opt = False
    for opt in q.get("options", []):
        if re.search(corrupt_opt_regex, str(opt)):
            has_corrupt_opt = True
            
    if has_corrupt_opt:
        count += 1
        print(f"\n[{count}] ID: {q['id']}")
        print(f"Question: {q['question']}")
        print(f"Options: {q['options']}")
        print(f"Answer: {q['answer']}")
        print(f"Issues reported: {issues}")
        if count >= 15:
            break
