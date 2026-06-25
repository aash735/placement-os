import pypdf

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"

def debug():
    reader = pypdf.PdfReader(pdf_path)
    
    # Check HCF page 71
    print("=== HCF PAGE 71 ===")
    print(reader.pages[71].extract_text()[:500])
    
    # Check Average page 223
    print("=== AVERAGE PAGE 223 ===")
    print(reader.pages[223].extract_text()[:500])

if __name__ == "__main__":
    debug()
