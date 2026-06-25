import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"

def print_chapter_start():
    reader = pypdf.PdfReader(pdf_path)
    text = reader.pages[316].extract_text()
    with open("scratch/chapter_316.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Saved page 316 to scratch/chapter_316.txt")

if __name__ == "__main__":
    print_chapter_start()
