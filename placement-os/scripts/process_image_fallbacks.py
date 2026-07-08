import os
import re
import json
import pdfplumber
import pypdfium2 as pdfium
from PIL import Image

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
output_image_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\public\resources\aptitude"
report_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\aptitude-audit-report.json"

# Import crop function
from generate_question_images import crop_question_image

def load_json_file(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_json_file(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def main():
    print("Running Image Fallback Processing and Database Recovery...")
    
    categories = ["quantitative", "logical", "data-interpretation"]
    
    # Load PDF once to share across calls
    pdf_doc = pdfium.PdfDocument(pdf_path)
    
    total_recovered = 0
    
    # Track statistics for report update
    stats_updated = {
        "quantitative": {"valid": 0, "review": 0, "quarantine": 0},
        "logical": {"valid": 0, "review": 0, "quarantine": 0},
        "data-interpretation": {"valid": 0, "review": 0, "quarantine": 0},
        "verbal": {"valid": 0, "review": 0, "quarantine": 0},
        "puzzles": {"valid": 0, "review": 0, "quarantine": 0}
    }
    
    # Preserve verbal and puzzles counts
    for c in ["verbal", "puzzles"]:
        valid_qs = load_json_file(os.path.join(base_dir, c, "questions.json"))
        review_qs = load_json_file(os.path.join(base_dir, c, "review.json"))
        quar_qs = load_json_file(os.path.join(base_dir, c, "quarantine.json"))
        stats_updated[c]["valid"] = len(valid_qs)
        stats_updated[c]["review"] = len(review_qs)
        stats_updated[c]["quarantine"] = len(quar_qs)

    for cat in categories:
        prod_path = os.path.join(base_dir, cat, "questions.json")
        review_path = os.path.join(base_dir, cat, "review.json")
        quar_path = os.path.join(base_dir, cat, "quarantine.json")
        
        valid_qs = load_json_file(prod_path)
        review_qs = load_json_file(review_path)
        quar_qs = load_json_file(quar_path)
        
        print(f"Processing category '{cat}':")
        print(f"  Initial - Valid: {len(valid_qs)} | Review: {len(review_qs)} | Quarantine: {len(quar_qs)}")
        
        new_valid = []
        new_review = []
        new_quar = []
        
        # 1. Process Review Questions
        for entry in review_qs:
            q = entry.get("question")
            score = entry.get("score", 100)
            issues = entry.get("issues", [])
            
            if not q:
                new_review.append(entry)
                continue
                
            q_id = q.get("questionId") or q.get("id")
            page_num = q.get("page") or q.get("sourcePage")
            
            # Extract question number from ID (e.g. quant-number-system-11 -> 11)
            num_match = re.search(r'-(\d+)$', q_id)
            q_num = int(num_match.group(1)) if num_match else None
            
            # Check eligibility for image fallback
            opts = q.get("options")
            ans = q.get("answer")
            has_4_options = False
            correct_ans_valid = False
            if opts and ans:
                if isinstance(opts, list):
                    has_4_options = len(opts) == 4
                    correct_ans_valid = ans in opts
                elif isinstance(opts, dict):
                    has_4_options = len(opts) == 4 and all(k in opts for k in ["A", "B", "C", "D"])
                    correct_ans_valid = ans in ["A", "B", "C", "D"]
            
            if q_num is not None and page_num is not None and has_4_options and correct_ans_valid and score >= 30:
                print(f"  [REVIEW] Salvaging {q_id} (Page {page_num}, Q {q_num})...")
                success = crop_question_image(pdf_doc, int(page_num), q_num, q_id)
                if success:
                    q["renderMode"] = "IMAGE"
                    q["questionImage"] = f"/resources/aptitude/{q_id}.png"
                    q["validationStatus"] = "PASS"
                    q["integrityStatus"] = "INTEGRATED"
                    valid_qs.append(q)
                    total_recovered += 1
                else:
                    new_review.append(entry)
            else:
                new_review.append(entry)
                
        # 2. Process Quarantine Questions
        for entry in quar_qs:
            q = entry.get("question")
            score = entry.get("score", 100)
            issues = entry.get("issues", [])
            
            if not q:
                new_quar.append(entry)
                continue
                
            q_id = q.get("questionId") or q.get("id")
            page_num = q.get("page") or q.get("sourcePage")
            
            num_match = re.search(r'-(\d+)$', q_id)
            q_num = int(num_match.group(1)) if num_match else None
            
            opts = q.get("options")
            ans = q.get("answer")
            has_4_options = False
            correct_ans_valid = False
            if opts and ans:
                if isinstance(opts, list):
                    has_4_options = len(opts) == 4
                    correct_ans_valid = ans in opts
                elif isinstance(opts, dict):
                    has_4_options = len(opts) == 4 and all(k in opts for k in ["A", "B", "C", "D"])
                    correct_ans_valid = ans in ["A", "B", "C", "D"]
            
            # Duplicate IDs are hard failures and must never be salvaged
            is_duplicate = any("Duplicate" in issue for issue in issues)
            
            if q_num is not None and page_num is not None and has_4_options and correct_ans_valid and score >= 30 and not is_duplicate:
                print(f"  [QUARANTINE] Salvaging {q_id} (Page {page_num}, Q {q_num})...")
                success = crop_question_image(pdf_doc, int(page_num), q_num, q_id)
                if success:
                    q["renderMode"] = "IMAGE"
                    q["questionImage"] = f"/resources/aptitude/{q_id}.png"
                    q["validationStatus"] = "PASS"
                    q["integrityStatus"] = "INTEGRATED"
                    valid_qs.append(q)
                    total_recovered += 1
                else:
                    new_quar.append(entry)
            else:
                new_quar.append(entry)
                
        # Save updated datasets
        save_json_file(prod_path, valid_qs)
        save_json_file(review_path, new_review)
        save_json_file(quar_path, new_quar)
        
        stats_updated[cat]["valid"] = len(valid_qs)
        stats_updated[cat]["review"] = len(new_review)
        stats_updated[cat]["quarantine"] = len(new_quar)
        
        print(f"  Updated - Valid: {len(valid_qs)} | Review: {len(new_review)} | Quarantine: {len(new_quar)}")

    print(f"Recovery complete. Total questions salvaged: {total_recovered}")
    
    # 3. Update Audit Report Stats
    total_scanned = 0
    total_valid = 0
    total_review = 0
    total_quar = 0
    
    for c in stats_updated:
        total_valid += stats_updated[c]["valid"]
        total_review += stats_updated[c]["review"]
        total_quar += stats_updated[c]["quarantine"]
    
    total_scanned = total_valid + total_review + total_quar
    total_removed = total_review + total_quar
    
    audit_report = load_json_file(report_path)
    if audit_report:
        audit_report["summary"] = {
            "total_questions_scanned": total_scanned,
            "valid_for_production": total_valid,
            "review_required": total_review,
            "invalid_quarantined": total_quar,
            "removed_from_production": total_removed,
            "duplicate_count": audit_report["summary"].get("duplicate_count", 0),
            "broken_asset_count": audit_report["summary"].get("broken_asset_count", 0)
        }
        
        # Calculate render modes across all questions
        text_mode_count = 0
        image_mode_count = 0
        hybrid_mode_count = 0
        
        for cat in categories + ["verbal", "puzzles"]:
            prod_path = os.path.join(base_dir, cat, "questions.json")
            qs = load_json_file(prod_path)
            for q in qs:
                mode = q.get("renderMode", "TEXT")
                if mode == "IMAGE":
                    image_mode_count += 1
                elif mode == "HYBRID":
                    hybrid_mode_count += 1
                else:
                    text_mode_count += 1
                    
        audit_report["render_modes"] = {
            "text_mode": text_mode_count,
            "image_mode": image_mode_count,
            "hybrid_mode": hybrid_mode_count
        }
        
        audit_report["status"] = "ALL_PASS" if total_quar == 0 else "WARNINGS_QUARANTINED"
        save_json_file(report_path, audit_report)
        print("Updated audit report saved successfully.")

if __name__ == "__main__":
    main()
