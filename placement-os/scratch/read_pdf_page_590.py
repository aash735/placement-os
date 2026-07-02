import pypdf
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

print("Searching for ship leak question...")
found = False
for idx, page in enumerate(reader.pages):
    text = page.extract_text()
    if " leak which admits " in text or "sailing, so that she may reach the shore" in text:
        print(f"Found on page {idx}:")
        print(text)
        found = True
        break

if not found:
    print("Question not found.")
