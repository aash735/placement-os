import pypdf
import json

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"

def dump_outline():
    reader = pypdf.PdfReader(pdf_path)
    outline = reader.outline
    
    def parse_outline(item):
        if isinstance(item, list):
            res = []
            for sub in item:
                res.append(parse_outline(sub))
            return res
        else:
            title = item.get('/Title', 'No Title')
            page_num = None
            try:
                page_num = reader.get_destination_page_number(item)
            except Exception as e:
                pass
            return {"title": str(title), "page": page_num}

    parsed = parse_outline(outline)
    with open("scratch/outline.json", "w", encoding="utf-8") as f:
        json.dump(parsed, f, indent=2)
    print("Saved outline to scratch/outline.json")

if __name__ == "__main__":
    dump_outline()
