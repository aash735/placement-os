import os
import json
import re

base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
report_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\aptitude-audit-report.json"

EXPECTED_COUNTS = {
    # Quant
    "number-system": 180,
    "hcf-lcm": 85,
    "simplification": 240,
    "average": 130,
    "ages": 65,
    "percentages": 220,
    "profit-loss": 180,
    "ratios": 160,
    "pipes-cisterns": 60,
    "time-work": 165,
    "speed": 115,
    "simple-interest": 80,
    "compound-interest": 90,
    "permutation-combination": 45,
    "probability": 50,
    # Logical
    "series": 110,
    "coding-decoding": 104,
    "blood-relations": 87,
    "syllogism": 60,
    "seating-arrangement": 70,
    "statement-conclusion": 55,
    "analogy": 45,
    "clocks": 30,
    "calendar": 25,
    "direction-sense": 125,
    # Verbal
    "synonyms": 150,
    "antonyms": 150,
    "sentence-improvement": 120,
    "rc": 80,
    "error-detection": 100,
    "vocab": 200,
    # DI
    "tables": 100,
    "pie-charts": 70,
    "bar-graphs": 80,
    "line-graphs": 80,
    "caselets": 40
}

def verify():
    categories = ["quantitative", "logical", "verbal", "data-interpretation", "puzzles"]
    all_questions = []
    
    # Track statistics
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
    
    # 1. Load and validate questions from JSON
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
            
            # Check duplicate ID
            if q_id in id_set:
                stats["duplicates"] += 1
                errors.append(f"Duplicate question ID found: {q_id}")
                continue
            id_set.add(q_id)
            
            # Check required fields
            missing_fields = []
            for field in ["id", "question", "options", "answer", "explanation", "topic", "category"]:
                if not q.get(field):
                    missing_fields.append(field)
                    
            if missing_fields:
                stats["invalid_questions"] += 1
                errors.append(f"Question {q_id or idx} in {cat} is missing fields: {missing_fields}")
                continue
                
            # Verify options
            opts = q.get("options")
            if not isinstance(opts, list) or len(opts) != 4:
                stats["invalid_questions"] += 1
                stats["missing_options"] += 1
                errors.append(f"Question {q_id} has invalid options list length.")
                continue
                
            empty_opts = [o for o in opts if not o or not str(o).strip()]
            if empty_opts:
                stats["invalid_questions"] += 1
                stats["missing_options"] += 1
                errors.append(f"Question {q_id} has empty options.")
                continue

            # Duplicate options
            unique_opts = set([str(o).strip().lower() for o in opts])
            if len(unique_opts) < len(opts):
                stats["invalid_questions"] += 1
                stats["missing_options"] += 1
                errors.append(f"Question {q_id} has duplicate options.")
                continue

            # Merged options
            has_merged = False
            for opt_idx, opt in enumerate(opts):
                if opt and re.search(r'\(\s*[b-e]\s*\)', str(opt), re.IGNORECASE):
                    stats["invalid_questions"] += 1
                    stats["missing_options"] += 1
                    errors.append(f"Question {q_id} has merged options at index {opt_idx}: {opt}")
                    has_merged = True
                    break
            if has_merged:
                continue
                
            # Verify answer is in options
            ans = q.get("answer")
            if ans not in opts:
                stats["invalid_questions"] += 1
                stats["invalid_answers"] += 1
                errors.append(f"Question {q_id} has answer '{ans}' which is not in options: {opts}")
                continue
                
            # ID mappings check
            opts_src = q.get("optionsSourceId", q_id)
            ans_src = q.get("answerSourceId", q_id)
            exp_src = q.get("explanationSourceId", q_id)
            if opts_src != q_id:
                stats["invalid_questions"] += 1
                stats["option_mismatches"] += 1
                errors.append(f"Question {q_id} has optionsSourceId mismatch: expected {q_id}, got {opts_src}")
                continue
            if ans_src != q_id:
                stats["invalid_questions"] += 1
                stats["answer_mismatches"] += 1
                errors.append(f"Question {q_id} has answerSourceId mismatch: expected {q_id}, got {ans_src}")
                continue
            if exp_src != q_id:
                stats["invalid_questions"] += 1
                stats["explanation_mismatches"] += 1
                errors.append(f"Question {q_id} has explanationSourceId mismatch: expected {q_id}, got {exp_src}")
                continue

            # Schema structure fields verify
            corr_ans = q.get("correctAnswer")
            if corr_ans != ans:
                stats["invalid_questions"] += 1
                errors.append(f"Question {q_id} has correctAnswer mismatch: expected '{ans}', got '{corr_ans}'")
                continue
                
            src_ref = q.get("sourceReference")
            expected_ref = q.get("sourceFile", q_id)
            if src_ref != expected_ref:
                stats["invalid_questions"] += 1
                errors.append(f"Question {q_id} has sourceReference mismatch: expected '{expected_ref}', got '{src_ref}'")
                continue

            # Banned placeholder explanation check
            exp = str(q.get("explanation", "")).strip()
            exp_lower = exp.lower()
            if not exp:
                stats["invalid_questions"] += 1
                stats["invalid_explanations"] += 1
                errors.append(f"Question {q_id} has empty explanation.")
                continue
            
            is_unavailable = (exp_lower == "detailed explanation unavailable" or 
                              exp_lower == "detailed explanation unavailable." or
                              exp_lower == "verified detailed explanation unavailable" or
                              exp_lower == "verified detailed explanation unavailable.")
            if not is_unavailable:
                banned_phrases = [
                    "analyze the question",
                    "apply the formula",
                    "compute the value",
                    "calculate directly",
                    "use the given information",
                    "no explanation available",
                    "refer to standard solutions",
                    "calculate the result",
                    "calculate the answer",
                    "compute final answer"
                ]
                clean_exp = re.sub(r'[.\s]+', ' ', exp_lower)
                has_banned = False
                for phrase in banned_phrases:
                    clean_phrase = re.sub(r'[.\s]+', ' ', phrase)
                    if clean_exp == clean_phrase or clean_exp.startswith(clean_phrase + " ") or clean_exp.endswith(" " + clean_phrase) or (" " + clean_phrase + " ") in clean_exp:
                        stats["invalid_questions"] += 1
                        stats["invalid_explanations"] += 1
                        errors.append(f"Question {q_id} has banned placeholder explanation: {exp}")
                        has_banned = True
                        break
                if has_banned:
                    continue
            
            # Check DI asset structure
            if q.get("category") == "di":
                if q.get("chartType") and not q.get("chartData"):
                    stats["broken_assets"] += 1
                    stats["invalid_questions"] += 1
                    errors.append(f"Question {q_id} has chartType but no chartData.")
                    continue
                if q.get("topic") == "tables" and not q.get("tableData"):
                    stats["broken_assets"] += 1
                    stats["invalid_questions"] += 1
                    errors.append(f"Question {q_id} is in tables topic but has no tableData.")
                    continue
                    
            stats["valid_questions"] += 1
            all_questions.append(q)
            
    # 2. Calculate Topic Coverage
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
        
    # 3. Write final report
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
