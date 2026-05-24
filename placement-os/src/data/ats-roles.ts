export interface AtsRole {
  title: string;
  category: string;
  keywords: string[];
  isExisting: boolean;
  suggestions?: Record<string, string[]>;
}

export const jobIcons: Record<string, string> = {
  'Entry-Level Software Developer': '💻',
  'Entry-Level Python Developer': '🐍',
  'Entry-Level Full Stack Developer': '⚡',
  'Entry-Level Backend Developer': '⚙️',
  'Entry-Level Front End Developer': '🎨',
  'Entry-Level Junior Web Developer': '🌱',
  'Entry-Level Data Analyst': '📊',
  'Entry-Level Machine Learning Engineer': '🤖',
  'Entry-Level Cybersecurity Analyst': '🔒',
  'Entry-Level Web Developer': '🌐',
  'Entry-Level DevOps Engineer': '🚀',
  'Entry-Level Database Administrator (DBA)': '💾',
  'Product Engineer': '🧩',
  'Entry-Level Cloud Solutions Architect (Trainee)': '☁️',
  'Mobile App Developer': '📱',
  'Data Scientist': '🔬',
  'Data Engineer': '🗄️',
  'Cloud Engineer / Cloud Developer': '☁️',
  'Cybersecurity Engineer': '🛡️',
  'QA / Test Engineer': '🔍',
  'UI/UX Designer': '🎨',
  'Blockchain Developer': '⛓️',
  'Game Developer': '🎮',
  'Product Manager': '📋',
  'Business Analyst / Tech Consultant': '💼',
  'Technical Support / IT Support Engineer': '🛠️',
  'Digital Marketing / Growth / SEO Specialist': '📈',
  'AR/VR Developer': '🥽',
  'Site Reliability Engineer (SRE)': '🚥',
  'Technical Content Creator / Educator': '✍️',
  'Research Engineer (R&D)': '📚',
  'ERP / Enterprise Software Consultant': '🏢'
};

export const careerRolesData: AtsRole[] = [
  {
    title: "Entry-Level Software Developer",
    category: "Software Development",
    keywords: [
      "Software Development", "Coding", "Programming", "SDLC", "OOP", "Data Structures",
      "Algorithms", "Unit Testing", "Debugging", "Java", "Python", "C++", "C#", "Git",
      "Agile", "Scrum", "SQL", "REST APIs", "Version Control", "Software Engineering"
    ],
    isExisting: true,
    suggestions: {
      "Software Development": ["Application Development", "Software Engineering"],
      "OOP": ["Object-Oriented Programming", "Design Patterns"],
      "Data Structures": ["Algorithms", "Problem Solving"],
      "Git": ["Version Control", "Source Control"],
      "Unit Testing": ["Debugging", "Quality Assurance"]
    }
  },
  {
    title: "Entry-Level Python Developer",
    category: "Software Development",
    keywords: [
      "Python", "Django", "Flask", "Back-end Development", "REST API", "ORM",
      "PostgreSQL", "MySQL", "Pandas", "NumPy", "Automation", "Scripting", "PEP 8",
      "Git", "Unit Testing", "Microservices", "FastAPI", "Async Programming"
    ],
    isExisting: true,
    suggestions: {
      "Python": ["Python Programming", "Python Development"],
      "Django": ["Web Frameworks", "Back-end Frameworks"],
      "REST API": ["API Design", "Server-Side Logic"],
      "ORM": ["Database Interaction", "SQL"],
      "Automation": ["Scripting", "DevOps Tools"]
    }
  },
  {
    title: "Entry-Level Full Stack Developer",
    category: "Software Development",
    keywords: [
      "Full Stack", "Web Development", "Frontend", "Backend", "JavaScript", "Node.js",
      "React", "Vue.js", "Angular", "Python", "Django", "Flask", "SQL", "NoSQL",
      "API Development", "Database Design", "HTML", "CSS", "Git", "Deployment"
    ],
    isExisting: true,
    suggestions: {
      "Full Stack": ["End-to-End Development", "Web Application Development"],
      "JavaScript": ["Modern JavaScript", "ES6+"],
      "API Development": ["RESTful Services", "Microservices"],
      "SQL": ["Database Querying", "Database Management"],
      "Deployment": ["CI/CD", "DevOps Practices"]
    }
  },
  {
    title: "Entry-Level Backend Developer",
    category: "Software Development",
    keywords: [
      "Backend Development", "Server-Side", "API", "RESTful", "Microservices", "Node.js",
      "Express.js", "Java", "Spring Boot", "Python", "Django", "Go", "Databases", "SQL",
      "NoSQL", "PostgreSQL", "MongoDB", "Authentication", "Authorization", "Caching",
      "Git", "Docker", "Cloud", "Unit Testing"
    ],
    isExisting: true,
    suggestions: {
      "Backend Development": ["Server-Side Programming", "API Engineering"],
      "API": ["RESTful Services", "GraphQL"],
      "SQL": ["Database Querying", "Database Architecture"],
      "Node.js": ["Server-Side JavaScript", "Express.js"],
      "Authentication": ["Authentication Systems", "Data Protection"]
    }
  },
  {
    title: "Entry-Level Front End Developer",
    category: "Software Development",
    keywords: [
      "Frontend Development", "UI Development", "Web Development", "HTML5", "CSS3",
      "JavaScript", "ES6+", "React", "Angular", "Vue.js", "Responsive Design",
      "Mobile First", "Cross-browser Compatibility", "Web Performance", "Git",
      "Redux", "SASS", "Accessibility", "TypeScript"
    ],
    isExisting: true,
    suggestions: {
      "Frontend Development": ["Client-Side Development", "UI/UX Implementation"],
      "React": ["React.js", "React Hooks", "Component Development"],
      "Responsive Design": ["Mobile-Friendly Design", "Adaptive Layouts"],
      "JavaScript": ["Modern JavaScript", "DOM Manipulation"],
      "HTML5": ["Semantic HTML", "Web Markup"]
    }
  },
  {
    title: "Entry-Level Junior Web Developer",
    category: "Software Development",
    keywords: [
      "Junior Web Developer", "Web Development", "HTML", "CSS", "JavaScript", "CMS",
      "WordPress", "Frontend", "Responsive Design", "Website Maintenance", "SEO",
      "Git", "Debugging", "Web Design", "jQuery"
    ],
    isExisting: true,
    suggestions: {
      "Junior Web Developer": ["Trainee Web Developer", "Web Assistant"],
      "CMS": ["Content Management System", "WordPress Management"],
      "HTML": ["Semantic HTML", "Web Markup"],
      "JavaScript": ["Client-Side Scripting", "Basic Scripting"],
      "Responsive Design": ["Mobile Layouts", "CSS Media Queries"]
    }
  },
  {
    title: "Entry-Level Data Analyst",
    category: "Data & Analytics",
    keywords: [
      "Data Analyst", "Data Analysis", "Business Intelligence", "BI", "SQL", "Tableau",
      "Power BI", "Data Visualization", "Python", "R", "Statistics", "Exploratory Data Analysis",
      "EDA", "Data Cleaning", "Data Reporting", "KPIs", "Data Mining", "Excel"
    ],
    isExisting: true,
    suggestions: {
      "Data Analyst": ["Business Analyst", "Junior Data Scientist"],
      "SQL": ["Database Querying", "Data Extraction Language"],
      "Tableau": ["Data Visualization", "Dashboarding"],
      "Python": ["Data Analysis Programming", "R"],
      "EDA": ["Exploratory Analysis", "Statistical Analysis"]
    }
  },
  {
    title: "Entry-Level Machine Learning Engineer",
    category: "AI & Machine Learning",
    keywords: [
      "Machine Learning", "ML Engineer", "Artificial Intelligence", "AI", "Python",
      "Scikit-learn", "TensorFlow", "PyTorch", "Model Training", "Model Deployment",
      "MLOps", "Feature Engineering", "Data Science", "Statistics", "Deep Learning",
      "Computer Vision", "NLP"
    ],
    isExisting: true,
    suggestions: {
      "Machine Learning": ["AI Development", "Predictive Modeling"],
      "Python": ["ML Programming", "Data Science Language"],
      "TensorFlow": ["Deep Learning Frameworks", "PyTorch"],
      "MLOps": ["Model Lifecycle Management", "Production ML"],
      "Feature Engineering": ["Data Preprocessing", "Data Transformation"]
    }
  },
  {
    title: "Entry-Level Cybersecurity Analyst",
    category: "Security",
    keywords: [
      "Cybersecurity", "Information Security", "Security Analyst", "SOC", "SIEM",
      "Vulnerability Assessment", "Incident Response", "Network Security", "Firewall",
      "Intrusion Detection", "Malware Analysis", "Encryption", "Authentication",
      "CompTIA Security+", "Ethical Hacking", "Forensics"
    ],
    isExisting: true,
    suggestions: {
      "Cybersecurity": ["Information Security", "IT Security"],
      "SIEM": ["Security Monitoring", "Log Analysis"],
      "Vulnerability Assessment": ["Penetration Testing", "Risk Assessment"],
      "Incident Response": ["Security Triage", "Threat Hunting"],
      "Network Security": ["TCP/IP", "Firewall Management"]
    }
  },
  {
    title: "Entry-Level Web Developer",
    category: "Software Development",
    keywords: [
      "Web Developer", "HTML", "CSS", "JavaScript", "Full Stack", "Frontend", "Backend",
      "API", "Git", "Responsive Design", "Web Performance", "SQL", "Node.js", "React",
      "CMS", "Web Application"
    ],
    isExisting: true,
    suggestions: {
      "Web Developer": ["Web Engineer", "Application Developer"],
      "JavaScript": ["Modern JavaScript", "ES6+"],
      "API": ["Web Services Integration", "REST"],
      "Responsive Design": ["Mobile-First Development", "Adaptive Layouts"],
      "Git": ["Version Control", "Source Management"]
    }
  },
  {
    title: "Entry-Level DevOps Engineer",
    category: "DevOps & Cloud",
    keywords: [
      "DevOps", "CI/CD", "Automation", "Cloud Computing", "AWS", "Azure", "GCP",
      "Docker", "Kubernetes", "Linux", "Bash", "Python Scripting", "Terraform",
      "IaC", "Jenkins", "Git", "Monitoring", "Prometheus", "Grafana", "Configuration Management"
    ],
    isExisting: true,
    suggestions: {
      "DevOps": ["Site Reliability Engineering", "Infrastructure Automation"],
      "CI/CD": ["Continuous Integration", "Continuous Delivery"],
      "Docker": ["Containerization", "Microservices Deployment"],
      "Cloud Computing": ["AWS Management", "Azure Operations"],
      "Terraform": ["Infrastructure as Code", "IaC Tools"]
    }
  },
  {
    title: "Entry-Level Database Administrator (DBA)",
    category: "Data & Database",
    keywords: [
      "Database Administrator", "DBA", "SQL", "T-SQL", "PL/pgSQL", "MySQL", "PostgreSQL",
      "Oracle", "SQL Server", "Database Design", "Database Tuning", "Backup and Recovery",
      "Data Security", "NoSQL", "Cloud Databases", "Query Optimization", "Database Management"
    ],
    isExisting: true,
    suggestions: {
      "Database Administrator": ["Database Engineer", "Data Management Specialist"],
      "SQL": ["Structured Query Language", "Database Scripting"],
      "Database Tuning": ["Performance Optimization", "Query Optimization"],
      "Backup and Recovery": ["Disaster Recovery", "High Availability"],
      "Data Security": ["Access Control", "Database Security"]
    }
  },
  {
    title: "Product Engineer",
    category: "Product & Engineering",
    keywords: [
      "JavaScript", "React", "TypeScript", "HTML5", "CSS3", "REST API", "Node.js",
      "SQL", "Git", "Agile", "Scrum", "Product Management", "User Experience",
      "A/B Testing", "Analytics", "Product Analytics", "Mixpanel", "Amplitude",
      "Google Analytics", "Performance Optimization", "Core Web Vitals", "System Design",
      "Scalability", "Feature Flags", "User Research", "Data-Driven", "UI/UX",
      "Cross-Functional", "API Integration", "Web Performance", "Product Roadmap"
    ],
    isExisting: true,
    suggestions: {
      "JavaScript": ["ES6+", "Modern JavaScript", "Vanilla JS"],
      "React": ["React.js", "React Hooks", "Component Architecture"],
      "TypeScript": ["Typed JavaScript", "Static Typing"],
      "REST API": ["RESTful Services", "API Design", "HTTP APIs"],
      "A/B Testing": ["Experimentation", "Split Testing", "Feature Testing"]
    }
  },
  {
    title: "Entry-Level Cloud Solutions Architect (Trainee)",
    category: "Cloud & Infrastructure",
    keywords: [
      "Cloud Solutions Architect", "Cloud Computing", "AWS", "Azure", "GCP", "Cloud Services",
      "Cloud Infrastructure", "IaC", "Infrastructure as Code", "Virtualization",
      "Networking", "Storage", "Compute", "IAM", "Cloud Security", "Cloud Migration",
      "Cloud Practitioner", "Serverless", "Terraform"
    ],
    isExisting: true,
    suggestions: {
      "Cloud Solutions Architect": ["Cloud Architect", "Cloud Planner"],
      "Cloud Computing": ["AWS Services", "Cloud Platforms"],
      "Terraform": ["Infrastructure as Code", "IaC"],
      "Cloud Security": ["IAM", "Cloud Compliance"],
      "Serverless": ["Lambda Functions", "Cloud Functions"]
    }
  },
  {
    title: "Mobile App Developer",
    category: "Mobile Development",
    keywords: [
      "Android", "Kotlin", "Java", "Android SDK", "Jetpack Compose", "iOS", "Swift",
      "SwiftUI", "UIKit", "Flutter", "Dart", "React Native", "Mobile Development",
      "Material Design", "Core Data", "Room Database", "Retrofit", "Firebase",
      "App Store", "Play Store", "Mobile UI/UX", "Cross-platform", "SQLite",
      "Push Notifications", "Mobile Performance"
    ],
    isExisting: false
  },
  {
    title: "Data Scientist",
    category: "Data & Analytics",
    keywords: [
      "Data Science", "Python", "R", "Machine Learning", "Statistics", "Pandas",
      "NumPy", "SciPy", "Scikit-learn", "Linear Regression", "Logistic Regression",
      "Decision Trees", "Random Forest", "SVM", "K-means", "Model Evaluation",
      "Cross-validation", "Feature Engineering", "Data Visualization", "Matplotlib",
      "Seaborn", "Plotly", "Deep Learning", "TensorFlow", "PyTorch", "Hypothesis Testing"
    ],
    isExisting: false
  },
  {
    title: "Data Engineer",
    category: "Data & Engineering",
    keywords: [
      "Data Engineering", "ETL", "ELT", "SQL", "Data Warehousing", "Apache Spark",
      "Hadoop", "Python", "PySpark", "Airflow", "Kafka", "Data Pipelines",
      "AWS", "S3", "Redshift", "BigQuery", "Azure Synapse", "Data Lake",
      "Star Schema", "Snowflake Schema", "Data Quality", "Data Governance",
      "Terraform", "Data Modeling", "Streaming Data"
    ],
    isExisting: false
  },
  {
    title: "Cloud Engineer / Cloud Developer",
    category: "Cloud & Infrastructure",
    keywords: [
      "Cloud Engineering", "AWS", "Azure", "GCP", "EC2", "S3", "Lambda",
      "VPC", "Cloud Storage", "Cloud Networking", "IAM", "Infrastructure as Code",
      "Terraform", "CloudFormation", "Ansible", "Linux", "Bash", "PowerShell",
      "Monitoring", "CloudWatch", "Cost Management", "Security", "Automation"
    ],
    isExisting: false
  },
  {
    title: "Cybersecurity Engineer",
    category: "Security",
    keywords: [
      "Security Engineering", "Network Security", "Application Security", "Penetration Testing",
      "Vulnerability Assessment", "OWASP", "Cryptography", "SSL/TLS", "Firewall",
      "IDS/IPS", "Security Audits", "Compliance", "ISO 27001", "NIST", "GDPR",
      "Security Automation", "Python", "Bash", "Incident Response", "Threat Modeling"
    ],
    isExisting: false
  },
  {
    title: "QA / Test Engineer",
    category: "Quality Assurance",
    keywords: [
      "Quality Assurance", "Testing", "Manual Testing", "Automated Testing",
      "Selenium", "JUnit", "TestNG", "Pytest", "Test Cases", "Test Plans",
      "Bug Tracking", "Jira", "Regression Testing", "Integration Testing",
      "Performance Testing", "Load Testing", "API Testing", "Postman",
      "CI/CD", "Test Automation"
    ],
    isExisting: false
  },
  {
    title: "UI/UX Designer",
    category: "Design",
    keywords: [
      "UI Design", "UX Design", "User Interface", "User Experience", "Figma",
      "Adobe XD", "Sketch", "Wireframing", "Prototyping", "User Research",
      "Usability Testing", "Information Architecture", "Interaction Design",
      "Visual Design", "Design Systems", "Responsive Design", "Accessibility",
      "Design Thinking", "User Flows", "HTML", "CSS"
    ],
    isExisting: false
  },
  {
    title: "Blockchain Developer",
    category: "Emerging Tech",
    keywords: [
      "Blockchain", "Ethereum", "Solidity", "Smart Contracts", "Web3",
      "DeFi", "NFT", "Cryptocurrency", "Distributed Ledger", "Consensus Algorithms",
      "Hyperledger", "Truffle", "Hardhat", "MetaMask", "Cryptography",
      "dApps", "JavaScript", "Node.js", "Go"
    ],
    isExisting: false
  },
  {
    title: "Game Developer",
    category: "Gaming",
    keywords: [
      "Game Development", "Unity", "Unreal Engine", "C#", "C++", "Game Design",
      "3D Graphics", "Physics Engine", "Animation", "Shader Programming",
      "Multiplayer", "Game Mechanics", "Level Design", "Mobile Games",
      "Console Games", "PC Games", "VR Games", "Game Optimization"
    ],
    isExisting: false
  },
  {
    title: "Product Manager",
    category: "Product Management",
    keywords: [
      "Product Management", "Product Strategy", "Roadmap", "User Stories",
      "Agile", "Scrum", "PRD", "Product Requirements", "Market Research",
      "Competitive Analysis", "A/B Testing", "Metrics", "KPIs", "SQL",
      "Analytics", "Stakeholder Management", "Prioritization", "RICE",
      "User Research", "Jira", "Figma", "Data-Driven"
    ],
    isExisting: false
  },
  {
    title: "Business Analyst / Tech Consultant",
    category: "Business & Consulting",
    keywords: [
      "Business Analysis", "Requirements Gathering", "BRD", "FRD", "Use Cases",
      "Process Modeling", "BPMN", "UML", "SQL", "Excel", "Data Analysis",
      "Gap Analysis", "Stakeholder Management", "Documentation", "Jira",
      "Confluence", "Agile", "Scrum", "Presentations"
    ],
    isExisting: false
  },
  {
    title: "Technical Support / IT Support Engineer",
    category: "IT Support",
    keywords: [
      "Technical Support", "IT Support", "Troubleshooting", "Windows", "Linux",
      "macOS", "Networking", "DNS", "DHCP", "VPN", "Remote Support",
      "Ticketing", "Zendesk", "ServiceNow", "Customer Service", "Documentation",
      "Knowledge Base", "Office 365", "Active Directory"
    ],
    isExisting: false
  },
  {
    title: "Digital Marketing / Growth / SEO Specialist",
    category: "Marketing & Growth",
    keywords: [
      "Digital Marketing", "SEO", "Search Engine Optimization", "Google Analytics",
      "Google Ads", "Social Media Marketing", "Content Marketing", "Email Marketing",
      "A/B Testing", "Conversion Optimization", "Google Tag Manager", "Ahrefs",
      "SEMrush", "Meta Tags", "Backlinks", "Keywords", "Analytics", "Growth Hacking"
    ],
    isExisting: false
  },
  {
    title: "AR/VR Developer",
    category: "Emerging Tech",
    keywords: [
      "AR", "VR", "Augmented Reality", "Virtual Reality", "Unity", "Unreal Engine",
      "C#", "C++", "3D Graphics", "ARKit", "ARCore", "Oculus", "Meta XR",
      "SteamVR", "Spatial Computing", "Hand Tracking", "6DoF", "Shaders",
      "Optimization", "Immersive Design"
    ],
    isExisting: false
  },
  {
    title: "Site Reliability Engineer (SRE)",
    category: "DevOps & Infrastructure",
    keywords: [
      "SRE", "Site Reliability", "SLI", "SLO", "SLA", "Monitoring", "Prometheus",
      "Grafana", "Incident Management", "On-call", "Postmortems", "Python", "Go",
      "Linux", "Distributed Systems", "Observability", "Logging", "Metrics",
      "Tracing", "Chaos Engineering", "Load Testing", "CI/CD"
    ],
    isExisting: false
  },
  {
    title: "Technical Content Creator / Educator",
    category: "Education & Content",
    keywords: [
      "Technical Writing", "Content Creation", "Teaching", "Tutorials", "Documentation",
      "Video Production", "Blogging", "YouTube", "OBS", "Screen Recording",
      "Instructional Design", "E-learning", "Course Creation", "Public Speaking",
      "Social Media", "DevOps", "Programming", "Web Development"
    ],
    isExisting: false
  },
  {
    title: "Research Engineer (R&D)",
    category: "Research & Development",
    keywords: [
      "Research", "R&D", "Algorithms", "Machine Learning", "Deep Learning",
      "PyTorch", "TensorFlow", "Scientific Computing", "MATLAB", "C++",
      "Python", "Literature Review", "Experimental Design", "Paper Implementation",
      "Statistical Analysis", "Data Analysis", "Publications"
    ],
    isExisting: false
  },
  {
    title: "ERP / Enterprise Software Consultant",
    category: "Enterprise Software",
    keywords: [
      "ERP", "SAP", "Oracle", "Enterprise Software", "Business Processes",
      "Finance", "Supply Chain", "HR Management", "SQL", "Integration",
      "ABAP", "Configuration", "Requirements Gathering", "UAT", "Training",
      "Client Management"
    ],
    isExisting: false
  }
];
