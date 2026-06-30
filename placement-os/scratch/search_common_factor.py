import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

found_pages = []
for p in range(len(reader.pages)):
    text = reader.pages[p].extract_text()
    if "common factor" in text.lower():
        found_pages.append(p)

print(f"Found 'common factor' on page indices: {found_pages}")
# Write the text of these pages to a file
with open("scratch/common_factor_pages.txt", "w", encoding="utf-8") as f:
    for p in found_pages:
        f.write(f"\n================ PAGE INDEX {p} (PAGE {p+1}) ================\n")
        f.write(reader.pages[p].extract_text())

print("Saved common factor pages text to scratch/common_factor_pages.txt")
