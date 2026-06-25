import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"

def print_contents_pages():
    reader = pypdf.PdfReader(pdf_path)
    # Check pages 6, 7, 8, 9, 10
    for idx in [6, 7, 8, 9, 10]:
        print(f"================ PAGE {idx} ================")
        text = reader.pages[idx].extract_text()
        print(text)

if __name__ == "__main__":
    print_contents_pages()
