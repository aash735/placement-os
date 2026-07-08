import os
import re
import pdfplumber
import pypdfium2 as pdfium
from PIL import Image

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"

def test_crop_question(page_num, q_num):
    print(f"Testing crop for page {page_num}, question {q_num}...")
    
    # 1. Use pdfplumber to get coordinates
    with pdfplumber.open(pdf_path) as pdf:
        if page_num >= len(pdf.pages):
            print("Page out of range.")
            return
        
        page = pdf.pages[page_num]
        width = page.width
        height = page.height
        mid_x = width / 2.0
        
        words = page.extract_words()
        print(f"Extracted {len(words)} words on page.")
        
        # Determine column of the target question
        # We search for the word "q_num." (e.g. "11.") or just "q_num"
        target_word = None
        for w in words:
            # Match "11." or "11" as a whole word representing the question start
            clean_text = w['text'].strip()
            if clean_text == f"{q_num}." or clean_text == f"{q_num}":
                target_word = w
                break
                
        if not target_word:
            print(f"Could not find word '{q_num}.' or '{q_num}' on page.")
            return
            
        print(f"Found target word: {target_word}")
        
        col_type = "left" if target_word['x0'] < mid_x else "right"
        print(f"Question lies in the {col_type} column.")
        
        # Define column bounds
        col_x0 = 0 if col_type == "left" else mid_x
        col_x1 = mid_x if col_type == "left" else width
        
        # Top bound of question is the top of target word
        top_y = target_word['top'] - 5 # Add small margin
        
        # Bottom bound is the top of the next question in the same column, 
        # or the bottom of the page if no subsequent question exists
        next_q_num = q_num + 1
        next_word = None
        
        # Also look for any word in the same column that starts with a number followed by dot
        # that is larger than q_num
        for w in words:
            # Must be in same column
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
            bottom_y = next_word['word']['top'] - 5
            print(f"Found next question in column: {next_word['num']}. at y={bottom_y}")
        else:
            # If no next question, find the bottom of any text in this column
            col_words = [w for w in words if (col_type == "left" and w['x0'] < mid_x) or (col_type == "right" and w['x0'] >= mid_x)]
            if col_words:
                bottom_y = max(w['bottom'] for w in col_words) + 10
                print(f"No next question, using column bottom: y={bottom_y}")
                
        # Clamp bounds
        top_y = max(0, top_y)
        bottom_y = min(height, bottom_y)
        
        print(f"Final Crop Bounds (Points): x0={col_x0}, y0={top_y}, x1={col_x1}, y1={bottom_y}")
        
        # 2. Use pypdfium2 to render and crop
        doc = pdfium.PdfDocument(pdf_path)
        pdfium_page = doc[page_num]
        
        # Render page at 2x scale (scale=2 -> 144 DPI)
        scale = 3
        bitmap = pdfium_page.render(scale=scale)
        pil_img = bitmap.to_pil()
        
        img_w, img_h = pil_img.size
        print(f"Rendered image size: {img_w}x{img_h}")
        
        # Convert points coordinates to pixel coordinates
        # pdfplumber coordinates are in points, where width/height are the page dimensions.
        scale_x = img_w / width
        scale_y = img_h / height
        
        crop_x0 = int(col_x0 * scale_x)
        crop_y0 = int(top_y * scale_y)
        crop_x1 = int(col_x1 * scale_x)
        crop_y1 = int(bottom_y * scale_y)
        
        print(f"Pixel Crop Bounds: x0={crop_x0}, y0={crop_y0}, x1={crop_x1}, y1={crop_y1}")
        
        cropped_img = pil_img.crop((crop_x0, crop_y0, crop_x1, crop_y1))
        
        output_file = f"scratch/crop_q_{q_num}.png"
        cropped_img.save(output_file)
        print(f"Saved cropped image to {output_file}")

if __name__ == "__main__":
    # Let's test cropping question 11 on page 30
    test_crop_question(30, 11)
