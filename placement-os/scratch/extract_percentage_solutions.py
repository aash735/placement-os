import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"

def extract_solutions():
    reader = pypdf.PdfReader(pdf_path)
    with open("scratch/percentage_solutions.txt", "w", encoding="utf-8") as f:
        for idx in range(350, 378):
            f.write(f"\n================ PAGE {idx} ================\n")
            text = reader.pages[idx].extract_text()
            f.write(text)
    print("Saved pages 350 to 377 to scratch/percentage_solutions.txt")

if __name__ == "__main__":
    extract_solutions()
