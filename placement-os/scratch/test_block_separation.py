import pypdf
import re
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\aptitude\dokumen.pub_quantitative-aptitude-for-competitive-examinations-by-rs-aggarwal-reprint-2017nbsped-9352534026-9789352534029_1769142935.pdf"
reader = pypdf.PdfReader(pdf_path)

# Time and Work pages: 534 to 570
start_page, end_page = 534, 570

print("--- RUNNING TEXT-FEATURE-BASED BLOCK SEPARATION ---")

# Step 1: Extract all numbered blocks across the chapter
all_blocks = []
current_block = None

for p in range(start_page, min(end_page + 1, len(reader.pages))):
    text = reader.pages[p].extract_text()
    lines = text.split("\n")
    for line in lines:
        match = re.match(r"^\s*(\d+)\.\s*(.*)", line)
        if match:
            num = int(match.group(1))
            if current_block:
                all_blocks.append(current_block)
            current_block = {
                "num": num,
                "lines": [match.group(2)],
                "page": p
            }
        else:
            if current_block:
                current_block["lines"].append(line)

if current_block:
    all_blocks.append(current_block)

print(f"Extracted {len(all_blocks)} raw numbered blocks.")

# Step 2: Categorize each block by text features
questions = []
solutions = []
answers = []

# Helper to check if a block has option choices (like (a), (b), (c), (d))
def count_option_declarations(text):
    count = 0
    for letter in ['a', 'b', 'c', 'd', 'e']:
        if re.search(r'\(\s*' + letter + r'\s*\)', text):
            count += 1
    return count

for b in all_blocks:
    num = b["num"]
    full_text = " ".join(b["lines"]).strip()
    
    # Check if it has choices
    opt_count = count_option_declarations(full_text)
    
    # 1. Answer Key check (very short, matches " (a) ")
    # Or matches a sequence of answers on one line like "1. (a) 2. (b)"
    # If the block text itself contains multiple answers, we split them.
    # But if the block is just a single answer like "(a)" or "(a) 15 days" where it was matched,
    # wait: answers in the PDF answers page are extracted as:
    # "1. (a) 2. (b) 3. (c)" on one line.
    # So when we split by line, a line like "1. (a) 2. (b) 3. (c)" starts with "1.", so it becomes a block for "1".
    # The text of the block is "(a) 2. (b) 3. (c)".
    # If a block has multiple sub-answers like "2. (b)", it is definitely an answer key block!
    has_dense_answers = len(re.findall(r"\d+\.\s*\([a-e]\)", full_text)) > 0
    is_simple_answer = re.match(r"^\s*\([a-e]\)\s*$", full_text) is not None
    
    if is_simple_answer or has_dense_answers:
        answers.append(b)
    elif opt_count >= 3:
        questions.append(b)
    else:
        solutions.append(b)

print(f"\nCategorized Blocks:")
print(f"  Questions: {len(questions)}")
print(f"  Answers:   {len(answers)}")
print(f"  Solutions: {len(solutions)}")

# Let's inspect some parsed questions and solutions
print("\nFirst 5 Questions:")
for q in questions[:5]:
    print(f"  Q {q['num']} (Page {q['page']}): {' '.join(q['lines'])[:100]}...")

print("\nFirst 5 Solutions:")
for s in solutions[:5]:
    print(f"  Sol {s['num']} (Page {s['page']}): {' '.join(s['lines'])[:100]}...")
