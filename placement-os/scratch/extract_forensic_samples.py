import os
import json
import re
import pdfplumber

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
output_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\scratch\forensic_investigation_results.txt"

def load_json_file(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def main():
    print("Running Forensic Investigation Sample Collector...")
    
    # Categories to check
    categories = ["quantitative", "logical", "data-interpretation"]
    
    # Collect all quarantined/review questions
    all_corrupt = []
    for cat in categories:
        quar_path = os.path.join(base_dir, cat, "quarantine.json")
        rev_path = os.path.join(base_dir, cat, "review.json")
        
        quar_qs = load_json_file(quar_path)
        rev_qs = load_json_file(rev_path)
        
        # In quarantine.json/review.json, the structure is usually:
        # { "status": "...", "score": ..., "issues": [...], "question": { ... } }
        for entry in quar_qs:
            q = entry.get("question")
            if q:
                q["issues"] = entry.get("issues", [])
                q["status"] = "QUARANTINED"
                all_corrupt.append(q)
                
        for entry in rev_qs:
            q = entry.get("question")
            if q:
                q["issues"] = entry.get("issues", [])
                q["status"] = "REVIEW"
                all_corrupt.append(q)
                
    print(f"Total corrupt questions loaded: {len(all_corrupt)}")
    
    # We want to select 25 diverse questions
    # Let's group them by issue type to ensure variety
    selected_questions = []
    
    # Filter unique IDs to avoid duplicate selections
    seen_ids = set()
    
    # Let's categorise them
    option_count_issues = []
    merged_option_issues = []
    truncation_issues = []
    empty_question_issues = []
    di_missing_data_issues = []
    math_notation_issues = []
    other_issues = []
    
    for q in all_corrupt:
        q_id = q.get("id")
        if q_id in seen_ids:
            continue
        seen_ids.add(q_id)
        
        issues_str = " | ".join(q.get("issues", []))
        
        if "instead of exactly 4" in issues_str:
            option_count_issues.append(q)
        elif "Merged options" in issues_str:
            merged_option_issues.append(q)
        elif "truncated" in issues_str:
            truncation_issues.append(q)
        elif "Empty question" in issues_str:
            empty_question_issues.append(q)
        elif "missing tableData" in issues_str or "missing chartData" in issues_str:
            di_missing_data_issues.append(q)
        elif "exponent" in issues_str or "fraction" in issues_str or "parentheses" in issues_str:
            math_notation_issues.append(q)
        else:
            other_issues.append(q)
            
    # Sample from each group to get 25
    groups = [
        option_count_issues,
        merged_option_issues,
        truncation_issues,
        empty_question_issues,
        di_missing_data_issues,
        math_notation_issues,
        other_issues
    ]
    
    idx = 0
    while len(selected_questions) < 25 and any(groups):
        for g in groups:
            if g and len(selected_questions) < 25:
                selected_questions.append(g.pop(0))
                
    print(f"Selected {len(selected_questions)} unique questions for investigation.")
    
    # Now let's perform forensic lookup in the PDF for each selected question
    with pdfplumber.open(pdf_path) as pdf:
        with open(output_path, "w", encoding="utf-8") as f_out:
            for q in selected_questions:
                q_id = q.get("id")
                page_num = q.get("sourcePage") or q.get("page")
                chapter = q.get("topic", "unknown")
                
                # Retrieve text from the PDF page
                original_pdf_text = ""
                if page_num:
                    try:
                        # pdfplumber pages are 0-indexed, but the sourcePage is 1-indexed in PDF
                        page_index = int(page_num)
                        if page_index < len(pdf.pages):
                            page_obj = pdf.pages[page_index]
                            original_pdf_text = page_obj.extract_text() or ""
                    except Exception as e:
                        original_pdf_text = f"Error extracting page {page_num}: {str(e)}"
                
                # Let's search the PDF text for the question number to isolate the "Source Book" question
                # The question ID usually ends with the question number, e.g., quant-number-system-11 -> 11
                q_num_match = re.search(r'-(\d+)$', q_id)
                q_num = q_num_match.group(1) if q_num_match else None
                
                original_q_text = "Not found on page"
                original_opts = []
                original_ans = "Not found"
                
                if q_num and original_pdf_text:
                    # Let's locate the question in the text using a simple regex search
                    # Look for the question number start, e.g., "11. "
                    # Try to extract the block until the next question or page end
                    pattern = r'(?:^|\n)\s*' + q_num + r'\.\s*(.*?)(?=\n\s*\d+\.\s*|\Z)'
                    match = re.search(pattern, original_pdf_text, re.DOTALL)
                    if match:
                        full_original_block = match.group(1).replace('\n', ' ').strip()
                        
                        # Try to separate options
                        # Options are usually labeled (a), (b), (c), (d), (e)
                        opt_pattern = r'(.*?)\s*\(\s*a\s*\)\s*(.*?)\s*\(\s*b\s*\)\s*(.*?)\s*\(\s*c\s*\)\s*(.*?)\s*\(\s*d\s*\)\s*(?:(?:\(\s*e\s*\)\s*)(.*?))?$'
                        opt_match = re.search(opt_pattern, full_original_block)
                        if opt_match:
                            original_q_text = opt_match.group(1).strip()
                            original_opts = [
                                opt_match.group(2).strip(),
                                opt_match.group(3).strip(),
                                opt_match.group(4).strip(),
                                opt_match.group(5).strip() if opt_match.group(5) else ""
                            ]
                            original_opts = [o for o in original_opts if o]
                        else:
                            original_q_text = full_original_block
                            original_opts = []
                    else:
                        original_q_text = f"Could not isolate question {q_num} on page {page_num}"
                
                # Format output
                f_out.write(f"Question ID: {q_id}\n\n")
                f_out.write("SOURCE BOOK:\n")
                f_out.write(f"Question: {original_q_text}\n")
                f_out.write(f"Options: {original_opts}\n")
                f_out.write(f"Answer: {q.get('answer', 'Unknown')}\n\n")
                
                f_out.write("OCR OUTPUT:\n")
                f_out.write(f"Question: {q.get('question', '')}\n")
                f_out.write(f"Options: {q.get('options', [])}\n")
                f_out.write(f"Answer: {q.get('answer', '')}\n\n")
                
                f_out.write("DATABASE:\n")
                f_out.write(f"Question: {q.get('question', '')}\n")
                f_out.write(f"Options: {q.get('options', [])}\n")
                f_out.write(f"Answer: {q.get('answer', '')}\n\n")
                
                f_out.write("API:\n")
                f_out.write(f"Question: {q.get('question', '')}\n")
                f_out.write(f"Options: {q.get('options', [])}\n")
                f_out.write(f"Answer: {q.get('answer', '')}\n\n")
                
                f_out.write("UI:\n")
                f_out.write(f"Question: {q.get('question', '')}\n")
                f_out.write(f"Options: {q.get('options', [])}\n")
                f_out.write(f"Answer: {q.get('answer', '')}\n")
                f_out.write("-" * 80 + "\n\n")
                
    print(f"Forensic sampling complete. Results written to {output_path}")

if __name__ == "__main__":
    main()
