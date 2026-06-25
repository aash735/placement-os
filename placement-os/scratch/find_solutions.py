import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"

def find_keywords():
    reader = pypdf.PdfReader(pdf_path)
    for idx in range(350, 390):
        text = reader.pages[idx].extract_text()
        if "ANSWERS" in text.upper() or "HINTS" in text.upper() or "SOLUTIONS" in text.upper():
            print(f"Page {idx} has keywords: {[kw for kw in ['ANSWERS', 'HINTS', 'SOLUTIONS'] if kw in text.upper()]}")
            lines = text.split("\n")
            print(f"First 5 lines of page {idx}:")
            for line in lines[:10]:
                print(f"  {line}")
            print("-" * 50)

if __name__ == "__main__":
    find_keywords()
