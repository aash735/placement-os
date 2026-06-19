import json
import os
import re

def parse_mcqs():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    python_file_path = os.path.join(script_dir, '..', 'scratch', 'mcq_extracted_python.py')
    
    if not os.path.exists(python_file_path):
        print(f"Error: {python_file_path} does not exist.")
        return

    with open(python_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where questions = [ starts
    match = re.search(r'questions\s*=\s*\[', content)
    if not match:
        print("Error: Could not find 'questions = [' in the file.")
        return

    start_index = match.start()
    # Let's extract the list. We need to find the matching closing bracket ]
    bracket_count = 0
    list_content = ""
    found_start = False
    
    for i in range(start_index, len(content)):
        char = content[i]
        if char == '[':
            bracket_count += 1
            found_start = True
        elif char == ']':
            bracket_count -= 1
        
        list_content += char
        
        if found_start and bracket_count == 0:
            break

    # We have extracted "questions = [...]"
    # Let's execute this string in a safe local scope to get the questions list
    local_scope = {}
    try:
        exec(list_content, {}, local_scope)
    except Exception as e:
        print(f"Error executing extracted questions: {e}")
        return

    parsed_questions = local_scope.get('questions', [])
    print(f"Successfully evaluated and parsed {len(parsed_questions)} questions.")

    # Let's format the parsed questions into normalized format
    normalized_questions = []
    for q in parsed_questions:
        # Extract correct option and option cleanups
        options_raw = q.get('options', [])
        options = []
        answer = q.get('answer', '')
        
        # Clean option strings (remove checkmarks)
        for opt in options_raw:
            cleaned_opt = opt.replace('✓', '').strip()
            # If the option had a checkmark and answer wasn't explicitly matching, let's confirm
            options.append(cleaned_opt)

        topic = q.get('topic', 'General')
        title = q.get('title', '')
        scenario = q.get('scenario', '')
        code = q.get('code', '')
        explanation = q.get('explanation', '')
        num = q.get('num', len(normalized_questions) + 1)
        
        # Guess difficulty based on topic/content or just default to Medium/Easy/Hard
        # We will canonicalize/classify difficulty in another step or here
        # Let's keep it normalized
        normalized_questions.append({
            "id": f"docx-q{num}",
            "question": f"{title}\n\n{scenario}" if title and scenario else (title or scenario or "Question"),
            "title": title,
            "scenario": scenario,
            "code": code,
            "options": options,
            "answer": answer,
            "explanation": explanation,
            "topic": topic,
            "difficulty": "Medium"  # Default, will classify in Phase 4
        })

    # Save to src/data/mcq-questions.json
    output_dir = os.path.join(script_dir, '..', 'src', 'data')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'mcq-questions.json')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(normalized_questions, f, indent=2)
        
    print(f"Saved {len(normalized_questions)} normalized questions to {output_path}")

if __name__ == "__main__":
    parse_mcqs()
