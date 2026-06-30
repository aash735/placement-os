import pypdf
import re

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

# Average pages: 214 to 248. Solutions start around page 235
for p in range(235, 249):
    text = reader.pages[p].extract_text()
    lines = text.split("\n")
    for idx, line in enumerate(lines):
        match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
        if match:
            num = int(match.group(1))
            if num in [1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131, 141, 151, 161, 171]:
                print(f"Page {p}, Line {idx}: {line}")
