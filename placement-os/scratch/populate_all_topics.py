import json
import os

base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"

new_questions = {
    "quantitative": [
        {
            "id": "quant-si-1",
            "category": "quant",
            "topic": "simple-interest",
            "subtopic": "Simple Interest Formulas",
            "difficulty": 1,
            "question": "A sum of money at simple interest doubles itself in 10 years. In how many years will it triple itself?",
            "options": ["15 years", "20 years", "25 years", "30 years"],
            "answer": "20 years",
            "explanation": "If a sum of money doubles itself in 10 years, it means the simple interest earned equals the principal P in 10 years. To triple itself, the amount must become 3P, which means the interest earned must equal 2P. Since interest P is earned in 10 years, interest 2P will be earned in 10 * 2 = 20 years.",
            "shortcuts": ["Time for n-times = (n - 1) * (Rate/Time factor)", "3 - 1 = 2 times interest, so 2 * 10 years = 20 years"],
            "estimatedTime": 45,
            "companyRelevance": ["TCS", "Wipro", "Infosys"],
            "tags": ["simple-interest", "interest"],
            "companyTags": ["TCS", "Wipro", "Infosys"]
        },
        {
            "id": "quant-ci-3",
            "category": "quant",
            "topic": "compound-interest",
            "subtopic": "Compound Interest Formulas",
            "difficulty": 2,
            "question": "If the compound interest on a certain sum for 2 years at 10% per annum is $420, find the simple interest on the same sum at the same rate and for the same time.",
            "options": ["$400", "$380", "$390", "$410"],
            "answer": "$400",
            "explanation": "Let the principal be P. CI = P * [(1 + R/100)^2 - 1] => 420 = P * [(1.1)^2 - 1] => 420 = P * [1.21 - 1] => 420 = 0.21P => P = 420 / 0.21 = $2000. Now, Simple Interest (SI) = (P * R * T) / 100 = (2000 * 10 * 2) / 100 = $400.",
            "shortcuts": ["For 2 years, Ratio CI/SI = (1 + R/200) = (1 + 10/200) = 21/20.", "So, SI = CI * 20 / 21 = 420 * 20 / 21 = $400."],
            "estimatedTime": 60,
            "companyRelevance": ["Cognizant", "Accenture", "TCS Digital"],
            "tags": ["compound-interest", "interest"],
            "companyTags": ["Cognizant", "Accenture", "TCS Digital"]
        },
        {
            "id": "quant-pl-1",
            "category": "quant",
            "topic": "profit-loss",
            "subtopic": "Profit and Loss Percentage",
            "difficulty": 2,
            "question": "By selling an article for $240, a man incurs a loss of 10%. At what price should he sell it to gain 20%?",
            "options": ["$320", "$300", "$280", "$360"],
            "answer": "$320",
            "explanation": "Let CP be x. Selling at 10% loss means SP = 0.9x = 240 => CP x = 240 / 0.9 = 2400 / 9 = $266.67. To gain 20%, new SP = CP * 1.2 = (2400 / 9) * 1.2 = 320.",
            "shortcuts": ["New SP = Old SP * (100 + Gain%) / (100 - Loss%)", "New SP = 240 * (120 / 90) = 240 * 4/3 = 320"],
            "estimatedTime": 60,
            "companyRelevance": ["Capgemini", "Infosys", "Deloitte"],
            "tags": ["profit-loss", "percentages"],
            "companyTags": ["Capgemini", "Infosys", "Deloitte"]
        }
    ],
    "logical": [
        {
            "id": "logical-dir-1",
            "category": "logical",
            "topic": "direction-sense",
            "subtopic": "Direction Sense",
            "difficulty": 1,
            "question": "A man walks 5 km East, then turns right and walks 4 km, then turns left and walks 5 km. In which direction is he now from his starting point?",
            "options": ["East", "South-East", "North-East", "South"],
            "answer": "South-East",
            "explanation": "Starting at (0,0):\n1. Walks 5 km East -> reaches (5, 0).\n2. Turns right (facing South) and walks 4 km -> reaches (5, -4).\n3. Turns left (facing East) and walks 5 km -> reaches (10, -4).\nFrom (0,0), the point (10, -4) lies in the South-East direction.",
            "shortcuts": ["Draw coordinates on paper: (5,0) -> (5,-4) -> (10,-4) => South-East"],
            "estimatedTime": 45,
            "companyRelevance": ["TCS", "Accenture", "Wipro"],
            "tags": ["direction-sense", "logical-reasoning"],
            "companyTags": ["TCS", "Accenture", "Wipro"]
        },
        {
            "id": "logical-sc-1",
            "category": "logical",
            "topic": "statement-conclusion",
            "subtopic": "Statement Conclusion",
            "difficulty": 2,
            "question": "Statement: Morning walks are good for health. \nConclusions: \nI. All healthy people go for morning walks. \nII. Morning walks help in maintaining good health.",
            "options": ["Only conclusion I follows", "Only conclusion II follows", "Either I or II follows", "Neither I nor II follows"],
            "answer": "Only conclusion II follows",
            "explanation": "The statement asserts that morning walks are good for health, which directly leads to conclusion II (they help maintain good health). However, it does not imply that *all* healthy people go for morning walks, so conclusion I does not follow.",
            "shortcuts": ["Avoid conclusions containing extreme words like 'all', 'never', 'always' unless explicitly stated"],
            "estimatedTime": 40,
            "companyRelevance": ["Infosys", "Deloitte"],
            "tags": ["statement-conclusion", "logical-reasoning"],
            "companyTags": ["Infosys", "Deloitte"]
        },
        {
            "id": "logical-ana-1",
            "category": "logical",
            "topic": "analogy",
            "subtopic": "Analogy",
            "difficulty": 1,
            "question": "Choose the word that completes the analogy: \nDoctor : Patient :: Politician : ?",
            "options": ["Voter", "Campaign", "Government", "Election"],
            "answer": "Voter",
            "explanation": "A doctor serves and provides care to a patient. Similarly, a politician represents and serves a voter/constituent.",
            "tags": ["analogy", "verbal-reasoning"],
            "companyTags": ["Cognizant", "Wipro"],
            "shortcuts": ["Identify relationship: Server : Served"],
            "estimatedTime": 20
        },
        {
            "id": "logical-seat-1",
            "category": "logical",
            "topic": "seating-arrangement",
            "subtopic": "Seating Arrangement",
            "difficulty": 2,
            "question": "Six friends P, Q, R, S, T, and U are sitting in a row facing North. S is between P and T. U is at the immediate right of T. R is at the immediate left of P. Q is at the left end. Who is sitting next to Q?",
            "options": ["R", "P", "S", "T"],
            "answer": "R",
            "explanation": "Let's arrange them from left to right:\n1. Q is at the left end: Q, _, _, _, _, _.\n2. S is between P and T: PST or TSP.\n3. U is at the immediate right of T: TU. This makes the block: PSTU or S (not between if P is right? Wait, if S is between P and T, S is PST or TSP. Since U is right of T, the order is PSTU or USTP? If S is between P and T, T-S-P, and U is right of T, so U-T-S-P. Let's check).\n4. R is at the immediate left of P: RP. This makes the block: R-P-S-T-U.\n5. Combining this with Q at the left end: Q, R, P, S, T, U. All six positions are filled! The person sitting next to Q is R.",
            "shortcuts": ["Use absolute anchors first: Q at left end.", "RP and PSTU forms RPS-TU, fits Q-R-P-S-T-U."],
            "estimatedTime": 90,
            "companyRelevance": ["Capgemini", "TCS Digital", "Infosys"],
            "tags": ["seating-arrangement", "puzzles"],
            "companyTags": ["Capgemini", "TCS Digital", "Infosys"]
        }
    ],
    "verbal": [
        {
            "id": "verbal-syn-1",
            "category": "verbal",
            "topic": "synonyms",
            "subtopic": "Synonyms",
            "difficulty": 1,
            "question": "What is the synonym of 'CANDID'?",
            "options": ["Secretive", "Frank", "Insincere", "Ambiguous"],
            "answer": "Frank",
            "explanation": "Candid means truthful, straightforward, or frank. Therefore, 'Frank' is the correct synonym.",
            "shortcuts": ["Candid = honest, open, frank"],
            "estimatedTime": 20,
            "companyRelevance": ["All MNCs"],
            "tags": ["synonyms", "vocabulary"],
            "companyTags": ["All MNCs"]
        },
        {
            "id": "verbal-ant-1",
            "category": "verbal",
            "topic": "antonyms",
            "subtopic": "Antonyms",
            "difficulty": 1,
            "question": "What is the antonym of 'COMPASSIONATE'?",
            "options": ["Kind", "Cruel", "Sympathetic", "Merciful"],
            "answer": "Cruel",
            "explanation": "Compassionate means feeling or showing sympathy and concern for others. The antonym is 'Cruel' (showing a lack of sympathy).",
            "shortcuts": ["Compassionate (positive) <=> Cruel (negative)"],
            "estimatedTime": 20,
            "companyRelevance": ["All MNCs"],
            "tags": ["antonyms", "vocabulary"],
            "companyTags": ["All MNCs"]
        },
        {
            "id": "verbal-imp-1",
            "category": "verbal",
            "topic": "sentence-improvement",
            "subtopic": "Sentence Improvement",
            "difficulty": 2,
            "question": "Improve the underlined part: The boy *is having* a new smartphone.",
            "options": ["has", "had had", "is owning", "No improvement"],
            "answer": "has",
            "explanation": "Dynamic verbs (like 'is having') should not be used in continuous tense to express possession. The simple present tense 'has' should be used instead.",
            "shortcuts": ["State of possession = use simple present (has/have)"],
            "estimatedTime": 30,
            "companyRelevance": ["TCS Ninja", "Cognizant"],
            "tags": ["sentence-improvement", "grammar"],
            "companyTags": ["TCS Ninja", "Cognizant"]
        },
        {
            "id": "verbal-err-1",
            "category": "verbal",
            "topic": "error-detection",
            "subtopic": "Error Detection",
            "difficulty": 2,
            "question": "Find the part containing a grammatical error: \n(A) One of the players / (B) are injured / (C) during the match. / (D) No error",
            "options": ["A", "B", "C", "D"],
            "answer": "B",
            "explanation": "The phrase 'One of the...' takes a singular verb because the subject is 'One', not 'players'. Therefore, 'are injured' should be corrected to 'is injured' or 'was injured' depending on the tense.",
            "shortcuts": ["One of + Plural Noun + Singular Verb"],
            "estimatedTime": 45,
            "companyRelevance": ["Accenture", "Wipro"],
            "tags": ["error-detection", "grammar"],
            "companyTags": ["Accenture", "Wipro"]
        }
    ],
    "data-interpretation": [
        {
            "id": "di-table-1",
            "category": "di",
            "topic": "tables",
            "subtopic": "Tables",
            "difficulty": 2,
            "question": "Refer to the table showing expenses (in $1000s) of a startup:\nRent: Q1=50, Q2=52, Q3=55, Q4=60\nSalaries: Q1=120, Q2=125, Q3=130, Q4=140\nMarketing: Q1=30, Q2=40, Q3=20, Q4=50\n\nWhat is the percentage increase in Salaries from Q1 to Q4?",
            "options": ["16.67%", "14.28%", "20.0%", "15.5%"],
            "answer": "16.67%",
            "explanation": "Salaries in Q1 = 120, Salaries in Q4 = 140. Increase = 140 - 120 = 20. Percentage increase = (20 / 120) * 100 = 16.67%.",
            "shortcuts": ["Increase = 20. Base = 120. Growth = 20/120 = 1/6 = 16.67%"],
            "estimatedTime": 60,
            "companyRelevance": ["TCS Digital", "Infosys"],
            "tags": ["data-interpretation", "tables"],
            "companyTags": ["TCS Digital", "Infosys"]
        },
        {
            "id": "di-pie-1",
            "category": "di",
            "topic": "pie-charts",
            "subtopic": "Pie Charts",
            "difficulty": 2,
            "question": "In a pie chart representing energy generation in a state, Coal represents 45%, Hydro represents 25%, Solar represents 15%, Wind represents 10%, and Nuclear represents 5%. If the total energy generated is 80,000 MW, how much energy is generated from Solar and Wind combined?",
            "options": ["20,000 MW", "24,000 MW", "16,000 MW", "12,000 MW"],
            "answer": "20,000 MW",
            "explanation": "Combined percentage for Solar and Wind = 15% + 10% = 25%. Total combined energy generated = 25% of 80,000 = (25 / 100) * 80,000 = 20,000 MW.",
            "shortcuts": ["25% = 1/4 of total. 80,000 / 4 = 20,000 MW"],
            "estimatedTime": 45,
            "companyRelevance": ["Capgemini", "Accenture"],
            "tags": ["data-interpretation", "pie-charts"],
            "companyTags": ["Capgemini", "Accenture"]
        },
        {
            "id": "di-bar-1",
            "category": "di",
            "topic": "bar-graphs",
            "subtopic": "Bar Graphs",
            "difficulty": 2,
            "question": "A bar graph shows sales of three car models (A, B, C) in two consecutive years:\nModel A: 2023=400, 2024=450\nModel B: 2023=300, 2024=350\nModel C: 2023=500, 2024=480\n\nWhat is the total sales growth (in units) for models A and B combined from 2023 to 2024?",
            "options": ["100 units", "150 units", "50 units", "120 units"],
            "answer": "100 units",
            "explanation": "Combined sales in 2023 = 400 (A) + 300 (B) = 700 units. Combined sales in 2024 = 450 (A) + 350 (B) = 800 units. Total growth = 800 - 700 = 100 units.",
            "shortcuts": ["Model A growth = 50, Model B growth = 50. Combined growth = 50 + 50 = 100 units"],
            "estimatedTime": 45,
            "companyRelevance": ["Infosys", "Deloitte"],
            "tags": ["data-interpretation", "bar-graphs"],
            "companyTags": ["Infosys", "Deloitte"]
        },
        {
            "id": "di-line-1",
            "category": "di",
            "topic": "line-graphs",
            "subtopic": "Line Graphs",
            "difficulty": 2,
            "question": "Refer to the line graph displaying stock prices of a tech company over 4 days:\nDay 1 = $150, Day 2 = $160, Day 3 = $145, Day 4 = $155.\n\nOn which day did the stock price experience the largest percentage decline compared to the previous day?",
            "options": ["Day 2", "Day 3", "Day 4", "Cannot be determined"],
            "answer": "Day 3",
            "explanation": "Calculate change for each day:\n- Day 2 vs Day 1: +10 change (increase)\n- Day 3 vs Day 2: -15 change (decline). % decline = (15 / 160) * 100 = 9.38%.\n- Day 4 vs Day 3: +10 change (increase).\nTherefore, the stock price experienced the largest decline on Day 3.",
            "shortcuts": ["Only decline happened on Day 3, so Day 3 must be the answer."],
            "estimatedTime": 30,
            "companyRelevance": ["Wipro", "TCS Digital"],
            "tags": ["data-interpretation", "line-graphs"],
            "companyTags": ["Wipro", "TCS Digital"]
        },
        {
            "id": "di-case-1",
            "category": "di",
            "topic": "caselets",
            "subtopic": "Caselets",
            "difficulty": 3,
            "question": "In a college class of 100 students, 60 study Java, 50 study Python, and 30 study both. How many students do not study either Java or Python?",
            "options": ["20 students", "10 students", "15 students", "30 students"],
            "answer": "20 students",
            "explanation": "Using the set theory formula:\nTotal students studying either Java or Python = n(Java) + n(Python) - n(Java ∩ Python) = 60 + 50 - 30 = 80 students.\nStudents studying neither = Total - studying either = 100 - 80 = 20 students.",
            "shortcuts": ["Java only = 30, Python only = 20, both = 30. Total = 30 + 20 + 30 = 80. Neither = 100 - 80 = 20."],
            "estimatedTime": 60,
            "companyRelevance": ["TCS Digital", "Google"],
            "tags": ["data-interpretation", "caselets", "set-theory"],
            "companyTags": ["TCS Digital", "Google"]
        }
    ]
}

def append_new():
    # Read, merge and save
    for category, q_list in new_questions.items():
        json_path = os.path.join(base_dir, category, "questions.json")
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                existing_qs = json.load(f)
        except Exception:
            existing_qs = []
            
        merged = {q["id"]: q for q in existing_qs}
        for q in q_list:
            merged[q["id"]] = q
            
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(list(merged.values()), f, indent=2)
        print(f"Appended new questions to {json_path} - total: {len(merged)}")

if __name__ == "__main__":
    append_new()
