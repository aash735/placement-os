import json
import re

base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
quarantine_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude\quantitative\quarantine.json"

with open(quarantine_path, "r", encoding="utf-8") as f:
    qs = json.load(f)

print(f"Total quarantined in quant: {len(qs)}")

# Fraction regex
fraction_pattern = r'\b(\d)(\d+)\s*([a-zA-Z%\s/]+[a-zA-Z%])(\d+)\b'
def replace_fraction(match):
    num = int(match.group(1))
    whole = match.group(2)
    unit = match.group(3)
    den = int(match.group(4))
    if num < den:
        return f"{whole} {num}/{den} {unit}"
    return match.group(0)

# Math symbols cleanups
def clean_text(text):
    if not text:
        return ""
    text = text.replace(" * ", " × ")
    text = text.replace("Rs. ", "₹").replace("Rs.", "₹").replace("Rs ", "₹")
    text = re.sub(r'([^a-zA-Z]|^)pa2\b', r'\1πa²', text)
    text = re.sub(r'([^a-zA-Z]|^)pr2\b', r'\1πr²', text)
    text = re.sub(r'([^a-zA-Z]|^)pR2\b', r'\1πR²', text)
    text = re.sub(r'\bcm2\b', 'cm²', text)
    text = re.sub(r'\bcm3\b', 'cm³', text)
    text = re.sub(r'\bm2\b', 'm²', text)
    text = re.sub(r'\bm3\b', 'm³', text)
    text = re.sub(r'\bunits2\b', 'units²', text)
    
    # Apply fraction replacement
    text = re.sub(fraction_pattern, replace_fraction, text)
    return text

recovered = 0
reasons = {}

for entry in qs:
    q = entry["question"]
    
    # Try cleaning options
    opts = q.get("options", [])
    cleaned_opts = [clean_text(o) for o in opts]
    
    # Re-evaluate validator check for corrupted options
    corrupt_opt_regex = r'\b[a-zA-Z]{2,}\d\b'
    still_corrupted = False
    for opt in cleaned_opts:
        if re.search(corrupt_opt_regex, str(opt)):
            still_corrupted = True
            
    # Check if answer is in cleaned options
    ans = clean_text(q.get("answer", ""))
    ans_in_opts = ans in cleaned_opts
    
    # Check duplicate option values
    unique_opts = len(set(cleaned_opts)) == len(cleaned_opts)
    
    # Check merged options
    has_merged = False
    for opt in cleaned_opts:
        if re.search(r'\(\s*[b-e]\s*\)', str(opt)):
            has_merged = True
            
    if not still_corrupted and ans_in_opts and unique_opts and not has_merged:
        recovered += 1
    else:
        # Trace why it still failed
        fails = []
        if still_corrupted: fails.append("still_corrupted_opt")
        if not ans_in_opts: fails.append("ans_not_in_opts")
        if not unique_opts: fails.append("duplicate_opts")
        if has_merged: fails.append("merged_opts")
        if not q.get("question"): fails.append("empty_question")
        
        for f in fails:
            reasons[f] = reasons.get(f, 0) + 1

print(f"Recoverable questions: {recovered}")
print(f"Non-recoverable reasons: {reasons}")
