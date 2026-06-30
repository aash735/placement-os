import pypdf
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

# Let's search pages 549 to 563
for p in range(549, 564):
    text = reader.pages[p].extract_text()
    if "12 men" in text and "11 children" in text:
        print(f"=== Found on Page {p} ===")
        lines = text.split('\n')
        for idx, line in enumerate(lines):
            if "12 men" in line and "11 children" in line:
                start = max(0, idx - 3)
                end = min(len(lines), idx + 4)
                for i in range(start, end):
                    print(f"  Line {i}: '{lines[i]}'")
