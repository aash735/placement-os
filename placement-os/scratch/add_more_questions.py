import json
import os

base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"

additional_questions = {
    "logical": [
        {
            "id": "logical-series-4",
            "category": "logical",
            "topic": "series",
            "subtopic": "Number & Letter Series",
            "difficulty": 1,
            "difficultyStr": "Easy",
            "question": "Find the missing number in the series: 3, 7, 15, 31, 63, ?",
            "options": ["95", "111", "127", "128"],
            "answer": "127",
            "explanation": "The pattern is: each term is twice the previous term plus 1. 3*2+1 = 7. 7*2+1 = 15. 15*2+1 = 31. 31*2+1 = 63. The next term is 63*2+1 = 127. Alternatively, the differences are powers of 2: 4, 8, 16, 32, 64. 63 + 64 = 127.",
            "tags": ["number-series", "logical-reasoning"],
            "companyTags": ["Infosys", "Wipro", "TCS Ninja"],
            "shortcuts": ["Next term = 2 * current + 1", "63 * 2 + 1 = 127"],
            "estimatedTime": 30
        },
        {
            "id": "logical-coding-3",
            "category": "logical",
            "topic": "coding-decoding",
            "subtopic": "Coding-Decoding",
            "difficulty": 2,
            "difficultyStr": "Medium",
            "question": "In a certain code, 'COMPUTER' is written as 'PMOCRETU'. How is 'DECEMBER' written in that code?",
            "options": ["EDECMEBR", "EDECEMBR", "EDEEBCMR", "EDECMRBE"],
            "answer": "EDECMEBR",
            "explanation": "Divide the word into two equal parts: COMP and UTER. Reverse each part: PMOC and RETU. Merge them to get PMOCRETU. Similarly, for DECEMBER: DECE and MBER. Reversing them gives ECED and REBM? Wait, let's look at the letters: C-O-M-P-U-T-E-R. The letters at positions 4,3,2,1 (PMOC) and then 8,7,6,5 (RETU)? If so, for D-E-C-E-M-B-E-R: letters 4,3,2,1 is E-C-E-D, and 8,7,6,5 is R-E-B-M. So the code is ECEDREBM. Wait, let's look at options: 'EDECMEBR'. Let's see how EDECMEBR is formed: swap adjacent pairs: D-E becomes E-D, C-E becomes E-C, M-B becomes B-M? No, DECEMBER: D-E (swap -> E-D), C-E (swap -> E-C), M-B (swap -> B-M), E-R (swap -> R-E)? That would give EDECEBMR. What if the swap is: swap 1st & 2nd letters, 3rd & 4th, etc? Let's check COMPUTER: C-O (swap -> O-C), M-P (swap -> P-M), U-T (swap -> T-U), E-R (swap -> R-E) = OCPMTURE. But it is PMOCRETU, which is reversing the first four letters (COMP -> PMOC) and last four letters (UTER -> RETU) which is PMOCRETU. Let's see: C(1) O(2) M(3) P(4) U(5) T(6) E(7) R(8) -> P(4) M(3) O(2) C(1) R(8) E(7) T(6) U(5). Yes, it's reversing COMP -> PMOC and UTER -> RETU. So DECEMBER (D-E-C-E-M-B-E-R) should have DECE reversed (ECED) and MBER reversed (REBM), yielding ECEDREBM. Let's make the answer option 'ECEDREBM' and update the question to include it as a clean correct option.",
            "options": ["ECEDREBM", "EDECEMBR", "EDEEBCMR", "EDECMRBE"],
            "answer": "ECEDREBM",
            "explanation": "The word is split into two halves of 4 letters each: COMP and UTER. Both halves are reversed individually: COMP becomes PMOC, and UTER becomes RETU, combined as PMOCRETU. Similarly, DECEMBER is split into DECE and MBER. Reversing DECE gives ECED, and reversing MBER gives REBM. Combining them gives ECEDREBM.",
            "tags": ["coding-decoding", "pattern"],
            "companyTags": ["TCS Ninja", "Accenture"],
            "shortcuts": ["Split in half and reverse each half"],
            "estimatedTime": 60
        },
        {
            "id": "logical-blood-3",
            "category": "logical",
            "topic": "blood-relations",
            "subtopic": "Blood Relations",
            "difficulty": 2,
            "difficultyStr": "Medium",
            "question": "Pointing to a man, a woman says: 'His mother is the only daughter of my mother.' How is the woman related to the man?",
            "options": ["Mother", "Daughter", "Sister", "Grandmother"],
            "answer": "Mother",
            "explanation": "Break it down: 'only daughter of my mother' = the woman herself (since she is talking about her mother's only daughter). Thus, 'His mother' is the woman herself. So, the woman is the mother of the man.",
            "tags": ["blood-relations", "puzzles"],
            "companyTags": ["Capgemini", "Deloitte"],
            "shortcuts": ["'Only daughter of my mother' = Myself", "So, His mother = Myself => Mother"],
            "estimatedTime": 45
        },
        {
            "id": "logical-syllogism-3",
            "category": "logical",
            "topic": "syllogism",
            "subtopic": "Syllogism",
            "difficulty": 3,
            "difficultyStr": "Hard",
            "question": "Statements: All pens are books. Some books are pencils. \nConclusions: \nI. Some pens are pencils. \nII. Some pencils are books.",
            "options": ["Only I follows", "Only II follows", "Both I and II follow", "Neither I nor II follows"],
            "answer": "Only II follows",
            "explanation": "Since some books are pencils, it is guaranteed that some pencils are books (II follows, since intersection of books and pencils is non-empty). However, there is no guaranteed intersection between pens and pencils, so I does not necessarily follow.",
            "tags": ["syllogism", "logic"],
            "companyTags": ["TCS Digital", "Infosys"],
            "shortcuts": ["Some A are B => Some B are A is always true.", "All A are B + Some B are C => No conclusion between A and C."],
            "estimatedTime": 60
        }
    ],
    "verbal": [
        {
            "id": "verbal-grammar-3",
            "category": "verbal",
            "topic": "grammar",
            "subtopic": "Grammar & Sentence Correction",
            "difficulty": 1,
            "difficultyStr": "Easy",
            "question": "Choose the grammatically correct sentence:",
            "options": [
                "The group of students is planning a study trip.",
                "The group of students are planning a study trip.",
                "The group of students planning a study trip.",
                "The group of students is plan a study trip."
            ],
            "answer": "The group of students is planning a study trip.",
            "explanation": "The subject of the sentence is the collective noun 'group' (singular), not 'students'. Therefore, the singular verb 'is' is required.",
            "tags": ["subject-verb-agreement", "grammar"],
            "companyTags": ["TCS", "Cognizant", "Wipro"],
            "shortcuts": ["Collective noun (group) is singular => takes singular verb (is)"],
            "estimatedTime": 30
        },
        {
            "id": "verbal-rc-2",
            "category": "verbal",
            "topic": "rc",
            "subtopic": "Reading Comprehension",
            "difficulty": 3,
            "difficultyStr": "Hard",
            "question": "Passage: The rise of autonomous vehicles promises to reshape urban landscapes by reducing traffic congestion and emissions. However, the transition presents complex ethical challenges, particularly regarding decision-making algorithms in unavoidable accident scenarios. Who should be prioritized in a crash—pedestrians, passengers, or other drivers? \n\nAccording to the passage, what is the primary ethical issue associated with autonomous vehicles?",
            "options": [
                "The high cost of manufacturing autonomous cars.",
                "Algorithm-driven prioritizations in crash scenarios.",
                "The reduction of urban traffic congestion.",
                "Job losses in the public transportation sector."
            ],
            "answer": "Algorithm-driven prioritizations in crash scenarios.",
            "explanation": "The passage explicitly states that the transition presents complex ethical challenges regarding decision-making algorithms in unavoidable accident scenarios, such as prioritizing pedestrians, passengers, or other drivers.",
            "tags": ["reading-comprehension", "ethics"],
            "companyTags": ["Deloitte", "Infosys"],
            "shortcuts": ["Match keywords: 'ethical challenges' maps to 'decision-making algorithms in unavoidable accident scenarios'"],
            "estimatedTime": 90
        },
        {
            "id": "verbal-vocab-2",
            "category": "verbal",
            "topic": "vocab",
            "subtopic": "Vocabulary & Para Jumbles",
            "difficulty": 2,
            "difficultyStr": "Medium",
            "question": "Identify the word that is a synonym of 'PRUDENT':",
            "options": ["Reckless", "Cautious", "Foolish", "Impatient"],
            "answer": "Cautious",
            "explanation": "Prudent means showing care and thought for the future; wise or cautious. Therefore, 'Cautious' is the correct synonym.",
            "tags": ["synonyms", "vocabulary"],
            "companyTags": ["Accenture", "TCS Ninja"],
            "shortcuts": ["Prudent = Wise, careful, cautious"],
            "estimatedTime": 30
        }
    ],
    "data-interpretation": [
        {
            "id": "di-charts-3",
            "category": "di",
            "topic": "di",
            "subtopic": "Tabulation",
            "difficulty": 2,
            "difficultyStr": "Medium",
            "question": "Refer to the table showing production (in tons) of three crop types (Wheat, Rice, Maize) by a farm:\nWheat: 2023=500, 2024=550, 2025=600\nRice: 2023=300, 2024=320, 2025=350\nMaize: 2023=150, 2024=180, 2025=200\n\nWhat is the average production of Rice over the three years?",
            "options": ["323.3 tons", "310.0 tons", "340.0 tons", "330.0 tons"],
            "answer": "323.3 tons",
            "explanation": "Rice production over three years is: 300 (2023) + 320 (2024) + 350 (2025) = 970 tons. Average production = 970 / 3 = 323.33 tons.",
            "tags": ["data-interpretation", "tabulation", "averages"],
            "companyTags": ["Capgemini", "Accenture"],
            "shortcuts": ["Sum = 970. Average = 970 / 3 = 323.3"],
            "estimatedTime": 60
        },
        {
            "id": "di-charts-4",
            "category": "di",
            "topic": "di",
            "subtopic": "Pie Chart",
            "difficulty": 3,
            "difficultyStr": "Hard",
            "question": "In a pie chart representing a student's budget allocation, Rent takes up 30%, Food takes 25%, Tuition takes 20%, Entertainment takes 15%, and Savings takes 10%. \n\nWhat is the central angle (in degrees) for the 'Rent' sector?",
            "options": ["90 degrees", "108 degrees", "120 degrees", "135 degrees"],
            "answer": "108 degrees",
            "explanation": "A circle has 360 degrees. Since Rent takes up 30% of the total budget, the central angle is: 30% of 360 = (30 / 100) * 360 = 0.3 * 360 = 108 degrees.",
            "tags": ["data-interpretation", "pie-chart", "angles"],
            "companyTags": ["TCS Digital", "Infosys"],
            "shortcuts": ["Angle = Percentage * 3.6", "30 * 3.6 = 108 degrees"],
            "estimatedTime": 45
        }
    ],
    "puzzles": [
        {
            "id": "puzzles-logic-3",
            "category": "puzzles",
            "topic": "puzzles",
            "subtopic": "Seating & Arrangement",
            "difficulty": 2,
            "difficultyStr": "Medium",
            "question": "A, B, C, D, E are sitting in a circle facing the center. A is between E and C. D is to the immediate right of E. Who is sitting to the immediate left of C?",
            "options": ["A", "B", "D", "E"],
            "answer": "B",
            "explanation": "Let's arrange them in a circle:\n- A is between E and C. So we have E - A - C or C - A - E.\n- D is to the immediate right of E. If we look at the circle facing the center, this means D is adjacent to E. Let's test the order clockwise: E, D, B, C, A. E's right is D. E's left is A. So the clockwise order is: E -> D -> B -> C -> A. A is between E and C (correct). D is to the immediate right of E (correct, going counter-clockwise/clockwise depending on perspective, but let's confirm: D is right of E, A is left of E). The remaining person is B, who must be between D and C. Therefore, B is sitting to the immediate left of C (since A is to the immediate right of C).",
            "tags": ["circular-seating", "puzzles"],
            "companyTags": ["Infosys", "Deloitte"],
            "shortcuts": ["Draw circle: D - E - A - C - B. Left of C is B."],
            "estimatedTime": 90
        }
    ]
}

def append_additional():
    for cat, qs in additional_questions.items():
        json_path = os.path.join(base_dir, cat, "questions.json")
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                existing_qs = json.load(f)
        except Exception:
            existing_qs = []

        # Merge, avoiding duplicates
        merged = {q["id"]: q for q in existing_qs}
        for q in qs:
            merged[q["id"]] = q

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(list(merged.values()), f, indent=2)
            
        print(f"Appended additional questions to {json_path} - total: {len(merged)}")

if __name__ == "__main__":
    append_additional()
