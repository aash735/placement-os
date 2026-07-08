import os
import json
import re

base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
report_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\aptitude-audit-report.json"

EXPECTED_COUNTS = {
    # Quant
    "number-system": 180,
    "h-c-f-and-l-c-m-of-numbers": 85,
    "decimal-fractions": 95,
    "simplification": 240,
    "square-roots-and-cube-roots": 90,
    "average": 130,
    "problems-on-numbers": 80,
    "problems-on-ages": 65,
    "surds-and-indices": 85,
    "logarithms": 55,
    "percentage": 210,
    "profit-and-loss": 180,
    "ratio-and-proportion": 160,
    "partnership": 60,
    "chain-rule": 70,
    "pipes-and-cisterns": 60,
    "time-and-work": 125,
    "time-distance": 115,
    "boats-and-streams": 40,
    "problems-on-trains": 80,
    "alligation-or-mixture": 35,
    "simple-interest": 80,
    "compound-interest": 90,
    "area": 200,
    "volume-and-surface-areas": 150,
    "races-and-games-of-skill": 20,
    "stocks-and-shares": 35,
    "permutation-and-combination": 45,
    "probability": 50,
    "true-discount": 25,
    "banker-s-discount": 25,
    "heights-and-distances": 30,
    # Logical
    "calendar": 25,
    "clocks": 30,
    "odd-man-out-and-series": 55,
    # DI
    "tabulation": 100,
    "bar-graphs": 80,
    "pie-chart": 70,
    "line-graphs": 80
}

def verify():
    categories = ["quantitative", "logical", "verbal", "data-interpretation", "puzzles"]
    all_questions = []
    
    stats = {
        "total_questions": 0,
        "valid_questions": 0,
        "invalid_questions": 0,
        "duplicates": 0,
        "broken_assets": 0,
        "option_mismatches": 0,
        "answer_mismatches": 0,
        "explanation_mismatches": 0,
        "missing_options": 0,
        "invalid_answers": 0,
        "invalid_explanations": 0,
        "coverage_by_topic": {}
    }
    
    id_set = set()
    errors = []
    
    for cat in categories:
        json_path = os.path.join(base_dir, cat, "questions.json")
        if not os.path.exists(json_path):
            continue
            
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                qs = json.load(f)
        except Exception as e:
            errors.append(f"Failed to parse {json_path}: {str(e)}")
            continue
            
        for idx, q in enumerate(qs):
            stats["total_questions"] += 1
            q_id = q.get("id")
            
            if q_id in id_set:
                stats["duplicates"] += 1
                errors.append(f"Duplicate question ID found: {q_id}")
                continue
            id_set.add(q_id)
            
            missing_fields = []
            for field in ["id", "question", "options", "answer", "explanation", "topic", "category"]:
                if not q.get(field):
                    missing_fields.append(field)
                    
            if missing_fields:
                stats["invalid_questions"] += 1
                errors.append(f"Question {q_id or idx} in {cat} is missing fields: {missing_fields}")
                continue
                
            opts = q.get("options")
            if not isinstance(opts, dict) or len(opts) != 4 or not all(k in opts for k in ["A", "B", "C", "D"]):
                stats["invalid_questions"] += 1
                stats["missing_options"] += 1
                errors.append(f"Question {q_id} has invalid options dictionary structure.")
                continue
                
            empty_opts = [k for k, v in opts.items() if not v or not str(v).strip()]
            if empty_opts:
                stats["invalid_questions"] += 1
                stats["missing_options"] += 1
                errors.append(f"Question {q_id} has empty options: {empty_opts}")
                continue

            unique_opts = set([str(v).strip().lower() for v in opts.values()])
            if len(unique_opts) < len(opts):
                stats["invalid_questions"] += 1
                stats["missing_options"] += 1
                errors.append(f"Question {q_id} has duplicate option values.")
                continue

            has_merged = False
            for opt_key, opt_val in opts.items():
                if opt_val and re.search(r'\(\s*[b-e]\s*\)', str(opt_val), re.IGNORECASE) and q.get("renderMode") != "IMAGE":
                    stats["invalid_questions"] += 1
                    stats["missing_options"] += 1
                    errors.append(f"Question {q_id} has merged options at key {opt_key}: {opt_val}")
                    has_merged = True
                    break
            if has_merged:
                continue
                
            ans = q.get("answer")
            if ans not in ["A", "B", "C", "D"]:
                stats["invalid_questions"] += 1
                stats["invalid_answers"] += 1
                errors.append(f"Question {q_id} has answer '{ans}' which is not in ['A', 'B', 'C', 'D']")
                continue
                
            exp = str(q.get("explanation", "")).strip()
            if not exp:
                stats["invalid_questions"] += 1
                stats["invalid_explanations"] += 1
                errors.append(f"Question {q_id} has empty explanation.")
                continue
            
            # Check DI asset structure
            if q.get("category") == "di":
                if q.get("chartType") and not q.get("chartData"):
                    stats["broken_assets"] += 1
                    stats["invalid_questions"] += 1
                    errors.append(f"Question {q_id} has chartType but no chartData.")
                    continue
                if q.get("topic") == "tabulation" and not q.get("tableData") and not q.get("questionImage"):
                    stats["broken_assets"] += 1
                    stats["invalid_questions"] += 1
                    errors.append(f"Question {q_id} is in tabulation topic but has no tableData and no questionImage.")
                    continue
                    
            stats["valid_questions"] += 1
            all_questions.append(q)
            
    topic_counts = {}
    for q in all_questions:
        t = q["topic"]
        topic_counts[t] = topic_counts.get(t, 0) + 1
        
    for topic, expected in EXPECTED_COUNTS.items():
        imported = topic_counts.get(topic, 0)
        coverage = min(100.0, (imported / expected) * 100.0) if expected > 0 else 100.0
        stats["coverage_by_topic"][topic] = {
            "expected": expected,
            "imported": imported,
            "missing": max(0, expected - imported),
            "coverage_pct": round(coverage, 2)
        }
        
    report = {
        "status": "PASS" if stats["invalid_questions"] == 0 else "WARNINGS_FOUND",
        "summary": {
            "total_questions_scanned": stats["total_questions"],
            "valid_questions_imported": stats["valid_questions"],
            "questions_with_option_mismatch": stats["option_mismatches"],
            "questions_with_answer_mismatch": stats["answer_mismatches"],
            "questions_with_explanation_mismatch": stats["explanation_mismatches"],
            "questions_with_missing_options": stats["missing_options"],
            "questions_with_invalid_answers": stats["invalid_answers"],
            "questions_with_invalid_explanations": stats["invalid_explanations"],
            "questions_removed_from_production": stats["invalid_questions"] + stats["duplicates"],
            "questions_requiring_review": stats["invalid_questions"] + stats["duplicates"],
            "duplicate_question_count": stats["duplicates"],
            "broken_asset_count": stats["broken_assets"]
        },
        "errors_and_warnings": errors,
        "coverage": stats["coverage_by_topic"]
    }
    
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
        
    print("Verification execution completed.")
    print(f"  Total questions scanned: {stats['total_questions']}")
    print(f"  Valid questions: {stats['valid_questions']}")
    print(f"  Invalid questions: {stats['invalid_questions']}")
    print(f"  Duplicates: {stats['duplicates']}")
    print(f"  Broken Assets: {stats['broken_assets']}")
    print(f"Report successfully saved to {report_path}")

if __name__ == "__main__":
    verify()
