// Auto-generated TCS Native Questions file.
import type { AptitudeQuestion } from "./aptitude-questions";

export interface TcsCodingQuestion {
  id: string;
  title: string;
  description: string;
  solutionCode: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicId: string;
  estimatedMinutes: number;
  company: string;
}

export const tcsAptitudeQuestions: AptitudeQuestion[] = [
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q1",
    "question": "Consider two tumblers, the first containing one litre of water. Suppose you take one spoon of water out of the first tumbler and pour it into the second tumbler and after which you take one spoon of the mixture from the second tumbler and pour it back into the first tumbler. Which one of the following statements holds true?",
    "options": [
      "There is less coffee in the first tumbler than water in the second tumbler.",
      "There is more coffee in the first tumbler than water in the second tumbler",
      "There is as much coffee in the first tumbler as there is water in the second tumbler",
      "None of the statements holds true."
    ],
    "answer": "There is as much coffee in the first tumbler as there is water in the second tumbler",
    "explanation": "Suppose spoon can contain 5 drops. T umbler can contain 100 drops.\n1 --> 2 (spoon contains 5w drops)\ntumb 1: 95w\ntumb 2: 100c + 5w\n2 --> 1 (spoon contains 4c+1w drops)\ntumb 1 : 96w\ntumb 2 : 96c .\nThere is as much coffee in the first tumbler as there is water in the second tumbler .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q2",
    "question": "A lady has fine gloves and hats of different colours in her closet 18 blue, 32 red and 25 yellow. The lights are out and it is totally dark. In spite of the darkness, she can make out the difference between a hat and a glove. She takes an item out of the closet only if she is sure that it is a glove. How many gloves must she take out to make sure that she has a pair of each colour?",
    "options": [
      "6",
      "8",
      "60",
      "59"
    ],
    "answer": "59",
    "explanation": "It is not given that how many of these items are gloves and how many are hats, if we consider that all the items are gloves then according to my opinion 32+25+2 = 59 gloves, she must take out to make sure she has a pair of each colour .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q3",
    "question": "It was the semester exam day, Vidhya caught the college bus. She enjoyed travelling by bus. Moving at 6 mph, the bus took Vidhya to college at the right time. She finished her exam and had a chit chat with her friends and suddenly she realized that it was 6 pm and she had missed the college bus. She decided to walk back home at 4 mph. What is her average speed for the day?",
    "options": [
      "4 mph",
      "5 mph",
      "2.4 mph",
      "4.8 mph"
    ],
    "answer": "4.8 mph",
    "explanation": "Since distance is constant , to calculate the average speed =2xy/x+y. where x and y are speed given.\nSo 2*6*4/(6+4)=48/10=4.8mph.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "speed",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q4",
    "question": "Spores of a fungus, called late blight, grow and spread infection rapidly. These pathogens were responsible for the Irish potato famine of the mid-19th century. These seem to have attacked the tomato crops in England this year. The tomato crops have reduced and the price of the crop has risen up. The price has already gone up to $45 a box from $27 a box a month ago. How much more would a vegetable vendor need to pay to buy 27 boxes this month over what he would have paid last month?",
    "options": [
      "$ 27",
      "$ 18",
      "$ 45",
      "$ 486"
    ],
    "answer": "$ 486",
    "explanation": "Since the price of a box increased from $27 to $45.there will be loss of 18 for one box. so for 27 boxes it equals 27*18=486.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q5",
    "question": "A car manufacturer produces only red and blue models which come out of the final testing area completely at random. What are the odds that 5 consecutive cars of the same colour will come through the test area at a time?",
    "options": [
      "1 in 16",
      "1 in 125",
      "1 in 32",
      "1 in 25"
    ],
    "answer": "1 in 16",
    "explanation": "Total 5 cars each can have any of the 2 colours , so the total possibilities are 2*2*2*2*2= 32.\nThe Favourable outcome is the same colour for all the 5 cars = 2 ( all 5 are red or all 5 are blue.)\nHence the probability = 2/32 = 1/16.\nOR\n2*(1/2)^5 =1 in 16\nAs there are 5 Cars and 2 types.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q6",
    "question": "Susan made a block with small cubes of 8 cubic cm volume . To make the block she used 3 small cubes long, 9 small cubes wide and 5 small cubes deep. She realizes that she has used more small cubes than she really needed. She realized that she could have glued a fewer number of cubes together to lock like a block with same dimensions, if it were made hollow. What is the minimum number of cubes that she needs to make the block?",
    "options": [
      "114",
      "135",
      "21",
      "71"
    ],
    "answer": "114",
    "explanation": "The total volume (in terms of number of cubes) of the solid = 3*9*5 = 135\nThe total volume (in terms of number of cubes) of the hollow = (3-2)*(9-2)*(5-2)\n= 21\nSo number of cubes required = 135-21 = 114",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q7",
    "question": "A seamstress buys a certain amount of Gingham cloth which comes in rolls that are exactly 56 inches wide. She has also bought a certain length of Seek sucker cloth and 35 inches wide. The seamstress first focuses on the Gingham roll ad discovers that she has 116 yards of Gingham and she wants to divide the gingham into 116 lengths of 1 yard each. She wants to have twice as many pieces of seek sucker as she does of the Gingham. It takes 4 seconds to cut each length of Gingham. Working non-stop, how long (in seconds) will it take her to cut all 116 pieces?",
    "options": [
      "464",
      "460",
      "463",
      "465"
    ],
    "answer": "460",
    "explanation": "To make 116 pieces she needs 115 cuts. Because for n cuts we will have (n+1) pieces. For cutting 1 piece it takes 4 sec. it will be 115*4=460.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "time-work",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q8",
    "question": "A triangle is made from a rope. The sides of the triangle are 25 cm, 11 cm and 31 cm. What will be the area of the square made from the same rope?",
    "options": [
      "280.8565",
      "280.5625",
      "281.5646",
      "282.5624"
    ],
    "answer": "280.5625",
    "explanation": "Length of the rope=25+11+31=67cm,\nSide of the square=67/4=16.75cm,\nArea of the square=(side of the square)^2=16.75^2 = 280.5625 cm^2",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q9",
    "question": "Mr. Alex is the father of children Jane, Joe, and Jill. He goes to a nearby park twice a week. He loves his children very much. On a certain day, on his way to the park he finds fruit vendors selling different fruits. Watermelon is one penny each, dates at 2 for a penny and plums at 3 for a penny. Mr. Alex spent 7 pennies and got the same amount of each type of fruit for each of his three children. What did each child get?",
    "options": [
      "1 Watermelon, 2 Dates, 1 plum",
      "1 Watermelon, 1 Date, 1 plum",
      "1 Watermelon, 3 Dates, 2 plums",
      "1 Watermelon, 2 Dates, 2 plums"
    ],
    "answer": "1 Watermelon, 2 Dates, 1 plum",
    "explanation": "You can check through the option and find it. if we take option 1.it is given that 1 watermelon,2 dates,1 plum for each child. So , he should have bought 3 watermelon , 6 dates, and 3 plums for all the three. But it is given that he spends only 7 pennies. When you check the cost of all the fruits . the only option satisfies the given condition is 1 Watermelon, 2 Dates and 1 Plum.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q10",
    "question": "An athlete decides to run the same distance in 1/4th less time that she usually took. By how much percent will she have to increase her average speed?",
    "options": [
      "0.25",
      "0.5",
      "0.3333",
      "0.2"
    ],
    "answer": "0.3333",
    "explanation": "Let original speed be s1 and time be t1\nThen s1=d/t1 ---eqn 1 and according to ques new speed be s2 and time given is 3t1/4 therefore s2=d/(3t1/4) -----eqn 2 dividing eqn 2 by eqn 1\ns2=4s1/3 increased speed = 4s1/3-s1\n=1s1/3 percent increase=[(1s1/3)/s1]*100 =33.33%=33.33/100=0.3333..",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "speed",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q11",
    "question": "A racehorse starts chasing a wild pony 3 hours after the pony bolts the stable. The pony runs through the entire country of Alb. Texas jumping 3 streams and crossing four 10 meter roads. The racehorse finally catches up with the pony after four hours by the time the sun had set and the moon was up in the sky for 4 hours. If the average speed of the racehorse is 73kmph then average speed of the wild pony is?",
    "options": [
      "54.75 kmph",
      "42.71 kmph",
      "31.29 kmph",
      "41.71 kmph"
    ],
    "answer": "41.71 kmph",
    "explanation": "Distance covered by ho rse =73*4=292\nTotal time taken by =3hr+4hr =7hr\nSpeed of pony =292/7 =41.71",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "speed",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q12",
    "question": "On planet Korba, a solar blast has melted the ice caps on its equator. 9 years after the ice melts, tiny planetoids called echina start growing on the rocks. Echina grows in the form of circle, and the relationship between the diameter of this circle and the age of echina is given by the formula, d = 4*√ (t-9) for t ≥ 9, where d represents the diameter in mm and t, the number of years since the solar blast. Anubhav recorded the radius of some echina at a particular spot as 7mm. How many years back did the solar blast occur?",
    "options": [
      "17",
      "21.25",
      "12.25",
      "12.06"
    ],
    "answer": "21.25",
    "explanation": "Radius= 7mm.\nSo dia meter = 14mm.\nPutting D=14 in equation we can easily calculate\nt=21.25.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q13",
    "question": "How many 13 digit numbers are possible by using the digits 1, 2, 3, 4, 5 which are divisible by 4 if repetition of digits is allowed?",
    "options": [
      "4*511",
      "512",
      "5*121",
      "513"
    ],
    "answer": "512",
    "explanation": "To be divisible by 4, last two digits must be divisible by 4. Which are 12, 24, 32, 44, 52 . so 5 combinations are possible for last two digits also 5 combinations each for remaining 11 places. so the answer is 5^12.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q14",
    "question": "In a family there are some boys and girls. All boys told that they are having equal number of brothers and sisters and girls told that they are having twice the number of brothers than sisters. How many boys and girls are present in a family?",
    "options": [
      "5 boys & 3 girls",
      "7 boys & 2 girls",
      "4 boys & 3 girls",
      "6 boys & 2 girls"
    ],
    "answer": "4 boys & 3 girls",
    "explanation": "Let number of boys =b\nAnd number of girls=g;\nSince each brother having equal no of brothers and sisters\nSo b-1=g\nGirls told that they are having twice the no. of brothers than sisters\nb=2(g-1)\nTherefore 1+g=2g-2\ng=3 and b=1+3=4\nSo ans wer is 4boys and 3 girls",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q15",
    "question": "Mr Behera wants to build a house for his wife. In his dream house there are 5 rooms each having equal area. The length of each room is 4 m, breadth is 5 m and the height is 2m. For every single unit of area, he requires 17 bricks, how many bricks are required to make the floor of a particular room?",
    "options": [
      "340",
      "420",
      "280",
      "400"
    ],
    "answer": "340",
    "explanation": "Area of floor 5*4(l*b)=20 sq.m\n1 sq.m =17 bricks\nSo 20 sq.m=20*17=340 bricks\nADVANCE QUANTITATIVE APTITUDE",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q16",
    "question": "There are N numbers of gold biscuits in the house, in which four people are lived. If the first men woke up and divided the biscuits into 5 equal piles and found one extra biscuit. He took one of those piles along with the extra biscuit and hid them. He then gathered the 4 remaining piles into a big pile, woke up the second person and went to sleep. Each of the other 3 persons did the same one by one i.e. divided the big pile into 5 equal piles and found one extra biscuit. Each hid one of the piles along with the extra biscuit and gathered the remaining 4 piles into a big pile. If N>1000, what could be the least value of N?",
    "options": [
      "1249",
      "1023",
      "1202",
      "1246"
    ],
    "answer": "1246",
    "explanation": "Suppose N=5x+1\nA took (x+1) biscuit.\nNow 4x is of the form 5y+1 then x must be in the form 5z+4\n⇒ 4(5z+4)=5y+1\n⇒ y=4z+3 and x=5z+4\nThe ratio of number of biscuits that A and B took is\n[(5z+4)+1]:[(4z+3)+1]=5:4\nSo, we can say that any two successive persons A, B, C and D take coins in the ratio of 5:4\nLet the number of biscuits that A, B, C and D took be a, b, c and d respectively.\na:b=b:c=c:d=5:4\na:b:c:d=125:100:80:64\n⇒ a=125k\n⇒ x=125k−1 and N=5x+1=625k−4\nAs, N>1000, the least value of N is when k=2\n⇒ N= 1246 .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q17",
    "question": "ABCDEF is a regular hexagon inscribed inside a circle. If the shortest diagonal of the hexagon is of length 3 units, what is the area of the shaded region?",
    "options": [
      "1/6(3Π − (9√3)/2)",
      "1/6(2Π − (6√3)/2)",
      "1/6(3Π − (8√3)/2)",
      "1/6(6Π − (15√3)/2)"
    ],
    "answer": "1/6(3Π − (9√3)/2)",
    "explanation": "Let side of regular hexagon be a.\nThe shortest diagonal will be of length a√3. Why?\nA regular hexagon is just 6 equilateral triangles around a point. The shortest diagonal is FD.\nFD = FP + PD\n△ FOE is equilateral and so is △ EOD.\nDiagonal FD can be broken as FP + PD, both of which are altitude of equilateral is.\nFP = (√3a)/2\nFD = √3 a = shortest diagonal\nThe question tells us that the shortest diagonal measures 3 cm.\n√3 a = 3 => a = √3\nRadius of circle = √3\nArea of hexagon = (√3 a2)/4 x 6\nArea of circle – area of hexagon = π (√3)2 − √3/4 x (√3)2 x 6\n= 3π − (9√3)/2\nArea of shaded region = 1/(6 ) (area(circle) – area(hexagon))\n= 1/(6 )(3π − (9√3)/2)",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q18",
    "question": "Abhishek starts to paint a fence on one day. On the second day, two more friends of Abhishek join him. On the third day 3 more friends of him join him and so on. If the fence is completely painted this way in exactly 20 days, then find the number of days in which 10 girls painting together can paint the fence completely, given that every girl can paint twice as fast as Abhishek and his friends (Boys)? (Assume that the friends of Abhishek are all boys).",
    "options": [
      "20",
      "40",
      "45",
      "77"
    ],
    "answer": "77",
    "explanation": "Number of men working on first day = 1\nNumber of men working on second day = 3\nNumber of men working on second day = 6 and so on..\nTotal number of boys till the end of the work = [n(n + 1) (n + 2)] / 6\n= [20 x 21 x 22] / 6 = 1540\nGiven that every girl paints twice as fast as Abhishek’s friends.\nHence, 20 girls work is being done.\nThus, the number of days taken to paint the fence = 1540/20 = 77.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q19",
    "question": "Six friends decide to share a big cake. Since all of them like the cake, they begin quarrelling as to who gets to first cut and has a piece of the cake. One friend suggests that they blindfold a friend and then choose from a well shuffled set of cards numbered from one to six. You check and find that this method works as it should be simulating a fair throw of a die. You check by performing multiple simultaneous trials of picking the cards blindfolding and throwing a die. You note that the number shown by the method of picking up a card and throwing a real world die, sums up to a number between 2 and 12. Which total would be likely to appear more often 8, 9 or 10?",
    "options": [
      "8",
      "9",
      "10",
      "All are equally likely."
    ],
    "answer": "8",
    "explanation": "The best solution will be 7, and there will be total 6 cases for this choice (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)but this one is not in the choices so out of the 4 cho ices given 8 will be the best choice. For this choice there are 5 methods (2,6), (3,5), (4,4), (5,3), (6,2)\nSimilarly for 9 there are 4 choices (3,6), (4,5), (5,4), (6,3) for 10 there are 3 choices (4,6), (5,5), (4,6)\nAnswer is 8 .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "time-work",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-2-1-q20",
    "question": "A research lab in Chennai requires 100 mice and 75 sterilized cages for a certain set of laboratory experiments. To identify the mice, the lab has prepared labels with numbers 1 to 100, by combining tags numbered 0 to 9. The SPCA requires that the tags be made of toxin-free material and that the temperature of the cages be maintained at 27 degree Celsius. Also, not more than 2 mice can be caged together and each cage must be at least 2 sq.ft in area. The 5 experiments to be conducted by lab are to be thoroughly documented and p erformed only after a round of approval by authorities. The approval procedure takes around 48 hours. How many times is, the tag numbered ’4’ used by the lab in numbering these mice?",
    "options": [
      "9",
      "19",
      "20",
      "21"
    ],
    "answer": "20",
    "explanation": "Just count the number of 4's from 1 to 100.it will give you 20.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q1",
    "question": "Jenny made a block with small cubes of 9 cubic cm volume. To make the block she used 4 small cubes long, 8 small cubes wide and 16 small cubes deep. She realizes that she has used more small cubes than she really needed. She realized that she could have glued a fewer number of cubes together to look like a block with same dimensions, if it were made hollow. What is the minimum number of cubes that she needs to take out so that the bigger cube is hollow?",
    "options": [
      "344",
      "512",
      "168",
      "342"
    ],
    "answer": "168",
    "explanation": "The total volume (in terms of number of cubes) of the solid = 4*8*16= 512\nThe total volume (in terms of number of cubes) of the hollow = (4-2)*(8-2)*(16-2) = 168\ni.e. 168 smaller cubes must be removed from the cube in order to make a hollow block.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q2",
    "question": "John buys a cycle for 31 dollars and given a cheque of amount 35 dollars. Shop Keeper exchanged the cheque with his neighbour and gave change to John. After 2 days, it is known that cheque is bounced. Shop keeper paid the amount to his neighbour . The cost price of cycle is 19 dollars. What is the profit/loss for shop keeper?",
    "options": [
      "23",
      "35",
      "19",
      "31"
    ],
    "answer": "23",
    "explanation": "CP of cycle = $19\nSP of cycle = $31\nProfit for the shopkeeper = $31 - $19 = $12\nAgain, shopkeeper gave $35 to neighbour.\nLoss = $35\nSo, net loss = $35 - $12 = $23",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "percentages",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q3",
    "question": "If Tarun buys only pens costing Rs. 13 each or only pencils costing Rs. 5 each, he is left with Rs. 2 in each case. Which of the following cannot be the amount available with him?",
    "options": [
      "457",
      "782",
      "577",
      "1042"
    ],
    "answer": "577",
    "explanation": "Given that : When the person buys either only pen s , each costing Rs.13 OR he buys only pencils, each costing Rs.5, he will have remaining 2 rupees. (i.e. when the amount he has is divided by 13 or 5, the remainder is 2 ).\nLooking at the options, the only number that does not satisfy the given condition is 577. (577 when divided by 13 do not give remainder 2 ).\nOR\nThe number must be divisible by 13 or 5 exactly, leaving (minus) the remainder 2.\nOnly 575 is not divisible by 13 exactly.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q4",
    "question": "Rahul buys an article at Rs.15850 from the retailer who sells it at a profit of 15 %. The retailer bought it from a wholesaler who sold it at a profit of 20 %. The manufacture sold it at a profit of 30 % to the wholesaler. Find the cost price of manufacturing the article (approximately)?",
    "options": [
      "8835",
      "15000",
      "12192",
      "cannot be Determined"
    ],
    "answer": "8835",
    "explanation": "Going from options\nOption 8835\nIf manufacturing cost is 8835,\nManufacturer to Wholesaler = 30/100 * 8835 = 2650.5 Total = 8835 + 2650.5 = 11485.5\nWholesaler to Retailer = 20/100 * 11485.5 = 2297.1 Total = 11485.5 + 2297.1 = 13782.6\nRetailer to Rahul = 15/100 * 13782.6 = 2067.34 Total = 13782.6 + 2067.34 ~ 15850\nHence option 8835 will be the answer.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "percentages",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q5",
    "question": "The points A (-5,4), B (-7,6) and C (5,2) are the co-ordinates of a right angled triangle. Which of the following angle is a right angle?",
    "options": [
      "A",
      "B",
      "C",
      "cannot be Determined"
    ],
    "answer": "A",
    "explanation": "Distance between any two points (x1,y1) and (x2,y2) is given by the formula [ (x2 - x1)2 - (y2 - y1)2 ]1/2\nDistance between A and B in the given question is (8)1/2\nSimilarly, Distance between B and C is (160)1/2\nDistance between A and C is (104)1/2\nFor any right angled triangle, hypotenuse is the largest side. Thus for our triangle ABC, BC is the hypotenuse. So the angle opposite to hypotenuse is the right angle.\nSo A is the right angle.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q6",
    "question": "If 5 Neptunian s can destroy 5 small plutos in 5 solar years. How long will 7 Neptunians take to destroy 7 small plutos (in solar years )?",
    "options": [
      "7",
      "5",
      "10",
      "12"
    ],
    "answer": "5",
    "explanation": "Using chain Rule,\n5*7*5=7*5*x\nx=(5*7*5)/(7*5)=5 .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q7",
    "question": "A cuboid of length 4 cm, breadth 6 cm and height 8 cm is formed using unit cubes. All the faces of the cuboid are painted using different colours. Now the cubes are separated and the cubes with no face painted are used to form a new cuboid. Find the volume of the newly formed cuboid.",
    "options": [
      "48",
      "72",
      "96",
      "36"
    ],
    "answer": "48",
    "explanation": "Cuboid is made of unit cubes\nFind the volume of hollow cuboid = (4-2)*(6-2)*(8-2)\n= 2*4*6\n= 48",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q8",
    "question": "Cadbury manufactures a chocolate box which contains “x” number of chocolates. There are three houses A , B, C in the neighbourhood of Cadbury. Since it was a new variety of chocolate the marketing managers of Cadbury decided to free chocolates to the children in the neighbouring houses A,B,C. In house A there are 3 children and in B there are 5 children and in C there are 7 children. After distributing the chocolates he was left with one chocolate in each case.",
    "options": [
      "204",
      "211",
      "214",
      "217"
    ],
    "answer": "211",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q9",
    "question": "The Tatas have decided to launch their new brand “Aria” in the SUV segment. Mr.Mehra decided to take a test drive before deciding on Aria. During the test drive he found that Aria could cover 500 m in 20 seconds. Aria is known for its uniform acceleration. Can you find out the acceleration?",
    "options": [
      "3.2",
      "2.5",
      "1.8",
      "2"
    ],
    "answer": "2.5",
    "explanation": "As we know, Speed=Distance/Time\nI.e. Speed =500/20=2.5",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "ratios",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q10",
    "question": "Find the maximum possible value of x-y+33 if x, y are any two single digit integers, not necessarily the same.",
    "options": [
      "41",
      "33",
      "51",
      "43"
    ],
    "answer": "51",
    "explanation": "x and y are 2 single digit integer to get the maximum value for equation\nx-y+33\nSince it is difference between x&y one number should be maximum and other should be minimum to get maximum value take x=9&y=1\n9-1+33=41",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q11",
    "question": "Kailash faces towards North. Turning to his right, he walks 25 meters. He then turns to his left and walks 30 meters. Next, he moves 25 meters to his right. He then turns to his right again and walks 55 meters. Finally he turns to the right and moves 40 meters. In which direction is he now from his starting point?",
    "options": [
      "South-West",
      "South",
      "North-West",
      "South-East"
    ],
    "answer": "South-East",
    "explanation": "Facing north turns towards right and walks 25km=east\nThen turns towards left walks 30 m=north\nAgain he turns towards his right and walks 25m=north east\nHe moves towards his right and walks 55m=south\nFinally he turns right and walks 40m=south east.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q12",
    "question": "Find the value of (213 x 213 x 213 - 31 x 31 x 31)/(213 x 213 + 213 x 31 + 31 x 31)",
    "options": [
      "191",
      "182",
      "178",
      "210"
    ],
    "answer": "182",
    "explanation": "Here , the numerator is in the form of a3-b3=(a-b) (a2+ab+b2) and the denominator is in the form of a2+ab+b2\na=213 & b=31\nBy cancelling the common terms in th e numerator and the denominator we will get (a-b)\nI.e.213-31= 182",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q13",
    "question": "Mr.Govind was a building contractor. He was doing reasonably well in his business but was always on an expansion mode. Mr.Govind won a contract with the Corporation and his business began to boom, so he decided to deploy more people in his projects. If he were to increase his labour force by 33.33%, what will be percentage reduction in the work load of each employee?",
    "options": [
      "75",
      "50",
      "25",
      "33.33"
    ],
    "answer": "25",
    "explanation": "As we know if men increase the workload of each employee will decrease\ni.e., men are inversely proportional to work load of an employee.\nAs we see in percentage concept, if there is 1/n increase, there will be 1/n+1 decrease\nHere 33.33% increase which equals=1/3\nThere will be 1/4 decrease=25%",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "time-work",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q14",
    "question": "Vodafone has come up with a new scheme “Pay Easy”. They have decided to charge the first 100 calls of a Pay Easy customer @Rs.1/-call, the next 100 calls @Rs.1.25/-call and the next 100 calls @Rs.1.75/-call. Raj is a Pay Easy customer. He paid Rs.286.25/- as his mobile bill that month. How many calls did Raj make?",
    "options": [
      "243",
      "241",
      "242",
      "235"
    ],
    "answer": "235",
    "explanation": "When you go through the option all the options are above 200\nTotal cost paid=Rs.286.25\nFor 1st 100 calls=Rs.100\n2nd 100 calls=Rs.125\nStill he has to pay Rs.61.25\nFor third 100 call=Rs.1.75\nNo of calls=61.25/1.75=35\nTotal number of calls =100+100+35=235 calls",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q15",
    "question": "Arun was all bent on building a new house. He carefully got the blue print of his house designed by his friend Ashwin, a civil engineer. He wanted to build a room of dimension 27 by 48 ft and lay tiles in this room. Each tile was of dimension 2 by 3 ft. How many such tiles should Arun buy?",
    "options": [
      "184",
      "224",
      "318",
      "216"
    ],
    "answer": "216",
    "explanation": "27*48/2*3=216\nADVANCED QUANTITATIVE APTITUDE",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q16",
    "question": "An intelligence agency forms a code of two distinct digits selected from 0, 1, 2 … 9 such that the first digit of the code is nonzero. The code, handwritten on a slip, can however potentially create confusion, when read upside down-for examp le, the code 91 may appear as 16. How many codes are there for which no such confusion can arise?",
    "options": [
      "80",
      "78",
      "71",
      "69"
    ],
    "answer": "71",
    "explanation": "The available digits are 0 , 1, 2, ...., 9 .\nThe first digit can be chosen in 9 ways (0 not acceptable), the second digit can be accepted in 9 ways (digits repetition not allowed).\nThus, the code can be made in 9 × 9 = 81 ways.\nNow there are only 4 digits 1, 6, 8, 9 which can create confusion.\nHence, the total number of codes which create confusion are = 4 × 3 = 12.\nOut of these 12 codes 69 and 96 will not create confusion.\nHence, in total 12 – 2 = 10 codes will create confusion.\nHence, the total codes without confusion are 81 – 10 = 71.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q17",
    "question": "Let N = 553 + 173 – 723. N is divisible by:",
    "options": [
      "both 7 and 13",
      "both 3 and 13",
      "both 17 and 7",
      "both 3 and 17"
    ],
    "answer": "both 3 and 17",
    "explanation": "We have N = 55^3 + 17^3 – 72^3 = (54 + 1)^3 + (18 – 1^)3 – 72^3\nWhen N is divided by 3, we get remainders (1)^3 + (- 1)^3 – 0 = 0\nHence, the number N is divisible by 3.\nAgain N = (51 + 4)^3 + 17^3 – (68 + 4)^3\nWhen N is divided by 17, the remainder is (4)^3 + 0 – (4)^3 = 0\nHence, the number is divisible by 17.\nHence, the number is divisible by both 3 and 17.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q18",
    "question": "ABCDE is a regular pentagon. O is a point inside the pentagon such that AOB is an equilateral triangle. What is ∠ OEA?",
    "options": [
      "66°",
      "48°",
      "54°",
      "72°"
    ],
    "answer": "66°",
    "explanation": "Join OE and OD.\nInternal angle of regular pentagon = 108°\n∠ EAB = ∠ EDC = 108°\n∠ OAB = 60°\n∠ EAO = 48°\nAO = OB = AB as the triangle is equilateral.\nAB = AE as this is a regular pentagon.\nTriangle AEO is isosceles as AO = EA.\n∠ AEO = ∠ AOE = x (say)\nIn triangle AEO,\n∠ OAE + 2x = 180°\n48° + 2x = 180°\n2x = 132°, or x = 66°",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q19",
    "question": "If there are 30 cans out of them one is poisoned. If a person tastes very little of this he will die within 14 hours so they decided to test it with mice. Given that a mouse dies in 24 hours and you have 24 hours in all to find out the poisoned can, how many mice are required to find the poisoned can?",
    "options": [
      "29",
      "15",
      "6",
      "5"
    ],
    "answer": "5",
    "explanation": "The mice will die within 24 hours not exactly on the 24th hour.\nFor example, if there are 7 cans,\n1st Can's solution is given to mice A.\n2nd Can's solution is given to mice B.\n3rd Can's solution is given to mice C.\n4th Can's solution is given to A and B.\n5th Can's solution is given to B and C.\n6th Can's solution is given to C and A.\n7th Can's solution is given to A, B and C.\nThen within 24 hours if A alone dies, Can 1 is poisoned.\nIf B alone dies, Can 2 is poisoned.\nIf C alone dies, Can 3 is poisoned.\nA and B dies if Can 4 is poisoned, B and C dies if Can 5 is poisoned, C and A dies if Can 6 is poisoned & if all A, B, C dies then Can 7 is poisoned.\nFrom this we can tell that to check 23-1 = 7 Cans we need 3 mouse.\nTherefore we can tell that in order to check 30 Cans (25-1 = 31 maximum) we need 5 mouse.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-3-r-1-q20",
    "question": "If a person makes a row of toys of 20 each, there would be 15 toys left. If they made to stand in rows of 25 each, there would be 20 toys left, if they made to stand in rows of 38 each, there would be 33 toys left and if they are made to stand in rows of 40 each, there would be 35 toys left. What is the minimum number of toys the person have?",
    "options": [
      "1255",
      "3805",
      "7595",
      "3795"
    ],
    "answer": "3795",
    "explanation": "Required number of toys =LCM (20, 25, 28, 38 and 40)–5\n⇒ 3,800−5=3,800−5= 3,795.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q1",
    "question": "The difference between the ages of two of my three grandchildren is 3. My eldest grandchild is three times older than the age of my youngest grandchild and my eldest grandchild’s age is two years more than the ages of my two youngest grandchildren added together. How old is my eldest grandchild?",
    "options": [
      "12",
      "13",
      "10",
      "15"
    ],
    "answer": "15",
    "explanation": "Youngest be x , then eldest = 3x.\n3x = y + x + 2 => y = 2x -2\nSo ages are 3x , 2x-2 and x respectively.\nNow check the options. 10 and 13 are not suitable in place of 3x so on taking 12 for 3x, x=4 so ages are 12,6,4 but this answer is not possible according to the condition- The difference between the ages of two of my three grandchildren is 3\nSo take 3x=15, x=5 so ages are 15, 8, 5 and 8-5 =3 so 15 is the correct answer .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q2",
    "question": "A greengrocer was selling apple at a penny each, chickoos at 2 for a penny and peanuts at 3 for a penny. A father spent 7 pennies and got the same amount of each type of fruit for each of his three children. What did each child get?",
    "options": [
      "1 apple, 2 chickoos, 2 peanuts",
      "1 apple, 2 chickoos, 1 peanut",
      "1 apple, 3 chickoos, 2 peanuts",
      "1 apple, 1 chickoo, 1 peanut"
    ],
    "answer": "1 apple, 2 chickoos, 1 peanut",
    "explanation": "1 apple costs 1 penny ===> 3 apples for 3 pennies,\n2 chickoos cost one pen ny ===> 3 kids * 2 chickoos each for 3 pennies\n3 peanuts cost one penny ===> 3 peanuts from the balance penny\nSpending 7 pennies and giving each child 1 apple, 2 chickoos and 1 peanut each .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q3",
    "question": "The IT giant Tirnop has recently crossed a head count of 150000 and earnings of $7 billion. As one of the forerunners in the technology front, Tirnop continues to lead the way in products and services in India. At Tirnop, all programmers are equal in every respect. They receive identical salaries and also write code at the same rate. Suppose 12 such programmers take 12 minutes to write 12 lines of code in total. How long will it take 72 programmers to write 72 lines of code in total?",
    "options": [
      "12",
      "18",
      "6",
      "72"
    ],
    "answer": "12",
    "explanation": "Use the eqn (men*time)/work\n(p1*t1)/l1=(p2*t2)/l2\n(12*12)/14=(72*t2)/72\n12=t2\nTime taken = 12",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q4",
    "question": "One day Rapunzel meets Dwarf and Byte in the Forest of forgetfulness. She knows that Dwarf lies on Mondays, Tuesdays and Wednesdays, and tells the truth on the other days of the week. Byte, on the other hand, lies on Thursdays, Fridays and Saturdays, but tells the truth on the other days of the week. Now they make the following statements to Rapunzel - Dwarf: Yesterday was one of those days when I lie. Byte: Yesterday was one of those days when I lie too. What day is it?",
    "options": [
      "Monday",
      "Sunday",
      "Thursday",
      "Saturday"
    ],
    "answer": "Thursday",
    "explanation": "Answer is Thursday\nAs the condition says that the dwarf lie on Monday , Tuesday & Wednesday so they will speak truth that they lied on Thursday also on the other side the bytes speak lie on Thursday and will tell that they spoke lie on Wednesday . So the day has to be Thursday as no other option satisfies the condition also.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q5",
    "question": "A sheet of paper has statements numbered from 1 to 40. For each value of n from 1 to 40, statement n says \"At least n of the statements on this sheet are true.\" Which statements are true and which are false?",
    "options": [
      "The even numbered statements are true and the odd numbered are false.",
      "The first 26 statements are false and the rest are true.",
      "The first 13 statements are true and the rest are false.",
      "The odd numbered statements are true and the even numbered are false."
    ],
    "answer": "The first 13 statements are true and the rest are false.",
    "explanation": "\"The first 13 statements are true and the rest are false.\" is the correct answer.\nAll others do not satisfy the rule and contradict itself.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q6",
    "question": "10 suspects are rounded by the police and questioned about a bank robbery. Only one of them is guilty. The suspects are made to stand in a line and each person declares that the person next to him on his right is guilty. The rightmost person is not questioned. Which of the following possibilities are true?",
    "options": [
      "(I) All suspects are lying or the leftmost suspect is innocent.",
      "(II) All suspects are lying and the leftmost suspect is innocent",
      "Both (I) and (II)",
      "Neither (I) nor (II)"
    ],
    "answer": "(I) All suspects are lying or the leftmost suspect is innocent.",
    "explanation": "\"All suspects are lying\" means the leftmost is guilty.\n\"All suspects are lying or the leftmost suspect is innocent.\" is true because, it is either leftmost is guilty or innocent.\n” All suspects are lying and the leftmost suspect is innocent\" has \"and\" in it, so, the statement becomes contradictory and so cannot be true.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q7",
    "question": "The citizens of planet nigiet are 8 fingered and have thus developed their decimal system in base 8. A certain street in nigiet contains 1000 (in base 8) buildings numbered 1 to 1000. How many 3s are used in numbering these buildings?",
    "options": [
      "75",
      "64",
      "192",
      "102"
    ],
    "answer": "192",
    "explanation": "There will be 20 3s in between 1 to 100\nSimilarly, 20 3s in between 200 to 300 but (100+20) in between 300 to 400 (because at unit place 19 3s and 10's plac e 1 and 100 3s at 100's place ) and 20 3s in between 400 to 500\n20 3s in between 500 to 600\n20 3s in between 600 to 700\n20 3s in between 700 to 800\n20 3s in between 800 to 900\n20 3s in between 900 to 1000\nSo total number of 3s will be 180+19+1+100 = 300\nThis count is in decimal but in question base value is 8 so we need to convert (300)8 = 192",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q8",
    "question": "On planet zorba, a solar blast has melted the ice caps on its equator. 8 years after the ice melts, tiny plantoids called echina start growing on the rocks. Echina grows in the form of a circle and the r elationship between the diamete r of this circle and the age of echina is given by the formula d = 4 * √ (t - 8) for t ≥ 8 where d represents the diameter in mm and t the number of years since the solar blast. Jagan recorded the radius of some echina at a particular spot as 8mm. How many years back did the solar blast occur?",
    "options": [
      "8",
      "12",
      "16",
      "24"
    ],
    "answer": "16",
    "explanation": "t=24\nD = 4*sqrt(24 - 8)\nD = 4*sqrt(16)\nD = 4*4\nD = 16",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q9",
    "question": "A circular dartboard of radius 1 foot is at a distance of 20 feet from you. You throw a dart at it and it hits the dartboard at some point Q in the circle. What is the probability that Q is closer to the ce ntre of the circle than the periphery?",
    "options": [
      "1/3",
      "½",
      "¾",
      "1/4"
    ],
    "answer": "1/4",
    "explanation": "0.25.\nTotal area of board = Pi*1^2= Pi\nPreferred are =Pi (1/2)^2= Pi/4\nSo prob = (pi/4)/pi =1/4= 0.25",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q10",
    "question": "After the typist writes 12 letters and addresses 12 envelopes, she inserts the letters randomly into the envelopes (1 letter per envelope). What is the probability that exactly 1 letter is inserted in an improper envelope?",
    "options": [
      "11/12",
      "0",
      "1/12",
      "1/6"
    ],
    "answer": "0",
    "explanation": "If one letter is in wrong envelope, one other letter must also be in wrong en velope. So zero is the probability that exactly 1 letter is inserted in an improper envelope.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q11",
    "question": "Alok is attending a workshop \"How to do more with less\" and today’s the me is working with fewer digits. The speakers discuss how a lot of miraculous mathematics can be achieved if mankind (as well as womankind) had only worked with fewer digits. The problem posed at the end of the workshop is How many 5 digit numbers can be formed using the digits 1, 2, 3, 4, 5 (but with repetition) that are divisible by 4?Can you help Alok find the answer?",
    "options": [
      "375",
      "625",
      "500",
      "3125"
    ],
    "answer": "625",
    "explanation": "For a number to be divisible by 4,we must check that the last two digits should be divisible by 4.\nThe combinations of digits formed by 1,2,3,4, 5 which are divisible by 4 are (1,2),(2,4),(3,2)(4,4),(5,2)\nSo out of these 5 pairs we must select 1 pair for the number to be divisible by 4.\nSo probability is 5C1 =5\nNow we have to select the first 3 digits in a number. They can be any digits i.e. (1, 2, 3, 4, 5) because repetition is allowed\nNumber of possibilities for 1st place =5\nNumber of possibilities for 2nd place =5\nNumber of possibilities for 3rd place =5\nSo total possibilities at 1st, 2nd, 3rd place =5^3\nTotal proba bil ity is=5^3+5C1 = 5^4= 625.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "time-work",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q12",
    "question": "Given 3 lines in the plane such that the points of intersection form a triangle with sides of length 20, 20 and 30, the number of points equidistant from all the 3 lines is",
    "options": [
      "1",
      "0",
      "4",
      "2"
    ],
    "answer": "4",
    "explanation": "There are 4 such points. One point i s the incenter of the triangle. 3 is the excenters with respect to each angle of the triangle. In the picture given below, I is the incenter and JA, JB, JC are excenters.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q13",
    "question": "The pacelength P is the distance between the rear of two consecutive footprints. For men, the formula, n/P = 144 gives an approximate relationship between n and P where, n = number of steps per minute and P = pacelength in meters. Bernard knows his pacelength is 164cm. The formula applies to Bernard’s walking. Calculate Bernard’s walking speed kmph.",
    "options": [
      "236.16",
      "11.39",
      "8.78",
      "23.24"
    ],
    "answer": "23.24",
    "explanation": "n/P = 144 gives an approximate relationship between n and P where, n = number of steps per minute and P = pacelength in meters. Bernard knows his pacelength is 164cm.\nNumber of steps in one minute = 144*1.64\nDistance travelled in 1 minute = 144*1.64*1.64 metres\nDistance travelled in one hr = 144*1.64*1.64*60/1000 km = 23.24 km approx",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "speed",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q14",
    "question": "Alice and Bob play the following coins-on-a-stack game. 20 coins are stacked one above the other. One of them is a special (gold) coin and the rest are ordinary coins. The goal is to bring the gold c oin to the top by repeatedly mo ving the topmost coin to another position in the stack. Alice starts and the players take turns. A turn consists of moving the coin on the top to a position i below the top coin (0 ≤ i ≤ 20). We will call this an i-move (thus a 0-move implies doing nothing). The proviso is that an i-move cannot be repeated; for example once a player makes a 2-move, on subsequent turns neither player can make a 2-move. If the gold coin happens to be on top when it’s a player’s turn then the player wins the game. Initially, the gold coin i s the third coin from the top. Then",
    "options": [
      "In order to win, Alice’s first move should be a 0-move.",
      "In order to win, Alice’s first move should be a 1-move.",
      "Alice has no winning strategy",
      "In order to win, Alice’s first move can be a 0-move or a 1-move"
    ],
    "answer": "In order to win, Alice’s first move should be a 1-move.",
    "explanation": "In order to win, Alice's first move should be a 1-move.Because there are two possibilities after 1- move by Alice:-",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q15",
    "question": "For the FIFA world cup, Paul the octopus has been predicting the winner of each match with amazing success. It is rumoured that in a match between 2 teams A and B, Paul picks A with the same probability as A’s chances of winning. Let’s assume such rumours to be true and that in a match between Ghana and Bolivia, Ghana the stronger team has a probability of 2/3 of winning the game. What is the probability that Paul will correctly pick the winner of the Ghana- Bolivia game?",
    "options": [
      "5/9",
      "1/9",
      "2/3",
      "1/3"
    ],
    "answer": "5/9",
    "explanation": "Paul picks A with the same probability as A’s chances of winning.\nChance of A winning = 2/3\nPrediction of octopus is also = 2/3 (given in ques tion )\nChance of B winning = 1/3\nOctopus prediction = 1/3\nSo prob ability of picking a winner = ( prob picking of Ghana * Ghana winning + prob picking of Bolivia * Bolivia winning)\n= (2/3)*(2/3) +(1/3)*(1/3) = 5/9.\nADVANCE QUANTITATIVE APTITUDE",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q16",
    "question": "Alok and Bhanu play the following min-max game. Given the expression N = 9 + X + Y – Z, where X, Y and Z are variables representing single digits (0 to 9), Alok would like to maximize N while Bhanu would like to minimize it. Towards this end, Alok chooses a single digit number and Bhanu substitutes this for a variable of her choice (X, Y or Z). Alok then chooses the next value and Bhanu, the variable to substitute the value. Finally Alok proposes the value for the remaining variable. Assuming both play to their optimal strategies, the value of N at the end of the game would be",
    "options": [
      "20",
      "18",
      "27",
      "0"
    ],
    "answer": "18",
    "explanation": "Actually only Alok chooses numbers.\nSo he wants to maximize the numbers.\nSince there are two positive and one negative sign, he will definitely choose 9 so as to get the maximum value.\nSince maximum of x+y-z can be obtained only from that way\nSo 9+9+9-9 = 18.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q17",
    "question": "Two bikers Rohan and Ajay are practicing with two different sports bike; Yamaha and Honda, on the circular racing track, for the bike racing tournament to be held next month. Both Rohan and Ajay start from the same point on the circular track. Rohan completes one round of the track in 1 min and Ajay takes 2 min to complete a round. While Rohan maintains speed for all the rounds, Ajay halves his speed after the completion of each round. How many times Rohan and Ajay will meet between 4th round and 7th round of Sunil (4th and 7th round is excluded)? Assume that the speed of Sunil remains steady throughout each round and changes only after the completion of that round.",
    "options": [
      "47",
      "94",
      "60",
      "120"
    ],
    "answer": "94",
    "explanation": "Time taken by Ajay for 1st round = 2 min\n2nd round = 4minutes\n3rd round = 8 minutes\n4th round = 16 minutes\n5th round = 32 minutes\n6th round = 64 min Rohan tales one minute for every round.\nHe meets 31 times in 5th and 63 times in 6th round\nTotal meet = 31 + 63 = 94 .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "speed",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q18",
    "question": "Events A, B, C are mutua lly exclusive events such that: The set of possible values of x are in the interval",
    "options": [
      "1/3, ½",
      "1/3, 2/3",
      "1/3, 13/3",
      "0,1"
    ],
    "answer": "1/3, ½",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q19",
    "question": "The ratio of a two-digit natural number to a number form ed by reversing its digits is 4 : 7. Which of the following is the sum of all the numbers of all such pairs?",
    "options": [
      "99",
      "198",
      "330",
      "132"
    ],
    "answer": "330",
    "explanation": "Let the two digit number be 10a + b and the number formed by reversing its digits be 10b + a.\n10a + b/10b + a= 4/7\n70a + 7b = 40b + 4a\n66a = 33b\nTherefore,\na/b= 1/2\nSo, let us list down all possible values for a and b.\na b Number Reversed Number\n1 2 12 21\n2 4 24 42\n3 6 36 63\n4 8 48 84\nHence, the sum of all the numbers would be,\n12 + 21 + 24 + 42 + 36 + 63 + 48 + 84 = 330.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "ratios",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-4-1-q20",
    "question": "When 40! Is expressed in base 8 form, what is the last non–zero digit in the base 8 expansion?",
    "options": [
      "2",
      "6",
      "4",
      "2 or 6"
    ],
    "answer": "4",
    "explanation": "We need to find the largest power of 8 that divides 40!.\nWe need to find the largest power of 2 that divides 40!\nThis is given by (40/2) and then successive division by 2. = 20 + 10 + 5 + 2 + 1 = 38\nSo, 238 divide 40! Or, (23)12 × 22 divides 40!\n(23)12 divides the number or the base 8 representation ends with 12 zeroes. Now, the base 8 representation of this number will be some (abcd…n)8 × (1000000000000)8. Now, (abcd…n)8 does not end in 0 and is a multiple of 22. The last digit has to be 4.\nThe last non–zero digit is 4 .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q1",
    "question": "1/3 of a number is 6 more than 1/6 of that number then what is the number?",
    "options": [
      "12",
      "36",
      "24",
      "48"
    ],
    "answer": "36",
    "explanation": "Let the number be x\nSo , x*(1/3 ) = 6+[x*(1/6)]\nSolving this,\nx=36",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q2",
    "question": "The pacelength P is the distance between the rear of two consecutive footprints. For men, the formula, n/P = 180 gives an approximate relationship between n and P where, n = number of steps per minute and P = pacelength in meters. Bernard knows his pacelength is 120 cm. The formula applies to Bernard’s walking. Calculate Bernard’s walking speed kmph.",
    "options": [
      "236.16",
      "8.78",
      "12.44",
      "15.55"
    ],
    "answer": "15.55",
    "explanation": "n/P = 180 gives an approximate relationship between n and P where, n = number of steps per minute and P = pacelength in meters. Bernard knows his pacelength is 120cm.\nNumber of steps in one minute = 180*1.2\nDistance travelled in 1 minute = 180*1.2*1.2 metres\nDistance travelled in one hr = 180*1.2*1.2*60/1000 km = 15.55 km approx",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "speed",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q3",
    "question": "The IT giant Tirnop has recently crossed a head count of 150000 and earnings of $7 billion. As one of the forerunners in the technology front, Tirnop continues to lead the way in products and services in India. At Tirnop, all programmers are equal in every respect. They receive identical salaries and also write code at the same rate. Suppose 24 such programmers take 24 minutes to write 24 lines of code in total. How long will it take 72 programmers to write 72 lines of code in total?",
    "options": [
      "12",
      "14",
      "6",
      "72"
    ],
    "answer": "14",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q4",
    "question": "A sheet of paper has statements numbered from 1 to N. For each value of n from 1 to 40, statement N says \"Exactly N of the statements on this sheet is false.\" Which statements are true and which are false?",
    "options": [
      "All statements are false",
      "The odd numbered statements are true the even numbered are false",
      "Second last statement is true and the remaining statements are false",
      "The even numbered statements are true and the odd numbered are false"
    ],
    "answer": "Second last statement is true and the remaining statements are false",
    "explanation": "For this type of Questions, follow this:\nAt least- 1 st half are true, last half are false\nExactly- Last second one is true or (N-1)th Statement is true\nAlmost- All are true.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q5",
    "question": "Alok and Bhanu play the following min-max game. Given the expression N = 25 + X + Y – Z , where X, Y and Z are variables representing single digits (0 to 9), Alok would like to maximize N while Bhanu would like to minimize it. Towards this end, Alok chooses a single digit number and Bhanu substitutes this for a variable of her choice (X, Y or Z). Alok then chooses the next value and Bhanu, the variable to substitute the value. Finally Alok proposes the value for the remaining variable. Assuming both plays to their optimal strategies, the value of N at the end of the game would be",
    "options": [
      "43",
      "16",
      "36",
      "34"
    ],
    "answer": "36",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q6",
    "question": "A sheet of paper has statements numbered from 1 to 40. For each value of n from 1 to 40, statement n says \" At least n of the statements on this sheet are false.\" Which statements are true and which are false?",
    "options": [
      "First half of the statements are true and the rest are false",
      "The odd numbered statements are true the even numbered are false",
      "First half of the statements are false and the rest are true",
      "The even numbered statements are true and the odd numbered are false"
    ],
    "answer": "First half of the statements are true and the rest are false",
    "explanation": "* At least - First half of the statements are true and the rest are false\n* Exactly : First statement is true and rest are false\n* Almost : all the statements are true",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q7",
    "question": "10 suspects are rounded by the police and questioned about a bank robbery. Only one of them is guilty. The suspects are made to stand in a line and each person declares that the person next to him on his right is guilty. The rightmost person is not questioned. Which of the following possibilities are true?\nA) All suspects are lying\nB) The leftmost suspect is guilty\nC) Rightmost suspect is guilty",
    "options": [
      "A only",
      "A and B",
      "B only",
      "A and C"
    ],
    "answer": "A and B",
    "explanation": "If first is victim then all suspects are lying. Here you should remember that the rightmost person is not questioned.\nIf any of the person leaving leftmo st is victim then the leftmost suspect is innocent. But \"and\" should not be used between the conditions because leftmost is not innocent necessarily.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q8",
    "question": "One the Planet, Oz, there are 8 days in a week – Sunday to Saturday and another day called Oz day. There are 36 hours in a day and each hours has 90 min while each minute has 60 sec. As on earth, hour hand covers the dial twice every day. Find the approximate angle between the hands of clock on Oz when time is 14.40 am",
    "options": [
      "83",
      "74",
      "129",
      "65"
    ],
    "answer": "129",
    "explanation": "Hour hand=> 18hrs=360 deg=> 1hr=20 deg\n90mins=20 deg=> 1min=2/9 deg\nMinute hand=> 90mins=360 deg=> 1min=4 deg\nAngle= ( 14*20+40*2/9)-40*4\n= 280+80(8.8)/9-160\n= 289-160\nAngle= 129 deg .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q9",
    "question": "It is dark in my bedroom and I want to get two socks of the same colour from my drawer, which contains 26 red and 24 blue and 34 brown socks. How many socks do I have to take from the drawer to get at least two socks of the each colour?",
    "options": [
      "6",
      "74",
      "61",
      "62"
    ],
    "answer": "62",
    "explanation": "Maximum of (red, blue, brown) + 2nd maximum of (red, blue, brown) + 2\n36 + 24 + 2 = 62.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q10",
    "question": "66 people {a1, a2, ..., a66} meet and shake hands in a circular fashion. In other words, there are totally 36 handshakes involving the pairs, {a1, a2}, {a2, a3}, ..., {a65, a66}, {a66, a1}. Then size of the smallest set of people such that the rest have shaken hands with at least one person in the set is",
    "options": [
      "22",
      "33",
      "65",
      "11"
    ],
    "answer": "22",
    "explanation": "For minimum people in a set we can consider handshakes as {a1, a2, a3} , {a4, a5, a6},\n{a7, a8, a9},…….{ an-2,an-1,an}\nFor minimum people, we can consider the set {a2, a5, a8… an-1}.\nSo, MINIMUM people in a set = n / 3\nso n/3=66/3=22",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q11",
    "question": "The IT giant Tirnop has recently crossed a head count of 150000 and earning of $7 billion. As one of the forerunners in the technology front, Tirnop continues to lead the way in products and services in India. At Tirnop, all programmers are equal in every respect. They receive identical salaries and also write code at the same rate Suppose 16 such programmers take 16 minutes to write 16 lines of code in total. How many lines of code can be written by 96 programmers in 96 minutes? The IT giant Tirnop has recently crossed a head count of 150000 and earning of $7 billion. As one of the forerunners in the technology front, Tirnop continues to lead the way in products and services in India. At Tirnop, all programmers are equal in every respect. They receive identical salaries and also write code at the same rate Suppose 16 such programmers take 16 minutes to write 16 lines of code in total. How many lines of code can be written by 96 programmers in 96 minutes?",
    "options": [
      "16",
      "576",
      "432",
      "96"
    ],
    "answer": "576",
    "explanation": "(16 men)*(16 min) / ( 16 lines ) = ( 96 men ) ( 96 min)/ x ( lines)\nHence x=576",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q12",
    "question": "Anoop managed to draw 6 circles of equal radii with their centres on the diagonal of a square such that the two extreme circles touch two sides of the square and each middle circle touches two cir cles on either side. Find the r atio of the side of the square to the radius of the circles. Assume √2 is 1.4.",
    "options": [
      "9:1",
      "6.2: 1",
      "10.4: 1",
      "7.6: 1"
    ],
    "answer": "10.4: 1",
    "explanation": "Let the radius of circle be r\nLet the side of square be a\nThen diagonal of square= a*sqrt(2)\nThis diagonal length = 12*r + 2r * sqrt(2)\n( Because the extreme circle's radius is perpendicular to side of square.)\nThus we get\n12*r+2r*sqrt(2)=a*sqrt(2)\nr ( 6*sqrt(2)+2)=a\nr / a=1/(6*sqrt(2)+2)\nThus ratio: r : a = 1 :( 6 *sqrt(2)+2)\n= 1: 10.4\nSo, a : r = 10.4 : 1",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q13",
    "question": "A hare and tortoise a race along a circle of 100 yards diameter. The tortoise goes in one direction and the hare in the other. The hare starts after tortoise has covered 1/5 its distance and that leisurely. The hare and tortoise meet when the hare has covered only 1/4 of the distance. By what factor should the hare increase its speed so as to tie the race?",
    "options": [
      "8",
      "37",
      "45",
      "6.6"
    ],
    "answer": "6.6",
    "explanation": "First distance = 1/x\nSecond distance = 1/y\nLet z = xy-x\nRequired factor will be = z*(z-y)/x^2\nIn this question..\nx=5 , y=4\nz=5*4-5=15\nz-y = 15-4 = 11\nRequired factor = 15*11/25 =6.6",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "speed",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q14",
    "question": "There are two boxes, one containing 21 red balls and the other containing 25 green balls. You are allowed to move the balls between the boxes so that when you choose a box at random and a ball at random from the chosen box, the probability of getting a red is maximized. This maximum probability is",
    "options": [
      "0.5",
      "0.63",
      "0.72",
      "0.48"
    ],
    "answer": "0.72",
    "explanation": "From the given data,\n1/2*(1+20/45) = 65/90=.72\nThe maximum probability=.72",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q15",
    "question": "Alok and Bhanu play the following min-max game. Given the expression N = 32 + X* (Y – Z) , where X, Y and Z are variables representing single digits (0 to 9), Alok would like to maximize N while Bhanu would like to minimize it. Towards this end, Alok chooses a single digit number and Bhanu substitutes this for a variable of her choice (X, Y or Z). Alok then chooses the next value and Bhanu, the variable to substitute the value. Finally Alok proposes the value for the remaining variable. Assuming both play to their optimal strategies, the value of N at the end of the game would be",
    "options": [
      "113",
      "32",
      "-49",
      "50"
    ],
    "answer": "50",
    "explanation": "For these type of ques, remember dis thumb rule..\nX*Y-Z=18\nX+Y-Z=11\nX-Y-Z=2\nSo\nN = 32 + X * Y - Z\nN= 32+18=50\nADVANCE QUANTITATIVE APTITUDE",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q16",
    "question": "The citizens of planet nigiet are 6 fingered and have thus developed their decimal system in base 6. A certain street in nigiet contains 1000 (in base 6) buildings numbered 1 to 1000. How many 3s are used in numbering these buildings?",
    "options": [
      "108",
      "192",
      "54",
      "102"
    ],
    "answer": "108",
    "explanation": "In decimal system total no. of 3's from 1 to 1000 are 100*3 = 300\nIn base 6, value of 300 = 3*(6^2) + 0*(6^1) + 0*(6^0) = 108 .",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q17",
    "question": "Given 3 lines in the plane such that the points of intersection form a triangle with sides of length 19, 19 and 19, the number of points equidistant from all the 3 lines is",
    "options": [
      "1",
      "0",
      "4",
      "2"
    ],
    "answer": "4",
    "explanation": "A ns is 4 because 1 for incentre and other 3 for excentres .So total no of points equidistant from the 3 lines is 4.\nNote:-Every triangle has three excenters and three excircles. The excircle which is tangent to one side of the triangle and the extensions of the other two sides and the centre of the excircle is known as excentre",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q18",
    "question": "Janta Airline has a free luggage allowance for its passengers. If any passenger carries excess luggage, it is charged at a constant rate per kg. The total luggage charge paid by Ravind Jekriwal and Pranas Shubhan i s Rs. 1100. If both Ravind and Pranas had carried luggage twice the weight than they actually did, their lugg age charges would have been Rs.2000 and Rs. 1000 respectively. What was the charge levied on Ravind’s luggage?",
    "options": [
      "Rs.600",
      "Rs.800",
      "Rs.900",
      "Rs.700"
    ],
    "answer": "Rs.800",
    "explanation": "Let the free luggage allowance be ‘f’ kg. Let the weight of the luggage carried by Ravind be ‘r’ kg and the weight of the luggage carried by Pranas be ‘p’ kg. Thus, the excess luggage weights carried by Ravind and Pranas respectively are (r – f ) kg and (p – f ) kg .\nThus, the total luggage charge for both would be (r – f ) k + (p – f ) k if k is the charge per kg.\nThus, (r – f ) k + (p – f ) k = 1100.\n(r + p – 2f ) k = 1100....................... ( 1)\nIf Ravind carried twice the luggage weight he actually did, i.e., if he carried 2r kg, then the excess luggage weight he carried would have been 2r – f and the corresponding charge would have been (2r – f) k.\nTherefore, (2r – f ) k = 2000 ................ (2)\nLikewise, If Pranas carried twice the luggage he actually did i.e., if he carried 2p kg, then the excess luggage he carried would have been 2p –f and the corresponding charge would have been (2p – f) k.\nTherefore, (2p – f ) k = 1000 ................ (3)\nAdding (2) and (3) and simplifying, we get,\n(r + p – f ) k = 1500 ........................ (4)\nDividing (4) by (1) and simplifying, we get,\n19f = 4r + 4p ............................. (5)\nDividing (2) by (3) and simplifying, we get,\n–f = 2r – 4p ............................. (6)\nSolving (5) and (6) for r, we get,\nr = 3f ................................... (7)\nSubtracting (1) from (4) and simplifying, we get,\nfk = 400.\nRavind’s luggage charge = (r – f ) k .\nBut, according to equation (7), r = 3f. Therefore, Ravind’s luggage charge = 2fk\nBut, fk = 400. Therefore, Ravind’s luggage charge = Rs. 800.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q19",
    "question": "Consider a class of 40 students whose average weight is 40 kgs. m new students join this class whose average weight is n kgs. If it is known that m + n = 50, what is the maximum possible average weight of the class now?",
    "options": [
      "40.18",
      "40.56",
      "40.67",
      "40.49"
    ],
    "answer": "40.56",
    "explanation": "If the overall average weight has to increase after the new people are added, the average weight of the new entrants has to be higher than 40.\nSo, n > 40\nConsequently, m has to be < 10 (as n + m = 50)\nWorking with the “differences” approach, we know that the total additional weight added by “m” students would be (n - 40) each, above the already existing average of 40. m ( n - 40) is the total extra additional weight added, which is shared amongst 40 + m students. So, m\n(n – 40) / (m + 40)\nhas to be maximum for the overall average to be maximum.\nAt this point, use the trial and error approach (or else, go with the answer options) to arrive at the answer.\nThe maximum average occurs when m = 5 , and n = 45\nAnd the average is 40 + (45 – 40) * (5 / 45)\n= 40 + (5 / 9)\n= 40.56 kgs",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-5-1-q20",
    "question": "Let n! = 1 x 2 x 3 x……….x n for integer n> 1. If p = 1! + (2 x 2!) + (3 x 3!) + … … ( 10 x 10!) , then p+2 when divided by 11! Leaves remainder of",
    "options": [
      "10",
      "0",
      "7",
      "1"
    ],
    "answer": "1",
    "explanation": "If P = 1! = 1\nThen P + 2 = 3, when divided by 2! Remainder will be 1.\nIf P = 1! + 2 × 2! = 5\nThen, P + 2 = 7 when divided by 3! Remainder is still 1.\nHence, P = 1! + (2 × 2!) + (3 × 3!)+ ……+ (10 × 10!)\nHence, when p + 2 is divided by 11 ! The remainder is 1.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q1",
    "question": "Fill dirt or fill soil is usually the sub-soil removed from an excavation site and is used to level a place or create artificial mounds. If the average density of sub-soil removed from a site is 3gm/cu cm and it weight 400 kg. How many hemispherical pits each of volume 240 cubic cm, can this sub-soil fill?",
    "options": [
      "555",
      "277",
      "556",
      "554"
    ],
    "answer": "555",
    "explanation": "3 gm per cm cube and there are hemispheric pits of capacity 240 cm cube\nSo each hemisphere can contain 3*240=720 cm cube soil.\nSo total of 400 kg i.e. 400*1000=400000 gms will be held in 400000/720=555.55 so approximately 555.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q2",
    "question": "The New York Public library is one of the world’s greatest repositories of books and journals. It has a beautiful reading room facing Manhattan’s famous Fifth Avenue. In the reading rooms are 10 reading spots. Each reading spot consists of a round table with 4 chairs placed around it. There are some readers such that in each occupied reading spot there are different numbers of readers. If in all there are 10 readers, how many reading spots are empty?",
    "options": [
      "None",
      "6",
      "5",
      "4"
    ],
    "answer": "6",
    "explanation": "1st spot=1 reader\n2nd spot=2 reader\n3rd spot=3 reader\n4th spot=4 reader\n10 readers can occupy 4 spots only. So answer is 6",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q3",
    "question": "A group of friends Tom, Tim, Dick, Diana, Harry, and Harriet go out to a fair three hundred meters from the McDonalds which is five Km away. They see a weighing machine and decide to have some fun. However the girls refuse to step on the weighing machine. So Tom, Dick and harry, weigh themselves in a particular order. First Tom, Dick, and Harry weigh themselves individually and then tom and Dick, Dick and Harry, Tom and Harry and then Tom, Dick and harry together respectively. The recorded weight for the last measure is 158 kgs. The average of all the 7 measures is",
    "options": [
      "112.86",
      "52.67",
      "90.29",
      "67.71"
    ],
    "answer": "90.29",
    "explanation": "Let tom,dick and harry be a, b and c.\nNow there is total ly 7 rounds of weight measure.\nFirst Tom, Dick, and Harry weigh themselves individually and then Tom and Dick, Dick and Harry, Tom and Harry and then Tom, Dick and Harry together respectively.\nSum of total 7 rounds written as,\na+b+c+(a+b)+(b+c)+(c+a)+(a+b+c) = 4(a+b+c)\n4*158=632\nAverage of 7 weighing is 632/7=90.29 kg",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q4",
    "question": "Determine the distance between the x-intercept and the z-intercept of the plane whose equation is 2x+9y-3z=18",
    "options": [
      "6.32",
      "10.82",
      "3",
      "5"
    ],
    "answer": "10.82",
    "explanation": "Putting y=z=0\nx=9\nPutting x=y=0\nz=-6\nDistance=(x^2+z^2) ^0.5=10.82 unit",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q5",
    "question": "In the year 2002, Britain was reported to have had 4.3m closed-circuit televisions (CCTV) cameras – one for every 14 people in the country. This scrutiny is supposed to deter and detect crime. In one criminal case, the police interrogates two suspects. The ratio between the ages of the suspects is 6:5 and the sum of their ages is 66 years. After how many years will the ratio be 8:7?",
    "options": [
      "11 years",
      "12 years",
      "6 years",
      "7 years"
    ],
    "answer": "12 years",
    "explanation": "A/6 =B/5=x;\nA=6x;B=5x;\nA+B=66; ==> x=6;\nA=36, B=30;\nAfter X years,((A+X)/(B+X))=(8/7)\nSolve the above eqn, we get X=12.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "ratios",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q6",
    "question": "A game is played between 2 players and one player is declared as winner. All the winners from first round, played in the second round. All the winners from second round played in third round and so on. If 8 rounds were played to declare only one player as winner, how many players played in first round?",
    "options": [
      "256",
      "128",
      "255",
      "127"
    ],
    "answer": "256",
    "explanation": "8 rounds means 128-64-32-16-8-4-2-1\nSo 128 matches were played in first round\nteams= 128*2=256\n7 .1/3rd of a number is 3 more than the 1/6th of the same number, then find the number?\na. 24 b. 12 c. 18 d. 20\nAnswer: C\nExplanation:\nLet X is the number.\n(1/3) X-(1/6) X=3,\nSolving these we can get the answer.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q8",
    "question": "It is the class with the seating arrangement in 4 rows and 8 columns. When the teacher says ’start’ the girl who is sitting in first row and first column will say 1, then the next girl sitting behind her will say 4, the next girl sitting behind that girl will say 7, in a particular order each girl is telling a number, the following girls told 10, 13 next turn is yours what will you say?",
    "options": [
      "14",
      "16",
      "20",
      "17"
    ],
    "answer": "16",
    "explanation": "The series is like.. 1,4,7,10,13.... and so on.\nSo the difference between the two consecutive no's in the series is 3. When 13 is already completed, the next no in the series should be 13+3=16.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q9",
    "question": "If Valentine’s day of 2005 was celebrated on a Monday. What day is Feb 14th, 2010?",
    "options": [
      "Monday",
      "Sunday",
      "Tuesday",
      "Wednesday"
    ],
    "answer": "Sunday",
    "explanation": "In leap year 2 odd days\nOrdinary year 1 odd days.\nFrom 2005 to 2010, there is one leap year and 4 ordinary year. So totally 6 odd days.\nSo answer is Sunday.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q10",
    "question": "If a pipe can fill the tank in 6 hrs but unfortunately there was a leak in the tank due to which it took 30 more minutes .Now if the tank was full how much time will it take to get emptied through the leak?",
    "options": [
      "39 hrs",
      "78 hrs",
      "72 hrs",
      "70 hrs"
    ],
    "answer": "78 hrs",
    "explanation": "Work done by the leak in 1 hour = [(1/6)-(2/13)]= 1/78 hrs.\nTime taken= 78 hrs",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q11",
    "question": "Joe counts 48 heads and 134 legs among the chicken and dogs in his farm. How many dogs does he have?",
    "options": [
      "29",
      "21",
      "18",
      "19"
    ],
    "answer": "19",
    "explanation": "Let us take the no. of Chickens as C and no. of dogs as D.\nEquation 1: C + D = 48\nEquation 2: 2C + 4D = 134 (2 legs for Chicken and 4 legs for Dogs)\nSolving eqns 1 and 2, we get, D = 19 and C = 29.\nNo. of dogs is 19.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q12",
    "question": "A family consists of father, mother, two sons and the youngest daughter. The age of first son and daughter are in the ratio 3:1. The mother is 3.5 times as old as the second son. The age of the second son is 2/3 of the age of the first son. The age of the youngest daughter is 5 years. What is the age of the mother?",
    "options": [
      "40",
      "35",
      "15",
      "25"
    ],
    "answer": "35",
    "explanation": "Let us take the ages of Father, Mother, First s on, Second son and daughter as F, M, S1, S2 and D respectively.\nGiven,\nS1: D = 3 : 1\nM = 3.5 (S2)\nS2 = 2/3 (S1)\nD = 5\nNow, S1: D = 3 : 1 => S1 = 3D => S1 = 3(5) => 15\nSo, S1 = 15\nS2 = 2/3 (S1) => S2 = 2/3(15) => 10\nS2 = 10\nM = 3.5 (10) => 35\nMother's age is 35",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "ratios",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q13",
    "question": "A bag contains 20 yellow balls, 23 green balls, 27 white balls. How many minimum balls one should pick out so that to make sure he gets at least 2 balls of all colour ?",
    "options": [
      "48",
      "52",
      "60",
      "68"
    ],
    "answer": "52",
    "explanation": "The highest number from one colour ball is 27 (white balls), the second highest is 23 (green)\nSo, as a worst case scenario, one should take all 27 and 23 to move to get 2 yellow balls.\nSo, 27 + 23 + 2 = 52\nOne should at least take 52 balls to get minimum 2 balls from all colo u rs.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q14",
    "question": "A pipe can fill a tank in 3 hrs .Due to a leakage in the tank it takes 3.5 hrs to fill the same tank. Then how many hours will the leakage can empty the tank.",
    "options": [
      "3.5 hrs",
      "30 hrs",
      "0.5 hrs",
      "21 hrs"
    ],
    "answer": "21 hrs",
    "explanation": "The electric pump can fill the tank in 3 hrs. Because of the leak it took 3.5 hrs.\nNow, if there is no leak and the electric pump works for 3.5 hrs instead of 3 hrs, 0.5/3 = 1/6 of the tank must have been overflown. But we are unable to see the overflow because this 1/6 is emptied by the leak of course working for 3.5 hrs.\nHence the leak can empty 1/6 of the tank in 3.5 hours. So it can empty a full tank in 21 hrs.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q15",
    "question": "Pointing out to a photograph a man tells his friend, “She is the daughter of the only son of my father’s\nwife”. How is the girl in photograph related to the man?",
    "options": [
      "Niece",
      "Daughter",
      "Mother",
      "None of these"
    ],
    "answer": "Daughter",
    "explanation": "From the given information,\nThe Only son of my father's wife is the man\nDaughter of the only son of my father's wife is the man's daughter.\nSo, the girl is the daughter of that man.\nADVANCED QUANTITATIVE APTITUDE",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q16",
    "question": "Mr. X decides to travel from Delhi to Gurgaon at a uniform speed and decides to reach Gurgaon after T hr. After 30 km, there is some engine malfunction and the speed of the car becomes 4/5th of the original speed. So, he travels the rest of the distance at a constant speed 4/5th of the original speed and reaches Gurgaon 45 minutes late. Had the same thing happened after he travelled 48 km, he would have reached only 36 minutes late. What is the distance between Delhi and Gurgaon?",
    "options": [
      "90 km",
      "120 km",
      "20 km",
      "40 km"
    ],
    "answer": "120 km",
    "explanation": "Let the distance from Delhi to Gurgaon be ‘d’ km. The first 30 km he travels at his usual speed. However, the remaining‘d -30’ km he travels at a reduced speed.\nTo travel ‘d’ km he usually t akes T hr. Therefore, to travel ‘d - 30’ km he should ideally take (d−30)xT/d hr. However, this is only if he travels at his usual speed. It is given that he travelled only at 4/5th of his usual speed. Because of this he would have taken 5/4th of the time to travel the remaining distance, i .e., he takes 1/4th of the time extra. This is given to be 45 minutes (or 3/4th hr)\n1/4x(d−30)xT/d = 3/4 ........(1)\nOn the other hand, had the same thing happened after he travelled 48 km, he would have reached only 36 minutes or 34 hrs late. Hence,\n1/4x(d−48)xT/d = 3/5 ........(2)\nDividing (1) by (2) and solving for d, we get d = 120 km.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "speed",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q17",
    "question": "What will be the remainder when (1234567890123456789)24 is divided by 2187?",
    "options": [
      "3",
      "2",
      "1",
      "0"
    ],
    "answer": "0",
    "explanation": "1234567890123456789 can be expressed as (9k ) 24 .\n1234567890123456789 is divisible by 9.\n2187=37\n(Because sum of the digits is divisible by 9)So it is divisible by 3. Thus the remainder will be zero.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q18",
    "question": "Two circles are placed in an equilateral triangle as shown in the figure. What is the ratio of the area of the smaller circle to that of the equilateral triangle?",
    "options": [
      "π : 36√3",
      "π : 18√3",
      "π : 27√3",
      "π : 42√3"
    ],
    "answer": "π : 27√3",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "ratios",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q19",
    "question": "John has chocolates of types A and B in the ratio 3 : 7, while Mike has chocolates of types B and C in the ratio 5 : 4, Ram has chocolates of types C and A in the ratio 3 : 5. If there are more chocolates of type C than of type B, and more of type B than of type A, what is the minimum possible number of chocolates overall?",
    "options": [
      "78",
      "40",
      "56",
      "72"
    ],
    "answer": "78",
    "explanation": "Again, big thanks to Mukund Sukumar for excellent solution.\nLet john have 3x chocolates of type A and 7x of type B\nLet Mike have 5y chocolates of type B and 4y of type C\nLet john have 3z chocolates of type C and 5z of type A\nSo in total A=3x+5z; B=7x+5y ; C=4y+3z\nSince C>B we get solving y<3z-7x —>(1)\nSince B>A we get solving 5y>5z-4x —> (2)\nWhat gets inferred from above 2 statements is z>=3. So when x=1 , z =3, we get only y=1 as choice, for which second condition doesn’t satisfy.\nSo, when x=1,z=4, we get y<5 from first condition and when y > 3.2 from second condition. So which gives choice the only y=4.\nHence x=1,y=4 and z=4 works and is the best possible answer.\nFor these values, we get A=23,B=27,C=28.\nMinimum possible number of chocolates overall is 78.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "ratios",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-quantitative-aptitude-6-q20",
    "question": "If a three digit number ‘abc’ has 3 factors, how many factors does the 6-digit number ‘abcabc’ have?",
    "options": [
      "16",
      "24",
      "16 or 24",
      "20"
    ],
    "answer": "16 or 24",
    "explanation": "‘abc’ has exactly 3 factors, so ‘abc’ should be square of a prime number. (This is an important inference, please remember this).\nAny number of the form paqbrc will have (a + 1) (b + 1) (c + 1) factors, where p, q, r are prime. So, if a number has 3 factors, its prime factorization has to be p2.\n‘abcabc’ = ‘abc’ * 1001 or abc * 7 * 11 * 13 (again, this is a critical idea to remember)\nNow, ‘abc’ has to be square of a prime number. It can be either 121 or 169 (square of either 11 or 13) or it can be the square of some other prime number.\nWhen abc = 121 or 169, then ‘abcabc’ is of the form p3q1r1 1, which should have 4 * 2 * 2 = 16 factors.\nWhen ‘abc’ = square of any other prim e number (say 172 which is 289) , then ‘abcabc’ is of the form p1q1r1s2 , which should have 2 * 2 * 2 * 3 = 24 factors\nSo, ‘abcabc’ will have either 16 factors or 24 factors.",
    "shortcuts": [],
    "difficulty": 2,
    "topic": "general",
    "category": "quant",
    "estimatedTime": 75,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-2-1-q1",
    "question": "Raji found it difficult (A)/ to manage single-handedly the three children (B)/ who were always quarrelling (C)/ between themselves. (D)",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": "D",
    "explanation": "Correction: Raji found it difficult to manage single-handedly the three children who were always quarrelling among themselves.\nAs there are three children, 'among' is the suitable word to use instead of between.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-2-1-q2",
    "question": "Fluosol is a transparency liquid (A)/ that closely resembles water (B)/ but in fact is twice (C)/ as dense as it is. (D)",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": "A",
    "explanation": "Correction: Fluosol is a transparent liquid that closely resembles water but in fact is twice as dense as it is. 'Transparency' is a noun and transparent is its adjective form. The adjective must be used in order to describe anything.\nQuestion 3\nChoose the most appropriate sentence which can replace the ‘Underlined’ sentence.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-2-1-q3",
    "question": "Moule’s review served as a welcome encouragement to the author: Hardy set to work with renewed vigor and finished the serial ahead of time.",
    "options": [
      "served as a welcome encouragement to the author: Hardy",
      "served a welcome encouragement to Hardy, and the author",
      "was welcome as an encouragement to Hardy, the author",
      "was a welcome encouragement to the author, Hardy"
    ],
    "answer": "was a welcome encouragement to the author, Hardy",
    "explanation": "The sentence is fine as it is. All the other options are all incorrect because they contain the ‘comma splice’ error – you cannot join two complete sentences with only a comma, you need a conjunction or a colon or semicolon. The expression ‘served a welcome’ is unidiomatic; ‘served as’ is correct in this case.\nQuestion 4\nFor each sentence, choose the most appropriate option that best completes the given sentence.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-2-1-q4",
    "question": "Hawkins is ____ in his field; no other contemporary scientist commands the same respect.",
    "options": [
      "preeminent",
      "ignominious",
      "obsolete",
      "A nachronistic"
    ],
    "answer": "preeminent",
    "explanation": "The part after the semicolon tells us that Hawkins is highly respected. Hence, the only suitable word is preeminent. (All the others have negative connotations.)\n( Disparaged = criticized; ignominious = shameful; obsolete = outdated; anachronistic = in the wrong time period; preeminent = foremost, famous)\nQuestion 5\nChoose the most logical order of sentences among the given choices to construct a coherent paragraph.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-2-1-q5",
    "question": "A. Often we are prone to assume that all families are like the ones we live in.\nB. No other social institution appears more universal and unchanging.\nC. Sociology and social anthropology have over many decades conducted field research across cultures to show how the institutions of family, marriage and kinship are important in all societies and yet their character is different in different societies.\nD. Perhaps no other social entity appears more ‘natural’ than the family.",
    "options": [
      "DABC",
      "ABCD",
      "BACD",
      "DACB"
    ],
    "answer": "DABC",
    "explanation": "The sequence DABC is the most meaningful sequence from among the options.\nQuestion 6\nIn each of the questions given below from the given options select the word which is closest in meaning to the word given in the question.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-2-1-q6",
    "question": "Bairn",
    "options": [
      "Adult",
      "Chi ld",
      "Senior",
      "Sophomore"
    ],
    "answer": "Chi ld",
    "explanation": "Bairn - A child: son or daughter\nQuestion 7\nIn each of the questions given below from the given options select the word which is farthest in meaning to the word given in the question.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-2-1-q7",
    "question": "Culpable",
    "options": [
      "ineffable",
      "Incriminated",
      "innocent",
      "I ndignant"
    ],
    "answer": "innocent",
    "explanation": "The word culpable means deserving of blame. A thief is culpable for the crime of ro bbery or theft. The opposite of culpable is blameless or not deserving of blame. Because innocent means guiltless or not deserving of blame, 'innocent' is the answer.\n' Ineffable ' means unutterable or inexpressible. This is not the opposite of culpable.\n' Incriminated ' means accused. This is not the opposite of culpable.\n' Indignant ' means angry at a perceived injustice.\nQuestion 8\nSelect the lettered pair that best expresses a relationship similar to that expressed by the original pair.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-2-1-q8",
    "question": "DOMINO: MASQUERADE ::",
    "options": [
      "tango : dance",
      "violin : concert",
      "tuxedo : prom",
      "taxi : limousine"
    ],
    "answer": "tuxedo : prom",
    "explanation": "One meaning of domino is a mask or a masked costume worn to a masquerade. The tuxedo is the proper prom costume .\nQuestion 9\nChoose the most appropriate sentence which can r eplace the ‘Underlined’ phrase .",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-2-1-q9",
    "question": "Traffic was really slow on the freeway this morning because of a fender-bender in one of the westbound lanes.",
    "options": [
      "conges ted traffic",
      "automobile accident",
      "police surveillance",
      "divider damage"
    ],
    "answer": "automobile accident",
    "explanation": "The phrase ’fender-bender’ refers to an automobile accident.\nQuestion 10\nDirections for questions: Choose the most logical fit for each blank.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-2-1-q10",
    "question": "Kalyan found it hard to ______ himself from the problem he had created by producing fake documents.",
    "options": [
      "Extricate",
      "Abstain",
      "Alienate",
      "Estrange"
    ],
    "answer": "Extricate",
    "explanation": "Option \"Extricate\":\nRebuke – Criticise\nOne would never ‘rebuke oneself from something’; one would always ‘rebuke oneself for something’\nOption \"Abstain\": One would never ‘engulf oneself from something’; ‘one would always engulf oneself in something’.\nOptions \"Alienate\" vs. \"Estrange\":\nOust – Expel\nExtricate – Remove\nWhen using ‘oust’, one would never use the expression ‘ousting himself’.\nE.g. sentence: Saddam Hussein was ousted from the post of Iraqi President.\nThus Option \"Extricate\" is the perfect fit.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-3-1-q1",
    "question": "Everyone who saw the movie ‘Star Wars’ (A)/ is unanimous in their view (B)/ that it is the best science fiction movie (C)/ ever produced. (D)",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": "B",
    "explanation": "The word 'unanimous' itself means sharing the same views or opinions. Thus it is needless to repeat the same point by stating that 'Everyone who saw the movie ‘Star Wars’ is unanimous in their view'. Thus the error is in B.\nCorrection: Everyone who saw t he movie ‘Star Wars’ is unanimous that it is the best science fiction movie ever produced.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-3-1-q2",
    "question": "Though the elephant, because of its size, (A)/ appears to be a rather slow animal, (B)/ it can in fact run faster than (C)/ any other man. (D)",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": "D",
    "explanation": "Correction: Though the elephant, because of its size, appears to be a rather slow animal, it can in fact run faster than any other man can.\nIt should be evident from the sentence that the ability of an elephant is being compared to the ability of a man.\nQuestion 3\nChoose the most appropriate sentence which can replace the ‘Underlined’ sentence.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-3-1-q3",
    "question": "The publishers, unwilling to shoulder the entire risk, insisted that the author should pay half the cost of the initial print run of his controversial new book.",
    "options": [
      "The publishers, unwilling to shoulder the entire risk, insisted that the author should pay half the cost of the initial print run of his controversial new book.",
      "The publishers, unwilling to shoulder the entire risk, insisted that the author should be paying half the cost of the initial print run of the author’s controversial new book.",
      "The publishers, unwilling to shoulder the entire risk, insisted that the author pay half the cost of the initial print run of his controversial new book.",
      "Unwilling to shoulder the entire risk, the publishers insisted the author should pay half the cost of the initial print run of his controversial new book."
    ],
    "answer": "The publishers, unwilling to shoulder the entire risk, insisted that the author pay half the cost of the initial print run of his controversial new book.",
    "explanation": "The option 'The publishers, unwilling to shoulder the entire risk, insisted that the author pay half the cost of the initial print run of his controversial new book.' is the correct option. When the verb 'insist' comes, there doesn't arise a need for using the verb 'should'.\nQuestion 4\nFor each sentence, choose the most appropriate option that best completes the given sentence.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-3-1-q4",
    "question": "His musical tastes are certainly ____; he has recordings ranging from classical piano performances to rock concerts, jazz and even Chinese opera.",
    "options": [
      "antediluvian",
      "eclectic",
      "harmonious",
      "S onorous"
    ],
    "answer": "eclectic",
    "explanation": "The correct option is eclectic.\nEclectic means a mixture of what appears to be best of various doctrines, methods or styles. Thus the word fits into its premises perfectly.\nAntediluvian: ancient or antiquated; old; prehistoric.\nHarmonious: showing accord in feeling or action.\nSonorous: capable of giving out a deep resonant sound.\nQuestion 5\nChoose the most logical order of sentences among the given choices to construct a coherent paragraph.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-3-1-q5",
    "question": "A. Besides this, no organ of the government can act in a manner that violates them.\nB. While ordinary legal rights are protected and enforced by ordinary law, Fundamental Rights are protected and guaranteed by the constitution of the country.\nC. Ordinary rights may be changed by the legislature by ordinary process of law making, but a fundamental right may only be changed by amending the Constitution itself.\nD. Fundamental Rights are different from other rights available to us.",
    "options": [
      "DCBA",
      "DBCA",
      "DCAB",
      "ACDB"
    ],
    "answer": "DBCA",
    "explanation": "The correct answer is DBCA. The opening sentence can only be D. sentence B introduces us to the differences between ordinary and fundamental rights. The sentence C demarcates the two kinds of rights further and sentence A concludes it. Thus the sequence is DBCA\nQuestion 6\nIn each of the questions given below from the given options select the word which is farthest in meaning to the word given in the question.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-3-1-q6",
    "question": "Infirm",
    "options": [
      "hospitable",
      "E questria n",
      "tremulous",
      "R obust"
    ],
    "answer": "R obust",
    "explanation": "The word infirm means feeble or weak in body or health. A very old dog would likely be infirm. The opposite of infirm is\nstrong in health. Because robust means strong and healthy, 'robust' is the answer.\n'hospitable' means receptive or open. This is not the opposite of infirm.\n'equestrian' means mounted on horseback. This is not the opposite of infirm.\n'tremulous' means quivering or fearful. This is not the opposite of infirm.\nQuestion 7\nSelect the lettered pair that best expresses a relationship similar to that expressed by the original pair.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-3-1-q7",
    "question": "ETHEREAL: EMPYREAL ::",
    "options": [
      "celestial : deferential",
      "earnest : saccharine",
      "fastidious : foolhardy",
      "obsequious : sycophantic"
    ],
    "answer": "obsequious : sycophantic",
    "explanation": "To be ethereal is to be empyreal; both terms refe r to the heavenly or unearthly. Similarly, to be obsequious is to be s ycophantic; both terms refer to behaviour that is excessively fawning, servile, or submissive.\nQuestion 8\nIn each of the questions given below from the given options select the word which is closest in meaning to the word given in the question.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-3-1-q8",
    "question": "Prosaic",
    "options": [
      "Pedestrian",
      "Creative",
      "Exceptional",
      "Different"
    ],
    "answer": "Pedestrian",
    "explanation": "Prosaic means pertaining to or having the characteristics of prose. It also means simple and commonplace to the point of being boring.\nPedestrian has a meaning of ordinary, dull, everyday; unexceptional. Thus the words 'prosaic' and 'pedestrian' are synonymous.\nQUESTION 9\nChoose the most appropriate sentence which can r eplace the ‘Underlined’ Phrase .",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-3-1-q9",
    "question": "People cry over spilt milk when they do not execute tasks with proper planning.",
    "options": [
      "weep",
      "repent",
      "fail",
      "are indifferent"
    ],
    "answer": "repent",
    "explanation": "’To cry over spilt milk’ is to be unhappy about what cannot be undone. The word ’repent’ also has a similar meaning.\nQuestion 10\nDirections for questions: Choose the most logical fit for each blank.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-3-1-q10",
    "question": "People often revel under the impression that only the wretched and less educated people use slang, but this idea is totally _________.",
    "options": [
      "accurate",
      "popular",
      "erroneous",
      "I neffective"
    ],
    "answer": "erroneous",
    "explanation": "Anticipated answer:- The answer one could come up through proactive solving will be ‘incorrect’. The answer closest to ‘incorrect’ among the answer options is option \"erroneous\" (Erroneous – full of errors)\nC ontrast sign:- But. Due to the presence of the conjunction ‘but’, the answer has to be negative in this context. Thus ‘accurate’ and ‘popular’ cannot be answers.\n‘Ineffective’ does not exactly capture the opposing-idea-relationship expected in this question. Thus ‘erroneous’ is the right answer.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-4-1-q1",
    "question": "The University has announced that (A)/ everyone will take the examination now (B)/ will receive their results within (C)/ eight weeks at the latest. (D)",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": "C",
    "explanation": "Correction: The University has announced that everyone who takes the examination now will receive their results within eight weeks at the latest.\nThere needs to be a connection between the subject and the verb which is provided by replacing 'will' by 'who'.\nQuestions 2 to 3\nChoose the most appropriate sentence which can replace the ‘Underlined’ sentence.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-4-1-q2",
    "question": "It is probable that the prototype cellular motor might be ready for testing around the end of next year.",
    "options": [
      "might be ready for testing around the end of next year",
      "may be ready for testing about the end of next year",
      "might be ready for testing toward next year’s end",
      "will be ready for testing toward the end of next year"
    ],
    "answer": "will be ready for testing toward the end of next year",
    "explanation": "As the end of the year is the time being mentioned and as it is in the future the most appropriate word to use will be 'toward'. Thus the answer is 'will be ready for testing toward the end of next year'.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-4-1-q3",
    "question": "China’s economy continues to flourish this year: industrial production grew, inflation has eased, and the trade surplus swelled .",
    "options": [
      "grew, inflation has eased, and the trade surplus swelled",
      "is growing, inflation is easing and the trade surplus is swelling",
      "has grown, inflation eased, and the trade surplus has swelled",
      "has grown, inflation eased, and the trade surplus is swelling"
    ],
    "answer": "is growing, inflation is easing and the trade surplus is swelling",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-4-1-q4",
    "question": "The refugee's poor grasp of English is hardly an ____ problem; she can attend classes and improve within a matter of months.",
    "options": [
      "implausible",
      "insuperable",
      "i nconsequential",
      "evocative"
    ],
    "answer": "insuperable",
    "explanation": "The word has to mean 'impossible to be overcome.' The word for it is 'insuperable'\nImplausible: not plausible, unlikely.\nInconsequential: having no consequence. Not consequential.\nEvocative: that evokes a memory, mood, feeling or image.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-4-1-q5",
    "question": "The cricket match seemed ____ to our guests; they were used to watching sports in which the action is over in a couple of hours at the most.",
    "options": [
      "unintelligible",
      "inconsequential",
      "interminable",
      "implausible"
    ],
    "answer": "interminable",
    "explanation": "The word has to mean too long or ceaseless.\nInterminable means existing without interruption or end. Thus the answer is interminable.\nUnintelligible: unable to be understood.\nInconseq uential: having no consequence. not consequential.\nImplausible: not plausible, unlikely.\nQuestion 6\nChoose the most logical order of sentences among the given choices to construct a coherent paragraph.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-4-1-q6",
    "question": "A. Right to Equality provides for equal access to public places like shops, hotels, places of entertainment, wells, bathing Ghats and places of worship.\nB. This right is very important because our society did not practice equal access in the past.\nC. There cannot be any discrimination in this access on the basis of caste, creed, colour, sex, religion, or place of birth.\nD. It also prohibits any discrimination in public employment on any of the above mentioned basis.",
    "options": [
      "ACDB",
      "BCDA",
      "DBCA",
      "ACBD"
    ],
    "answer": "ACDB",
    "explanation": "The sentence A is the opening sentence. Sentence C follows sentence A by elaborating on the freedom to access certain places. D follows C by referring to the differences mentioned in C. B concludes the paragraph. Thus the answer is ACDB.\nQuestion 7\nIn each of the questions given below from the given options select the word which is farthest in meaning to the word given in the question.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-4-1-q7",
    "question": "Yoke",
    "options": [
      "mar",
      "Fell",
      "Pervert",
      "split"
    ],
    "answer": "split",
    "explanation": "The word yoke means to unite or join together. Two oxen are yoked if they are tied togethe r to pull a wagon. The opposite of yoke is separate. Because split means to divide or separate, 'split' is the answer.\n'mar' means to damage. This is not the opposite of yoke.\n'fell' means to chop down. This is not the opposite of yoke.\n'pervert ' means to misuse. This is not the opposite of yoke.\nQuestion 8\nSelect the lettered pair that best expresses a relationship similar to that expressed by the original pair.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-4-1-q8",
    "question": "TRIPTYCH : PANEL ::",
    "options": [
      "triangle : hypotenuse",
      "circle : arc",
      "cathedral : nave",
      "blossom : sepal"
    ],
    "answer": "triangle : hypotenuse",
    "explanation": "A triptych is a hinged set of pictures or carvings with three panels. The\nHypotenuse is one of three sides of a triangle.\nQuestion 9\nIn each of the questions given below from the given options select the word which is closest in meaning to the word given in the question.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-4-1-q9",
    "question": "Egregious",
    "options": [
      "Outrageous",
      "Minor",
      "Secondary",
      "Wonderful"
    ],
    "answer": "Outrageous",
    "explanation": "Egregious means outrageously bad or shocking. Thus outrageous is the synonymous word.\nQUESTION 10\nChoose the alternative to replace the underlined part.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-4-1-q10",
    "question": "Great entrepreneurs always follow the carrot and stick policy.",
    "options": [
      "far-seeking",
      "reward and punish",
      "profit-oriented",
      "adaptable"
    ],
    "answer": "reward and punish",
    "explanation": "\"Carrot and Stick\" is an idiom that refers to a policy of offering a combination of rewards and punishment to induce behavio u r. It is named in reference to a cart driver dangling a carrot in front of a mule and holding a stick behind it. The mule would move towards the carrot because it wants the reward of food, while also moving away from the stick behind it, since it does not want the punishment of pain, thus drawing the cart.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-5-r-1-q1",
    "question": "She was a young girl with a pretty face, (A)/ very well trained in dancing (B)/ and who gave much promise of (C)/ a brilliant career as a film artist. (D)",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": "C",
    "explanation": "Correction: She was a young girl with a pretty face, very well trained in dancing and she gave much promise of a brilliant career as a film artist. 'Who' must be replaced with 'she'.\nQuestion 2\nChoose the most appropriate sentence which can replace the ‘Underlined’ sentence.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-5-r-1-q2",
    "question": "A conjunction is used to connect words and sentences together.",
    "options": [
      "words and sentences together.",
      "words or sentences together.",
      "words and sentences.",
      "words or sentences."
    ],
    "answer": "words or sentences.",
    "explanation": "Together is redundant. The conjunction does not couple words to sentences; it joins words, or it joins sentences. Hence the meaning is clearest in \"words or sentences\"\nQuestion 3\nFor each sentence, choose the most appropriate option that best completes the given sentence.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-5-r-1-q3",
    "question": "In one shocking instance of ____ research, one of the nation’s most influential researchers in the field of genetics reported on experiments that were never carried out and published deliberately ____ scientific papers on his non-existent.",
    "options": [
      "comprehensive, abstract",
      "theoretical, challenging",
      "fraudulent, deceptive",
      "erroneous, impartial"
    ],
    "answer": "fraudulent, deceptive",
    "explanation": "The sentence speaks about experiments that never were carried out. This is an event of fraudulence. In that case, the research results published will be deceptive in nature.\nSo the answer is \"fraudulent, deceptive\"\nIn each of the questions given below from the given options select the word which is closest in meaning to the word given in the question.\nQuestion 4\nChoose the most appropriate sentence which can r eplace the ‘Underlined’ phrase .",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-5-r-1-q4",
    "question": "His wrong decision was just like the act of a giddy goat.",
    "options": [
      "a slow act",
      "a brave act",
      "a foolish act",
      "an obedient act"
    ],
    "answer": "a foolish act",
    "explanation": "The phrase ’act of a giddy goat’ means to behave foolishly.\nQuestion 5\nChoose the most logical order of sentences among the given choices to construct a coherent paragraph.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-5-r-1-q5",
    "question": "A. The provisions of the 73rd amendment were not made applicable to the areas inhabited by the Adivasi populations in many States of India.\nB. Therefore, the new act protects the rights of these communities to manage their resources in ways acceptable to them.\nC. In 1996, a separate act was passed extending the provisions of the Panchayat system to these areas.\nD. Many Adivasi communities have their traditional customs of managing common resources such as forests and small water reservoirs, etc.",
    "options": [
      "CDBA",
      "BDAC",
      "ACDB",
      "ADCB"
    ],
    "answer": "ACDB",
    "explanation": "There is an AC link in the paragraph. Sentence A speaks about the act and its limitation. In Sentence B, that limitation is rectified. Among the four sentence, only Sentence A can be the topic sentence. So with this, option \"ACDB\" is the correct sequence of the paragraph.\nQuestion 6\nIn each of the questions given below from the given options select the word which is farthest in meaning to the word given in the question.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-5-r-1-q6",
    "question": "Indulge",
    "options": [
      "abstain",
      "quaff",
      "regress",
      "absolve"
    ],
    "answer": "abstain",
    "explanation": "The word indulge means to give in to a craving or desire. To indulge is to willingly give in to a temptation. The opposite of\nIndulge is to refrain from a desire. Because abstain means to refrain deliberately from something, 'abstain' is the answer.\n'Quaff' means to drink deeply or with pleasure. This is not the opposite of indulge.\n'Regress' means to move backward. This is not the opposite of indulge.\n'Absolve' means to clear from blame. This is not the opposite of indulge.\nQuestions 7 to 10\nRead the passage given below and choose the best option for the blanks.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-5-r-1-q7",
    "question": "Which of the following best fits blank 19?",
    "options": [
      "condemn",
      "accuse",
      "charge",
      "blame"
    ],
    "answer": "blame",
    "explanation": "Keyword: ‘Themselves’\n• ‘Blame’ is to hold responsible for a fault. In this particular passage, the fault is that companies are failing to grow (“lack of growth”).\n• ‘Charge’ and ‘accuse’ are also words which mean ‘holding responsible for a fault’, but the fault in both these cases is usually very strong (e.g.: A crime).\n• Moreover, ‘charge’ and ‘accuse’ are NEVER used to refer to one holding oneself responsible. It is usually used to refer to, say “X holding Y responsible for a fault”.\nE.g . the police charged him with stealing jewels from the store.\nThey accused him of stealing jewels from the store.\n• ‘Condemn’ means official reprimand/criticism.\nE.g.: The Principal condemned him for stealing school property.\nSince ‘condemn’ is OFFICIAL reprimand/criticism (criticism which comes from an official higher authority), it is never used while referring to oneself.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-5-r-1-q8",
    "question": "Which of the following best fits blank 20?",
    "options": [
      "admission",
      "entry",
      "access",
      "entrance"
    ],
    "answer": "access",
    "explanation": "• All four answer options share a meaning: ‘entry’ to some place.\n• ‘Access’ has another meaning which is unique to the four answer options: ‘Ability to use’.\nE.g.: Terrorists have access to the latest weapons in the world.\nThis meaning of ‘having the ability to use’ is what fits best in the sentence.\n‘Investment capital’ means ‘investment money’. It is illogical to talk about entry/admission/entrance to money. The only logical option would be to talk about whether or not money is available and whether it can be utilized.\n“...you shouldn’t waste much time wondering whether you have access to investment capital”, meaning you shouldn’t waste time wondering whether or not you have availability to investment capital.\n• All four answer options share a meaning: ‘entry’ to some place.\n• ‘Access’ has another meaning which is unique to the four answer options: ‘Ability to use’.\nE.g.: Terrorists have access to the latest weapons in the world.\nThis meaning of ‘having the ability to use’ is what fits best in the sentence.\n‘Investment capital’ means ‘investment money’. It is illogical to talk about entry/admission/entrance to money. The only logical option would be to talk about whether or not money is available and whether it can be utilized.\n“...you shouldn’t waste much time wondering whether you have access to investment capital”, meaning you shouldn’t waste time wondering whether or not you have availability to investment capital.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-5-r-1-q9",
    "question": "Which of the following best fits blank 21?",
    "options": [
      "currency",
      "money",
      "cash",
      "banknote"
    ],
    "answer": "currency",
    "explanation": "• ‘Currency’, ‘cash’ and ‘banknote’ refer to the same thing: Money\n• ‘Exchange rate’ is a formal business term. That is also the keyword here.\n• Exchange of money happens between different countries. For example, exchange of money can be done between the USA and India. While doing that, one does not exchange 5000 cash/banknotes/money of India with 5000 cash/banknotes/money of the USA. One exchanges 5000 rupees, which is the CURRENCY of India with 93 dollars, which is the CURRENCY of the USA.\nHence ‘currency’ goes together with ‘exchange rate’.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-5-r-1-q10",
    "question": "Which of the following best fits blank 22?",
    "options": [
      "specify",
      "categories",
      "identify",
      "allocate"
    ],
    "answer": "identify",
    "explanation": "ELIMINATION OF ‘CATEGORIES’:\n• “more likely to ___”. We are looking for a verb (because of the presence of ‘to’—to+verb = infinitive). Thus we eliminate ‘categories’ (option B), which is not a verb.\nELIMINATION OF ‘ALLLOCATE’:\n• ‘Allocate’ means allot/distribute. It would be illogical to talk about distributing/allotting barriers to success.\n• ‘Allocate’ is best used when referring to resources.\nE.g.: Half of the country’s budget was allocated to the educational sector.\n‘SPECIFY’ vs. ‘IDENTIFY’:\n• From a logical perspective, ‘Specify’ and ‘identify’ are good fits for the blank. To discriminate between the two, we look for a key phrase in the second part of the sentence: “by looking in the mirror”.\n• There are two actions in the sentence.\nAction 1: Specify/identify the main barrier to success\nAction 2: by looking in the mirror\nAction 2 is the method/means of achieving Action 1 (found by the word ‘by’)\n• If one has to ‘specify’ something, the second part, which mentions the means/method of doing it, is not relevant. If ‘specify’ were the answer, the sentence would be complete even without Action 2.\nE.g.: The barrier to success was specified clearly.\n• Only while ‘identifying’ the barrier would one need a means/method of identification.\n“...identify the main barrier to greater success”\nHow? --- “by looking in the mirror”",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-6-r-q1",
    "question": "I do not wish to make a formal (A)/ complaint, but I would have been better pleased (B)/if you gave the (C)/award to the person who best deserved it.(D)/",
    "options": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": "C",
    "explanation": "Change gave to had given because the verb in the previous clause is in the past conditional tense.\nQuestion 2\nChoose the most appropriate sentence which can r eplace the ‘Underlined’ phrase .",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-6-r-q2",
    "question": "He refused to co-operate with me, and thus threw a spanner on my plan.",
    "options": [
      "executed",
      "left me alone with",
      "sabotaged",
      "restructured"
    ],
    "answer": "sabotaged",
    "explanation": "’To throw a spanner on something’ is to spoil it from succeeding.\nQuestion 3\nDirections for questions: Choose the most logical fit for each blank.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-6-r-q3",
    "question": "Shilpa Shetty was cleared of all allegations; she was free of all charges ______against her.",
    "options": [
      "accused",
      "alleged",
      "levelled",
      "vindicated"
    ],
    "answer": "levelled",
    "explanation": "The word in the blank is an adjective for ‘charges’.\nOption \"accused\":\nAccused – To charge (someone) with an offence\n‘Accused’ is always followed by who is being accused.\nE.g. sentence: He accused me of stealing his notebook.\n‘Accused’ is always followed by the preposition ‘of’. In the given sentence, the word immediately following the blank is NOT ‘of’. Hence option a is eliminated.\nOption \"alleged\":\nAlleged – Claim without proof\nE.g. sentence: One of the Delhi gang-rapists alleged that he was innocent of the crime.\n‘Alleged’ is not an adjective, but a verb. Thus it cannot be chosen as the answer.\nOption \"vindicated\":\nVindicated – To clear of blame/suspicion\nE.g. sentence: He felt vindicated after all the charges were dropped.\n‘Vindicated’ is used to describe people and NOT ‘charges’.\nOption \"levelled\":\nLevelled (v.) – Directed\nThis meaning fits perfectly when describing ‘charges’. This is thus the answer.\nQuestion 4\nChoose the most logical order of sentences among the given choices to construct a coherent paragraph.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-6-r-q4",
    "question": "A. There are more than 20 major languages and several hundred minor ones and it is the home of several major religions.\nB. There are several million indigenous peoples living in different parts of the country.\nC. In spite of all these diversities we share a common land mass.\nD. India is a land of continental proportions and immense diversities.",
    "options": [
      "DABC",
      "DCBA",
      "CABD",
      "BACD"
    ],
    "answer": "DABC",
    "explanation": "It is very clear that only D can be the beginning sentence and C the ending sentence. The correct sequence is \"DABC\".\nQuestions 5 to 10\nRead the passage given below and choose the best option for the blanks.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-6-r-q5",
    "question": "Which of the following best fits blank 23?",
    "options": [
      "achieved",
      "drawn",
      "acquired",
      "obtained"
    ],
    "answer": "drawn",
    "explanation": "• Certain usages in English are always set pairs. One such example is ‘drawing conclusions’.\n• We think in terms of images. Dan Brown, the famous author of ‘The Da Vinci Code’ once talked about his childhood in an interview. When he grew up, Brown never had a TV at home. He looked back at having grown up without a TV, with great happiness. He said, “When you watch a lot of TV, you stop thinking because television paints the picture for you. But when you read books, you paint your own pictures.”\n• For example, when you read a biography of Adolph Hitler, you form an opinion (conclusion) about him. The conclusion/opinion you form is the image you paint/draw in your mind. Thus the process of reading and understanding a piece of work is similar to looking at a picture and understanding it. Hence the usage of ‘drawing conclusions’.\n• Moreover, there is the usage of ‘drawing (withdrawing) money from an ATM’ or ‘drawing water from a well’. This usage of ‘drawing conclusions’ is of the same kind.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-6-r-q6",
    "question": "Which of the following best fits blank 24?",
    "options": [
      "clear",
      "distinct",
      "resolved",
      "defined"
    ],
    "answer": "clear",
    "explanation": "“The research makes the reason ____: management behaviour is often the root of the problem.”\nObservations made from the aforementioned sentence:",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-6-r-q7",
    "question": "Which of the following best fits blank 25",
    "options": [
      "foundation",
      "ground",
      "base",
      "root"
    ],
    "answer": "root",
    "explanation": "• All the answer options seem to be similar, for all the options refer to a starting point.\n• The accepted and popular way of looking at a problem is like looking at a tree. Just like how a tree grows when uncut; a problem grows and becomes big ger when unchecked. The cause ( starting point) of problem is usually referred to as the ‘root’ of the problem.\nPopular usages:",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-6-r-q8",
    "question": "Which of the following best fits blank 26?",
    "options": [
      "notified",
      "expressed",
      "informed",
      "addressed"
    ],
    "answer": "expressed",
    "explanation": "Keyword: “View”\nELIMINATION OF ‘NOTIFIED’ AND ‘INFORMED’:• ‘Notified’ and ‘informed’ are synonyms. Both words are used usually only when referring to a piece of information, not when used with views/opinions.\nE.g. 1: The staff members were informed of the delay in the meeting.\nE.g. 2: The staff members were notified of the delay in the meeting.\nELIMINATION OF ‘ADDRESSED’:\n• ‘Addressed’ can have two meanings: ‘Talk to (a gathering)’ and ‘deal with (an issue)’.\nE.g. 1: The Prime Minister addressed the people of India on the eve of Independence Day.\nE.g. 2: The Prime Minister addressed the issue of terrorism during his Independence Day speech.\nIt is again not applicable to be used with views/opinions.\n• A view is a personal opinion put forward by someone. Hence it is only logical to say that views are ‘expressed’.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-6-r-q9",
    "question": "Which of the following best fits blank 27?",
    "options": [
      "caught",
      "occupied",
      "held",
      "contained"
    ],
    "answer": "occupied",
    "explanation": "“...day to day issues ____ all their time.”\nKeyword: Time\n• ‘Contained’ and ‘caught’ are words which are never used with ‘time’. ‘Contained’ in particular is more often used with specific quantified objects. Hence they are eliminated.\n• ‘Held’ when used as ‘held up’ would mean ‘delay’, a context relevant to ‘time’.\nE.g.: I was held up in traffic and was thus late to the meeting.\nHowever, due to the absence of the word ‘up’ following the blank, ‘held’ cannot be used here.\n• ‘Occupied’ would be the best fit, for it means ‘filling up (time or space)’.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs-ninja-verbal-ability-6-r-q10",
    "question": "Which of the following best fits blank 28?",
    "options": [
      "significance",
      "meaning",
      "definition",
      "sense"
    ],
    "answer": "significance",
    "explanation": "Keyword: Minor\n• Let X be the answer. X, in the sentence, is attributed to as minor X. This means that X is an item which has got several degrees/levels: Major level and minor level.\n• ‘Meaning’, ‘definition’ and ‘sense’ are all items which will never go together with ‘minor’, because it is illogical to talk about several degrees/levels of all of them.\nI.e. There is no major/minor meaning, no major/minor definition and no major/minor sense. All three items are very singular, in the sense that they are either present or absent.\nE.g.: Meaning and lack of meaning, sense and lack of sense, definition and lack of definition.\n• ‘Significance’ means importance. There can be levels of significance, i.e. major and minor importance. Thus ‘significance’ is the best fitting answer.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "vocab",
    "category": "verbal",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-02t-q1",
    "question": "#include is called",
    "options": [
      "Pre processor directive",
      "Inclusion directive",
      "File inclusion directive",
      "None of the mentioned"
    ],
    "answer": "Pre processor directive",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-02t-q2",
    "question": "The format identifier ‘%i’ is also used for _____ data type?",
    "options": [
      "char",
      "Int",
      "Float",
      "double"
    ],
    "answer": "Int",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-02t-q3",
    "question": "What is the size of an int data type?",
    "options": [
      "4 Bytes",
      "8 Bytes",
      "Depends on the system/compiler",
      "Cannot be determined"
    ],
    "answer": "Depends on the system/compiler",
    "explanation": "The size of the data types depend on the system.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-02t-q4",
    "question": "Which of the following cannot be a structure member?",
    "options": [
      "Another structure",
      "Function",
      "Array",
      "None of the mentioned"
    ],
    "answer": "Function",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-02t-q5",
    "question": "Which of the following structure declaration will throw an error?",
    "options": [
      "struct temp{}s;\nmain(){}",
      "struct temp{};\nstruct temp s;\nmain(){}",
      "struct temp s;\nstruct temp{};\nmain(){}",
      "None of the mentioned"
    ],
    "answer": "None of the mentioned",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-02t-q6",
    "question": "For the following expression to work, which option should be selected. (In C)\nstring p = “HELLO”;",
    "options": [
      "typedef char [] string",
      "typedef char * string",
      "Both (a) and (b)",
      "Such expression cannot be generated in C"
    ],
    "answer": "typedef char * string",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-02t-q7",
    "question": "What is the default return-type of getchar()?",
    "options": [
      "int",
      "char",
      "char*",
      "Reading character doesn’t require a return-type"
    ],
    "answer": "int",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-02t-q8",
    "question": "The value of EOF is_____.",
    "options": [
      "1",
      "0",
      "-1",
      "10"
    ],
    "answer": "-1",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-02t-q9",
    "question": "If there is any error while opening a file, fopen will return?",
    "options": [
      "Nothing",
      "EOF",
      "Depends on compiler",
      "NULL"
    ],
    "answer": "NULL",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-02t-q10",
    "question": "union test\n{\nint x;\nchar arr[8];\nint y;\n};\nint main()\n{\nprintf(\"%d\", sizeof(union test));\nreturn 0;\n}\nPredict the output of above program. Assume that the size of an integer is 4 bytes and size of character is 1 byte. Also assume that there is no alignment needed.",
    "options": [
      "8",
      "16",
      "12",
      "Compiler error"
    ],
    "answer": "8",
    "explanation": "When we declare a union, memory allocated for a union variable of the type is equal to memory needed for the largest member of it, and all members share this same memory space. In above example, \"char arr[8]\" is the largest member. Therefore size of union test is 8 bytes .",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-03t-q1",
    "question": "Assume int is 4 bytes, char is 1 byte and float is 4 bytes. Also, assume that pointer size is 4 bytes (i.e. typical case)\nchar *p;\nint *q;\nfloat *r;\nsizeof(p);\nsizeof(q);\nsizeof(r);",
    "options": [
      "4 4 4",
      "1 4 4",
      "1 4 8",
      "None of the mentioned"
    ],
    "answer": "4 4 4",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-03t-q2",
    "question": "Continue statement used for",
    "options": [
      "to continue the next line of code",
      "to stop the current iteration and begin the next iteration from the beginning",
      "to handle runtime error",
      "None of the mentioned"
    ],
    "answer": "to stop the current iteration and begin the next iteration from the beginning",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-03t-q3",
    "question": "What will be the output of following program?",
    "options": [
      "error",
      "0",
      "10",
      "Garbage value"
    ],
    "answer": "0",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-03t-q4",
    "question": "What is the use of \\r in C?",
    "options": [
      "used to insert a vertical tab",
      "used to insert a tab",
      "places cursor at the end of line",
      "places cursor at the start of line"
    ],
    "answer": "places cursor at the start of line",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-03t-q5",
    "question": "In the context of the following printf() in C, pick the best statement.\ni) printf(\"%d\",8);\nii) printf(\"%d\",090);\niii) printf(\"%d\",00200);\niv) printf(\"%d\",0007000);",
    "options": [
      "Only i) would compile. And it will print 8.",
      "Both i) and ii) would compile. i) will print 8 while ii) will print 90",
      "All i), ii), iii) and iv) would compile successfully and they will print 8, 90, 200 & 7000 respectively.q",
      "Only i), iii) and iv) would compile successfully. They will print 8, 128 and 3584 respectively."
    ],
    "answer": "Only i), iii) and iv) would compile successfully. They will print 8, 128 and 3584 respectively.",
    "explanation": "As per C standard, \"An octal constant consists of the prefix 0 optionally followed by a sequence o f the digits 0 through 7 only.\" So 090 isn’t valid because 0 prefix is used for octal but 9 isn’t valid octal-digit.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-03t-q6",
    "question": "What’s going to happen when we compile and run the following C program?",
    "options": [
      "Compile Error.",
      "No compile error but it will run into infinite loop printing FACE",
      "No compile error and it’ll print FACE 10 times",
      "No compile error but it’ll print FACE 9 times."
    ],
    "answer": "No compile error and it’ll print FACE 10 times",
    "explanation": "Basically, even though for loop doesn’t have any of three expressions in parenthesis, the initialization, control and increment has been done in the body of the loop. So j would be initialized to 0 via first if. This if itself would be executed only once due to i--. Next if and else blocks are being used to check the value of j and existing the loop if j becomes 10. Please note that j is getting incremented in printf even though there’s no format specifier in format string. That’s why FACE would be printed for j=0 to j=9 i.e. a total of 10 times.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-03t-q7",
    "question": "The compiler in C ignores all test till the end of line using",
    "options": [
      "//",
      "/",
      "*/",
      "None of the mentioned"
    ],
    "answer": "//",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-03t-q8",
    "question": "UML Meaning is",
    "options": [
      "Unique modeling language",
      "Unified modeling language",
      "Unified modern language",
      "Unified master language"
    ],
    "answer": "Unified modeling language",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-03t-q9",
    "question": "Disadvantage of array in C is",
    "options": [
      "We can easily access each element",
      "It is necessary to declare too many variables",
      "It can store only one similar type of data",
      "None of the mentioned"
    ],
    "answer": "It can store only one similar type of data",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-03t-q10",
    "question": "What is wild pointer in C",
    "options": [
      "a pointer which we need to write in future",
      "a pointer which has had naming convention",
      "a pointer which had no limit",
      "a pointer which has not initialized"
    ],
    "answer": "a pointer which has not initialized",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-04t-r-q1",
    "question": "What is the purpose of ftell?",
    "options": [
      "To get the current file name",
      "To get the current file status",
      "To get the current file attributes",
      "To get the current file position"
    ],
    "answer": "To get the current file position",
    "explanation": "ftell() is used to find out the position of file pointer in the file with respect to starting of the file.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-04t-r-q2",
    "question": "What will be the output of the below code?",
    "options": [
      "NO output",
      "NO",
      "Successfully complied but no output",
      "ERROR"
    ],
    "answer": "Successfully complied but no output",
    "explanation": "No error and if condition fails so there is no output",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-04t-r-q3",
    "question": "What is the output of the below-mentioned programme?",
    "options": [
      "sizeof(i) = 2",
      "sizeof(i) = 1",
      "compile Error",
      "None of these"
    ],
    "answer": "sizeof(i) = 1",
    "explanation": "int size is 2bytes or 4 bytes. Char size is 1 byte. Int is defined as Char. Sizeof(i) = 1",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-04t-r-q4",
    "question": "For passing command line argument the main function should be like",
    "options": [
      "int main(int argc, char *argv[])",
      "int main(int argc)",
      "int main(char *argv[])",
      "int main(char *argv[], int argc)"
    ],
    "answer": "int main(int argc, char *argv[])",
    "explanation": "Command Line Arguments Syntax",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-04t-r-q5",
    "question": "Where the local variables are stored?",
    "options": [
      "Disk",
      "Stack",
      "Heap",
      "OS"
    ],
    "answer": "Stack",
    "explanation": "Local Variable is stored in stack",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-04t-r-q6",
    "question": "Which of the below functions is NOT declared in string.h?",
    "options": [
      "strptr ()",
      "strcpy ()",
      "strlen()",
      "strupr()"
    ],
    "answer": "strptr ()",
    "explanation": "strptr() is not declared",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-04t-r-q8",
    "question": "What is the format of conditional operator?",
    "options": [
      "Condition? true value : false value",
      "Condition! true value : false value",
      "Condition? false value : true value",
      "Condition? true value : : false value"
    ],
    "answer": "Condition? true value : false value",
    "explanation": "Syntax",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-04t-r-q9",
    "question": "What is recursion?",
    "options": [
      "Looping",
      "A function calls another function repeatedly",
      "A function calls repeatedly",
      "A function calls itself repeatedly"
    ],
    "answer": "A function calls itself repeatedly",
    "explanation": "In recursion, function calls itself repeatedly",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-04t-r-q10",
    "question": "A memory leak happens when?",
    "options": [
      "A program allocates memory in heap but forget to delete it.",
      "A program allocates memory in stack.",
      "When an unsigned pointer is freed using free function.",
      "When realloc() is called on a pointer that is not allocated"
    ],
    "answer": "A program allocates memory in heap but forget to delete it.",
    "explanation": "Memory leak occurs when programmers create a memory in heap and forget to delete it.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-05t-q1",
    "question": "What the below statement will print if a=5? printf(\"%d %d\",a, !a++);",
    "options": [
      "5 0",
      "6 0",
      "5 1",
      "6 1"
    ],
    "answer": "6 0",
    "explanation": "Values in the function get passed from right to left. First !a++ get processed which pass zero as argument and make a equal to 6",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-05t-q2",
    "question": "What is the output?",
    "options": [
      "1",
      "False",
      "Compiler Error",
      "No output"
    ],
    "answer": "False",
    "explanation": "In this program we are comparing the addresses contained by ptr & ptr1 not the value at those addresses and pointers ptr and ptr1 have the addresses of different variables so above condition is false",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-05t-q3",
    "question": "How many times main() will get called?",
    "options": [
      "Error",
      "Infinite times",
      "No output",
      "None of these\nAnswe r : B\nExplanation :\nThere is no condition in the main() to stop the recursive calling of the main() hence it will be called infinite no of times."
    ],
    "answer": "Error",
    "explanation": "There is no condition in the main() to stop the recursive calling of the main() hence it will be called infinite no of times.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-05t-q4",
    "question": "Comment on the following?\nconst int *ptr;",
    "options": [
      "You cannot change the value pointed by ptr",
      "You can change the value of the pointer",
      "None of these",
      "You can change the pointer as well as the value pointed by it"
    ],
    "answer": "You cannot change the value pointed by ptr",
    "explanation": "Value of the pointer cannot be changed when const keyword is used",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-05t-q5",
    "question": "What is the output of the following program?",
    "options": [
      "NULL",
      "Error",
      "0",
      "1"
    ],
    "answer": "1",
    "explanation": "ASCII codes are compared. ’A’ is 65 while ’a’ is 97",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-05t-q7",
    "question": "Which of the following does not initialize ptr to null (assuming variable declaration of a as int a=0)?",
    "options": [
      "int *ptr = &a",
      "int *ptr = &a - &a",
      "int *ptr = a -a",
      "None of these"
    ],
    "answer": "int *ptr = &a",
    "explanation": "In *ptr = &a, the address of a is stored in pointer. In other cases, it is 0",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-05t-q9",
    "question": "T he statement that transfers control to the beginning of the loop is called ______ _.",
    "options": [
      "Break statement",
      "Exit statement",
      "Goto statement",
      "continue statement"
    ],
    "answer": "continue statement",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-05t-q10",
    "question": "W hat is the output of following program?",
    "options": [
      "6 6.500000",
      "6 6.5",
      "6 6.000000",
      "None of these"
    ],
    "answer": "6 6.000000",
    "explanation": "S olution of 13/2 is obtained as an integer and decimal values are dropped before assigning to f",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-06t-q1",
    "question": "What will be the output of the below program?",
    "options": [
      "Runtime Error",
      "Compile Time error",
      "1",
      "10"
    ],
    "answer": "1",
    "explanation": "scanf returns the number of items successfully read and not 10. Here 10 is input and scanf reads the 10 and return 1.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-06t-q2",
    "question": "Memory allocation using malloc() is done in?",
    "options": [
      "static area",
      "Heap area",
      "stack area",
      "disc"
    ],
    "answer": "Heap area",
    "explanation": "Dynamic memory allocation is done in Heap",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-06t-q3",
    "question": "Comment the output of below two print statements.\nInteger x = 10, y = 20, z = 5 print x*y/z+x.\nprint x*(y/z ) + x.",
    "options": [
      "Same output",
      "Differ by 20",
      "Differ by 10",
      "Differ by 15"
    ],
    "answer": "Same output",
    "explanation": "Solving 2 equations, we get 50",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "syllogism",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-06t-q4",
    "question": "The best data structure to check whether an arithmetic expression has balanced parenthesis is a",
    "options": [
      "Queue",
      "Stack",
      "Tree",
      "Linked List"
    ],
    "answer": "Stack",
    "explanation": "Stacks can check equal pair/ balanced pair of parenthesis efficiently. Whenever we get an opening parenthesis we can push it on the stack and when we get the corresponding closing parenthesis, we can pop it.\nAfter performing all push and pop operations, if at the end of the expression stack becomes empty then the expression has a balanced parenthesis",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-06t-q5",
    "question": "Which of the below functions is Not declared in math.h?",
    "options": [
      "pow()",
      "hex()",
      "sqrt()",
      "cos()"
    ],
    "answer": "hex()",
    "explanation": "hex() is not declared in math.h",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-06t-q6",
    "question": "What is the best case and worst case complexity of ordered linear search?",
    "options": [
      "O(nlogn), O(logn)",
      "O(logn), O(nlogn)",
      "O(n), O(1)",
      "O(1), O(n)"
    ],
    "answer": "O(n), O(1)",
    "explanation": "Although ordered linear search is better than unordered when the element is not present in the array, the best and worst cases still remain the same, with the key element being found at first position or at last position.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-06t-q7",
    "question": "What is the use of void pointer?",
    "options": [
      "Pointer that will not return any value",
      "Address of any variable of any data type can be assigned",
      "Address of void method can be stored",
      "Address of another pointer can be stored"
    ],
    "answer": "Address of any variable of any data type can be assigned",
    "explanation": "Refer to standard solutions.",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-06t-q8",
    "question": "If malloc() fails to allocate the requested memory, it returns",
    "options": [
      "Null",
      "Garbage Value",
      "Zero",
      "None of the Mentioned"
    ],
    "answer": "Null",
    "explanation": "If malloc() fails to allocate memory, it will return Null",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  },
  {
    "id": "tcs17-06t-q9",
    "question": "Which of the following is the correct order of evaluation for the below expression? z = x + y * z / 4 % 2 - 1",
    "options": [
      "* / % + - =",
      "* / % + -=",
      "/ * % - + =",
      "* % / - + ="
    ],
    "answer": "* / % + - =",
    "explanation": "It executes based upon operator precedence",
    "shortcuts": [],
    "difficulty": 1,
    "topic": "coding-decoding",
    "category": "logical",
    "estimatedTime": 45,
    "companyRelevance": [
      "TCS"
    ]
  }
];

export const tcsCodingQuestions: TcsCodingQuestion[] = [
  {
    "id": "tcs-02t",
    "title": "Check string palindrome",
    "description": "Program to check string palindrome.",
    "solutionCode": "#include <stdio.h>\n#include <string.h>\nint main(){\nchar string1[20];\nint i, length;\nint flag = 0;\nscanf(\"%s\", string1);\nlength = strlen(string1);\nfor(i=0;i < length ;i++){\nif(string1[i] != string1[length-i-1]){\nflag = 1;\nbreak;\n}\n}\nif (flag) {\nprintf(\"%s is not a palindrome\", string1);\n}\nelse {\nprintf(\"%s is a palindrome\", string1);\n}\nreturn 0;\n}",
    "difficulty": "Easy",
    "topicId": "strings",
    "estimatedMinutes": 20,
    "company": "TCS"
  },
  {
    "id": "tcs-03t",
    "title": "Print all the unique elements in the array",
    "description": "Program to print all the unique elements in the array.",
    "solutionCode": "#include <stdio.h>\n#define MAX_SIZE 100\nint main()\n{\nint arr[MAX_SIZE], freq[MAX_SIZE];\nint size, i, j, count;\nscanf(\"%d\", &size);\n// Get the N elements as input\n// Assign the array freq[] as -1 (i.e., as default value)\nfor(i=0; i<size; i++)\n{\nscanf(\"%d\", &arr[i]);\nfreq[i] = -1;\n}\n// Check the frequency of all the elements in an array\nfor(i=0; i<size; i++)\n{\ncount = 1;\nfor(j=i+1; j<size; j++)\n{\nif(arr[i] == arr[j])\n{\ncount++;\nfreq[j] = 0;\n}\n}\n// Store the number of occurrences of each element of the given array\nif(freq[i] != 0)\n{\nfreq[i] = count;\n}\n}\n// Print only the unique elements\n// If freq[i] value is 1, then it has occured only one time\nfor(i=0; i<size; i++)\n{\nif(freq[i] == 1)\n{\nprintf(\"%d \", arr[i]);\n}\n}\nreturn 0;\n}",
    "difficulty": "Easy",
    "topicId": "arrays",
    "estimatedMinutes": 20,
    "company": "TCS"
  },
  {
    "id": "tcs-04c",
    "title": "Program to find the Factorial of the given number",
    "description": "Write a program to find the Factorial of the given number",
    "solutionCode": "#include <stdio.h>\nint main()\n{\nlong int fact=1;\nint i,num;\n//printf(\"\\nPlease enter a number to find factorial : \");\nscanf(\"%d\",&num);\nif (num<0)\n{\n//printf(\"\\nPlease enter a positive number to\");\nreturn 1;\n}\nfor(i=1;i<=num;i++)\n{\nfact=fact*i;\n}\nprintf(\"%ld\\n\",fact);\nreturn 0;\n}",
    "difficulty": "Easy",
    "topicId": "maths",
    "estimatedMinutes": 20,
    "company": "TCS"
  },
  {
    "id": "tcs-05c",
    "title": "Program to find the area of a circle",
    "description": "Write a Program to find the area of a circle.",
    "solutionCode": "#include<stdio.h>\n#define PI 3.14\nint main()\n{\nfloat d, area;\nscanf(\"%f\",&d);\narea=PI*(d/2)*(d/2);\nprintf(\"%0.2f\", area);\nreturn 0;\n}",
    "difficulty": "Easy",
    "topicId": "maths",
    "estimatedMinutes": 20,
    "company": "TCS"
  },
  {
    "id": "tcs-06c",
    "title": "Given two lines, w rite Program for find ing its intersection point",
    "description": "Given two lines, w rite Program for find ing its intersection point",
    "solutionCode": "#include <stdio.h>\nint main()\n{\nfloat x1, y1, x2, y2;\nscanf(\"%f,%f\\n%f,%f\", &x1, &y1, &x2, &y2);\nfloat x3,y3,x4,y4;\nscanf(\"%f,%f\\n%f,%f\", &x3, &y3, &x4, &y4);\nfloat m1 = (y2-y1)/(x2-x1);\nfloat m2 = (y4-y3)/(x4-x3);\n// Line 1\n// y = y1 + m * (x - x1);\n// y = y1 + m * (x - x1);\n// y = m1*x + y1 - m1 * x1\n// Line 2\n// y = y1 + m * (x - x1);\n// y = y3 + m2 * (x - x3);\n// y = m2*x + y3 - m2 * x3\n// Solving line 1 and line 2 eqn\nfloat x_intersection = (y1 - m1 * x1 - y3 + m2 * x3)/(m2-m1);\nfloat y_intersection = y1 + m1 * (x_intersection - x1);\nprintf(\"%0.2f,%0.2f\", x_intersection, y_intersection);\nreturn 0;\n}",
    "difficulty": "Easy",
    "topicId": "maths",
    "estimatedMinutes": 20,
    "company": "TCS"
  }
];
