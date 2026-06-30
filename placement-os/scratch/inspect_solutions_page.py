import pypdf
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

# Extract page 549
text = reader.pages[549].extract_text()
with open("scratch/page_549.txt", "w", encoding="utf-8") as f:
    f.write(text)

print("Page 549 text saved to scratch/page_549.txt")
