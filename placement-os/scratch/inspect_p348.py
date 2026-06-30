import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

p = 21
text = reader.pages[p].extract_text()

with open("scratch/inspect_p348_raw.txt", "w", encoding="utf-8") as f:
    f.write(text)

print("Page index 21 text written to scratch/inspect_p348_raw.txt")
