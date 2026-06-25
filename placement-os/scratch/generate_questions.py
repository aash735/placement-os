import os
import json

base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"

categories = ["quantitative", "logical", "verbal", "data-interpretation", "puzzles"]

# Ensure directories exist
for cat in categories:
    os.makedirs(os.path.join(base_dir, cat), exist_ok=True)

# Define questions for each category
questions_data = {
    "quantitative": [
        # Number System
        {
            "id": "quant-num-1",
            "category": "quant",
            "topic": "number-system",
            "subtopic": "Divisibility Rules",
            "difficulty": "Easy",
            "question": "What is the least value of * so that the number 5824*3 is divisible by 9?",
            "options": ["2", "5", "6", "8"],
            "answer": "5",
            "explanation": "A number is divisible by 9 if the sum of its digits is divisible by 9. Sum of digits = 5 + 8 + 2 + 4 + * + 3 = 22 + *. The next multiple of 9 after 22 is 27. Therefore, 22 + * = 27 => * = 5.",
            "tags": ["Divisibility", "Math"],
            "companyTags": ["TCS", "Accenture", "Wipro"],
            "shortcuts": ["Sum of digits divisible by 9", "22 + 5 = 27, which is divisible by 9"],
            "estimatedTime": 45
        },
        {
            "id": "quant-num-2",
            "category": "quant",
            "topic": "number-system",
            "subtopic": "Division Algorithm & Remainder Theorem",
            "difficulty": "Medium",
            "question": "A number when divided by 296 leaves a remainder of 75. What will be the remainder when the same number is divided by 37?",
            "options": ["1", "2", "8", "11"],
            "answer": "1",
            "explanation": "Let the number be N = 296k + 75. Since 296 is a multiple of 37 (37 * 8 = 296), the remainder when N is divided by 37 is the same as the remainder when 75 is divided by 37. 75 = (37 * 2) + 1. So, the remainder is 1.",
            "tags": ["Remainder", "Math"],
            "companyTags": ["Cognizant", "Infosys"],
            "shortcuts": ["Remainder = 75 % 37 = 1"],
            "estimatedTime": 30
        },
        # H.C.F. and L.C.M. of Numbers
        {
            "id": "quant-hcf-1",
            "category": "quant",
            "topic": "hcf-lcm",
            "subtopic": "H.C.F. and L.C.M. Formulas",
            "difficulty": "Medium",
            "question": "The H.C.F. of two numbers is 11 and their L.C.M. is 7700. If one of the numbers is 275, find the other number.",
            "options": ["279", "308", "318", "440"],
            "answer": "308",
            "explanation": "We know that Product of two numbers = H.C.F. * L.C.M. Let the other number be x. x * 275 = 11 * 7700 => x = (11 * 7700) / 275 = 7700 / 25 = 308.",
            "tags": ["HCF", "LCM"],
            "companyTags": ["TCS", "Infosys", "Capgemini"],
            "shortcuts": ["Other Number = (HCF * LCM) / Given Number", "(11 * 7700) / 275 = 308"],
            "estimatedTime": 60
        },
        {
            "id": "quant-hcf-2",
            "category": "quant",
            "topic": "hcf-lcm",
            "subtopic": "Application Problems",
            "difficulty": "Hard",
            "question": "Three bells toll together at intervals of 9, 12, and 15 minutes respectively. If they toll together now, after how many hours will they toll together next?",
            "options": ["3 hours", "6 hours", "9 hours", "12 hours"],
            "answer": "3 hours",
            "explanation": "The bells will toll together next after a time interval equal to the L.C.M. of 9, 12, and 15 minutes. L.C.M.(9, 12, 15) = 180 minutes. Converting to hours: 180 / 60 = 3 hours.",
            "tags": ["LCM Applications", "Bells"],
            "companyTags": ["Deloitte", "Accenture"],
            "shortcuts": ["LCM of (9, 12, 15) = 180 min = 3 hours"],
            "estimatedTime": 75
        },
        # Decimal Fractions & Simplification
        {
            "id": "quant-simp-1",
            "category": "quant",
            "topic": "simplification",
            "subtopic": "BODMAS Rule",
            "difficulty": "Easy",
            "question": "Simplify: 108 ÷ 36 of 1/4 + 2/5 * 3(1/4)",
            "options": ["12", "13.3", "11", "15"],
            "answer": "13.3",
            "explanation": "Using BODMAS, solve 'of' first: 36 of 1/4 = 9. Then division: 108 ÷ 9 = 12. Then multiplication: 2/5 * 13/4 = 13/10 = 1.3. Finally addition: 12 + 1.3 = 13.3.",
            "tags": ["BODMAS", "Simplification"],
            "companyTags": ["Wipro", "TCS"],
            "shortcuts": ["Solve 'of' -> 'division' -> 'multiplication' -> 'addition'"],
            "estimatedTime": 60
        },
        # Averages & Ages
        {
            "id": "quant-avg-1",
            "category": "quant",
            "topic": "average",
            "subtopic": "Change in Average",
            "difficulty": "Medium",
            "question": "The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What is the weight of the new person?",
            "options": ["76 kg", "84 kg", "85 kg", "75 kg"],
            "answer": "85 kg",
            "explanation": "Total increase in weight = 8 * 2.5 = 20 kg. Weight of the new person = Weight of the person who left + Total increase = 65 + 20 = 85 kg.",
            "tags": ["Average", "Weights"],
            "companyTags": ["TCS Digital", "Deloitte"],
            "shortcuts": ["New Weight = Replaced Weight + (Total Count * Increase)", "65 + (8 * 2.5) = 85 kg"],
            "estimatedTime": 45
        },
        {
            "id": "quant-age-1",
            "category": "quant",
            "topic": "ages",
            "subtopic": "Present, Past, and Future Relations",
            "difficulty": "Medium",
            "question": "Father's age is 4 times his son's age. Five years ago, the father was 9 times as old as his son was at that time. What is the father's present age?",
            "options": ["32 years", "36 years", "40 years", "48 years"],
            "answer": "32 years",
            "explanation": "Let son's present age be x. Father's age = 4x. Five years ago: Father's age = 4x - 5, Son's age = x - 5. Equation: 4x - 5 = 9(x - 5) => 4x - 5 = 9x - 45 => 5x = 40 => x = 8. Father's age = 4 * 8 = 32 years.",
            "tags": ["Ages", "Equations"],
            "companyTags": ["Cognizant", "Infosys"],
            "shortcuts": ["Plug option 32: son is 8. 5 years ago, father was 27, son was 3. 27 is 9 times 3. Correct!"],
            "estimatedTime": 60
        },
        # Pipes & Cisterns
        {
            "id": "quant-pipes-1",
            "category": "quant",
            "topic": "pipes-cisterns",
            "subtopic": "Inlet and Outlet Pipes",
            "difficulty": "Medium",
            "question": "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:",
            "options": ["10 minutes", "12 minutes", "15 minutes", "25 minutes"],
            "answer": "12 minutes",
            "explanation": "Net work done by both pipes in 1 minute = 1/20 + 1/30 = (3+2)/60 = 5/60 = 1/12. So, the tank will be filled in 12 minutes.",
            "tags": ["Pipes", "Cisterns"],
            "companyTags": ["Accenture", "Capgemini"],
            "shortcuts": ["Product / Sum = (20 * 30) / (20 + 30) = 600 / 50 = 12 mins"],
            "estimatedTime": 45
        },
        # Interest (Simple & Compound)
        {
            "id": "quant-interest-1",
            "category": "quant",
            "topic": "interest",
            "subtopic": "Simple Interest",
            "difficulty": "Easy",
            "question": "At what rate of simple interest per annum will a sum of money double itself in 8 years?",
            "options": ["12.5%", "10%", "15%", "8%"],
            "answer": "12.5%",
            "explanation": "Let Principal be P. Interest = P (since it doubles, Amount = 2P). Time = 8 years. Rate R = (Interest * 100) / (Principal * Time) = (P * 100) / (P * 8) = 100 / 8 = 12.5% per annum.",
            "tags": ["Simple Interest", "Rates"],
            "companyTags": ["TCS Ninja", "Wipro"],
            "shortcuts": ["Rate = 100 / Time = 100 / 8 = 12.5%"],
            "estimatedTime": 30
        },
        {
            "id": "quant-interest-2",
            "category": "quant",
            "topic": "interest",
            "subtopic": "Compound Interest",
            "difficulty": "Hard",
            "question": "Find the difference between compound interest and simple interest on $5,000 for 2 years at 10% per annum.",
            "options": ["$50", "$100", "$25", "$75"],
            "answer": "$50",
            "explanation": "Difference for 2 years = P * (R / 100)^2. Difference = 5000 * (10 / 100)^2 = 5000 * (1 / 10)^2 = 5000 / 100 = $50.",
            "tags": ["Compound Interest", "Difference Formula"],
            "companyTags": ["TCS Digital", "Deloitte"],
            "shortcuts": ["Difference = P(R/100)^2 = 5000 * 0.01 = 50"],
            "estimatedTime": 45
        },
        # Permutations & Probability
        {
            "id": "quant-prob-1",
            "category": "quant",
            "topic": "probability",
            "subtopic": "Probability of Coins/Dice",
            "difficulty": "Easy",
            "question": "Two unbiased coins are tossed. What is the probability of getting at most one head?",
            "options": ["1/4", "1/2", "3/4", "1"],
            "answer": "3/4",
            "explanation": "Sample space S = {HH, HT, TH, TT}. Size of sample space = 4. Event of getting at most one head (0 or 1 head) E = {HT, TH, TT}. Size of event space = 3. Probability P(E) = 3/4.",
            "tags": ["Probability", "Coins"],
            "companyTags": ["All MNCs"],
            "shortcuts": ["At most 1 Head = 1 - P(Both Heads) = 1 - 1/4 = 3/4"],
            "estimatedTime": 30
        },
        {
            "id": "quant-perm-1",
            "category": "quant",
            "topic": "permutation-combination",
            "subtopic": "Permutations",
            "difficulty": "Medium",
            "question": "In how many different ways can the letters of the word 'LEADING' be arranged such that the vowels always come together?",
            "options": ["360", "720", "1440", "5040"],
            "answer": "720",
            "explanation": "Vowels in 'LEADING' are E, A, I (3 vowels). Consonants are L, D, N, G (4 consonants). Treat vowels as a single block: total elements to arrange = 4 consonants + 1 block = 5 elements. Number of ways to arrange = 5! = 120. Inside the block, the 3 vowels can be arranged in 3! = 6 ways. Total arrangements = 120 * 6 = 720.",
            "tags": ["Permutations", "Word Arrangement"],
            "companyTags": ["TCS Digital", "Infosys"],
            "shortcuts": ["Arrange block + consonants: 5! = 120. Arrange vowels: 3! = 6. 120 * 6 = 720"],
            "estimatedTime": 75
        }
    ],
    "logical": [
        # Clocks & Calendars
        {
            "id": "logical-clock-1",
            "category": "logical",
            "topic": "clocks",
            "subtopic": "Angle between Hands",
            "difficulty": "Medium",
            "question": "What is the angle between the hour hand and the minute hand of a clock when the time is 3:25?",
            "options": ["47.5 degrees", "45.5 degrees", "42.5 degrees", "37.5 degrees"],
            "answer": "47.5 degrees",
            "explanation": "Using the clock angle formula: Angle = |30H - 5.5M|, where H is hours and M is minutes. Here H = 3, M = 25. Angle = |30(3) - 5.5(25)| = |90 - 137.5| = |-47.5| = 47.5 degrees.",
            "tags": ["Clocks", "Angles"],
            "companyTags": ["TCS", "Accenture"],
            "shortcuts": ["Formula: |30*H - 11/2 * M| = |30*3 - 5.5*25| = 47.5"],
            "estimatedTime": 60
        },
        {
            "id": "logical-calendar-1",
            "category": "logical",
            "topic": "calendar",
            "subtopic": "Odd Days Concept",
            "difficulty": "Medium",
            "question": "If January 1, 2007 was a Monday, what day of the week was January 1, 2008?",
            "options": ["Monday", "Tuesday", "Wednesday", "Sunday"],
            "answer": "Tuesday",
            "explanation": "2007 is an ordinary year, which has 365 days. 365 days = 52 weeks + 1 odd day. Therefore, January 1, 2008 will be 1 day ahead of January 1, 2007. Since Jan 1, 2007 was Monday, Jan 1, 2008 was Tuesday.",
            "tags": ["Calendar", "Leap Year"],
            "companyTags": ["Infosys", "Wipro"],
            "shortcuts": ["Ordinary year has 1 odd day => Monday + 1 day = Tuesday"],
            "estimatedTime": 45
        }
    ],
    "verbal": [],
    "data-interpretation": [],
    "puzzles": []
}

# Write out json files
for category, q_list in questions_data.items():
    if q_list:
        file_path = os.path.join(base_dir, category, "questions.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(q_list, f, indent=2)
        print(f"Generated {file_path} with {len(q_list)} questions.")
    else:
        # Create empty list JSON file so it can be loaded safely
        file_path = os.path.join(base_dir, category, "questions.json")
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump([], f, indent=2)
        print(f"Generated empty {file_path}")
