import os
import re
import json
import pdfplumber
import pypdfium2 as pdfium
from PIL import Image

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
output_image_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\public\resources\aptitude"

def crop_question_image(pdf_doc, page_num, q_num, q_id, plumber_doc=None):
    try:
        opened_plumber = False
        if plumber_doc is None:
            plumber_doc = pdfplumber.open(pdf_path)
            opened_plumber = True
            
        try:
            if page_num >= len(plumber_doc.pages):
                return False
            
            page = plumber_doc.pages[page_num]
            width = page.width
            height = page.height
            mid_x = width / 2.0
            
            words = page.extract_words()
            
            # Find the starting question number word (e.g., "11.")
            target_word = None
            for w in words:
                clean_text = w['text'].strip()
                if clean_text == f"{q_num}." or clean_text == f"{q_num}":
                    target_word = w
                    break
            
            if not target_word:
                return False
                
            col_type = "left" if target_word['x0'] < mid_x else "right"
            col_x0 = 0 if col_type == "left" else mid_x
            col_x1 = mid_x if col_type == "left" else width
            
            top_y = target_word['top'] - 4
            
            # Find the next question in the same column
            next_word = None
            for w in words:
                if col_type == "left" and w['x0'] >= mid_x:
                    continue
                if col_type == "right" and w['x0'] < mid_x:
                    continue
                    
                clean_text = w['text'].strip()
                match = re.match(r'^(\d+)\.$', clean_text)
                if match:
                    num = int(match.group(1))
                    if num > q_num:
                        if not next_word or num < next_word['num']:
                            next_word = {'word': w, 'num': num}
            
            bottom_y = height
            if next_word:
                bottom_y = next_word['word']['top'] - 4
            else:
                # Use the bottom of any words in this column as boundary
                col_words = [w for w in words if (col_type == "left" and w['x0'] < mid_x) or (col_type == "right" and w['x0'] >= mid_x)]
                if col_words:
                    bottom_y = max(w['bottom'] for w in col_words) + 8
            
            top_y = max(0, top_y)
            bottom_y = min(height, bottom_y)
            
            if bottom_y <= top_y:
                return False
                
            # 2. Render using pypdfium2
            pdfium_page = pdf_doc[page_num]
            scale = 3 # 3x scale for crisp text
            bitmap = pdfium_page.render(scale=scale)
            pil_img = bitmap.to_pil()
            
            img_w, img_h = pil_img.size
            scale_x = img_w / width
            scale_y = img_h / height
            
            crop_x0 = int(col_x0 * scale_x)
            crop_y0 = int(top_y * scale_y)
            crop_x1 = int(col_x1 * scale_x)
            crop_y1 = int(bottom_y * scale_y)
            
            # Clamp bounds
            crop_x0 = max(0, min(img_w, crop_x0))
            crop_y0 = max(0, min(img_h, crop_y0))
            crop_x1 = max(0, min(img_w, crop_x1))
            crop_y1 = max(0, min(img_h, crop_y1))
            
            if crop_y1 <= crop_y0 or crop_x1 <= crop_x0:
                return False
                
            cropped_img = pil_img.crop((crop_x0, crop_y0, crop_x1, crop_y1))
            os.makedirs(output_image_dir, exist_ok=True)
            cropped_img.save(os.path.join(output_image_dir, f"{q_id}.png"))
            return True
        finally:
            if opened_plumber:
                plumber_doc.close()
    except Exception as e:
        print(f"Error cropping {q_id}: {str(e)}")
        return False

def main():
    print("Question image extraction script loaded.")

if __name__ == "__main__":
    main()
