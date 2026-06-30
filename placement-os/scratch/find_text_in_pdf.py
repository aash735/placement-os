import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

found = []
for p in range(len(reader.pages)):
    text = reader.pages[p].extract_text()
    if "12 men" in text and "11 children" in text:
        found.append(p)

print(f"Found on page indices: {found}")
