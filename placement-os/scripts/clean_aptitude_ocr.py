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
    
    # Rebuild corrupted fractions from OCR layout displacement
    # Pattern 1: e.g. "15days3" -> "5 1/3 days" or "24days5" -> "4 2/5 days" or "14%gain7" -> "14 2/7 % gain"
    # Unit must not contain spaces, and denominator must be a single digit stuck to the unit.
    def replace_fraction_with_unit(match):
        num = int(match.group(1))
        whole = match.group(2)
        unit = match.group(3)
        den = int(match.group(4))
        if num < den:
            return f"{whole} {num}/{den} {unit}"
        return match.group(0)
    text = re.sub(r'\b(\d)(\d+)\s*([a-zA-Z%]+)(\d)\b', replace_fraction_with_unit, text)

    # Pattern 2: e.g. "7 th8" -> "7/8 th"
    # Restrict Group 2 to ordinal indicators to avoid corrupting text like "9 dividing 99"
    text = re.sub(r'\b(\d+)\s*(th|rd|nd|st|h)\s*(\d+)\b', r'\1/\3 \2', text)
    
    # Pattern 3: e.g. "3 4 th" -> "3/4th"
    text = re.sub(r'\b(\d+)\s+(\d+)\s*(th|rd|nd|st|h)\b', r'\1/\2\3', text)

    # 3. Math expression normalization
    # Convert: 75 108 100 * to $(\frac{108}{100}) \times 75$
    text = re.sub(
        r'\b(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*\*',
        r'$(\\frac{\2}{\3}) \\times \1$',
        text
    )
    
    # Convert simple fraction spaces: e.g. "3 5 of" or "1 3 of" to "3/5 of" and "1/3 of"
    text = re.sub(r'\b(\d+)\s+([234568])\s+of\b', r'\1/\2 of', text)
    text = re.sub(r'\b(\d+)\s+([234568])\s+remainder\b', r'\1/\2 remainder', text)
    
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
    
    # Math symbol / notation fixes
    text = re.sub(r'([^a-zA-Z]|^)pa2\b', r'\1πa²', text)
    text = re.sub(r'([^a-zA-Z]|^)pr2\b', r'\1πr²', text)
    text = re.sub(r'([^a-zA-Z]|^)pR2\b', r'\1πR²', text)
    text = re.sub(r'\bcm2\b', 'cm²', text)
    text = re.sub(r'\bcm3\b', 'cm³', text)
    text = re.sub(r'\bm2\b', 'm²', text)
    text = re.sub(r'\bm3\b', 'm³', text)
    text = re.sub(r'\bunits2\b', 'units²', text)
    text = re.sub(r'\bunits3\b', 'units³', text)
    
    # Clean up double/multiple spaces and trailing spaces
    text = re.sub(r'[ \t]+', ' ', text)
    text = text.strip()
    return text
BOILERPLATE_PATTERNS = [
    re.compile(r'^\s*step\s+\d+\s*$', re.IGNORECASE),
    re.compile(r'^\s*final\s+calculation\s*$', re.IGNORECASE),
    re.compile(r'^\s*answer:\s*.*$', re.IGNORECASE),
    re.compile(r'analyze the question details', re.IGNORECASE),
    re.compile(r'compute the final value', re.IGNORECASE),
    re.compile(r'apply the formula', re.IGNORECASE),
    re.compile(r'calculate the result', re.IGNORECASE),
    re.compile(r'compute final answer', re.IGNORECASE),
    re.compile(r'set up the equation based on given constraints', re.IGNORECASE),
    re.compile(r'use the given information', re.IGNORECASE),
    re.compile(r'analyze the question', re.IGNORECASE),
    re.compile(r'no explanation available', re.IGNORECASE),
    re.compile(r'refer to standard solutions', re.IGNORECASE),
    re.compile(r'detailed explanation unavailable', re.IGNORECASE),
    re.compile(r'verified detailed explanation unavailable', re.IGNORECASE),
    re.compile(r'compute the value', re.IGNORECASE),
    re.compile(r'calculate the answer', re.IGNORECASE)
]

def split_sentences(text):
    sentences = []
    current = ""
    bracket_depth = 0
    square_depth = 0
    curly_depth = 0
    
    for i in range(len(text)):
        char = text[i]
        if char == '(': bracket_depth += 1
        elif char == ')': bracket_depth -= 1
        elif char == '[': square_depth += 1
        elif char == ']': square_depth -= 1
        elif char == '{': curly_depth += 1
        elif char == '}': curly_depth -= 1
        
        current += char
        
        if bracket_depth <= 0 and square_depth <= 0 and curly_depth <= 0:
            if (char == '.' or char == ';') and (i == len(text) - 1 or text[i+1].isspace()):
                sentences.append(current.strip())
                current = ""
            elif char == '\n':
                sentences.append(current.strip())
                current = ""
                
    if current.strip():
        sentences.append(current.strip())
    return [s for s in sentences if s]

def standardize_explanation(explanation, answer):
    FALLBACK_MSG = "Detailed explanation is currently being prepared and will be available in a future update."
    if not explanation:
        return FALLBACK_MSG
        
    explanation = clean_ocr_text(explanation)
    
    # Split sentences by period/semicolon/newline
    # Avoid splitting on decimals like 1.5
    raw_parts = split_sentences(explanation)
    parts = []
    for p in raw_parts:
        p = p.strip()
        if p:
            # Check if any boilerplate pattern matches
            if any(pattern.search(p) for pattern in BOILERPLATE_PATTERNS):
                continue
            # Re-append dot if it looks like a sentence
            if not p.endswith('.') and not p.endswith('?') and not p.endswith('!'):
                p += '.'
            parts.append(p)
            
    # Re-join to assess length
    remaining_text = " ".join(parts).strip()
    if len(remaining_text) < 25:
        return FALLBACK_MSG
        
    steps = []
    if len(parts) == 1:
        steps.append(f"Step 1\n{parts[0]}")
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
