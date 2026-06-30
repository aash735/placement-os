import pypdf
import os
import sys

# Configure stdout to use utf-8 for Windows command prompt
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

print(f"Total pages in PDF: {len(reader.pages)}")

# Time and Work pageRange is [534, 570] in syllabus.json
# Let's scan and print headers, first/last few lines of each page from 530 to 570
for p in range(530, 571):
    if p >= len(reader.pages):
        break
    text = reader.pages[p].extract_text()
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    header = lines[0] if len(lines) > 0 else "EMPTY"
    footer = lines[-1] if len(lines) > 1 else "EMPTY"
    
    # Check if key section names exist on page
    indicators = []
    text_upper = text.upper()
    if "EXERCISE" in text_upper:
        indicators.append("EXERCISE")
    if "ANSWERS" in text_upper:
        indicators.append("ANSWERS")
    if "SOLUTIONS" in text_upper:
        indicators.append("SOLUTIONS")
    if "HINTS" in text_upper:
        indicators.append("HINTS")
    if "DATA" in text_upper and "SUFFICIENCY" in text_upper:
        indicators.append("DATA SUFFICIENCY")
        
    print(f"Page {p}: Header='{header[:50]}' | Footer='{footer[:50]}' | Indicators={indicators} | Lines={len(lines)}")
