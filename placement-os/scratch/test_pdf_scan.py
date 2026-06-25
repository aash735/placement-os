import pypdf
import time
import json

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"

def scan_pdf():
    start_time = time.time()
    reader = pypdf.PdfReader(pdf_path)
    print(f"Loaded PDF with {len(reader.pages)} pages in {time.time() - start_time:.2f} seconds.")
    
    # Load syllabus
    with open("scratch/syllabus.json", "r", encoding="utf-8") as f:
        syllabus = json.load(f)
        
    report = []
    
    for item in syllabus:
        topic = item["topic"]
        page_range = item["pageRange"]
        start_p, end_p = page_range
        
        # We will scan pages in the range and look for ANSWERS and SOLUTIONS
        answers_pages = []
        solutions_pages = []
        exercise_pages = []
        
        for p in range(start_p, min(end_p, len(reader.pages))):
            text = reader.pages[p].extract_text()
            text_upper = text.upper()
            
            # Check for exercise
            if "EXERCISE" in text_upper:
                exercise_pages.append(p)
            # Check for answers block
            if "ANSWERS" in text_upper and "1. (" in text_upper:
                answers_pages.append(p)
            # Check for solutions
            if "SOLUTIONS" in text_upper or "HINTS & SOLUTIONS" in text_upper:
                if p not in answers_pages:
                    solutions_pages.append(p)
                    
        report.append({
            "topic": topic,
            "pageRange": page_range,
            "exercise_pages": exercise_pages,
            "answers_pages": answers_pages,
            "solutions_pages": solutions_pages
        })
        
        print(f"Topic: {topic} | Range: {page_range} | Ex: {exercise_pages} | Ans: {answers_pages} | Sol: {solutions_pages}")
        
    with open("scratch/pdf_scan_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
        
    print(f"Scan complete in {time.time() - start_time:.2f} seconds. Saved to scratch/pdf_scan_report.json")

if __name__ == "__main__":
    scan_pdf()
