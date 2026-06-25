import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"

def inspect(start_page, end_page, out_file):
    reader = pypdf.PdfReader(pdf_path)
    print(f"Total pages: {len(reader.pages)}")
    with open(out_file, "w", encoding="utf-8") as f:
        for idx in range(start_page, end_page + 1):
            f.write(f"\n================ PAGE {idx} ================\n")
            text = reader.pages[idx].extract_text()
            f.write(text)
    print(f"Saved text from pages {start_page} to {end_page} to {out_file}")

if __name__ == "__main__":
    inspect(316, 330, "scratch/percentage_pages.txt")
