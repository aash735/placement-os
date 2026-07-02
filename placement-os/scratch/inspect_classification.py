import pypdf
import re

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

start_page = 11
end_page = 59

print(f"Classifying pages {start_page} to {end_page}...")
for p in range(start_page, end_page + 1):
    text = reader.pages[p].extract_text()
    ans_matches = len(re.findall(r"\d+\.\s*\([a-e]\)", text))
    opt_matches = len(re.findall(r"\(\s*[a-e]\s*\)", text))
    
    ptype = "sol"
    if ans_matches > 8:
        ptype = "ans"
    elif opt_matches > 5 and "SOLUTIONS" not in text.upper() and "HINTS" not in text.upper():
        ptype = "q"
        
    print(f"Page {p:02d}: ans_matches={ans_matches:2d}, opt_matches={opt_matches:2d}, ptype={ptype} | First 50 chars: {repr(text[:50])}")
