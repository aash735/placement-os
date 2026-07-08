import os
import json
import random
import sys

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
report_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\aptitude-qa-audit-checklist.json"
md_report_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\aptitude-qa-audit-checklist.md"

def generate_audit():
    print("🎯 Running Random Quality Audit Generator...")
    categories = ["quantitative", "logical", "data-interpretation"]
    all_questions = []
    
    for cat in categories:
        json_path = os.path.join(base_dir, cat, "questions.json")
        if os.path.exists(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                all_questions.extend(json.load(f))
                
    # Group by chapter
    by_chapter = {}
    for q in all_questions:
        ch = q.get("chapter") or q.get("topic")
        if ch not in by_chapter:
            by_chapter[ch] = []
        by_chapter[ch].append(q)
        
    audit_samples = {}
    total_sampled = 0
    
    # MD Report header
    md_content = """# 🎯 QA Random Quality Audit Checklist

This report contains a random sample of up to 25 questions from every chapter in the rebuilt Aptitude database. Use this checklist to verify correctness against the original source book.

## Audit Summary
"""
    
    md_table_rows = []
    
    for ch in sorted(by_chapter.keys()):
        qs = by_chapter[ch]
        sample_size = min(25, len(qs))
        samples = random.sample(qs, sample_size)
        audit_samples[ch] = samples
        total_sampled += sample_size
        
        print(f"  Chapter '{ch}': Sampled {sample_size} out of {len(qs)} questions.")
        md_table_rows.append(f"| {ch} | {len(qs)} | {sample_size} |")
        
    md_content += "\n| Chapter | Total Questions | Sampled for QA |\n|---|---|---|\n" + "\n".join(md_table_rows) + "\n\n"
    md_content += "## Sampled Questions Checklist\n\n"
    
    for ch in sorted(audit_samples.keys()):
        md_content += f"### Chapter: {ch}\n\n"
        for idx, q in enumerate(audit_samples[ch]):
            q_id = q.get("id")
            page = q.get("page")
            ans = q.get("answer")
            render = q.get("renderMode", "TEXT")
            
            opts_str = ""
            opts = q.get("options", {})
            if isinstance(opts, dict):
                opts_str = ", ".join([f"{k}: {v[:40]}" for k, v in opts.items()])
                
            q_text = q.get("question", "")[:120].replace("\n", " ")
            
            md_content += f"#### [{ch.upper()} QA-{idx+1}] Question: {q_id}\n"
            md_content += f"- **Source Page**: {page}\n"
            md_content += f"- **Correct Answer Option**: {ans}\n"
            md_content += f"- **Render Mode**: {render}\n"
            if q.get("questionImage"):
                md_content += f"- **Cropped Question Image**: [visual](file://{q.get('questionImage')})\n"
            if q.get("optionsImage"):
                md_content += f"- **Cropped Options Image**: [visual](file://{q.get('optionsImage')})\n"
            md_content += f"- **Question text snippet**: \"{q_text}...\"\n"
            md_content += f"- **Options**: {opts_str}\n"
            md_content += "- **QA Checklist Verification**:\n"
            md_content += "    - [ ] Question matches source book\n"
            md_content += "    - [ ] Options match source book\n"
            md_content += "    - [ ] Correct answer verified\n"
            md_content += "    - [ ] Page mapping accurate\n"
            md_content += "    - [ ] Formatting/rendering correct\n\n"
            
    # Save files
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(audit_samples, f, indent=2)
    with open(md_report_path, "w", encoding="utf-8") as f:
        f.write(md_content)
        
    print(f"Random QA Checklist reports generated successfully.")
    print(f"  JSON Checklist: {report_path}")
    print(f"  Markdown Checklist: {md_report_path}")

if __name__ == "__main__":
    generate_audit()
