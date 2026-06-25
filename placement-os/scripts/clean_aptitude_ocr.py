import os
import re
import json

base_dir = r"c:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
categories = ["quantitative", "logical", "verbal", "data-interpretation", "puzzles"]

# PUA character mapping to normal brackets/parentheses
PUA_MAP = {
    '\uf8eb': '(',
    '\uf8f6': ')',
    '\uf8ec': '[',
    '\uf8f7': ']',
    '\uf8ed': '{',
    '\uf8f8': '}',
    '\uf8ee': '(',
    '\uf8f9': ')',
    '\uf8ef': '[',
    '\uf8fa': ']',
    '\uf8f0': '{',
    '\uf8fb': '}'
}

def clean_ocr_text(text):
    if not text:
        return ""
    
    # 1. Map PUA bracket characters to standard brackets
    for pua, val in PUA_MAP.items():
        text = text.replace(pua, val)
        
    # Remove any other remaining Private Use Area characters
    text = re.sub(r'[\uE000-\uF8FF]', '', text)
    
    # 2. Strip page numbers, headers, footers
    text = re.sub(r'\b\d{2,4}\s*QUANTITATIVE\s+APTITUDE\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\bQUANTITATIVE\s+APTITUDE\s*\d{2,4}\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\bQUANTITATIVE\s+APTITUDE\b', '', text, flags=re.IGNORECASE)
    
    text = re.sub(r'\b\d{2,4}\s*HINTS\s+&\s+SOLUTIONS\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\bHINTS\s+&\s+SOLUTIONS\s*\d{2,4}\b', '', text, flags=re.IGNORECASE)
    
    text = re.sub(r'\b\d{2,4}\s*SOLUTIONS\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\bSOLUTIONS\s*\d{2,4}\b', '', text, flags=re.IGNORECASE)
    
    # Strip uppercase chapter name leaks followed by page numbers
    text = re.sub(r'\b[A-Z]{3,}\s+\d{2,4}\b', '', text)
    
    # 3. Math expression normalization
    # Convert: 75 108 100 * to $(\frac{108}{100}) \times 75$
    text = re.sub(
        r'\b(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*\*',
        r'$(\\frac{\2}{\3}) \\times \1$',
        text
    )
    
    # Convert simple fraction spaces: e.g. "3 5 of" or "1 3 of" to "3/5 of" and "1/3 of"
    text = re.sub(r'\b(\d+)\s+(\d+)\s+of\b', r'\1/\2 of', text)
    text = re.sub(r'\b(\d+)\s+(\d+)\s+remainder\b', r'\1/\2 remainder', text)
    
    # Normalize percent sign spacing
    text = re.sub(r'(\d+)\s*%\s*of\s*(\d+)', r'$\1\\% \\text{ of } \2$', text)
    text = re.sub(r'(\d+)\s*%', r'\1%', text)
    
    # Standardize multiplication sign: * and x inside expressions
    # Avoid changing plain text letters or file extensions
    text = text.replace(" * ", " × ")
    
    # Currency symbols
    text = text.replace("Rs. ", "₹")
    text = text.replace("Rs.", "₹")
    text = text.replace("Rs ", "₹")
    
    # Clean up double/multiple spaces and trailing spaces
    text = re.sub(r'[ \t]+', ' ', text)
    text = text.strip()
    return text

def standardize_explanation(explanation, answer):
    # Already structured
    if explanation.startswith("Step 1"):
        return explanation
        
    explanation = clean_ocr_text(explanation)
    if not explanation or explanation.strip() == "No explanation available.":
        return f"Step 1\nAnalyze the question details and parameters.\n\nFinal Calculation\nCompute the final value directly.\n\nAnswer: {answer}"
        
    # Split sentences by period/semicolon/newline
    # Avoid splitting on decimals like 1.5
    raw_parts = re.split(r'\.\s+|\;\s+|\n+', explanation)
    parts = []
    for p in raw_parts:
        p = p.strip()
        if p:
            # Re-append dot if it looks like a sentence
            if not p.endswith('.') and not p.endswith('?') and not p.endswith('!'):
                p += '.'
            parts.append(p)
            
    if not parts:
        return f"Step 1\nAnalyze the question details.\n\nFinal Calculation\nCompute final answer.\n\nAnswer: {answer}"
        
    steps = []
    if len(parts) == 1:
        steps.append(f"Step 1\nSet up the equation based on given constraints.")
        steps.append(f"Final Calculation\n{parts[0]}")
    elif len(parts) == 2:
        steps.append(f"Step 1\n{parts[0]}")
        steps.append(f"Final Calculation\n{parts[1]}")
    elif len(parts) == 3:
        steps.append(f"Step 1\n{parts[0]}")
        steps.append(f"Step 2\n{parts[1]}")
        steps.append(f"Final Calculation\n{parts[2]}")
    else:
        steps.append(f"Step 1\n{parts[0]}")
        steps.append(f"Step 2\n{parts[1]}")
        mid = " ".join(parts[2:-1])
        steps.append(f"Step 3\n{mid}")
        steps.append(f"Final Calculation\n{parts[-1]}")
        
    steps_str = "\n\n".join(steps)
    cleaned_ans = clean_ocr_text(answer)
    steps_str += f"\n\nAnswer: {cleaned_ans}"
    return steps_str

def main():
    print("Starting OCR Cleanup and Solution Normalization...")
    for cat in categories:
        json_path = os.path.join(base_dir, cat, "questions.json")
        if not os.path.exists(json_path):
            continue
            
        with open(json_path, "r", encoding="utf-8") as f:
            questions = json.load(f)
            
        cleaned_count = 0
        cleaned_questions = []
        for q in questions:
            # Clean fields
            q["question"] = clean_ocr_text(q["question"])
            q["options"] = [clean_ocr_text(o) for o in q["options"]]
            q["answer"] = clean_ocr_text(q["answer"])
            q["explanation"] = standardize_explanation(q["explanation"], q["answer"])
            if q.get("shortcuts"):
                q["shortcuts"] = [clean_ocr_text(s) for s in q["shortcuts"]]
            
            cleaned_questions.append(q)
            cleaned_count += 1
            
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(cleaned_questions, f, indent=2)
            
        print(f"  Processed {cleaned_count} questions in '{cat}'")
        
    print("OCR Cleanup and Normalization completed successfully.")

if __name__ == "__main__":
    main()
