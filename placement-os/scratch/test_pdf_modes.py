import pypdf
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

page = reader.pages[553]

print("=== DEFAULT EXTRACTION ===")
print(page.extract_text()[:600])

print("\n" + "="*50 + "\n")

print("=== LAYOUT EXTRACTION ===")
try:
    print(page.extract_text(extraction_mode="layout")[:600])
except Exception as e:
    print("Error running layout mode:", e)
