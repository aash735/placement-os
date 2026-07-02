import os
import json
import re

base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
categories = ["quantitative", "logical", "verbal", "data-interpretation", "puzzles"]

def analyze():
    print("--- APITUDE QUESTIONS ANALYSIS ---")
    for cat in categories:
        json_path = os.path.join(base_dir, cat, "questions.json")
        if not os.path.exists(json_path):
            print(f"Category '{cat}': questions.json NOT FOUND")
            continue
            
        with open(json_path, "r", encoding="utf-8") as f:
            qs = json.load(f)
            
        print(f"\nCategory '{cat}': {len(qs)} questions total")
        
        # Count by topic
        topics = {}
        pdf_sources = 0
        placeholder_exps = 0
        real_exps = 0
        corrupted_opts = 0
        corrupted_opts_examples = []
        
        for q in qs:
            t = q.get("topic", "unknown")
            topics[t] = topics.get(t, 0) + 1
            
            sf = q.get("sourceFile", "")
            if "rs-aggarwal" in sf or "9352534026" in sf or "1769142935" in sf:
                pdf_sources += 1
                
            exp = q.get("explanation", "")
            if "Detailed explanation will be available" in exp or "explanation unavailable" in exp.lower() or not exp.strip():
                placeholder_exps += 1
            else:
                real_exps += 1
                
            opts = q.get("options", [])
            has_corr_opt = False
            for opt in opts:
                opt_str = str(opt)
                # Check for Pattern: digit + word + digit (like 24 days5 or 15 days3)
                if re.search(r'\b\d+\s*[a-zA-Z]+\d+\b', opt_str):
                    has_corr_opt = True
                # Check for merged options (contains (b), (c), etc.)
                if re.search(r'\(\s*[b-e]\s*\)', opt_str):
                    has_corr_opt = True
            if has_corr_opt:
                corrupted_opts += 1
                if len(corrupted_opts_examples) < 5:
                    corrupted_opts_examples.append((q.get("id"), q.get("question")[:50], opts))
                    
        print(f"  From PDF: {pdf_sources}")
        print(f"  Explanations: Real={real_exps}, Placeholders={placeholder_exps}")
        print(f"  Corrupted Options count: {corrupted_opts}")
        if corrupted_opts_examples:
            print("  Corrupted Options Examples:")
            for q_id, text, opts in corrupted_opts_examples:
                print(f"    - {q_id}: {text}... | Options: {opts}")
                
        print("  Topics count:")
        for t, count in sorted(topics.items()):
            print(f"    {t}: {count}")

if __name__ == "__main__":
    analyze()
