import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"

def inspect_chapter(page_num, label, f_out):
    reader = pypdf.PdfReader(pdf_path)
    f_out.write(f"=== {label} (Page {page_num}) ===\n")
    if page_num < len(reader.pages):
        text = reader.pages[page_num].extract_text()
        lines = text.split("\n")
        for line in lines[:20]:
            f_out.write(f"  {line}\n")
    f_out.write("-" * 50 + "\n")

if __name__ == "__main__":
    with open("scratch/inspect_other_chapters.txt", "w", encoding="utf-8") as f:
        inspect_chapter(59, "H.C.F. & L.C.M. Start", f)
        inspect_chapter(73, "H.C.F. & L.C.M. Middle/Exercise", f)
        inspect_chapter(75, "H.C.F. & L.C.M. Answers/Solutions Search", f)
        inspect_chapter(214, "Average Start", f)
        inspect_chapter(931, "Pie-Chart Start", f)
    print("Done")
