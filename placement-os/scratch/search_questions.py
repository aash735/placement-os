import pypdf
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

for p in range(214, 249):
    text = reader.pages[p].extract_text()
    text_upper = text.upper()
    indicators = []
    if "EXERCISE" in text_upper:
        indicators.append("EXERCISE")
    if "ANSWERS" in text_upper:
        indicators.append("ANSWERS")
    if "SOLUTIONS" in text_upper:
        indicators.append("SOLUTIONS")
    if "HINTS & SOLUTIONS" in text_upper:
        indicators.append("HINTS & SOLUTIONS")
        
    print(f"Page {p}: {', '.join(indicators)} | Length: {len(text)}")
    # print first non-empty line
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if lines:
        print(f"  First line: {lines[0]}")
