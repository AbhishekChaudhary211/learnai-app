import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  LayoutDashboard, Sparkles, FileText, StickyNote, MessageSquare, BarChart3,
  Trophy, User, Flame, Clock, Target, CheckCircle2, XCircle, ChevronLeft,
  ChevronRight, Flag, Timer, Brain, BookOpen, Award, Search, Bell, Menu, X,
  ArrowRight, RotateCcw, Wand2, ListChecks, GraduationCap, Zap, PlayCircle,
  Layers, Shield, LogOut, Lock, Mail, Building2, UploadCloud, FileUp, Send,
  Bot, Star, Users, UserPlus, Activity, CalendarDays, BadgeCheck, Lightbulb,
  Book, PenTool, Pencil, Bookmark, ShieldCheck, Calendar, AlertTriangle,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line,
} from "recharts";

/* ----------------------------------------------------------------------- */
/* Design tokens                                                           */
/* ----------------------------------------------------------------------- */
const C = {
  bg: "#121217", bg2: "#1A1A22",
  panel: "rgba(255,255,255,0.05)", panelBorder: "rgba(255,255,255,0.1)",
  panelSolid: "#20202A",
  text: "#F3F2F6", textDim: "#A8A4B3", textFaint: "#6D6878",
  blue: "#C2185B", purple: "#7A0F2B", cyan: "#D4AF6A",
  green: "#3FA772", red: "#E4364A", amber: "#E0A93A",
};
const GRAD = `linear-gradient(135deg, ${C.blue}, ${C.purple})`;
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');`;

/* ----------------------------------------------------------------------- */
/* Sample curriculum content (not personal data — the course structure      */
/* every account sees; real per-user numbers come from what they actually   */
/* do, see makeUserFromForm and quizHistory below)                          */
/* ----------------------------------------------------------------------- */
const NAV_ITEMS = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "learning", label: "Personalized Learning", icon: Brain },
  { id: "generator", label: "AI Quiz Generator", icon: Sparkles },
  { id: "pdfquiz", label: "PDF → Quiz", icon: FileText },
  { id: "notes", label: "AI Notes Generator", icon: StickyNote },
  { id: "assistant", label: "AI Study Assistant", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "profile", label: "Profile", icon: User },
];

const STUDY_PLAN_TODAY = [
  { subject: "Computer Networks", topic: "IP Addressing", minutes: 20 },
  { subject: "DBMS", topic: "Normalization", minutes: 25 },
  { subject: "C++", topic: "OOP Concepts", minutes: 20 },
];
const RECOMMENDED = [
  { subject: "Computer Networks", topic: "Subnetting", reason: "Builds directly on IP Addressing", difficulty: "Medium" },
  { subject: "DBMS", topic: "Normalization", reason: "Core concept for database design", difficulty: "Easy" },
  { subject: "Data Structures", topic: "Trees & Searching", reason: "Common starting point for this subject", difficulty: "Medium" },
];

const SUBJECTS = ["Computer Networks", "DBMS", "C++", "Data Structures", "Operating Systems", "Artificial Intelligence", "Discrete Mathematics", "Communication English", "Analogy & Reasoning"];
const TOPICS_BY_SUBJECT = {
  "Computer Networks": ["All Topics", "OSI Model", "IP Addressing", "Subnetting", "TCP/IP"],
  "DBMS": ["All Topics", "ER Model", "Normalization", "SQL", "Transactions"],
  "C++": ["All Topics", "OOP", "Inheritance", "STL", "Pointers & Memory"],
  "Data Structures": ["All Topics", "Stacks & Queues", "Trees & Searching", "Graphs & DP"],
  "Operating Systems": ["All Topics", "Process Scheduling", "Deadlocks"],
  "Artificial Intelligence": ["All Topics", "Search Algorithms", "Machine Learning", "Neural Networks"],
  "Discrete Mathematics": ["All Topics", "Set Theory", "Logic & Propositions", "Graph Theory", "Combinatorics"],
  "Communication English": ["All Topics", "Grammar & Usage", "Vocabulary", "Business Writing"],
  "Analogy & Reasoning": ["All Topics", "Verbal Analogy", "Number Series", "Logical Reasoning"],
};

const LEARNING_CONTENT = {
  "Computer Networks": [
    { topic: "OSI Model", lessons: 5 }, { topic: "IP Addressing", lessons: 6 },
    { topic: "Subnetting", lessons: 7 }, { topic: "TCP/IP", lessons: 5 },
  ],
  "DBMS": [
    { topic: "ER Model", lessons: 4 }, { topic: "Normalization", lessons: 6 },
    { topic: "SQL", lessons: 8 }, { topic: "Transactions", lessons: 4 },
  ],
  "C++": [
    { topic: "OOP", lessons: 6 }, { topic: "Inheritance", lessons: 4 },
    { topic: "STL", lessons: 5 }, { topic: "Pointers & Memory", lessons: 5 },
  ],
  "Data Structures": [
    { topic: "Stacks & Queues", lessons: 5 }, { topic: "Trees & Searching", lessons: 6 }, { topic: "Graphs & DP", lessons: 7 },
  ],
  "Operating Systems": [
    { topic: "Process Scheduling", lessons: 5 }, { topic: "Deadlocks", lessons: 4 },
  ],
  "Artificial Intelligence": [
    { topic: "Search Algorithms", lessons: 5 }, { topic: "Machine Learning", lessons: 7 }, { topic: "Neural Networks", lessons: 6 },
  ],
  "Discrete Mathematics": [
    { topic: "Set Theory", lessons: 4 }, { topic: "Logic & Propositions", lessons: 5 },
    { topic: "Graph Theory", lessons: 6 }, { topic: "Combinatorics", lessons: 4 },
  ],
  "Communication English": [
    { topic: "Grammar & Usage", lessons: 5 }, { topic: "Vocabulary", lessons: 6 }, { topic: "Business Writing", lessons: 3 },
  ],
  "Analogy & Reasoning": [
    { topic: "Verbal Analogy", lessons: 4 }, { topic: "Number Series", lessons: 4 }, { topic: "Logical Reasoning", lessons: 5 },
  ],
};
function computeSkillProgress(completedTopics) {
  const coreSubjects = ["Computer Networks", "DBMS", "C++", "Data Structures"];
  return coreSubjects.map((subject) => {
    const topics = LEARNING_CONTENT[subject];
    const done = topics.filter((t) => completedTopics.has(`${subject}::${t.topic}`)).length;
    return { name: subject, value: Math.round((done / topics.length) * 100) };
  });
}
function learningStage(progress) {
  if (progress >= 75) return { label: "Advanced", color: C.green };
  if (progress >= 40) return { label: "Intermediate", color: C.amber };
  return { label: "Beginner", color: C.cyan };
}

const ACHIEVEMENTS = [
  { name: "First Quiz", desc: "Complete your first quiz", icon: PlayCircle, earned: true },
  { name: "7-Day Streak", desc: "Study 7 days in a row", icon: Flame, earned: true },
  { name: "Quiz Master", desc: "Complete 25 quizzes", icon: Trophy, earned: true },
  { name: "Concept Crusher", desc: "Score 90%+ on 5 quizzes", icon: Zap, earned: false },
  { name: "Perfect Score", desc: "Get 100% on any quiz", icon: Star, earned: false },
  { name: "Fast Learner", desc: "Finish a quiz in under 5 minutes", icon: Timer, earned: true },
  { name: "Topic Master", desc: "Reach 90%+ mastery in a topic", icon: BadgeCheck, earned: false },
];


/*
  No fabricated student roster and no hardcoded platform stats here on purpose.
  The Admin dashboard below is computed entirely from real activity that happens
  in this session: who actually registers, what subjects people actually
  generate quizzes for, and what topics people actually get wrong. Until real
  people use the real product, those panels show honest empty states instead
  of made-up numbers.
*/

/* Question bank ----------------------------------------------------------*/
const QUESTION_BANK = [
  { subject: "Computer Networks", topic: "OSI Model", difficulty: "medium", question: "Which OSI layer is responsible for routing packets between networks?", options: ["Physical", "Network", "Transport", "Data Link"], correctIndex: 1, explanation: "The Network layer (Layer 3) handles logical addressing and routing between networks." },
  { subject: "Computer Networks", topic: "OSI Model", difficulty: "easy", question: "How many layers does the OSI reference model have?", options: ["5", "6", "7", "8"], correctIndex: 2, explanation: "The OSI model has 7 layers, from Physical up to Application." },
  { subject: "Computer Networks", topic: "OSI Model", difficulty: "medium", question: "Which layer is responsible for reliable end-to-end delivery and flow control?", options: ["Session", "Transport", "Presentation", "Application"], correctIndex: 1, explanation: "The Transport layer manages reliable delivery, flow control, and error recovery." },
  { subject: "Computer Networks", topic: "OSI Model", difficulty: "medium", question: "Which of these operates primarily at the Data Link layer?", options: ["HTTP", "IP", "TCP", "Ethernet"], correctIndex: 3, explanation: "Ethernet defines framing and addressing (MAC) at the Data Link layer." },
  { subject: "Computer Networks", topic: "IP Addressing", difficulty: "easy", question: "What is the default subnet mask for a Class C IP address?", options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"], correctIndex: 2, explanation: "Class C networks use a default mask of 255.255.255.0, giving 24 network bits." },
  { subject: "Computer Networks", topic: "IP Addressing", difficulty: "medium", question: "How many usable host addresses are available in a /24 subnet?", options: ["254", "256", "255", "510"], correctIndex: 0, explanation: "A /24 has 256 total addresses; subtracting the network and broadcast address leaves 254 usable hosts." },
  { subject: "Computer Networks", topic: "IP Addressing", difficulty: "hard", question: "Which IP ranges are reserved for private networks?", options: ["10.0.0.0–10.255.255.255", "172.16.0.0–172.31.255.255", "192.168.0.0–192.168.255.255", "All of the above"], correctIndex: 3, explanation: "RFC 1918 reserves all three ranges for private use across Class A, B, and C respectively." },
  { subject: "Computer Networks", topic: "Subnetting", difficulty: "hard", question: "A subnet mask of 255.255.255.192 supports how many usable hosts per subnet?", options: ["30", "62", "126", "254"], correctIndex: 1, explanation: "255.255.255.192 is a /26, giving 64 addresses total; minus network and broadcast leaves 62 usable hosts." },
  { subject: "Computer Networks", topic: "Subnetting", difficulty: "medium", question: "What is the CIDR notation for a subnet mask of 255.255.255.128?", options: ["/25", "/26", "/27", "/28"], correctIndex: 0, explanation: "255.255.255.128 sets 25 bits to 1, which is written as /25." },
  { subject: "Computer Networks", topic: "Subnetting", difficulty: "hard", question: "Subnetting a large network primarily helps to:", options: ["Increase the broadcast domain size", "Reduce the number of usable hosts only", "Improve organization and reduce broadcast traffic", "Eliminate the need for routers"], correctIndex: 2, explanation: "Subnetting splits a network into smaller broadcast domains, improving structure and reducing unnecessary broadcast traffic." },
  { subject: "Computer Networks", topic: "TCP/IP", difficulty: "easy", question: "Which protocol guarantees reliable, ordered delivery of data?", options: ["TCP", "UDP", "IP", "ICMP"], correctIndex: 0, explanation: "TCP uses acknowledgements and sequencing to guarantee reliable, ordered delivery." },
  { subject: "Computer Networks", topic: "TCP/IP", difficulty: "medium", question: "What is the purpose of the TCP three-way handshake?", options: ["Encrypt the data being sent", "Establish a reliable connection between client and server", "Assign an IP address to the client", "Compress data before transmission"], correctIndex: 1, explanation: "SYN, SYN-ACK, ACK establish and synchronize a reliable connection before data transfer." },
  { subject: "Computer Networks", topic: "TCP/IP", difficulty: "easy", question: "Which port does HTTPS use by default?", options: ["80", "443", "21", "25"], correctIndex: 1, explanation: "HTTPS defaults to port 443, while HTTP uses port 80." },

  { subject: "DBMS", topic: "ER Model", difficulty: "easy", question: "In an ER diagram, a rectangle typically represents:", options: ["An attribute", "An entity", "A relationship", "A primary key"], correctIndex: 1, explanation: "Rectangles represent entities; ovals represent attributes and diamonds represent relationships." },
  { subject: "DBMS", topic: "ER Model", difficulty: "medium", question: "A relationship connecting three entities is called:", options: ["Binary", "Unary", "Ternary", "Recursive"], correctIndex: 2, explanation: "A relationship involving three entity sets is called a ternary relationship." },
  { subject: "DBMS", topic: "Normalization", difficulty: "medium", question: "A table is in 2NF if it is in 1NF and:", options: ["Has no transitive dependency", "Has no partial dependency on the primary key", "Has no multi-valued dependency", "Has a composite key"], correctIndex: 1, explanation: "2NF removes partial dependency, where a non-key attribute depends on only part of a composite key." },
  { subject: "DBMS", topic: "Normalization", difficulty: "medium", question: "Which normal form removes transitive dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correctIndex: 2, explanation: "3NF requires that non-key attributes depend only on the primary key, removing transitive dependencies." },
  { subject: "DBMS", topic: "Normalization", difficulty: "easy", question: "What is the main goal of normalization?", options: ["Increase redundancy", "Reduce data redundancy and improve integrity", "Increase storage requirements", "Remove all primary keys"], correctIndex: 1, explanation: "Normalization organizes data to minimize redundancy and maintain data integrity." },
  { subject: "DBMS", topic: "SQL", difficulty: "medium", question: "Which SQL clause filters groups after aggregation?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], correctIndex: 1, explanation: "HAVING filters grouped rows after aggregation, unlike WHERE which filters before grouping." },
  { subject: "DBMS", topic: "SQL", difficulty: "medium", question: "Which join returns all rows from both tables, matching where possible?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correctIndex: 3, explanation: "FULL OUTER JOIN returns matched rows plus unmatched rows from both tables." },
  { subject: "DBMS", topic: "Transactions", difficulty: "easy", question: "Which ACID property ensures a transaction is all-or-nothing?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], correctIndex: 0, explanation: "Atomicity guarantees a transaction either completes fully or has no effect at all." },

  { subject: "C++", topic: "OOP", difficulty: "medium", question: "Which OOP concept lets a subclass provide its own implementation of a parent class method?", options: ["Encapsulation", "Inheritance", "Polymorphism (overriding)", "Abstraction"], correctIndex: 2, explanation: "Method overriding is a form of runtime polymorphism where the subclass redefines inherited behavior." },
  { subject: "C++", topic: "OOP", difficulty: "easy", question: "What is encapsulation in C++?", options: ["Hiding implementation details behind a clean interface", "Using multiple inheritance", "Overloading operators", "Allocating memory dynamically"], correctIndex: 0, explanation: "Encapsulation bundles data and methods together while hiding internal implementation details." },
  { subject: "C++", topic: "Inheritance", difficulty: "easy", question: "Which symbol is used to inherit from a base class in C++?", options: ["extends", "inherits", ":", "implements"], correctIndex: 2, explanation: "C++ uses a colon after the class name to specify inheritance, e.g. class B : public A." },
  { subject: "C++", topic: "Inheritance", difficulty: "medium", question: "A derived class inheriting from two or more base classes uses which type of inheritance?", options: ["Single", "Multiple", "Multilevel", "Hierarchical"], correctIndex: 1, explanation: "Multiple inheritance lets one class inherit directly from more than one base class." },

  { subject: "Data Structures", topic: "Trees & Searching", difficulty: "hard", question: "What is the time complexity of searching in a balanced binary search tree?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correctIndex: 1, explanation: "A balanced BST halves the search space at each step, giving O(log n) search time." },
  { subject: "Data Structures", topic: "Stacks & Queues", difficulty: "easy", question: "Which data structure follows LIFO (Last In, First Out) order?", options: ["Queue", "Stack", "Linked List", "Tree"], correctIndex: 1, explanation: "A stack removes the most recently added element first, following LIFO order." },

  { subject: "Operating Systems", topic: "Process Scheduling", difficulty: "medium", question: "Which scheduling algorithm can cause starvation of longer processes?", options: ["FCFS", "Round Robin", "Shortest Job First", "Multilevel Queue"], correctIndex: 2, explanation: "SJF can repeatedly favor short processes, indefinitely delaying longer ones." },
  { subject: "Operating Systems", topic: "Deadlocks", difficulty: "hard", question: "Which of the following is NOT a necessary condition for deadlock?", options: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"], correctIndex: 2, explanation: "Deadlock requires no preemption; if resources can be preempted, deadlock can be broken." },

  { subject: "Artificial Intelligence", topic: "Machine Learning", difficulty: "medium", question: "In machine learning, 'overfitting' means the model:", options: ["Performs well on training data but poorly on new data", "Performs poorly on both training and test data", "Is too simple to capture patterns", "Has no trainable parameters"], correctIndex: 0, explanation: "Overfitting occurs when a model memorizes training data instead of generalizing to unseen data." },
  { subject: "C++", topic: "STL", difficulty: "medium", question: "Which STL container automatically sorts elements and disallows duplicates?", options: ["vector", "set", "queue", "stack"], correctIndex: 1, explanation: "std::set keeps elements sorted and rejects duplicate values automatically." },
  { subject: "C++", topic: "Pointers & Memory", difficulty: "hard", question: "What does a dangling pointer refer to?", options: ["A pointer to valid memory", "A pointer to memory that has already been freed", "A null pointer", "A pointer to a function"], correctIndex: 1, explanation: "A dangling pointer still holds the address of memory that has been deallocated, leading to undefined behavior if used." },

  { subject: "Data Structures", topic: "Graphs & DP", difficulty: "hard", question: "Which algorithm finds the shortest path in a weighted graph with no negative edges?", options: ["DFS", "Dijkstra's Algorithm", "Bubble Sort", "Binary Search"], correctIndex: 1, explanation: "Dijkstra's Algorithm greedily selects the nearest unvisited vertex to compute shortest paths in non-negative weighted graphs." },

  { subject: "Artificial Intelligence", topic: "Neural Networks", difficulty: "medium", question: "What is the primary role of an activation function in a neural network?", options: ["To initialize weights", "To introduce non-linearity into the model", "To reduce dataset size", "To visualize the network"], correctIndex: 1, explanation: "Activation functions introduce non-linearity, letting networks learn complex patterns beyond simple linear relationships." },

  { subject: "Discrete Mathematics", topic: "Logic & Propositions", difficulty: "easy", question: "Which of the following best defines a 'proposition' in propositional logic?", options: ["A statement that is either true or false, but not both", "A statement that can be both true and false", "A question", "A command"], correctIndex: 0, explanation: "A proposition is a declarative statement with exactly one truth value — true or false." },
  { subject: "Discrete Mathematics", topic: "Logic & Propositions", difficulty: "easy", question: "Which logical connective represents 'if and only if'?", options: ["∧", "∨", "→", "↔"], correctIndex: 3, explanation: "The biconditional symbol ↔ represents 'if and only if', true when both sides share the same truth value." },
  { subject: "Discrete Mathematics", topic: "Set Theory", difficulty: "easy", question: "How many subsets does a set with n elements have?", options: ["n", "2n", "2^n", "n^2"], correctIndex: 2, explanation: "Each element can independently be included or excluded, giving 2^n possible subsets." },
  { subject: "Discrete Mathematics", topic: "Graph Theory", difficulty: "medium", question: "A graph where every pair of vertices is connected by an edge is called:", options: ["A tree", "A complete graph", "A bipartite graph", "A cyclic graph"], correctIndex: 1, explanation: "In a complete graph, every vertex is directly connected to every other vertex." },
  { subject: "Discrete Mathematics", topic: "Combinatorics", difficulty: "medium", question: "In how many ways can 4 distinct books be arranged on a shelf?", options: ["4", "16", "24", "256"], correctIndex: 2, explanation: "The number of arrangements of 4 distinct items is 4! = 24." },

  { subject: "Communication English", topic: "Grammar & Usage", difficulty: "easy", question: "Choose the correctly punctuated sentence:", options: ["Its a great day, isn't it", "It's a great day, isn't it?", "Its a great day isnt it", "It's a great day isn't it"], correctIndex: 1, explanation: "\"It's\" (it is) needs an apostrophe, and the sentence needs a comma before the tag question and a closing question mark." },
  { subject: "Communication English", topic: "Grammar & Usage", difficulty: "medium", question: "Identify the passive voice sentence:", options: ["The manager approved the report.", "The report was approved by the manager.", "The manager is approving the report.", "The manager will approve the report."], correctIndex: 1, explanation: "In passive voice, the subject (the report) receives the action, marked by 'was approved by'." },
  { subject: "Communication English", topic: "Vocabulary", difficulty: "medium", question: "Which word is a synonym for 'meticulous'?", options: ["Careless", "Thorough", "Quick", "Vague"], correctIndex: 1, explanation: "'Meticulous' means showing great attention to detail — closest in meaning to 'thorough'." },
  { subject: "Communication English", topic: "Business Writing", difficulty: "easy", question: "In a formal email, which closing is most appropriate?", options: ["Bye!", "Sincerely,", "Later,", "Cheers mate,"], correctIndex: 1, explanation: "'Sincerely,' is a standard, professional closing suited for formal business correspondence." },

  { subject: "Analogy & Reasoning", topic: "Verbal Analogy", difficulty: "easy", question: "Doctor is to Hospital as Teacher is to:", options: ["Chalk", "School", "Student", "Book"], correctIndex: 1, explanation: "A doctor works at a hospital, just as a teacher works at a school — matching the workplace relationship." },
  { subject: "Analogy & Reasoning", topic: "Verbal Analogy", difficulty: "easy", question: "Book is to Author as Painting is to:", options: ["Canvas", "Painter", "Museum", "Frame"], correctIndex: 1, explanation: "A book is created by an author, just as a painting is created by a painter — the creator relationship." },
  { subject: "Analogy & Reasoning", topic: "Number Series", difficulty: "easy", question: "Find the next number: 2, 4, 8, 16, ?", options: ["20", "24", "32", "30"], correctIndex: 2, explanation: "Each number doubles the previous one, so the next term is 16 × 2 = 32." },
  { subject: "Analogy & Reasoning", topic: "Logical Reasoning", difficulty: "medium", question: "All Bloops are Razzies. All Razzies are Lazzies. Therefore, all Bloops are Lazzies. This conclusion is:", options: ["True", "False", "Cannot be determined", "Irrelevant"], correctIndex: 0, explanation: "This follows valid transitive logic: if Bloops ⊆ Razzies and Razzies ⊆ Lazzies, then Bloops ⊆ Lazzies." },
  { subject: "Analogy & Reasoning", topic: "Logical Reasoning", difficulty: "easy", question: "Find the odd one out: Apple, Banana, Carrot, Mango", options: ["Apple", "Banana", "Carrot", "Mango"], correctIndex: 2, explanation: "Apple, Banana, and Mango are fruits, while Carrot is a vegetable — the odd one out." },
];

const SAMPLE_PDFS = [
  { name: "Computer_Networks_Unit2_Subnetting.pdf", subject: "Computer Networks", topic: "Subnetting", size: "1.2 MB" },
  { name: "DBMS_Normalization_Notes.pdf", subject: "DBMS", topic: "Normalization", size: "860 KB" },
  { name: "OOP_Concepts_CPP.pdf", subject: "C++", topic: "OOP", size: "640 KB" },
];

const SUGGESTED_PROMPTS = [
  "Explain subnetting", "What is 3NF in DBMS?", "Difference between TCP and UDP", "What is polymorphism in C++?",
];

/* ----------------------------------------------------------------------- */
/* Helpers                                                                  */
/* ----------------------------------------------------------------------- */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/* ========================================================================= */
/* Astra GPT quiz-generation engine                                          */
/* ========================================================================= */
/*
  ASTRA_CONFIG — wiring point for a real Astra GPT backend.
  NEVER put a real secret API key directly in this client-side file.
  To connect a real backend:
    1. Create a server route (Node/Express, or a Vite/Next API route) that holds
       your real key as a server-side env var (e.g. ASTRA_API_KEY) and forwards
       requests to the actual Astra GPT API.
    2. Point ASTRA_CONFIG.endpoint at that route (e.g. "/api/astra/generate-quiz").
    3. That route should accept { system, payload } and return { quiz: [...] }
       in the schema documented below, for AstraAI.generateQuiz to consume.
  Until endpoint is set, LearnAI automatically falls back to Astra's local
  generation engine (localAstraGenerate) so the product keeps working end-to-end.
  (If you do want a client-exposed key for a low-stakes key, the usual pattern
  is import.meta.env.VITE_ASTRA_API_KEY under Vite, or process.env.REACT_APP_*
  under CRA — wire that into ASTRA_CONFIG.apiKey yourself.)
*/
const ASTRA_CONFIG = { endpoint: "", apiKey: "", model: "astra-gpt" };

/*
  OWNER_PASSCODE gates the Admin dashboard so only you (the product owner) can
  reach it — there's no link to it anywhere in the student-facing app, and
  regular accounts never see an "Admin" button. Change this passcode before
  sharing this build with anyone.
  IMPORTANT: a passcode checked in client-side JS is a UX speed bump, not real
  security — anyone who reads the bundle can find it. Before this ever handles
  real student data, move admin auth to a real backend (a login endpoint that
  checks a hashed password / real account role server-side, behind a session
  cookie or JWT), the same way section 22 of your original spec describes.
*/
const OWNER_PASSCODE = "change-me-owner-2026";

/*
  EMAIL VERIFICATION — three modes, picked automatically (see getVerificationMode):

  1) "backend"  (RECOMMENDED for production) — set API_CONFIG.baseUrl to the URL of
     the small server in /server (Express + SMTP). The server generates the code,
     stores only a hash, emails it, enforces expiry / attempt limits / rate limits,
     and checks the code itself. The browser never sees the code.
  2) "emailjs"  — no server needed. Fill EMAIL_CONFIG with your EmailJS Service ID,
     Template ID and Public Key (the template's "To email" must be {{to_email}} and
     its body must contain {{otp_code}}). The code is generated in the browser, so
     this is convenient but weaker than option 1.
  3) "demo"     — nothing configured: the code is shown on screen, clearly labeled.
     Never ship this mode to real users.
*/
const API_CONFIG = { baseUrl: "" }; // e.g. "https://api.yourdomain.com" (no trailing slash)
const EMAIL_CONFIG = { serviceId: "", templateId: "", publicKey: "" };

function getVerificationMode() {
  if (API_CONFIG.baseUrl) return "backend";
  if (EMAIL_CONFIG.serviceId && EMAIL_CONFIG.templateId && EMAIL_CONFIG.publicKey) return "emailjs";
  return "demo";
}
async function fetchJson(url, body, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: controller.signal });
    let data = {};
    try { data = await res.json(); } catch (e) { /* non-JSON body */ }
    return { ok: res.ok, status: res.status, data };
  } finally { clearTimeout(timer); }
}
// Ask for a verification code to be emailed. Returns { sent, reason?, retryAfter? }.
async function requestEmailCode(email, localCode) {
  const mode = getVerificationMode();
  if (mode === "demo") return { sent: false, reason: "not-configured" };
  try {
    if (mode === "backend") {
      const r = await fetchJson(`${API_CONFIG.baseUrl}/api/otp/send`, { email });
      if (r.ok && r.data.sent) return { sent: true };
      if (r.status === 429) return { sent: false, reason: "cooldown", retryAfter: r.data.retryAfter || 30 };
      return { sent: false, reason: "failed" };
    }
    const r = await fetchJson("https://api.emailjs.com/api/v1.0/email/send", {
      service_id: EMAIL_CONFIG.serviceId, template_id: EMAIL_CONFIG.templateId, user_id: EMAIL_CONFIG.publicKey,
      template_params: { to_email: email, otp_code: localCode },
    });
    return r.ok ? { sent: true } : { sent: false, reason: "failed" };
  } catch (err) {
    return { sent: false, reason: err && err.name === "AbortError" ? "timeout" : "failed" };
  }
}
// Check what the user typed. Returns { valid, reason? }.
async function checkEmailCode(email, typed, localCode) {
  if (getVerificationMode() !== "backend") return { valid: typed === localCode };
  try {
    const r = await fetchJson(`${API_CONFIG.baseUrl}/api/otp/verify`, { email, code: typed });
    if (r.ok && r.data.valid) return { valid: true };
    return { valid: false, reason: r.data.reason || "invalid" };
  } catch (err) { return { valid: false, reason: "network" }; }
}

/*
  Real reviews only. There is no seeded rating and no fabricated reviewer —
  this list starts empty and only ever contains what an actual signed-in
  account submits, one review per account (resubmitting edits their own).
*/
const REVIEWS_KEY = "learnai_reviews";
function getReviews() {
  try {
    const raw = window.localStorage.getItem(REVIEWS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}
function saveReview(userId, name, rating, comment) {
  try {
    const existing = getReviews().filter((r) => r.userId !== userId);
    const next = [...existing, { userId, name, rating, comment, date: new Date().toLocaleDateString(undefined, { month: "short", year: "numeric" }) }];
    window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
    return next;
  } catch (e) { return getReviews(); }
}

const ASTRA_SYSTEM_PROMPT = `You are Astra, an adaptive educational quiz generation engine for LearnAI.
Generate academically accurate, original, self-contained questions.
Never repeat questions. Never invent facts.
Respect the selected subject, topic, difficulty and question type.
Create plausible distractors. Do not reveal the answer inside the question.
Return valid JSON only. Every question must be independently answerable.
Prioritize educational value over unnecessary complexity.`;

const ASTRA_LOADING_STEPS = [
  "Astra is analyzing your learning profile…",
  "Astra is understanding the selected subject…",
  "Astra is mapping important concepts…",
  "Astra is planning question difficulty…",
  "Astra is generating fresh questions…",
  "Astra is checking question quality…",
  "Astra is removing duplicates…",
  "Astra is validating answers…",
  "Astra is personalizing the final quiz…",
  "Quiz ready!",
];

function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function normalizeSignature(text) {
  return (text || "").toString().toLowerCase().trim().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
}
function questionSignature(q) {
  return `${normalizeSignature(q.subject)}|${normalizeSignature(q.topic)}|${normalizeSignature(q.question)}`;
}
const USED_SIGNATURES_KEY = "learnai_used_question_signatures";
function getUsedSignatures() {
  try {
    const raw = window.localStorage.getItem(USED_SIGNATURES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (e) { return new Set(); }
}
function addUsedSignatures(sigs) {
  try {
    const merged = Array.from(new Set([...Array.from(getUsedSignatures()), ...sigs])).slice(-800);
    window.localStorage.setItem(USED_SIGNATURES_KEY, JSON.stringify(merged));
  } catch (e) { /* storage unavailable — safe to skip */ }
}

/* ---- Knowledge base: facts derived from the curated question bank ------- */
const FACTS = QUESTION_BANK.map((q, i) => ({
  id: `fact_${i}`, subject: q.subject, topic: q.topic, difficulty: q.difficulty,
  baseQuestion: q.question, options: q.options, correctIndex: q.correctIndex, explanation: q.explanation,
}));

function buildHint(fact) {
  const term = fact.options[fact.correctIndex];
  let h = fact.explanation.split(". ")[0];
  try {
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
    h = h.replace(re, "this concept");
  } catch (e) { /* ignore malformed regex source */ }
  return `Think about: ${h}.`;
}

function mcqFromFact(fact) {
  return { type: "MCQ", subject: fact.subject, topic: fact.topic, difficulty: fact.difficulty, question: fact.baseQuestion, options: fact.options, correctIndex: fact.correctIndex, explanation: fact.explanation, hint: buildHint(fact) };
}
function trueFalseFromFact(fact, makeTrue) {
  const stem = fact.baseQuestion.replace(/\?$/, "");
  if (makeTrue) {
    const text = fact.options[fact.correctIndex];
    return { type: "True/False", subject: fact.subject, topic: fact.topic, difficulty: fact.difficulty, question: `True or False: "${text}" correctly answers — ${stem}.`, options: ["True", "False"], correctIndex: 0, explanation: fact.explanation, hint: buildHint(fact) };
  }
  const wrongIdx = (fact.correctIndex + 1) % fact.options.length;
  const text = fact.options[wrongIdx];
  return { type: "True/False", subject: fact.subject, topic: fact.topic, difficulty: fact.difficulty, question: `True or False: "${text}" correctly answers — ${stem}.`, options: ["True", "False"], correctIndex: 1, explanation: fact.explanation, hint: buildHint(fact) };
}
function multiSelectFromFact(fact, siblingFacts) {
  const sameTopic = siblingFacts.filter((f) => f.topic === fact.topic && f.id !== fact.id);
  const second = sameTopic[0] || siblingFacts.find((f) => f.subject === fact.subject && f.id !== fact.id);
  const correctTexts = [fact.options[fact.correctIndex]];
  if (second) correctTexts.push(second.options[second.correctIndex]);
  const wrongPool = [];
  fact.options.forEach((o, i) => { if (i !== fact.correctIndex) wrongPool.push(o); });
  if (second) second.options.forEach((o, i) => { if (i !== second.correctIndex) wrongPool.push(o); });
  while (wrongPool.length < 2) wrongPool.push("None of the other statements apply");
  let combined = [...correctTexts, ...wrongPool.slice(0, Math.max(2, 4 - correctTexts.length))].slice(0, 4);
  while (combined.length < 4) combined.push("None of the above");
  combined = shuffle(combined);
  const correctIndexes = combined.map((t, i) => (correctTexts.includes(t) ? i : -1)).filter((i) => i >= 0);
  if (correctIndexes.length < 2) return null;
  return { type: "Multiple Select", subject: fact.subject, topic: fact.topic, difficulty: fact.difficulty, question: `Select all statements that correctly relate to ${fact.topic}:`, options: combined, correctIndexes, explanation: fact.explanation + (second ? ` Also: ${second.explanation}` : ""), hint: buildHint(fact) };
}
function shortAnswerFromFact(fact) {
  return { type: "Short Answer", subject: fact.subject, topic: fact.topic, difficulty: fact.difficulty, question: fact.baseQuestion, expectedAnswer: fact.options[fact.correctIndex], explanation: fact.explanation, hint: buildHint(fact) };
}

function buildCandidatePool({ subject, topic, qType }) {
  let facts = FACTS.filter((f) => f.subject === subject);
  if (topic && topic !== "All Topics") facts = facts.filter((f) => f.topic === topic);
  if (facts.length === 0) facts = FACTS.filter((f) => f.subject === subject);
  const out = [];
  facts.forEach((f) => {
    if (qType === "True/False") { out.push(trueFalseFromFact(f, true)); out.push(trueFalseFromFact(f, false)); }
    else if (qType === "Multiple Select") { const q = multiSelectFromFact(f, facts); if (q) out.push(q); }
    else if (qType === "Short Answer") out.push(shortAnswerFromFact(f));
    else out.push(mcqFromFact(f));
  });
  return out;
}

function adaptiveDistribution(n) {
  const easy = Math.round(n * 0.3);
  const medium = Math.round(n * 0.5);
  const hard = Math.max(0, n - easy - medium);
  return { easy, medium, hard };
}

/* ---- Local generation engine (Astra's offline fallback) ----------------- */
function localAstraGenerate({ subject, topic, difficulty, numQuestions, qType, opts, excludeSignatures, excludeWithin }) {
  const pool = buildCandidatePool({ subject, topic, qType });
  const usedSigs = new Set([...(excludeSignatures || []), ...(excludeWithin || []).map(questionSignature)]);
  const unused = pool.filter((q) => !usedSigs.has(questionSignature(q)));
  // Prefer never-seen questions, but don't starve the quiz if the local pool is small.
  const ordered = unused.length >= Math.min(numQuestions, pool.length) ? unused : [...unused, ...pool.filter((q) => usedSigs.has(questionSignature(q)))];

  let selected = [];
  if (difficulty && difficulty !== "Adaptive") {
    const want = difficulty.toLowerCase();
    const matched = ordered.filter((q) => q.difficulty === want);
    selected = matched.length ? matched : ordered;
  } else {
    const dist = adaptiveDistribution(numQuestions);
    ["easy", "medium", "hard"].forEach((lvl) => {
      const bucket = shuffle(ordered.filter((q) => q.difficulty === lvl));
      selected = selected.concat(bucket.slice(0, dist[lvl]));
    });
    if (selected.length < numQuestions) {
      const chosen = new Set(selected.map(questionSignature));
      const rest = shuffle(ordered.filter((q) => !chosen.has(questionSignature(q))));
      selected = selected.concat(rest.slice(0, numQuestions - selected.length));
    }
  }

  if ((!topic || topic === "All Topics") && opts && opts.weakAreas) {
    const weakTopics = RECOMMENDED.filter((r) => r.subject === subject).map((r) => r.topic);
    if (weakTopics.length) selected.sort((a, b) => (weakTopics.includes(b.topic) ? 1 : 0) - (weakTopics.includes(a.topic) ? 1 : 0));
  }

  return shuffle(selected).slice(0, numQuestions);
}

const AstraAI = {
  async generateQuiz(payload) {
    if (ASTRA_CONFIG.endpoint) {
      try {
        const res = await fetch(ASTRA_CONFIG.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(ASTRA_CONFIG.apiKey ? { Authorization: `Bearer ${ASTRA_CONFIG.apiKey}` } : {}) },
          body: JSON.stringify({ model: ASTRA_CONFIG.model, system: ASTRA_SYSTEM_PROMPT, payload }),
        });
        if (!res.ok) throw new Error(`Astra API responded with ${res.status}`);
        const data = await res.json();
        if (!data || !Array.isArray(data.quiz)) throw new Error("Malformed Astra response");
        return { source: "astra-gpt", questions: data.quiz.map((q) => ({ ...q, _source: "astra-gpt" })) };
      } catch (err) {
        console.warn("[Astra GPT] request failed — using local fallback engine:", err && err.message);
      }
    }
    const questions = localAstraGenerate(payload).map((q) => ({ ...q, _source: "local-fallback" }));
    return { source: "local-fallback", questions };
  },
};

/* ---- Validation ----------------------------------------------------------*/
function validateAIQuestion(q) {
  if (!q || typeof q.question !== "string" || !q.question.trim()) return false;
  if (!q.subject || !q.topic || !q.difficulty) return false;
  if (!["easy", "medium", "hard"].includes(q.difficulty)) return false;
  if (q.type === "MCQ" || q.type === "True/False") {
    if (!Array.isArray(q.options)) return false;
    if (q.type === "MCQ" && q.options.length !== 4) return false;
    if (q.type === "True/False" && q.options.length !== 2) return false;
    if (new Set(q.options.map(normalizeSignature)).size !== q.options.length) return false;
    if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length) return false;
  } else if (q.type === "Multiple Select") {
    if (!Array.isArray(q.options) || q.options.length !== 4) return false;
    if (new Set(q.options.map(normalizeSignature)).size !== q.options.length) return false;
    if (!Array.isArray(q.correctIndexes) || q.correctIndexes.length < 2 || q.correctIndexes.length > 3) return false;
    if (q.correctIndexes.some((i) => i < 0 || i >= q.options.length)) return false;
  } else if (q.type === "Short Answer") {
    if (!q.expectedAnswer || !q.expectedAnswer.toString().trim()) return false;
  } else {
    return false;
  }
  return true;
}
function validateQuizQuestions(list, config) {
  const opts = (config && config.opts) || {};
  const seen = new Set();
  const valid = []; let invalidCount = 0, duplicateCount = 0;
  list.forEach((q) => {
    if (!validateAIQuestion(q)) { invalidCount++; return; }
    if (opts.explanations && (!q.explanation || !q.explanation.trim())) { invalidCount++; return; }
    if (opts.hints && (!q.hint || !q.hint.trim())) { invalidCount++; return; }
    const sig = questionSignature(q);
    if (seen.has(sig)) { duplicateCount++; return; }
    seen.add(sig); valid.push(q);
  });
  return { valid, invalidCount, duplicateCount };
}
function dedupeAgainstUsed(list, usedSignatures) {
  const seen = new Set(); const out = [];
  list.forEach((q) => {
    const sig = questionSignature(q);
    if (seen.has(sig) || usedSignatures.has(sig)) return;
    seen.add(sig); out.push(q);
  });
  return out;
}

/* ---- Orchestrator: batching, buffer, retries, progress ------------------ */
async function runAstraGeneration(config, callbacks = {}) {
  const { onStep = () => {}, onProgress = () => {} } = callbacks;
  const { subject, topic, difficulty, qType, opts = {}, studentProfile = {} } = config;
  const requestedCount = Math.max(5, Math.min(100, config.numQuestions));
  const generationTarget = Math.ceil(requestedCount * 1.2);
  const batchSize = 20;

  onStep(0); await wait(300);
  onStep(1); await wait(260);
  onStep(2); await wait(260);
  onStep(3); await wait(220);

  const usedSignatures = getUsedSignatures();
  let allCandidates = [];
  let rawGenerated = 0;
  onStep(4);
  for (let got = 0; got < generationTarget; ) {
    const batchTarget = Math.min(batchSize, generationTarget - got);
    const { source, questions } = await AstraAI.generateQuiz({ subject, topic, difficulty, numQuestions: batchTarget, qType, opts, studentProfile, excludeSignatures: usedSignatures, excludeWithin: allCandidates });
    allCandidates = allCandidates.concat(questions);
    got += questions.length; rawGenerated = got;
    onProgress({ phase: "generating", generated: rawGenerated, target: generationTarget });
    await wait(200);
    if (questions.length === 0) break;
  }

  onStep(5); await wait(240);
  const { valid, invalidCount, duplicateCount } = validateQuizQuestions(allCandidates, { opts });
  onProgress({ phase: "validated", validated: valid.length, target: generationTarget });

  onStep(6); await wait(220);
  const unique = dedupeAgainstUsed(valid, usedSignatures);
  onProgress({ phase: "unique", unique: unique.length, target: generationTarget });

  onStep(7); await wait(180);
  onStep(8); await wait(220);

  const finalQuestions = shuffle(unique).slice(0, requestedCount).map((q, i) => ({ ...q, uid: i, id: `aq_${i}` }));
  const shortfall = finalQuestions.length < requestedCount;

  onStep(9); await wait(150);

  addUsedSignatures(finalQuestions.map(questionSignature));

  return {
    questions: finalQuestions,
    meta: {
      source: allCandidates.length ? (allCandidates[0]._source || "local-fallback") : "local-fallback",
      requested: requestedCount, provided: finalQuestions.length, shortfall,
      invalidCount, duplicateCount,
    },
  };
}
function isAnswerCorrect(q, ans) {
  if (q.type === "Multiple Select") {
    if (!Array.isArray(ans) || ans.length === 0) return false;
    const a = [...ans].sort().join(",");
    const b = [...(q.correctIndexes || [])].sort().join(",");
    return a === b;
  }
  if (q.type === "Short Answer") {
    if (typeof ans !== "string" || !ans.trim()) return false;
    const norm = (s) => s.toLowerCase().trim().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
    const a = norm(ans); const b = norm(q.expectedAnswer || "");
    return !!b && (a === b || a.includes(b));
  }
  return ans === q.correctIndex;
}
function computeResults(quiz, answers) {
  const topicStats = {}; const difficultyStats = {}; let correct = 0;
  quiz.forEach((q) => {
    const isCorrect = isAnswerCorrect(q, answers[q.uid]);
    if (isCorrect) correct++;
    topicStats[q.topic] = topicStats[q.topic] || { correct: 0, total: 0 };
    topicStats[q.topic].total++; if (isCorrect) topicStats[q.topic].correct++;
    difficultyStats[q.difficulty] = difficultyStats[q.difficulty] || { correct: 0, total: 0 };
    difficultyStats[q.difficulty].total++; if (isCorrect) difficultyStats[q.difficulty].correct++;
  });
  const total = quiz.length;
  const scorePct = total ? Math.round((correct / total) * 100) : 0;
  return { correct, incorrect: total - correct, total, scorePct, topicStats, difficultyStats };
}
function buildFeedback(results) {
  const entries = Object.entries(results.topicStats).map(([topic, s]) => ({ topic, ratio: s.correct / s.total }));
  entries.sort((a, b) => a.ratio - b.ratio);
  const weakest = entries[0]; const strongest = entries[entries.length - 1];
  let overall;
  if (results.scorePct >= 90) overall = "Excellent! You've mastered this material.";
  else if (results.scorePct >= 70) overall = "Great job! You have a strong understanding of the fundamentals.";
  else if (results.scorePct >= 50) overall = "Good effort. A bit more revision will solidify these concepts.";
  else overall = "This topic needs focused review — let's build up the fundamentals first.";
  const lines = [overall];
  if (strongest) lines.push(`Your strongest area is ${strongest.topic}, with ${Math.round(strongest.ratio * 100)}% accuracy.`);
  if (weakest && weakest.topic !== (strongest && strongest.topic)) {
    lines.push(`${weakest.topic} needs more practice — you scored ${Math.round(weakest.ratio * 100)}% there.`);
    lines.push(`Recommended next step: review the core concepts of ${weakest.topic}, then retry a medium-difficulty quiz on it.`);
  } else if (weakest) {
    lines.push(`Keep reinforcing ${weakest.topic} with a follow-up quiz in a few days.`);
  }
  return { overall, lines, weakTopic: weakest ? weakest.topic : null };
}
function fmtTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function generateNotes(subject, topic) {
  const items = QUESTION_BANK.filter((q) => q.subject === subject && (topic === "All Topics" || q.topic === topic));
  const byTopic = {};
  items.forEach((q) => {
    byTopic[q.topic] = byTopic[q.topic] || [];
    if (!byTopic[q.topic].includes(q.explanation)) byTopic[q.topic].push(q.explanation);
  });
  const sections = Object.entries(byTopic).map(([t, bullets]) => ({ heading: t, bullets }));
  const summary = `A concise overview of ${topic === "All Topics" ? subject : topic}, covering ${sections.length} key concept area${sections.length > 1 ? "s" : ""} with the core facts you need to remember.`;
  return { title: `${subject} — ${topic === "All Topics" ? "Complete Notes" : topic}`, summary, sections };
}
function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error("Could not load PDF reader"));
    document.body.appendChild(script);
  });
}
async function extractPdfText(file) {
  const pdfjsLib = await loadPdfJs();
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let text = "";
  const maxPages = Math.min(pdf.numPages, 15);
  for (let p = 1; p <= maxPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    text += content.items.map((it) => it.str).join(" ") + " ";
  }
  return text;
}
function classifyPdfText(text) {
  const lower = text.toLowerCase();
  let best = { subject: null, topic: null, score: 0 };
  SUBJECTS.forEach((subject) => {
    TOPICS_BY_SUBJECT[subject].filter((t) => t !== "All Topics").forEach((topic) => {
      const needle = topic.toLowerCase();
      const count = lower.split(needle).length - 1;
      if (count > best.score) best = { subject, topic, score: count };
    });
  });
  if (best.score === 0) {
    SUBJECTS.forEach((subject) => {
      const count = lower.split(subject.toLowerCase()).length - 1;
      if (count > best.score) best = { subject, topic: "All Topics", score: count };
    });
  }
  if (!best.subject) return { subject: "Computer Networks", topic: "All Topics" };
  return { subject: best.subject, topic: best.topic };
}
function assistantReply(text) {
  const lower = text.toLowerCase();
  const topicMatch = QUESTION_BANK.find((q) => lower.includes(q.topic.toLowerCase()));
  if (topicMatch) return `${topicMatch.explanation} Want me to generate a quick quiz on ${topicMatch.topic} to test this?`;
  const subjMatch = SUBJECTS.find((s) => lower.includes(s.toLowerCase()) || lower.includes(s.toLowerCase().split(" ")[0]));
  if (subjMatch) return `I can help with ${subjMatch}! Topics I have ready: ${TOPICS_BY_SUBJECT[subjMatch].filter((t) => t !== "All Topics").join(", ")}. Ask me about any of these, or head to the AI Quiz Generator to practice.`;
  return `I can help explain concepts in Computer Networks, DBMS, C++, Data Structures, Operating Systems, AI/ML, Discrete Mathematics, Communication English, and Analogy & Reasoning. Try asking something like "What is subnetting?" or "Explain 3NF".`;
}
/*
  A brand-new account starts at zero — no pre-filled quiz count, score, streak,
  or XP. Real numbers only show up once the person actually does something.
  (Password is kept in-memory for this session only, purely so "log in" can
  check it against what you typed at signup. This is NOT secure storage — a
  real deployment must hash passwords and check them on a server, never in
  client-side React state.)
*/
function makeUserFromForm(form) {
  return {
    id: `u_${Date.now()}`, name: form.fullName, email: form.email, password: form.password,
    college: form.college, degree: form.degree, branch: form.branch, year: form.year,
    level: "Beginner", streak: 0, xp: 0, totalQuizzes: 0, avgScore: null, studyHours: 0, topicsMastered: 0,
    joined: "Just now", active: true, quizzes: 0,
  };
}

/* ----------------------------------------------------------------------- */
/* Small shared UI                                                         */
/* ----------------------------------------------------------------------- */
function Glass({ children, style, className = "", ...rest }) {
  return (
    <div className={className} style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 18, ...style }} {...rest}>
      {children}
    </div>
  );
}
function Pill({ children, color = C.blue, style }) {
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full" style={{ background: `${color}22`, color, border: `1px solid ${color}44`, ...style }}>{children}</span>;
}
function CircularProgress({ value, size = 84, stroke = 8, color = C.blue, label }) {
  const r = (size - stroke) / 2; const c = 2 * Math.PI * r; const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset 0.8s ease" }} />
        <text x="50%" y="52%" textAnchor="middle" fill={C.text} fontSize={16} fontWeight={700} fontFamily="Space Grotesk">{value}%</text>
      </svg>
      {label && <span className="text-xs text-center" style={{ color: C.textDim, maxWidth: size + 20 }}>{label}</span>}
    </div>
  );
}
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Glass style={{ padding: 18 }} className="flex items-center gap-4">
      <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 14, background: `${color}20` }}>
        <Icon size={20} color={color} />
      </div>
      <div className="min-w-0">
        <div className="text-xl font-semibold truncate" style={{ fontFamily: "Space Grotesk", color: C.text }}>{value}</div>
        <div className="text-xs" style={{ color: C.textDim }}>{label}</div>
      </div>
    </Glass>
  );
}
function Toast({ message }) {
  if (!message) return null;
  return <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text, maxWidth: 300 }}>{message}</div>;
}
function TextField({ label, type = "text", value, onChange, placeholder, icon: Icon }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: C.textDim }}>{label}</label>
      <div className="flex items-center gap-2 px-3.5" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 12 }}>
        {Icon && <Icon size={15} color={C.textFaint} />}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full bg-transparent outline-none py-2.5 text-sm" style={{ color: C.text }} />
      </div>
    </div>
  );
}
function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: C.textDim }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 12, color: C.text, padding: "10px 12px", fontSize: 14, outline: "none" }}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Chip({ active, children, onClick }) {
  return (
    <button onClick={onClick} className="px-3.5 py-2 rounded-xl text-sm font-medium transition-colors"
      style={{ background: active ? GRAD : C.panelSolid, color: active ? "#fff" : C.textDim, border: `1px solid ${active ? "transparent" : C.panelBorder}` }}>
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------------- */
/* Animated background — floating books & pens                             */
/* ----------------------------------------------------------------------- */
const FLOATING_ITEMS = [
  { Icon: BookOpen, top: "8%", left: "6%", size: 50, delay: "0s", dur: "11s", rot: "-10deg" },
  { Icon: PenTool, top: "16%", left: "86%", size: 34, delay: "1.1s", dur: "8.5s", rot: "14deg" },
  { Icon: Book, top: "72%", left: "9%", size: 44, delay: "0.5s", dur: "12s", rot: "7deg" },
  { Icon: Pencil, top: "84%", left: "72%", size: 30, delay: "2s", dur: "9s", rot: "-18deg" },
  { Icon: BookOpen, top: "42%", left: "93%", size: 38, delay: "0.3s", dur: "13s", rot: "5deg" },
  { Icon: Bookmark, top: "58%", left: "50%", size: 26, delay: "1.7s", dur: "10s", rot: "-6deg" },
  { Icon: PenTool, top: "4%", left: "46%", size: 28, delay: "2.4s", dur: "9.5s", rot: "22deg" },
  { Icon: Book, top: "90%", left: "32%", size: 36, delay: "0.9s", dur: "11.5s", rot: "-12deg" },
  { Icon: Pencil, top: "27%", left: "18%", size: 24, delay: "1.4s", dur: "7.5s", rot: "30deg" },
  { Icon: BookOpen, top: "64%", left: "80%", size: 32, delay: "2.1s", dur: "10.5s", rot: "-20deg" },
  { Icon: Book, top: "12%", left: "65%", size: 28, delay: "0.7s", dur: "8s", rot: "16deg" },
  { Icon: PenTool, top: "48%", left: "4%", size: 26, delay: "1.9s", dur: "9s", rot: "-24deg" },
];
function FloatingBackground() {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 20% 20%, rgba(194,24,91,0.10), transparent 45%), radial-gradient(circle at 80% 75%, rgba(212,175,106,0.08), transparent 50%)` }} />
      {FLOATING_ITEMS.map((it, i) => (
        <div key={i} className="float-item" style={{ position: "absolute", top: it.top, left: it.left, animationDuration: it.dur, animationDelay: it.delay, "--float-rot": it.rot }}>
          <it.Icon size={it.size} color={C.textFaint} style={{ opacity: 0.16 }} strokeWidth={1.4} />
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Landing page                                                            */
/* ----------------------------------------------------------------------- */
const FEATURES = [
  { icon: Brain, title: "Personalized Learning", desc: "A study path that adapts to your pace, strengths, and goals." },
  { icon: Sparkles, title: "AI Quiz Generation", desc: "Instant, topic-specific quizzes tuned to your current level." },
  { icon: Zap, title: "Adaptive Difficulty", desc: "Questions get harder or easier automatically as you improve." },
  { icon: BarChart3, title: "Performance Analytics", desc: "Clear charts on accuracy, topics, and progress over time." },
  { icon: CalendarDays, title: "Smart Study Plans", desc: "A daily plan built around your exam date and available time." },
  { icon: Lightbulb, title: "Instant AI Feedback", desc: "Know exactly what to revise right after every quiz." },
];
function ReviewsSection() {
  const [reviews, setReviews] = useState(() => getReviews());
  useEffect(() => { setReviews(getReviews()); }, []);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">
      <div className="flex items-center justify-center gap-2 mb-1">
        <h2 className="text-xl font-semibold text-center" style={{ fontFamily: "Space Grotesk", color: C.text }}>What students say</h2>
      </div>
      {reviews.length > 0 ? (
        <>
          <div className="flex items-center justify-center gap-1.5 mb-8">
            {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={16} fill={n <= Math.round(avg) ? C.amber : "none"} color={C.amber} />)}
            <span className="text-sm font-medium ml-1" style={{ color: C.text }}>{avg.toFixed(1)}</span>
            <span className="text-xs" style={{ color: C.textFaint }}>· {reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.slice(-6).reverse().map((r, i) => (
              <Glass key={i} style={{ padding: 20 }}>
                <div className="flex items-center gap-1 mb-2">{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={13} fill={n <= r.rating ? C.amber : "none"} color={C.amber} />)}</div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: C.textDim }}>{r.comment}</p>
                <div className="text-xs font-medium" style={{ color: C.text }}>{r.name}</div>
                <div className="text-[11px]" style={{ color: C.textFaint }}>{r.date}</div>
              </Glass>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center p-8 rounded-3xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.panelBorder}` }}>
          <Star size={20} color={C.textFaint} className="mx-auto mb-2" />
          <p className="text-sm" style={{ color: C.textDim }}>No reviews yet — register and be the first to share your experience.</p>
        </div>
      )}
    </div>
  );
}
function Landing({ onStart, stats }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, position: "relative" }}>
      <FloatingBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
      <div className="flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 10, background: GRAD }}><GraduationCap size={18} color="#fff" /></div>
          <span className="font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text, fontSize: 17 }}>LearnAI</span>
        </div>
        <button onClick={() => onStart("login")} className="text-sm font-medium px-4 py-2 rounded-xl" style={{ color: C.text, border: `1px solid ${C.panelBorder}` }}>Log in</button>
      </div>

      <div className="max-w-4xl mx-auto text-center px-6 pt-10 pb-16">
        <Pill color={C.cyan}><Sparkles size={12} /> Powered by the Astra AI Engine</Pill>
        <h1 className="text-4xl md:text-5xl font-semibold mt-5 leading-tight" style={{ fontFamily: "Space Grotesk", color: C.text }}>
          Your AI-Powered Personalized Learning Companion
        </h1>
        <p className="text-base mt-5 max-w-2xl mx-auto leading-relaxed" style={{ color: C.textDim }}>
          Learn at your own pace with personalized study paths, AI-generated quizzes, adaptive difficulty, and intelligent performance analytics.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <button onClick={() => onStart("register")} className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm" style={{ background: GRAD, color: "#fff" }}>
            Start Learning <ArrowRight size={16} />
          </button>
          <button onClick={() => onStart("register")} className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text }}>
            <Wand2 size={16} /> Generate Quiz
          </button>
        </div>
        {stats && stats.students > 0 ? (
          <div className="grid grid-cols-2 gap-6 mt-14 max-w-xs mx-auto">
            <div><div className="text-2xl font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>{stats.students}</div><div className="text-xs mt-1" style={{ color: C.textFaint }}>Student{stats.students === 1 ? "" : "s"}</div></div>
            <div><div className="text-2xl font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>{stats.quizzes}</div><div className="text-xs mt-1" style={{ color: C.textFaint }}>Quiz{stats.quizzes === 1 ? "" : "zes"} generated</div></div>
          </div>
        ) : (
          <div className="mt-10"><Pill color={C.cyan}><Sparkles size={12} /> Just launched — be one of our first students</Pill></div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold text-center mb-8" style={{ fontFamily: "Space Grotesk", color: C.text }}>Everything you need to learn faster</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Glass key={i} style={{ padding: 22 }}>
              <div className="flex items-center justify-center mb-3" style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(76,127,255,0.14)" }}>
                <f.icon size={19} color={C.blue} />
              </div>
              <div className="font-medium text-sm mb-1.5" style={{ color: C.text }}>{f.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: C.textDim }}>{f.desc}</div>
            </Glass>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold text-center mb-8" style={{ fontFamily: "Space Grotesk", color: C.text }}>How it works</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {["Set your subjects & level", "Get a personalized study plan", "Take AI-generated quizzes", "Review AI feedback & improve"].map((s, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-3 flex items-center justify-center font-semibold" style={{ width: 34, height: 34, borderRadius: 99, background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.blue }}>{i + 1}</div>
              <div className="text-xs leading-relaxed" style={{ color: C.textDim }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <div className="p-8 rounded-3xl flex flex-col items-center gap-3" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.panelBorder}` }}>
          <Sparkles size={22} color={C.cyan} />
          <p className="text-sm leading-relaxed max-w-md" style={{ color: C.textDim }}>
            Every quiz ends with Astra AI feedback that names your weakest topic and tells you exactly what to review next — not just a score.
          </p>
        </div>
      </div>

      <ReviewsSection />

      <div className="border-t px-6 py-8" style={{ borderColor: C.panelBorder }}>
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs" style={{ color: C.textFaint }}>© 2026 LearnAI · Learn Smarter. Practice Better. Grow Faster.</span>
        </div>
      </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Auth: Login / Register                                                  */
/* ----------------------------------------------------------------------- */
function AuthShell({ children }) {
  return (
    <div className="flex" style={{ minHeight: "100vh", background: C.bg, position: "relative" }}>
      <FloatingBackground />
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden" style={{ width: "44%", background: `linear-gradient(160deg, ${C.purple}, ${C.bg} 70%)`, zIndex: 1 }}>
        <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: C.blue, opacity: 0.25, filter: "blur(90px)", top: -90, right: -90 }} />
        <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: C.cyan, opacity: 0.14, filter: "blur(100px)", bottom: -60, left: -60 }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 10, background: GRAD }}><GraduationCap size={18} color="#fff" /></div>
            <span className="font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text, fontSize: 17 }}>LearnAI</span>
          </div>
          <h2 className="text-3xl font-semibold leading-tight mb-4" style={{ fontFamily: "Space Grotesk", color: C.text }}>Learn Smarter.<br />Practice Better.<br />Grow Faster.</h2>
          <p className="text-sm leading-relaxed" style={{ color: C.textDim, maxWidth: 320 }}>Personalized study paths and instant quizzes, powered by the Astra AI engine.</p>
        </div>
        <div className="relative z-10 space-y-4">
          {["Personalized paths tuned to your level", "Instant quizzes generated by Astra AI", "Real-time analytics & feedback"].map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex items-center justify-center shrink-0" style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(255,255,255,0.12)" }}><CheckCircle2 size={14} color={C.cyan} /></div>
              <span className="text-sm" style={{ color: C.textDim }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-10" style={{ position: "relative", zIndex: 1 }}>
        <div className="w-full" style={{ maxWidth: 440 }}>
          <div className="flex lg:hidden items-center gap-2.5 justify-center mb-6">
            <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 10, background: GRAD }}><GraduationCap size={18} color="#fff" /></div>
            <span className="font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text, fontSize: 17 }}>LearnAI</span>
          </div>
          <Glass style={{ padding: 28 }}>{children}</Glass>
        </div>
      </div>
    </div>
  );
}
function LoginPage({ onLogin, onGoRegister, onGoOwner }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    const err = onLogin(email, password);
    if (err) setError(err);
  };
  return (
    <AuthShell>
      <Pill color={C.cyan}><Sparkles size={12} /> Astra AI Engine</Pill>
      <h1 className="text-xl font-semibold mt-3 mb-1" style={{ fontFamily: "Space Grotesk", color: C.text }}>Welcome back</h1>
      <p className="text-sm mb-6" style={{ color: C.textDim }}>Log in to continue your learning streak.</p>
      <div className="space-y-4">
        <TextField label="Email" type="email" icon={Mail} value={email} onChange={(v) => { setEmail(v); setError(""); }} placeholder="you@college.edu" />
        <TextField label="Password" type="password" icon={Lock} value={password} onChange={(v) => { setPassword(v); setError(""); }} placeholder="••••••••" />
      </div>
      {error && <p className="text-xs mt-2" style={{ color: C.red }}>{error}</p>}
      <button onClick={submit} className="w-full mt-6 py-3 rounded-xl font-semibold text-sm" style={{ background: GRAD, color: "#fff" }}>Log in</button>
      <p className="text-xs text-center mt-5" style={{ color: C.textFaint }}>
        New here? <button onClick={onGoRegister} style={{ color: C.blue, fontWeight: 600 }}>Create an account</button>
      </p>
      <p className="text-[11px] text-center mt-8" style={{ color: C.textFaint, opacity: 0.6 }}>
        Product owner? <button onClick={onGoOwner} style={{ color: C.textFaint, textDecoration: "underline" }}>Owner sign-in</button>
      </p>
    </AuthShell>
  );
}
function OwnerLoginPage({ onOwnerLogin, onBack }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    const err = onOwnerLogin(passcode);
    if (err) setError(err);
  };
  return (
    <AuthShell>
      <Pill color={C.amber}><Shield size={12} /> Owner access</Pill>
      <h1 className="text-xl font-semibold mt-3 mb-1" style={{ fontFamily: "Space Grotesk", color: C.text }}>Owner sign-in</h1>
      <p className="text-sm mb-6" style={{ color: C.textDim }}>This unlocks the admin dashboard — visible only to you, never to students.</p>
      <TextField label="Owner passcode" type="password" icon={Lock} value={passcode} onChange={(v) => { setPasscode(v); setError(""); }} placeholder="••••••••" />
      {error && <p className="text-xs mt-2" style={{ color: C.red }}>{error}</p>}
      <button onClick={submit} className="w-full mt-6 py-3 rounded-xl font-semibold text-sm" style={{ background: GRAD, color: "#fff" }}>Enter admin dashboard</button>
      <button onClick={onBack} className="w-full mt-2.5 py-3 rounded-xl font-medium text-sm" style={{ background: "transparent", border: `1px solid ${C.panelBorder}`, color: C.textDim }}>Back</button>
    </AuthShell>
  );
}
/* ---- Identity check: honest, client-checkable validation only ----------- */
/*
  This checks FORMAT and PLAUSIBILITY (real name shape, real email shape/domain,
  minimum age), and proves the signer controls the email address via a one-time
  code. It does NOT and CANNOT verify a government ID from the browser alone —
  that needs a licensed identity-verification provider (e.g. Persona, Onfido,
  DigiLocker) wired up through a secure backend. Faking that check here would
  just teach people to trust a checkmark that means nothing, so it's left out
  on purpose — see the note rendered in the verify step below.
*/
function validateNameFormat(name) {
  const n = (name || "").trim();
  return n.length >= 2 && n.length <= 60 && /^[A-Za-z][A-Za-z '.-]*$/.test(n);
}
const DISPOSABLE_EMAIL_DOMAINS = ["mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com", "yopmail.com", "trashmail.com", "fakeinbox.com", "getnada.com"];
const PLACEHOLDER_EMAIL_DOMAINS = ["example.com", "test.com", "fake.com", "asdf.com", "email.com", "abc.com", "domain.com"];
function validateEmailFormat(email) {
  const e = (email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return { valid: false, reason: "That doesn't look like a valid email address." };
  const domain = e.split("@")[1].toLowerCase();
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) return { valid: false, reason: "Disposable email addresses aren't accepted." };
  if (PLACEHOLDER_EMAIL_DOMAINS.includes(domain)) return { valid: false, reason: "That looks like a placeholder email — please use a real address." };
  return { valid: true };
}
function calculateAge(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}
function generateOtp() { return String(Math.floor(100000 + Math.random() * 900000)); }
const MIN_SIGNUP_AGE = 16;

function RegisterPage({ onRegister, onGoLogin }) {
  const [step, setStep] = useState("details"); // "details" | "verify"
  const [form, setForm] = useState({ fullName: "", email: "", password: "", dob: "", college: "", degree: "B.Tech", branch: "Computer Science", year: "1st Year" });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendState, setSendState] = useState("idle"); // idle | sending | sent | unconfigured | cooldown | failed
  const [retryAfter, setRetryAfter] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const [codeOk, setCodeOk] = useState(false);
  const mode = getVerificationMode();
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const nameCheck = validateNameFormat(form.fullName);
  const emailCheck = validateEmailFormat(form.email);
  const age = calculateAge(form.dob);
  const ageCheck = age !== null && age >= MIN_SIGNUP_AGE;
  const detailsValid = nameCheck && emailCheck.valid && ageCheck && form.password.trim().length >= 6 && form.college.trim();

  const dispatchCode = async (email, code) => {
    setSendState("sending");
    const result = await requestEmailCode(email, code);
    if (result.sent) setSendState("sent");
    else if (result.reason === "not-configured") setSendState("unconfigured");
    else if (result.reason === "cooldown") { setRetryAfter(result.retryAfter || 30); setSendState("cooldown"); }
    else setSendState("failed");
  };

  const handleContinue = () => {
    const errs = {};
    if (!nameCheck) errs.fullName = "Enter your name using letters only (2–60 characters).";
    if (!emailCheck.valid) errs.email = emailCheck.reason;
    if (!form.dob) errs.dob = "Date of birth is required.";
    else if (!ageCheck) errs.dob = `You must be at least ${MIN_SIGNUP_AGE} to create an account.`;
    if (form.password.trim().length < 6) errs.password = "Password must be at least 6 characters.";
    if (!form.college.trim()) errs.college = "College / University is required.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const code = generateOtp();
    setOtp(code); setOtpInput(""); setOtpError("");
    setStep("verify");
    dispatchCode(form.email, code);
  };

  const handleResend = () => {
    const code = generateOtp();
    setOtp(code); setOtpInput(""); setOtpError("");
    dispatchCode(form.email, code);
  };

  const handleVerify = async () => {
    if (verifying) return;
    if (otpInput.trim().length !== 6) { setOtpError("Enter the 6-digit code from your email."); return; }
    setVerifying(true);
    const result = await checkEmailCode(form.email, otpInput.trim(), otp);
    setVerifying(false);
    if (result.valid) { setCodeOk(true); onRegister(form); return; }
    const msgs = {
      expired: "That code has expired. Tap Resend to get a new one.",
      too_many_attempts: "Too many wrong attempts. Tap Resend to get a new code.",
      network: "Couldn't reach the server. Check your connection and try again.",
    };
    setOtpError(msgs[result.reason] || "That code doesn't match. Check your email and try again.");
  };

  if (step === "verify") {
    return (
      <AuthShell>
        <Pill color={C.cyan}><ShieldCheck size={12} /> Identity check</Pill>
        <h1 className="text-xl font-semibold mt-3 mb-1" style={{ fontFamily: "Space Grotesk", color: C.text }}>Verify your email</h1>
        <p className="text-sm mb-5" style={{ color: C.textDim }}>We send a 6-digit code to confirm you own <strong style={{ color: C.text }}>{form.email}</strong>.</p>

        {sendState === "sending" && (
          <div className="flex items-center gap-2 text-xs px-3.5 py-3 rounded-xl mb-5" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.textDim }}>
            <div className="animate-spin" style={{ width: 13, height: 13, borderRadius: 99, border: `2px solid ${C.blue}`, borderTopColor: "transparent" }} /> Sending code to {form.email}…
          </div>
        )}
        {sendState === "sent" && (
          <div className="flex items-center gap-2 text-xs px-3.5 py-3 rounded-xl mb-5" style={{ background: "rgba(63,167,114,0.12)", border: `1px solid ${C.green}44`, color: C.textDim }}>
            <CheckCircle2 size={14} color={C.green} /> Code sent to {form.email}. Check your inbox (and spam folder). It expires in 10 minutes.
            <button onClick={handleResend} className="ml-auto underline shrink-0" style={{ color: C.green }}>Resend</button>
          </div>
        )}
        {sendState === "cooldown" && (
          <div className="flex items-center gap-2 text-xs px-3.5 py-3 rounded-xl mb-5" style={{ background: "rgba(212,175,106,0.12)", border: `1px solid ${C.amber}44`, color: C.textDim }}>
            <AlertTriangle size={14} color={C.amber} /> A code was just sent. Please wait about {retryAfter}s before requesting another.
          </div>
        )}
        {sendState === "failed" && (
          <div className="flex items-center gap-2 text-xs px-3.5 py-3 rounded-xl mb-5" style={{ background: "rgba(228,54,74,0.12)", border: `1px solid ${C.red}44`, color: C.textDim }}>
            <AlertTriangle size={14} color={C.red} /> Couldn't send the email right now. Check the address is correct, then try again.
            <button onClick={handleResend} className="ml-auto underline shrink-0" style={{ color: C.red }}>Try again</button>
          </div>
        )}
        {sendState === "unconfigured" && (
          <div className="p-3.5 rounded-xl mb-5 text-xs leading-relaxed" style={{ background: "rgba(212,175,106,0.12)", border: `1px solid ${C.amber}44`, color: C.textDim }}>
            <strong style={{ color: C.amber }}>Demo mode:</strong> no email service is connected yet (see API_CONFIG / EMAIL_CONFIG at the top of this file and DEPLOY.md), so the code isn't emailed — it's shown here instead. Don't ship this mode to real users.
            <div className="mt-2 text-lg font-mono tracking-widest" style={{ color: C.text }}>{otp}</div>
          </div>
        )}

        <TextField label="Enter the 6-digit code" value={otpInput} onChange={(v) => { setOtpInput(v.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }} placeholder="000000" />
        {otpError && <p className="text-xs mt-2" style={{ color: C.red }}>{otpError}</p>}

        <div className="mt-5 p-3.5 rounded-xl space-y-1.5" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}` }}>
          <div className="text-xs font-medium mb-1" style={{ color: C.textDim }}>Identity check results</div>
          <div className="flex items-center gap-2 text-xs" style={{ color: C.textDim }}><CheckCircle2 size={13} color={C.green} /> Name format looks valid</div>
          <div className="flex items-center gap-2 text-xs" style={{ color: C.textDim }}><CheckCircle2 size={13} color={C.green} /> Email format & domain look valid</div>
          <div className="flex items-center gap-2 text-xs" style={{ color: C.textDim }}><CheckCircle2 size={13} color={C.green} /> Age requirement met ({age}+)</div>
          <div className="flex items-center gap-2 text-xs" style={{ color: codeOk ? C.green : C.textFaint }}>{codeOk ? <CheckCircle2 size={13} color={C.green} /> : <div style={{ width: 13, height: 13, borderRadius: 99, border: `2px solid ${C.textFaint}` }} />} Email ownership verified</div>
        </div>

        <div className="p-3 rounded-xl mt-4 text-xs leading-relaxed flex items-start gap-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.panelBorder}`, color: C.textFaint }}>
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          This confirms the name/email/age are well-formed and that you control this inbox — not a legal identity check. Verifying a real government ID requires a licensed provider wired up on a secure backend, which isn't something a signup form can safely fake.
        </div>

        <button onClick={handleVerify} disabled={verifying} className="w-full mt-5 py-3 rounded-xl font-semibold text-sm" style={{ background: GRAD, color: "#fff", opacity: verifying ? 0.7 : 1 }}>{verifying ? "Verifying…" : "Verify & create account"}</button>
        <button onClick={() => setStep("details")} className="w-full mt-2.5 py-3 rounded-xl font-medium text-sm" style={{ background: "transparent", border: `1px solid ${C.panelBorder}`, color: C.textDim }}>Back</button>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold mb-1" style={{ fontFamily: "Space Grotesk", color: C.text }}>Create your account</h1>
      <p className="text-sm mb-6" style={{ color: C.textDim }}>Start your personalized learning journey.</p>
      <div className="space-y-4">
        <div>
          <TextField label="Full name" icon={User} value={form.fullName} onChange={set("fullName")} placeholder="Your name" />
          {errors.fullName && <p className="text-xs mt-1" style={{ color: C.red }}>{errors.fullName}</p>}
        </div>
        <div>
          <TextField label="Email" type="email" icon={Mail} value={form.email} onChange={set("email")} placeholder="you@college.edu" />
          {errors.email && <p className="text-xs mt-1" style={{ color: C.red }}>{errors.email}</p>}
        </div>
        <div>
          <TextField label="Password" type="password" icon={Lock} value={form.password} onChange={set("password")} placeholder="••••••••" />
          {errors.password && <p className="text-xs mt-1" style={{ color: C.red }}>{errors.password}</p>}
        </div>
        <div>
          <TextField label="Date of birth" type="date" icon={Calendar} value={form.dob} onChange={set("dob")} />
          {errors.dob && <p className="text-xs mt-1" style={{ color: C.red }}>{errors.dob}</p>}
        </div>
        <div>
          <TextField label="College / University" icon={Building2} value={form.college} onChange={set("college")} placeholder="e.g. NIT Surat" />
          {errors.college && <p className="text-xs mt-1" style={{ color: C.red }}>{errors.college}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Degree" value={form.degree} onChange={set("degree")} options={["B.Tech", "B.E.", "M.Tech", "BCA"]} />
          <SelectField label="Branch" value={form.branch} onChange={set("branch")} options={["Computer Science", "IT", "ECE", "Mechanical", "Civil"]} />
        </div>
        <SelectField label="Year / Semester" value={form.year} onChange={set("year")} options={["1st Year", "2nd Year", "3rd Year", "4th Year"]} />
      </div>
      <button onClick={handleContinue} className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm" style={{ background: GRAD, color: "#fff" }}><ShieldCheck size={16} /> Continue to identity check</button>
      <p className="text-xs text-center mt-5" style={{ color: C.textFaint }}>
        Already have an account? <button onClick={onGoLogin} style={{ color: C.blue, fontWeight: 600 }}>Log in</button>
      </p>
    </AuthShell>
  );
}
function OnboardingPage({ onFinish }) {
  const [step, setStep] = useState(0);
  const [subjects, setSubjects] = useState(["Computer Networks"]);
  const [level, setLevel] = useState("Intermediate");
  const [style, setStyle] = useState("Mixed");
  const [time, setTime] = useState("30");
  const [target, setTarget] = useState("University exams");
  const toggleSubject = (s) => setSubjects((arr) => arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]);

  const steps = [
    { title: "What are you studying?", body: (
      <div className="flex flex-wrap gap-2">{SUBJECTS.map((s) => <Chip key={s} active={subjects.includes(s)} onClick={() => toggleSubject(s)}>{s}</Chip>)}</div>
    ) },
    { title: "Current knowledge level", body: (
      <div className="flex flex-wrap gap-2">{["Beginner", "Intermediate", "Advanced"].map((l) => <Chip key={l} active={level === l} onClick={() => setLevel(l)}>{l}</Chip>)}</div>
    ) },
    { title: "Preferred learning style", body: (
      <div className="flex flex-wrap gap-2">{["Conceptual", "Practical", "Mixed"].map((l) => <Chip key={l} active={style === l} onClick={() => setStyle(l)}>{l}</Chip>)}</div>
    ) },
    { title: "Daily study time", body: (
      <div className="flex flex-wrap gap-2">{["15", "30", "60", "90+"].map((t) => <Chip key={t} active={time === t} onClick={() => setTime(t)}>{t} min</Chip>)}</div>
    ) },
    { title: "What's your target?", body: (
      <div className="flex flex-wrap gap-2">{["University exams", "Placement", "Competitive exams", "Skill development"].map((t) => <Chip key={t} active={target === t} onClick={() => setTarget(t)}>{t}</Chip>)}</div>
    ) },
  ];
  const isLast = step === steps.length - 1;
  return (
    <AuthShell>
      <div className="flex gap-1.5 mb-6">{steps.map((_, i) => <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? GRAD : "rgba(255,255,255,0.08)" }} />)}</div>
      <h1 className="text-lg font-semibold mb-5" style={{ fontFamily: "Space Grotesk", color: C.text }}>{steps[step].title}</h1>
      {steps[step].body}
      <div className="flex items-center justify-between mt-8">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="text-sm font-medium" style={{ color: step === 0 ? C.textFaint : C.textDim, opacity: step === 0 ? 0.4 : 1 }}>Back</button>
        <button
          onClick={() => isLast ? onFinish({ subjects, level, style, time, target }) : setStep((s) => s + 1)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: GRAD, color: "#fff" }}>
          {isLast ? "Finish setup" : "Next"} <ArrowRight size={15} />
        </button>
      </div>
    </AuthShell>
  );
}

/* ----------------------------------------------------------------------- */
/* Sidebar + Topbar                                                        */
/* ----------------------------------------------------------------------- */
function Sidebar({ view, setView, mobileOpen, setMobileOpen, user }) {
  const content = (
    <div className="flex flex-col h-full" style={{ width: 252 }}>
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
        <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 11, background: GRAD }}><GraduationCap size={19} color="#fff" /></div>
        <div>
          <div className="font-semibold leading-tight" style={{ fontFamily: "Space Grotesk", color: C.text, fontSize: 17 }}>LearnAI</div>
          <div className="text-[10px] leading-tight" style={{ color: C.textFaint }}>Learn smarter, grow faster</div>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = view === item.id; const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => { setView(item.id); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
              style={{ background: active ? "rgba(76,127,255,0.14)" : "transparent", color: active ? "#DCE6FF" : C.textDim, border: active ? `1px solid ${C.blue}44` : "1px solid transparent", fontWeight: active ? 600 : 500 }}>
              <Icon size={17} color={active ? C.blue : C.textFaint} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 mx-3 mb-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.panelBorder}` }}>
        <div className="flex items-center gap-2 mb-1"><Flame size={15} color={C.amber} /><span className="text-xs font-semibold" style={{ color: C.text }}>{user.streak}-day streak</span></div>
        <div className="text-[11px]" style={{ color: C.textFaint }}>Keep it going — study today to stay on track.</div>
      </div>
    </div>
  );
  return (
    <>
      <div className="hidden md:block shrink-0" style={{ borderRight: `1px solid ${C.panelBorder}` }}>{content}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full" style={{ background: C.bg2 }}>{content}</div>
        </div>
      )}
    </>
  );
}
function buildSearchIndex() {
  const items = [];
  NAV_ITEMS.forEach((n) => items.push({ kind: "page", label: n.label, sub: "Page", viewId: n.id }));
  SUBJECTS.forEach((s) => items.push({ kind: "subject", label: s, sub: "Subject", subject: s }));
  Object.entries(LEARNING_CONTENT).forEach(([subject, topics]) => topics.forEach((t) => items.push({ kind: "topic", label: t.topic, sub: subject, subject, topic: t.topic })));
  return items;
}
const SEARCH_INDEX = buildSearchIndex();

function Topbar({ setMobileOpen, user, onLogout, setView, goGenerator, openSubject }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!(e.target.closest && e.target.closest("[data-searchbox]"))) setOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const q = query.trim().toLowerCase();
  const results = q ? SEARCH_INDEX.filter((it) => it.label.toLowerCase().includes(q) || it.sub.toLowerCase().includes(q)).slice(0, 8) : [];

  const choose = (it) => {
    setQuery(""); setOpen(false); setMobileSearch(false);
    if (it.kind === "page") setView(it.viewId);
    else if (it.kind === "subject") openSubject(it.subject);
    else openSubject(it.subject);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" && results[0]) choose(results[0]);
    if (e.key === "Escape") { setOpen(false); setMobileSearch(false); }
  };

  const searchBox = (
    <div data-searchbox="true" className="relative" style={{ width: "100%", maxWidth: 320 }}>
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <Search size={15} color={C.textFaint} />
        <input value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKeyDown}
          placeholder="Search subjects, topics, pages…" aria-label="Search" className="w-full bg-transparent outline-none text-sm" style={{ color: C.text }} />
        {query && <button onClick={() => { setQuery(""); setOpen(false); }} aria-label="Clear search"><X size={14} color={C.textFaint} /></button>}
      </div>
      {open && q && (
        <div className="absolute left-0 right-0 mt-2 rounded-xl overflow-hidden" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, boxShadow: "0 16px 40px rgba(0,0,0,0.45)", zIndex: 40 }}>
          {results.length === 0 ? (
            <div className="px-4 py-3 text-xs" style={{ color: C.textFaint }}>No matches for “{query.trim()}”.</div>
          ) : results.map((it, i) => (
            <div key={i} className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm cursor-pointer" style={{ color: C.text, borderTop: i ? `1px solid ${C.panelBorder}` : "none" }}
              onMouseDown={(e) => e.preventDefault()} onClick={() => choose(it)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <div className="min-w-0"><div className="truncate">{it.label}</div><div className="text-[11px]" style={{ color: C.textFaint }}>{it.sub}</div></div>
              {it.kind === "topic" && (
                <button onClick={(e) => { e.stopPropagation(); setQuery(""); setOpen(false); goGenerator({ subject: it.subject, topic: it.topic }); }} className="text-[11px] px-2 py-1 rounded-lg shrink-0" style={{ background: "rgba(255,255,255,0.06)", color: C.textDim }}>Quiz</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ borderBottom: `1px solid ${C.panelBorder}` }}>
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={22} color={C.text} /></button>
          <div className="hidden sm:block flex-1">{searchBox}</div>
          <button className="sm:hidden" onClick={() => setMobileSearch((v) => !v)} aria-label="Search"><Search size={20} color={C.textDim} /></button>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div ref={bellRef} className="relative">
            <button onClick={() => setBellOpen((v) => !v)} aria-label="Notifications"><Bell size={19} color={C.textDim} /></button>
            {bellOpen && (
              <div className="absolute right-0 mt-3 rounded-xl px-4 py-3 text-xs" style={{ width: 220, background: C.panelSolid, border: `1px solid ${C.panelBorder}`, boxShadow: "0 16px 40px rgba(0,0,0,0.45)", color: C.textDim, zIndex: 40 }}>
                You're all caught up — no new notifications.
              </div>
            )}
          </div>
          <button onClick={() => setView("profile")} className="flex items-center gap-2.5 text-left rounded-xl px-1.5 py-1 transition-colors" title="Open your profile" aria-label="Open your profile"
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <div className="flex items-center justify-center rounded-full text-xs font-semibold" style={{ width: 34, height: 34, background: GRAD, color: "#fff" }}>{user.name.split(" ").map((n) => n[0]).join("")}</div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium leading-tight" style={{ color: C.text }}>{user.name}</div>
              <div className="text-[11px] leading-tight" style={{ color: C.textFaint }}>{user.level} · {user.branch}</div>
            </div>
          </button>
          <button onClick={onLogout} title="Log out" aria-label="Log out"><LogOut size={17} color={C.textFaint} /></button>
        </div>
      </div>
      {mobileSearch && <div className="sm:hidden px-4 pb-4">{searchBox}</div>}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Dashboard                                                                */
/* ----------------------------------------------------------------------- */
function Dashboard({ user, goGenerator, quizHistory, completedTopics }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const skills = computeSkillProgress(completedTopics);
  const recentQuizzes = quizHistory.slice(-5).reverse();
  const bySubject = {};
  quizHistory.forEach((q) => { bySubject[q.subject] = bySubject[q.subject] || []; bySubject[q.subject].push(q.score); });
  const subjectActivity = Object.entries(bySubject).map(([subject, scores]) => ({ subject, quizzes: scores.length }));
  const lastCompleted = Array.from(completedTopics).slice(-1)[0];
  const [lastSubject, lastTopic] = lastCompleted ? lastCompleted.split("::") : [null, null];

  let insight;
  if (quizHistory.length === 0) insight = "Take your first quiz and Astra will start giving you personalized insights here — which topics to revisit, and which ones you've got down.";
  else {
    const avgBySubject = Object.entries(bySubject).map(([subject, scores]) => ({ subject, avg: scores.reduce((a, b) => a + b, 0) / scores.length }));
    avgBySubject.sort((a, b) => a.avg - b.avg);
    const weakest = avgBySubject[0];
    insight = `Based on ${quizHistory.length} quiz${quizHistory.length > 1 ? "zes" : ""} this session, ${weakest.subject} could use more practice — averaging ${Math.round(weakest.avg)}% so far.`;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Glass style={{ padding: "28px 26px", background: `linear-gradient(135deg, rgba(194,24,91,0.22), rgba(122,15,43,0.4))`, border: `1px solid ${C.blue}44` }} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Pill color={C.cyan}><Sparkles size={12} /> Astra AI is ready</Pill>
          <h1 className="text-2xl md:text-3xl font-semibold mt-3" style={{ fontFamily: "Space Grotesk", color: C.text }}>{greet}, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-sm mt-1" style={{ color: C.textDim }}>{user.streak > 0 ? `You're on a ${user.streak}-day streak — keep the momentum going.` : "Complete a lecture or quiz today to start your streak."}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <CircularProgress value={Math.min(100, Math.round(((user.xp || 0) / 3000) * 100))} size={82} color={C.cyan} label={user.level} />
          <button onClick={() => goGenerator()} className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm" style={{ background: GRAD, color: "#fff" }}><Wand2 size={16} /> Ask Astra for a quiz</button>
        </div>
      </Glass>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <StatCard icon={Flame} label="Streak" value={`${user.streak}d`} color={C.amber} />
        <StatCard icon={Clock} label="Study time" value={`${user.studyHours}h`} color={C.blue} />
        <StatCard icon={ListChecks} label="Quizzes done" value={user.totalQuizzes} color={C.purple} />
        <StatCard icon={Target} label="Avg score" value={user.avgScore != null ? `${user.avgScore}%` : "—"} color={C.green} />
        <StatCard icon={Layers} label="Topics mastered" value={user.topicsMastered} color={C.cyan} />
        <StatCard icon={Award} label="Level" value={user.level} color={C.red} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Glass style={{ padding: 22 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>Continue learning</h3>
              {lastSubject && <Pill color={C.green}>Last completed</Pill>}
            </div>
            {lastSubject ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center justify-center shrink-0" style={{ width: 52, height: 52, borderRadius: 14, background: GRAD }}><CheckCircle2 size={24} color="#fff" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium" style={{ color: C.text }}>{lastSubject} — {lastTopic}</div>
                  <div className="text-xs mt-0.5" style={{ color: C.textDim }}>Lecture completed — ready for practice</div>
                </div>
                <button onClick={() => goGenerator({ subject: lastSubject, topic: lastTopic })} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium shrink-0" style={{ background: GRAD, color: "#fff" }}>Practice now <ArrowRight size={15} /></button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center justify-center shrink-0" style={{ width: 52, height: 52, borderRadius: 14, background: GRAD }}><Brain size={24} color="#fff" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium" style={{ color: C.text }}>You haven't started a lecture yet</div>
                  <div className="text-xs mt-0.5" style={{ color: C.textDim }}>Pick a subject in Personalized Learning to begin</div>
                </div>
                <button onClick={() => goGenerator()} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium shrink-0" style={{ background: GRAD, color: "#fff" }}>Start learning <ArrowRight size={15} /></button>
              </div>
            )}
          </Glass>
          <Glass style={{ padding: 22 }}>
            <h3 className="font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>Suggested topics</h3>
            <p className="text-xs mb-4" style={{ color: C.textFaint }}>Curriculum-based starting points — not based on quiz history yet.</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {RECOMMENDED.map((r, i) => (
                <div key={i} className="p-4 rounded-xl flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.panelBorder}` }}>
                  <Pill color={C.purple}>{r.difficulty}</Pill>
                  <div className="text-sm font-medium" style={{ color: C.text }}>{r.topic}</div>
                  <div className="text-[11px]" style={{ color: C.textFaint }}>{r.subject}</div>
                  <div className="text-[11px] flex items-center gap-1" style={{ color: C.textDim }}><Sparkles size={11} color={C.cyan} /> {r.reason}</div>
                  <button onClick={() => goGenerator({ subject: r.subject, topic: r.topic })} className="mt-1 text-xs font-medium text-left" style={{ color: C.blue }}>Generate quiz →</button>
                </div>
              ))}
            </div>
          </Glass>
          <Glass style={{ padding: 22 }}>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "Space Grotesk", color: C.text }}>Quiz activity by subject (this session)</h3>
            {subjectActivity.length === 0 ? (
              <p className="text-xs" style={{ color: C.textFaint }}>No quizzes generated yet — this fills in as you use the AI Quiz Generator.</p>
            ) : (
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="subject" tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: C.textFaint, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 10, color: C.text }} />
                    <Bar dataKey="quizzes" fill={C.blue} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Glass>
        </div>
        <div className="space-y-5">
          <Glass style={{ padding: 22 }}>
            <h3 className="font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>Suggested study plan</h3>
            <p className="text-xs mb-3" style={{ color: C.textFaint }}>A sample daily plan — checks off as you complete lectures.</p>
            <div className="space-y-3">
              {STUDY_PLAN_TODAY.map((s, i) => {
                const done = completedTopics.has(`${s.subject}::${s.topic}`);
                return (
                  <div key={i} className="flex items-center gap-3">
                    {done ? <CheckCircle2 size={17} color={C.green} /> : <div style={{ width: 17, height: 17, borderRadius: 99, border: `2px solid ${C.textFaint}` }} />}
                    <div className="min-w-0 flex-1"><div className="text-sm truncate" style={{ color: done ? C.textFaint : C.text, textDecoration: done ? "line-through" : "none" }}>{s.subject} — {s.topic}</div></div>
                    <span className="text-xs shrink-0" style={{ color: C.textFaint }}>{s.minutes}m</span>
                  </div>
                );
              })}
            </div>
          </Glass>
          <Glass style={{ padding: 22 }}>
            <h3 className="font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>Skill progress</h3>
            <p className="text-xs mb-3" style={{ color: C.textFaint }}>Lectures completed out of each subject's topics.</p>
            <div className="grid grid-cols-2 gap-3">{skills.map((s, i) => <CircularProgress key={i} value={s.value} size={78} color={[C.blue, C.purple, C.cyan, C.amber][i % 4]} label={s.name} />)}</div>
          </Glass>
          <Glass style={{ padding: 22 }}>
            <h3 className="font-semibold mb-4" style={{ fontFamily: "Space Grotesk", color: C.text }}>Recent quiz performance</h3>
            {recentQuizzes.length === 0 ? (
              <p className="text-xs" style={{ color: C.textFaint }}>No quizzes taken yet this session.</p>
            ) : (
              <div className="space-y-3">
                {recentQuizzes.map((q, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="min-w-0"><div className="text-sm truncate" style={{ color: C.text }}>{q.topic}</div><div className="text-[11px]" style={{ color: C.textFaint }}>{q.subject} · {q.date}</div></div>
                    <span className="text-sm font-semibold shrink-0" style={{ color: q.score >= 70 ? C.green : q.score >= 50 ? C.amber : C.red }}>{q.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </Glass>
          <div className="p-5 rounded-2xl" style={{ background: `linear-gradient(135deg, rgba(76,127,255,0.14), rgba(155,107,255,0.14))`, border: `1px solid ${C.blue}33` }}>
            <div className="flex items-center gap-2 mb-2"><Sparkles size={16} color={C.cyan} /><span className="text-sm font-semibold" style={{ color: C.text }}>Astra AI insight</span></div>
            <p className="text-xs leading-relaxed" style={{ color: C.textDim }}>{insight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Personalized Learning                                                   */
/* ----------------------------------------------------------------------- */
function LectureView({ subject, topic, onClose, onComplete, isCompleted, goGenerator }) {
  const notes = useMemo(() => generateNotes(subject, topic), [subject, topic]);
  const [celebrate, setCelebrate] = useState(false);
  const handleComplete = () => { onComplete(subject, topic); setCelebrate(true); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }}>
      <div className="w-full overflow-y-auto" style={{ maxWidth: 640, maxHeight: "85vh" }}>
        <Glass style={{ padding: 28 }}>
          {!celebrate ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <Pill color={C.cyan}><Sparkles size={12} /> Astra AI lecture</Pill>
                <button onClick={onClose}><X size={18} color={C.textFaint} /></button>
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "Space Grotesk", color: C.text }}>{notes.title}</h2>
              <p className="text-sm mb-6" style={{ color: C.textDim }}>{notes.summary}</p>
              <div className="space-y-5 mb-7">
                {notes.sections.map((s, i) => (
                  <div key={i}>
                    <div className="text-sm font-semibold mb-2" style={{ color: C.blue }}>{s.heading}</div>
                    <ul className="space-y-1.5">{s.bullets.map((b, j) => <li key={j} className="text-sm leading-relaxed flex gap-2" style={{ color: C.textDim }}><span style={{ color: C.cyan }}>•</span>{b}</li>)}</ul>
                  </div>
                ))}
              </div>
              {isCompleted ? (
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: C.green }}><CheckCircle2 size={16} /> You've already completed this lecture</div>
              ) : (
                <button onClick={handleComplete} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm" style={{ background: GRAD, color: "#fff" }}><CheckCircle2 size={16} /> Mark lecture as complete</button>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex items-center justify-center" style={{ width: 68, height: 68, borderRadius: 20, background: GRAD }}><Trophy size={30} color="#fff" /></div>
              <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "Space Grotesk", color: C.text }}>Nice work! You learned {topic}.</h2>
              <p className="text-sm mb-7" style={{ color: C.textDim }}>+40 XP earned — Astra will fold this into your next recommendations.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text }}>Back to topics</button>
                <button onClick={() => goGenerator({ subject, topic })} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: GRAD, color: "#fff" }}><Wand2 size={15} /> Practice with Astra AI</button>
              </div>
            </div>
          )}
        </Glass>
      </div>
    </div>
  );
}
function LearningPage({ goGenerator, completedTopics, onComplete, initialSubject }) {
  const [subject, setSubject] = useState(initialSubject && SUBJECTS.includes(initialSubject) ? initialSubject : SUBJECTS[0]);
  const [openTopic, setOpenTopic] = useState(null);
  const isDone = (t) => completedTopics.has(`${subject}::${t}`);

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "Space Grotesk", color: C.text }}>Personalized Learning</h1>
      <p className="text-sm mb-6" style={{ color: C.textDim }}>Pick a subject, open a lecture, and Astra tracks what you've actually learned.</p>
      <div className="flex flex-wrap gap-2 mb-6">{SUBJECTS.map((s) => <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>{s}</Chip>)}</div>
      <div className="space-y-3">
        {LEARNING_CONTENT[subject].map((t, i) => {
          const done = isDone(t.topic);
          const progress = done ? 100 : 0;
          const stage = learningStage(progress);
          return (
            <Glass key={i} style={{ padding: 20 }} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button onClick={() => setOpenTopic(t.topic)} className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: done ? "rgba(63,167,114,0.18)" : "rgba(194,24,91,0.14)" }}>
                {done ? <CheckCircle2 size={19} color={C.green} /> : <BookOpen size={19} color={C.blue} />}
              </button>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setOpenTopic(t.topic)}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm" style={{ color: C.text }}>{t.topic}</span>
                  <Pill color={stage.color}>{stage.label}</Pill>
                </div>
                <div className="text-xs mt-0.5" style={{ color: C.textFaint }}>{t.lessons} lessons</div>
                <div className="w-full h-1.5 rounded-full mt-2" style={{ background: "rgba(255,255,255,0.08)", maxWidth: 260 }}><div className="h-1.5 rounded-full" style={{ width: `${progress}%`, background: GRAD }} /></div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-medium" style={{ color: C.textDim }}>{progress}%</span>
                <button onClick={() => setOpenTopic(t.topic)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text }}><BookOpen size={14} /> Lecture</button>
                <button onClick={() => goGenerator({ subject, topic: t.topic })} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text }}><PlayCircle size={14} /> Practice</button>
              </div>
            </Glass>
          );
        })}
      </div>
      {openTopic && (
        <LectureView subject={subject} topic={openTopic} isCompleted={isDone(openTopic)} onClose={() => setOpenTopic(null)} onComplete={onComplete} goGenerator={(pf) => { setOpenTopic(null); goGenerator(pf); }} />
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* AI Quiz Generator                                                       */
/* ----------------------------------------------------------------------- */
const QUESTION_COUNT_PRESETS = [5, 10, 15, 20, 30, 40, 50, 75, 100];
function GenerationProgress({ stepIndex, progress, requestedCount }) {
  const big = requestedCount > 20;
  return (
    <div className="flex flex-col items-center justify-center" style={{ minHeight: "70vh" }}>
      <div className="flex items-center justify-center mb-6 animate-pulse" style={{ width: 72, height: 72, borderRadius: 22, background: GRAD }}><Wand2 size={32} color="#fff" /></div>
      <div className="space-y-3 w-80">
        {ASTRA_LOADING_STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: i <= stepIndex ? C.text : C.textFaint, opacity: i <= stepIndex ? 1 : 0.4 }}>
            {i < stepIndex ? <CheckCircle2 size={15} color={C.green} /> : i === stepIndex ? <div className="animate-spin" style={{ width: 14, height: 14, borderRadius: 99, border: `2px solid ${C.blue}`, borderTopColor: "transparent" }} /> : <div style={{ width: 14, height: 14, borderRadius: 99, border: `2px solid ${C.textFaint}` }} />}
            {s}
          </div>
        ))}
      </div>
      {big && progress && (
        <div className="mt-6 w-80 space-y-1.5 text-xs" style={{ color: C.textDim }}>
          {progress.generated != null && <div className="flex justify-between"><span>Generating</span><span style={{ color: C.text }}>{progress.generated} / {progress.target}</span></div>}
          {progress.validated != null && <div className="flex justify-between"><span>Validated</span><span style={{ color: C.text }}>{progress.validated} / {progress.target}</span></div>}
          {progress.unique != null && <div className="flex justify-between"><span>Unique</span><span style={{ color: C.text }}>{progress.unique} / {progress.target}</span></div>}
        </div>
      )}
    </div>
  );
}
function QuizGenerator({ onStartQuiz, prefill, onGenerated, user }) {
  const [subject, setSubject] = useState(prefill?.subject || "Computer Networks");
  const [topic, setTopic] = useState(prefill?.topic || "All Topics");
  const [difficulty, setDifficulty] = useState("Adaptive");
  const [numQuestions, setNumQuestions] = useState(10);
  const [customCount, setCustomCount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [qType, setQType] = useState("MCQ");
  const [timeLimit, setTimeLimit] = useState("No Limit");
  const [opts, setOpts] = useState({ explanations: true, hints: false, weakAreas: true, examStyle: false });
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const genToken = useRef(0);

  useEffect(() => { if (!TOPICS_BY_SUBJECT[subject].includes(topic)) setTopic("All Topics"); }, [subject]);
  const toggleOpt = (k) => setOpts((o) => ({ ...o, [k]: !o[k] }));

  const effectiveCount = useCustom ? Math.max(5, Math.min(100, parseInt(customCount, 10) || 5)) : numQuestions;

  const generate = async () => {
    if (loading) return;
    const myToken = ++genToken.current;
    setLoading(true); setStepIndex(0); setProgress({});
    try {
      const result = await runAstraGeneration(
        { subject, topic, difficulty, numQuestions: effectiveCount, qType, opts, studentProfile: { level: user && user.level } },
        {
          onStep: (i) => { if (genToken.current === myToken) setStepIndex(i); },
          onProgress: (p) => { if (genToken.current === myToken) setProgress((prev) => ({ ...prev, ...p })); },
        }
      );
      if (genToken.current !== myToken) return; // a newer generation (or navigation) superseded this one
      setLoading(false);
      onGenerated && onGenerated(result.meta);
      onStartQuiz({ config: { subject, topic, difficulty, numQuestions: effectiveCount, qType, timeLimit }, quiz: result.questions, meta: result.meta });
    } catch (err) {
      if (genToken.current !== myToken) return;
      setLoading(false);
      onGenerated && onGenerated({ error: true, message: "Astra couldn't generate the quiz. Please try again." });
    }
  };

  useEffect(() => () => { genToken.current++; }, []); // invalidate any in-flight generation on unmount

  if (loading) return <GenerationProgress stepIndex={stepIndex} progress={progress} requestedCount={effectiveCount} />;

  const Field = ({ label, children }) => <div><label className="text-xs font-medium block mb-1.5" style={{ color: C.textDim }}>{label}</label>{children}</div>;
  const selectStyle = { width: "100%", background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 12, color: C.text, padding: "10px 12px", fontSize: 14, outline: "none" };

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-1"><Sparkles size={22} color={C.cyan} /><h1 className="text-2xl font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>AI Quiz Generator</h1></div>
      <p className="text-sm mb-6" style={{ color: C.textDim }}>Tell Astra what to focus on — it generates a fresh quiz tuned to your level.</p>
      <Glass style={{ padding: 24 }} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Subject"><select style={selectStyle} value={subject} onChange={(e) => setSubject(e.target.value)}>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Topic"><select style={selectStyle} value={topic} onChange={(e) => setTopic(e.target.value)}>{TOPICS_BY_SUBJECT[subject].map((t) => <option key={t}>{t}</option>)}</select></Field>
        </div>
        <Field label="Difficulty"><div className="flex flex-wrap gap-2">{["Easy", "Medium", "Hard", "Adaptive"].map((d) => <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>{d}</Chip>)}</div></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Number of questions">
            <div className="flex flex-wrap gap-2 mb-2">
              {QUESTION_COUNT_PRESETS.map((n) => <Chip key={n} active={!useCustom && numQuestions === n} onClick={() => { setUseCustom(false); setNumQuestions(n); }}>{n}</Chip>)}
              <Chip active={useCustom} onClick={() => setUseCustom(true)}>Custom</Chip>
            </div>
            {useCustom && (
              <input type="number" min={5} max={100} value={customCount} onChange={(e) => setCustomCount(e.target.value)} placeholder="5–100"
                style={{ width: "100%", background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 12, color: C.text, padding: "10px 12px", fontSize: 14, outline: "none" }} />
            )}
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: C.textFaint }}>Astra generates extra questions internally for quality checking, then returns the exact number you requested — or tells you clearly if it ran short.</p>
          </Field>
          <Field label="Time limit"><select style={selectStyle} value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}>{["No Limit", "10 minutes", "20 minutes", "30 minutes", "60 minutes"].map((t) => <option key={t}>{t}</option>)}</select></Field>
        </div>
        <Field label="Question type"><div className="flex flex-wrap gap-2">{["MCQ", "True/False", "Multiple Select", "Short Answer"].map((t) => <Chip key={t} active={qType === t} onClick={() => setQType(t)}>{t}</Chip>)}</div></Field>
        <Field label="Additional options">
          <div className="grid sm:grid-cols-2 gap-2.5">
            {[["explanations", "Include explanations"], ["hints", "Include hints"], ["weakAreas", "Focus on weak areas"], ["examStyle", "Exam-style questions"]].map(([k, label]) => (
              <label key={k} className="flex items-center gap-2.5 text-sm cursor-pointer" style={{ color: C.textDim }}><input type="checkbox" checked={opts[k]} onChange={() => toggleOpt(k)} style={{ accentColor: C.blue }} />{label}</label>
            ))}
          </div>
        </Field>
        <button onClick={generate} disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm" style={{ background: GRAD, color: "#fff", opacity: loading ? 0.7 : 1 }}><Wand2 size={17} /> Generate Quiz with Astra AI</button>
        <p className="text-[11px] text-center" style={{ color: C.textFaint }}>{ASTRA_CONFIG.endpoint ? "Engine: Astra GPT (live)" : "Engine: Astra GPT not connected — using Astra's local generation engine"}</p>
      </Glass>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* PDF → Quiz                                                              */
/* ----------------------------------------------------------------------- */
const PDF_LOADING_STEPS = ["Extracting text from PDF…", "Astra is identifying key concepts…", "Generating questions…"];
const REAL_PDF_STEPS = ["Reading your PDF…", "Extracting text…", "Astra is matching topics to your syllabus…", "Generating questions…"];
function PdfToQuiz({ onStartQuiz, onGenerated, onStub }) {
  const [picked, setPicked] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState(PDF_LOADING_STEPS);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const runGenerate = async (file) => {
    setError(null); setPicked(file); setSteps(PDF_LOADING_STEPS); setLoading(true); setStepIndex(0);
    try {
      const result = await runAstraGeneration(
        { subject: file.subject, topic: file.topic, difficulty: "Adaptive", numQuestions: 10, qType: "MCQ", opts: { explanations: true, hints: false, weakAreas: false, examStyle: false } },
        { onStep: (i) => setStepIndex(Math.min(i, PDF_LOADING_STEPS.length - 1)) }
      );
      setLoading(false);
      onGenerated && onGenerated(result.meta);
      onStartQuiz({ config: { subject: file.subject, topic: file.topic, difficulty: "Adaptive", numQuestions: 10, qType: "MCQ", timeLimit: "No Limit" }, quiz: result.questions, meta: result.meta });
    } catch (err) {
      setLoading(false);
      setError("Astra couldn't generate a quiz from that file. Please try again.");
    }
  };

  const handleRealUpload = async (file) => {
    setError(null); setPicked({ name: file.name }); setSteps(REAL_PDF_STEPS); setLoading(true); setStepIndex(0);
    try {
      const text = await extractPdfText(file);
      setStepIndex(1);
      await new Promise((r) => setTimeout(r, 400));
      const { subject, topic } = classifyPdfText(text);
      setStepIndex(2);
      const result = await runAstraGeneration(
        { subject, topic, difficulty: "Adaptive", numQuestions: 10, qType: "MCQ", opts: { explanations: true, hints: false, weakAreas: false, examStyle: false } },
        { onStep: () => setStepIndex(3) }
      );
      setLoading(false);
      onGenerated && onGenerated(result.meta);
      onStartQuiz({ config: { subject, topic, difficulty: "Adaptive", numQuestions: 10, qType: "MCQ", timeLimit: "No Limit" }, quiz: result.questions, meta: result.meta });
    } catch (err) {
      setLoading(false);
      setError("Couldn't read that PDF. Try a different file, or use a sample below.");
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Please upload a .pdf file."); return; }
    handleRealUpload(file);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: "70vh" }}>
        <div className="flex items-center justify-center mb-6 animate-pulse" style={{ width: 72, height: 72, borderRadius: 22, background: GRAD }}><FileUp size={30} color="#fff" /></div>
        <div className="text-sm mb-4 text-center px-6" style={{ color: C.textDim }}>{picked?.name}</div>
        <div className="space-y-3 w-72">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: i <= stepIndex ? C.text : C.textFaint, opacity: i <= stepIndex ? 1 : 0.4 }}>
              {i < stepIndex ? <CheckCircle2 size={15} color={C.green} /> : i === stepIndex ? <div className="animate-spin" style={{ width: 14, height: 14, borderRadius: 99, border: `2px solid ${C.blue}`, borderTopColor: "transparent" }} /> : <div style={{ width: 14, height: 14, borderRadius: 99, border: `2px solid ${C.textFaint}` }} />}
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-1"><FileText size={22} color={C.cyan} /><h1 className="text-2xl font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>PDF → Quiz</h1></div>
      <p className="text-sm mb-6" style={{ color: C.textDim }}>Upload your notes or lecture slides and the AI builds a quiz straight from them.</p>

      <input ref={fileInputRef} type="file" accept="application/pdf" onChange={onFileChange} style={{ display: "none" }} />
      <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="w-full flex flex-col items-center justify-center gap-2 py-12 rounded-2xl mb-2" style={{ border: `1.5px dashed ${C.panelBorder}`, background: "rgba(255,255,255,0.02)" }}>
        <UploadCloud size={26} color={C.textFaint} />
        <span className="text-sm" style={{ color: C.textDim }}>Click to upload your own PDF</span>
        <span className="text-xs" style={{ color: C.textFaint }}>We read the text in your browser and match it to your syllabus</span>
      </button>
      {error && <p className="text-xs mb-4" style={{ color: C.red }}>{error}</p>}

      <div className="text-xs font-medium mb-3 mt-6" style={{ color: C.textDim }}>Or try a sample</div>
      <div className="space-y-3">
        {SAMPLE_PDFS.map((f, i) => (
          <Glass key={i} style={{ padding: 18 }} className="flex items-center gap-4">
            <div className="flex items-center justify-center shrink-0" style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(228,54,74,0.14)" }}><FileText size={18} color={C.red} /></div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: C.text }}>{f.name}</div>
              <div className="text-xs" style={{ color: C.textFaint }}>{f.subject} · {f.topic} · {f.size}</div>
            </div>
            <button onClick={() => runGenerate(f)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium shrink-0" style={{ background: GRAD, color: "#fff" }}><Wand2 size={13} /> Generate quiz</button>
          </Glass>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* AI Notes Generator                                                      */
/* ----------------------------------------------------------------------- */
function NotesGenerator({ goGenerator }) {
  const [subject, setSubject] = useState("Computer Networks");
  const [topic, setTopic] = useState("All Topics");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(null);

  useEffect(() => { if (!TOPICS_BY_SUBJECT[subject].includes(topic)) setTopic("All Topics"); }, [subject]);

  const generate = () => {
    setLoading(true); setNotes(null);
    setTimeout(() => { setNotes(generateNotes(subject, topic)); setLoading(false); }, 1100);
  };

  const selectStyle = { width: "100%", background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 12, color: C.text, padding: "10px 12px", fontSize: 14, outline: "none" };

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-1"><StickyNote size={22} color={C.cyan} /><h1 className="text-2xl font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>AI Notes Generator</h1></div>
      <p className="text-sm mb-6" style={{ color: C.textDim }}>Get a structured summary of any topic, built from your syllabus.</p>

      <Glass style={{ padding: 22 }} className="grid sm:grid-cols-2 gap-4 mb-6">
        <div><label className="text-xs font-medium block mb-1.5" style={{ color: C.textDim }}>Subject</label><select style={selectStyle} value={subject} onChange={(e) => setSubject(e.target.value)}>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="text-xs font-medium block mb-1.5" style={{ color: C.textDim }}>Topic</label><select style={selectStyle} value={topic} onChange={(e) => setTopic(e.target.value)}>{TOPICS_BY_SUBJECT[subject].map((t) => <option key={t}>{t}</option>)}</select></div>
        <button onClick={generate} className="sm:col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm" style={{ background: GRAD, color: "#fff" }}><Wand2 size={16} /> Generate Notes</button>
      </Glass>

      {loading && (
        <div className="flex items-center gap-3 text-sm" style={{ color: C.textDim }}>
          <div className="animate-spin" style={{ width: 16, height: 16, borderRadius: 99, border: `2px solid ${C.blue}`, borderTopColor: "transparent" }} />
          Astra is structuring key concepts…
        </div>
      )}

      {notes && !loading && (
        <Glass style={{ padding: 26 }}>
          <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: "Space Grotesk", color: C.text }}>{notes.title}</h2>
          <p className="text-sm mb-6" style={{ color: C.textDim }}>{notes.summary}</p>
          <div className="space-y-5">
            {notes.sections.map((s, i) => (
              <div key={i}>
                <div className="text-sm font-semibold mb-2" style={{ color: C.blue }}>{s.heading}</div>
                <ul className="space-y-1.5">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="text-sm leading-relaxed flex gap-2" style={{ color: C.textDim }}>
                      <span style={{ color: C.cyan }}>•</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-7">
            <button onClick={() => goGenerator({ subject, topic })} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: GRAD, color: "#fff" }}><Wand2 size={15} /> Generate quiz from these notes</button>
          </div>
        </Glass>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* AI Study Assistant                                                      */
/* ----------------------------------------------------------------------- */
function StudyAssistant() {
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi, I'm Astra — your AI study assistant. Ask me about Computer Networks, DBMS, C++, Data Structures, OS, AI/ML, Discrete Math, English, or Analogy & Reasoning." }]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, { role: "assistant", text: assistantReply(t) }]), 500);
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl flex flex-col" style={{ height: "calc(100vh - 76px)" }}>
      <div className="flex items-center gap-3 mb-4"><MessageSquare size={22} color={C.cyan} /><h1 className="text-2xl font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>AI Study Assistant</h1></div>
      <Glass style={{ padding: 18, flex: 1, overflowY: "auto" }} className="mb-4">
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div key={i} className="flex items-start gap-2.5" style={{ flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
              <div className="flex items-center justify-center shrink-0 rounded-full" style={{ width: 28, height: 28, background: m.role === "user" ? C.panelSolid : GRAD }}>
                {m.role === "user" ? <User size={14} color={C.textDim} /> : <Bot size={14} color="#fff" />}
              </div>
              <div className="text-sm leading-relaxed px-4 py-2.5 rounded-2xl" style={{ maxWidth: "80%", background: m.role === "user" ? "rgba(76,127,255,0.16)" : "rgba(255,255,255,0.04)", color: C.text }}>{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </Glass>
      <div className="flex flex-wrap gap-2 mb-3">{SUGGESTED_PROMPTS.map((p) => <button key={p} onClick={() => send(p)} className="px-3 py-1.5 rounded-full text-xs" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.textDim }}>{p}</button>)}</div>
      <div className="flex items-center gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask a study question…"
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text }} />
        <button onClick={() => send()} className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 46, height: 46, background: GRAD }}><Send size={17} color="#fff" /></button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Analytics                                                                */
/* ----------------------------------------------------------------------- */
function EmptyChartState({ text }) {
  return <p className="text-xs py-10 text-center" style={{ color: C.textFaint }}>{text}</p>;
}
function AnalyticsPage({ quizHistory }) {
  const scoreTrend = quizHistory.map((q, i) => ({ quiz: `Q${i + 1}`, score: q.score }));

  const bySubject = {};
  quizHistory.forEach((q) => { bySubject[q.subject] = bySubject[q.subject] || []; bySubject[q.subject].push(q.score); });
  const accuracyBySubject = Object.entries(bySubject).map(([subject, scores]) => ({ subject, accuracy: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }));

  const diffAgg = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
  quizHistory.forEach((q) => { Object.entries(q.difficultyStats || {}).forEach(([lvl, s]) => { if (diffAgg[lvl]) { diffAgg[lvl].correct += s.correct; diffAgg[lvl].total += s.total; } }); });
  const difficultyPerf = ["easy", "medium", "hard"].filter((l) => diffAgg[l].total > 0).map((l) => ({ level: l[0].toUpperCase() + l.slice(1), accuracy: Math.round((diffAgg[l].correct / diffAgg[l].total) * 100) }));

  const topicAgg = {};
  quizHistory.forEach((q) => { Object.entries(q.topicStats || {}).forEach(([topic, s]) => { topicAgg[topic] = topicAgg[topic] || { correct: 0, total: 0 }; topicAgg[topic].correct += s.correct; topicAgg[topic].total += s.total; }); });
  const weakTopics = Object.entries(topicAgg).map(([topic, s]) => ({ topic, accuracy: Math.round((s.correct / s.total) * 100) })).sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);

  let insight = "Take a few quizzes and Astra will surface real patterns here — strongest subjects, weakest topics, and how your accuracy changes by difficulty.";
  if (accuracyBySubject.length) {
    const sorted = [...accuracyBySubject].sort((a, b) => a.accuracy - b.accuracy);
    const weakest = sorted[0], strongest = sorted[sorted.length - 1];
    insight = strongest.subject === weakest.subject
      ? `Across ${quizHistory.length} quiz${quizHistory.length > 1 ? "zes" : ""} in ${weakest.subject}, you're averaging ${weakest.accuracy}%.`
      : `You're strongest in ${strongest.subject} (${strongest.accuracy}%) — ${weakest.subject} could use more practice (${weakest.accuracy}%).`;
  }

  return (
    <div className="p-4 md:p-8 space-y-5">
      <h1 className="text-2xl font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>Performance Analytics</h1>
      <p className="text-xs" style={{ color: C.textFaint }}>Computed from the {quizHistory.length} quiz{quizHistory.length === 1 ? "" : "zes"} you've taken this session.</p>
      <div className="grid md:grid-cols-2 gap-5">
        <Glass style={{ padding: 22 }}>
          <h3 className="font-semibold mb-3" style={{ fontFamily: "Space Grotesk", color: C.text }}>Score trend</h3>
          {scoreTrend.length === 0 ? <EmptyChartState text="No quizzes yet — your score trend will appear here." /> : (
            <div style={{ height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="quiz" tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 10, color: C.text }} />
                  <Line type="monotone" dataKey="score" stroke={C.cyan} strokeWidth={2.5} dot={{ fill: C.cyan, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Glass>
        <Glass style={{ padding: 22 }}>
          <h3 className="font-semibold mb-3" style={{ fontFamily: "Space Grotesk", color: C.text }}>Accuracy by subject</h3>
          {accuracyBySubject.length === 0 ? <EmptyChartState text="No quizzes yet — subject accuracy will appear here." /> : (
            <div style={{ height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyBySubject}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="subject" tick={{ fill: C.textFaint, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 10, color: C.text }} />
                  <Bar dataKey="accuracy" fill={C.purple} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Glass>
        <Glass style={{ padding: 22 }}>
          <h3 className="font-semibold mb-3" style={{ fontFamily: "Space Grotesk", color: C.text }}>Difficulty performance</h3>
          {difficultyPerf.length === 0 ? <EmptyChartState text="No quizzes yet — difficulty breakdown will appear here." /> : (
            <div className="flex justify-around">{difficultyPerf.map((d, i) => <CircularProgress key={i} value={d.accuracy} size={90} color={[C.green, C.amber, C.red][i]} label={d.level} />)}</div>
          )}
        </Glass>
        <Glass style={{ padding: 22 }}>
          <h3 className="font-semibold mb-3" style={{ fontFamily: "Space Grotesk", color: C.text }}>Topics to review</h3>
          {weakTopics.length === 0 ? <EmptyChartState text="No quizzes yet — your weakest topics will appear here." /> : (
            <div className="space-y-3">
              {weakTopics.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: C.text }}>{t.topic}</span>
                  <span className="text-sm font-semibold" style={{ color: t.accuracy >= 70 ? C.green : t.accuracy >= 50 ? C.amber : C.red }}>{t.accuracy}%</span>
                </div>
              ))}
            </div>
          )}
        </Glass>
      </div>
      <div className="p-5 rounded-2xl" style={{ background: `linear-gradient(135deg, rgba(76,127,255,0.14), rgba(155,107,255,0.14))`, border: `1px solid ${C.blue}33` }}>
        <div className="flex items-center gap-2 mb-2"><Sparkles size={16} color={C.cyan} /><span className="text-sm font-semibold" style={{ color: C.text }}>Astra AI insight</span></div>
        <p className="text-xs leading-relaxed" style={{ color: C.textDim }}>{insight}</p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Achievements                                                            */
/* ----------------------------------------------------------------------- */
function AchievementsPage({ user }) {
  const nextLevelXp = 3000;
  const pct = Math.min(100, Math.round((user.xp / nextLevelXp) * 100));
  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>Achievements</h1>
      <Glass style={{ padding: 22 }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: C.text }}>{user.level} · {user.xp} XP</span>
          <span className="text-xs" style={{ color: C.textFaint }}>{nextLevelXp - user.xp} XP to next level</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}><div className="h-2 rounded-full" style={{ width: `${pct}%`, background: GRAD }} /></div>
      </Glass>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((a, i) => (
          <Glass key={i} style={{ padding: 20, opacity: a.earned ? 1 : 0.55 }} className="flex items-start gap-3">
            <div className="flex items-center justify-center shrink-0" style={{ width: 42, height: 42, borderRadius: 12, background: a.earned ? GRAD : "rgba(255,255,255,0.06)" }}>
              <a.icon size={19} color={a.earned ? "#fff" : C.textFaint} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium" style={{ color: C.text }}>{a.name}</div>
              <div className="text-xs mt-0.5" style={{ color: C.textFaint }}>{a.desc}</div>
              {a.earned && <Pill color={C.green} style={{ marginTop: 8 }}>Earned</Pill>}
            </div>
          </Glass>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Profile                                                                  */
/* ----------------------------------------------------------------------- */
function RateProductCard({ user }) {
  const existing = useMemo(() => getReviews().find((r) => r.userId === user.id), [user.id]);
  const [rating, setRating] = useState(existing ? existing.rating : 0);
  const [comment, setComment] = useState(existing ? existing.comment : "");
  const [saved, setSaved] = useState(!!existing);
  const submit = () => {
    if (rating < 1 || !comment.trim()) return;
    saveReview(user.id, user.name, rating, comment.trim());
    setSaved(true);
  };
  return (
    <Glass style={{ padding: 22 }}>
      <h3 className="font-semibold mb-1" style={{ fontFamily: "Space Grotesk", color: C.text }}>Rate LearnAI</h3>
      <p className="text-xs mb-4" style={{ color: C.textFaint }}>Your review shows on the landing page under your real name — this is the only way reviews appear on LearnAI.</p>
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => { setRating(n); setSaved(false); }}><Star size={22} fill={n <= rating ? C.amber : "none"} color={C.amber} /></button>
        ))}
      </div>
      <textarea value={comment} onChange={(e) => { setComment(e.target.value); setSaved(false); }} placeholder="What's your experience been like?" rows={3}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.panelBorder}`, color: C.text, resize: "vertical" }} />
      <button onClick={submit} disabled={rating < 1 || !comment.trim()} className="px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: GRAD, color: "#fff", opacity: rating < 1 || !comment.trim() ? 0.5 : 1 }}>
        {saved ? "Update review" : "Submit review"}
      </button>
      {saved && <span className="ml-3 text-xs" style={{ color: C.green }}>Saved — visible on the landing page.</span>}
    </Glass>
  );
}
function ProfilePage({ user, onSave, completedTopics }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, college: user.college, degree: user.degree, branch: user.branch, year: user.year });
  useEffect(() => { setForm({ name: user.name, college: user.college, degree: user.degree, branch: user.branch, year: user.year }); }, [user.name, user.college, user.degree, user.branch, user.year]);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const save = () => { onSave(form); setEditing(false); };
  const cancel = () => { setForm({ name: user.name, college: user.college, degree: user.degree, branch: user.branch, year: user.year }); setEditing(false); };

  return (
    <div className="p-4 md:p-8 max-w-3xl space-y-5">
      <Glass style={{ padding: 24 }}>
        {!editing ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex items-center justify-center rounded-full font-semibold text-xl shrink-0" style={{ width: 68, height: 68, background: GRAD, color: "#fff" }}>{user.name.split(" ").map((n) => n[0]).join("")}</div>
            <div className="flex-1">
              <div className="text-lg font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>{user.name}</div>
              <div className="text-sm" style={{ color: C.textDim }}>{user.degree} · {user.branch} · {user.year}</div>
              <div className="text-xs mt-1" style={{ color: C.textFaint }}>{user.college}</div>
              <Pill color={C.purple} style={{ marginTop: 8 }}>{user.level}</Pill>
            </div>
            <button onClick={() => setEditing(true)} className="px-4 py-2.5 rounded-xl text-sm font-medium shrink-0" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text }}>Edit profile</button>
          </div>
        ) : (
          <div>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <TextField label="Full name" icon={User} value={form.name} onChange={set("name")} />
              <TextField label="College / University" icon={Building2} value={form.college} onChange={set("college")} />
              <SelectField label="Degree" value={form.degree} onChange={set("degree")} options={["B.Tech", "B.E.", "M.Tech", "BCA"]} />
              <SelectField label="Branch" value={form.branch} onChange={set("branch")} options={["Computer Science", "IT", "ECE", "Mechanical", "Civil"]} />
              <SelectField label="Year / Semester" value={form.year} onChange={set("year")} options={["1st Year", "2nd Year", "3rd Year", "4th Year"]} />
            </div>
            <div className="flex gap-3">
              <button onClick={save} className="px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: GRAD, color: "#fff" }}>Save changes</button>
              <button onClick={cancel} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.textDim }}>Cancel</button>
            </div>
          </div>
        )}
      </Glass>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard icon={ListChecks} label="Quizzes" value={user.totalQuizzes} color={C.blue} />
        <StatCard icon={Target} label="Avg score" value={user.avgScore != null ? `${user.avgScore}%` : "—"} color={C.green} />
        <StatCard icon={Clock} label="Study hours" value={`${user.studyHours}h`} color={C.purple} />
        <StatCard icon={Zap} label="XP" value={user.xp} color={C.amber} />
        <StatCard icon={Flame} label="Streak" value={`${user.streak}d`} color={C.red} />
      </div>
      <Glass style={{ padding: 22 }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: "Space Grotesk", color: C.text }}>Skills</h3>
        <div className="space-y-4">
          {computeSkillProgress(completedTopics).map((s, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5"><span className="text-sm" style={{ color: C.text }}>{s.name}</span><span className="text-xs" style={{ color: C.textFaint }}>{s.value}%</span></div>
              <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}><div className="h-1.5 rounded-full" style={{ width: `${s.value}%`, background: GRAD }} /></div>
            </div>
          ))}
        </div>
      </Glass>
      <RateProductCard user={user} />
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Quiz taking screen                                                       */
/* ----------------------------------------------------------------------- */
function QuizScreen({ quiz, config, onSubmit }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const limited = config.timeLimit !== "No Limit";
  const limitSec = limited ? parseInt(config.timeLimit) * 60 : 0;
  const [seconds, setSeconds] = useState(limited ? limitSec : 0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        if (limited) { if (s <= 1) { clearInterval(id); handleSubmit(true); return 0; } return s - 1; }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showHint, setShowHint] = useState(false);
  const q = quiz[index];
  useEffect(() => { setShowHint(false); }, [index]);
  const select = (optIdx) => setAnswers((a) => ({ ...a, [q.uid]: optIdx }));
  const toggleMultiSelect = (optIdx) => setAnswers((a) => {
    const current = Array.isArray(a[q.uid]) ? a[q.uid] : [];
    const next = current.includes(optIdx) ? current.filter((i) => i !== optIdx) : [...current, optIdx];
    return { ...a, [q.uid]: next };
  });
  const setShortAnswer = (text) => setAnswers((a) => ({ ...a, [q.uid]: text }));
  const toggleMark = () => setMarked((m) => ({ ...m, [q.uid]: !m[q.uid] }));
  const handleSubmit = () => { const timeTakenSec = limited ? limitSec - seconds : seconds; onSubmit({ answers, timeTakenSec }); };
  const isAttempted = (qq) => {
    const a = answers[qq.uid];
    if (qq.type === "Multiple Select") return Array.isArray(a) && a.length > 0;
    if (qq.type === "Short Answer") return typeof a === "string" && a.trim().length > 0;
    return a !== undefined;
  };
  const attemptedCount = quiz.filter(isAttempted).length;

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div><div className="text-sm font-medium" style={{ color: C.text }}>{config.subject} · {config.topic}</div><div className="text-xs" style={{ color: C.textFaint }}>Question {index + 1} of {quiz.length}</div></div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}` }}><Timer size={15} color={limited && seconds < 60 ? C.red : C.blue} /><span className="text-sm font-mono" style={{ color: C.text }}>{fmtTime(seconds)}</span></div>
      </div>
      <div className="w-full h-1.5 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.08)" }}><div className="h-1.5 rounded-full" style={{ width: `${((index + 1) / quiz.length) * 100}%`, background: GRAD, transition: "width 0.3s" }} /></div>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Glass style={{ padding: 26 }}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <Pill color={q.difficulty === "hard" ? C.red : q.difficulty === "medium" ? C.amber : C.green}>{q.difficulty}</Pill>
              <button onClick={toggleMark} className="flex items-center gap-1.5 text-xs shrink-0" style={{ color: marked[q.uid] ? C.amber : C.textFaint }}><Flag size={14} /> {marked[q.uid] ? "Marked" : "Mark for review"}</button>
            </div>
            <h2 className="text-lg font-medium mb-3 leading-relaxed" style={{ color: C.text }}>{q.question}</h2>
            {q.type === "Multiple Select" && <p className="text-xs mb-4" style={{ color: C.textFaint }}>Select all that apply.</p>}
            {q.hint && (
              <div className="mb-4">
                {showHint ? (
                  <div className="flex items-start gap-2 text-xs px-3.5 py-2.5 rounded-xl" style={{ background: "rgba(212,175,106,0.12)", border: `1px solid ${C.amber}44`, color: C.textDim }}><Lightbulb size={14} color={C.amber} className="shrink-0 mt-0.5" />{q.hint}</div>
                ) : (
                  <button onClick={() => setShowHint(true)} className="flex items-center gap-1.5 text-xs" style={{ color: C.amber }}><Lightbulb size={13} /> Show hint</button>
                )}
              </div>
            )}

            {q.type === "Short Answer" ? (
              <textarea value={answers[q.uid] || ""} onChange={(e) => setShortAnswer(e.target.value)} placeholder="Type your answer…" rows={3}
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.panelBorder}`, color: C.text, resize: "vertical" }} />
            ) : (
              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const isMulti = q.type === "Multiple Select";
                  const selected = isMulti ? (Array.isArray(answers[q.uid]) && answers[q.uid].includes(i)) : answers[q.uid] === i;
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <button key={i} onClick={() => (isMulti ? toggleMultiSelect(i) : select(i))} className="quiz-option w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm"
                      style={{ background: selected ? "rgba(228,54,74,0.18)" : "rgba(255,255,255,0.03)", border: `1px solid ${selected ? C.red : C.panelBorder}`, color: selected ? "#FFE3E7" : C.textDim }}>
                      <span className="flex items-center justify-center shrink-0 font-semibold text-xs" style={{ width: 26, height: 26, borderRadius: isMulti ? 7 : 8, background: selected ? C.red : "rgba(255,255,255,0.06)", color: selected ? "#fff" : C.textFaint }}>
                        {isMulti ? (selected ? <CheckCircle2 size={14} /> : letter) : letter}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </Glass>
          <div className="flex items-center justify-between mt-5">
            <button onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: C.panelSolid, color: index === 0 ? C.textFaint : C.text, border: `1px solid ${C.panelBorder}`, opacity: index === 0 ? 0.5 : 1 }}><ChevronLeft size={16} /> Previous</button>
            {index < quiz.length - 1 ? (
              <button onClick={() => setIndex((i) => Math.min(quiz.length - 1, i + 1))} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: GRAD, color: "#fff" }}>Next <ChevronRight size={16} /></button>
            ) : (
              <button onClick={handleSubmit} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: C.green, color: "#06210F" }}>Submit Quiz</button>
            )}
          </div>
        </div>
        <Glass style={{ padding: 20, height: "fit-content" }}>
          <div className="text-xs font-medium mb-3" style={{ color: C.textDim }}>{attemptedCount}/{quiz.length} attempted</div>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {quiz.map((qq, i) => {
              const st = isAttempted(qq) ? "done" : marked[qq.uid] ? "marked" : "none";
              const bg = i === index ? GRAD : st === "done" ? "rgba(52,211,153,0.18)" : st === "marked" ? "rgba(245,185,75,0.18)" : "rgba(255,255,255,0.04)";
              const border = i === index ? "transparent" : st === "done" ? C.green : st === "marked" ? C.amber : C.panelBorder;
              const color = i === index ? "#fff" : st === "done" ? C.green : st === "marked" ? C.amber : C.textFaint;
              return <button key={i} onClick={() => setIndex(i)} className="flex items-center justify-center rounded-lg text-xs font-semibold" style={{ height: 34, background: bg, border: `1px solid ${border}`, color }}>{i + 1}</button>;
            })}
          </div>
          <div className="space-y-1.5 text-[11px]" style={{ color: C.textFaint }}>
            <div className="flex items-center gap-2"><span style={{ width: 8, height: 8, borderRadius: 3, background: C.green }} /> Attempted</div>
            <div className="flex items-center gap-2"><span style={{ width: 8, height: 8, borderRadius: 3, background: C.amber }} /> Marked for review</div>
            <div className="flex items-center gap-2"><span style={{ width: 8, height: 8, borderRadius: 3, background: "rgba(255,255,255,0.15)" }} /> Unattempted</div>
          </div>
          <button onClick={handleSubmit} className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text }}>Submit early</button>
        </Glass>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Results + AI feedback                                                   */
/* ----------------------------------------------------------------------- */
function ResultsScreen({ quiz, answers, timeTakenSec, onReview, onTryAgain, onSimilar, onStub, meta }) {
  const results = useMemo(() => computeResults(quiz, answers), [quiz, answers]);
  const feedback = useMemo(() => buildFeedback(results), [results]);
  const pieData = [{ name: "Correct", value: results.correct, color: C.green }, { name: "Incorrect", value: results.incorrect, color: C.red }];
  const topicData = Object.entries(results.topicStats).map(([topic, s]) => ({ topic, accuracy: Math.round((s.correct / s.total) * 100) }));

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      {meta && meta.shortfall && (
        <div className="flex items-start gap-2 text-xs px-4 py-3 rounded-xl mb-6" style={{ background: "rgba(212,175,106,0.12)", border: `1px solid ${C.amber}44`, color: C.textDim }}>
          <Lightbulb size={14} color={C.amber} className="shrink-0 mt-0.5" />
          Astra generated {meta.provided} of the {meta.requested} requested questions — that's the maximum fresh, non-repeating content available right now for this subject/topic/type combination.
        </div>
      )}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4" style={{ width: 64, height: 64, borderRadius: 20, background: GRAD }}><Trophy size={28} color="#fff" /></div>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text }}>Quiz completed!</h1>
        <div className="text-5xl font-bold mt-3" style={{ fontFamily: "Space Grotesk", color: results.scorePct >= 70 ? C.green : results.scorePct >= 50 ? C.amber : C.red }}>{results.scorePct}%</div>
        <p className="text-sm mt-2" style={{ color: C.textDim }}>{feedback.overall}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={CheckCircle2} label="Correct" value={results.correct} color={C.green} />
        <StatCard icon={XCircle} label="Incorrect" value={results.incorrect} color={C.red} />
        <StatCard icon={Clock} label="Time taken" value={fmtTime(timeTakenSec)} color={C.blue} />
        <StatCard icon={Target} label="Accuracy" value={`${results.scorePct}%`} color={C.purple} />
      </div>
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <Glass style={{ padding: 22 }}>
          <h3 className="font-semibold mb-3" style={{ fontFamily: "Space Grotesk", color: C.text }}>Correct vs incorrect</h3>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>{pieData.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie><Tooltip contentStyle={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 10, color: C.text }} /></PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 text-xs mt-1" style={{ color: C.textDim }}>
            <span className="flex items-center gap-1.5"><span style={{ width: 8, height: 8, borderRadius: 99, background: C.green }} /> Correct ({results.correct})</span>
            <span className="flex items-center gap-1.5"><span style={{ width: 8, height: 8, borderRadius: 99, background: C.red }} /> Incorrect ({results.incorrect})</span>
          </div>
        </Glass>
        <Glass style={{ padding: 22 }}>
          <h3 className="font-semibold mb-3" style={{ fontFamily: "Space Grotesk", color: C.text }}>Topic-wise accuracy</h3>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="topic" width={110} tick={{ fill: C.textDim, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 10, color: C.text }} />
                <Bar dataKey="accuracy" fill={C.blue} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Glass>
      </div>
      <div className="p-5 rounded-2xl mb-6" style={{ background: `linear-gradient(135deg, rgba(76,127,255,0.14), rgba(155,107,255,0.14))`, border: `1px solid ${C.blue}33` }}>
        <div className="flex items-center gap-2 mb-3"><Sparkles size={16} color={C.cyan} /><span className="text-sm font-semibold" style={{ color: C.text }}>Astra AI feedback</span></div>
        <div className="space-y-1.5">{feedback.lines.map((l, i) => <p key={i} className="text-sm leading-relaxed" style={{ color: C.textDim }}>{l}</p>)}</div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={onReview} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text }}><ListChecks size={16} /> Review answers</button>
        <button onClick={onTryAgain} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text }}><RotateCcw size={16} /> Try again</button>
        <button onClick={onSimilar} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: GRAD, color: "#fff" }}><Wand2 size={16} /> Generate similar quiz</button>
        <button onClick={() => onStub("Study Weak Topics")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, color: C.text }}><BookOpen size={16} /> Study weak topics</button>
      </div>
    </div>
  );
}
function ReviewScreen({ quiz, answers, onBack }) {
  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-5" style={{ color: C.textDim }}><ChevronLeft size={16} /> Back to results</button>
      <h1 className="text-2xl font-semibold mb-6" style={{ fontFamily: "Space Grotesk", color: C.text }}>Answer review</h1>
      <div className="space-y-4">
        {quiz.map((q, idx) => {
          const studentAns = answers[q.uid];
          const isCorrect = isAnswerCorrect(q, studentAns);
          const answered = q.type === "Multiple Select" ? Array.isArray(studentAns) && studentAns.length > 0 : q.type === "Short Answer" ? typeof studentAns === "string" && studentAns.trim() : studentAns !== undefined;
          return (
            <Glass key={idx} style={{ padding: 22 }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs" style={{ color: C.textFaint }}>Question {idx + 1} · {q.topic}{q.type !== "MCQ" ? ` · ${q.type}` : ""}</span>
                {answered ? (isCorrect ? <Pill color={C.green}><CheckCircle2 size={12} /> Correct</Pill> : <Pill color={C.red}><XCircle size={12} /> Incorrect</Pill>) : <Pill color={C.textFaint}>Not attempted</Pill>}
              </div>
              <p className="text-sm font-medium mb-4" style={{ color: C.text }}>{q.question}</p>

              {q.type === "Short Answer" ? (
                <div className="space-y-2 mb-4">
                  <div className="px-3.5 py-2.5 rounded-xl text-sm" style={{ border: `1px solid ${answered ? (isCorrect ? C.green : C.red) : C.panelBorder}`, background: "rgba(255,255,255,0.02)", color: C.text }}>
                    <span className="text-xs block mb-1" style={{ color: C.textFaint }}>Your answer</span>
                    {answered ? studentAns : <span style={{ color: C.textFaint }}>— not answered —</span>}
                  </div>
                  <div className="px-3.5 py-2.5 rounded-xl text-sm" style={{ border: `1px solid ${C.green}`, background: "rgba(52,211,153,0.1)", color: C.text }}>
                    <span className="text-xs block mb-1" style={{ color: C.textFaint }}>Expected answer</span>{q.expectedAnswer}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {q.options.map((opt, i) => {
                    const isMulti = q.type === "Multiple Select";
                    const isCorrectOpt = isMulti ? (q.correctIndexes || []).includes(i) : i === q.correctIndex;
                    const isStudentOpt = isMulti ? Array.isArray(studentAns) && studentAns.includes(i) : i === studentAns;
                    let border = C.panelBorder, bg = "rgba(255,255,255,0.02)", color = C.textDim;
                    if (isCorrectOpt) { border = C.green; bg = "rgba(52,211,153,0.1)"; color = C.text; }
                    else if (isStudentOpt && !isCorrectOpt) { border = C.red; bg = "rgba(240,87,106,0.1)"; color = C.text; }
                    return (
                      <div key={i} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm" style={{ border: `1px solid ${border}`, background: bg, color }}>
                        <span className="font-semibold text-xs shrink-0">{String.fromCharCode(65 + i)}</span>{opt}
                        {isCorrectOpt && <CheckCircle2 size={14} color={C.green} className="ml-auto shrink-0" />}
                        {isStudentOpt && !isCorrectOpt && <XCircle size={14} color={C.red} className="ml-auto shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="p-3.5 rounded-xl" style={{ background: "rgba(76,127,255,0.08)", border: `1px solid ${C.blue}33` }}>
                <div className="text-xs font-medium mb-1" style={{ color: C.blue }}>Explanation</div>
                <p className="text-xs leading-relaxed" style={{ color: C.textDim }}>{q.explanation}</p>
              </div>
            </Glass>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Admin / owner dashboard                                                 */
/* ----------------------------------------------------------------------- */
function AdminDashboard({ registeredUsers, quizHistory, quizzesGenerated, onExit }) {
  const total = registeredUsers.length;
  const active = registeredUsers.filter((u) => u.active).length;
  const scored = registeredUsers.filter((u) => u.avgScore != null);
  const avgScore = scored.length ? Math.round(scored.reduce((s, u) => s + u.avgScore, 0) / scored.length) : null;

  const subjectCounts = {};
  quizHistory.forEach((q) => { subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1; });
  const popularSubjects = Object.entries(subjectCounts).map(([subject, count]) => ({ subject, count })).sort((a, b) => b.count - a.count);

  const topicAgg = {};
  quizHistory.forEach((q) => { Object.entries(q.topicStats || {}).forEach(([topic, s]) => { topicAgg[topic] = topicAgg[topic] || { correct: 0, total: 0 }; topicAgg[topic].correct += s.correct; topicAgg[topic].total += s.total; }); });
  const difficultTopics = Object.entries(topicAgg).map(([topic, s]) => ({ topic, accuracy: Math.round((s.correct / s.total) * 100) })).sort((a, b) => a.accuracy - b.accuracy).slice(0, 8);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, position: "relative" }}>
      <FloatingBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
      <div className="flex items-center justify-between px-6 md:px-10 py-5" style={{ borderBottom: `1px solid ${C.panelBorder}` }}>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 10, background: GRAD }}><Shield size={17} color="#fff" /></div>
          <span className="font-semibold" style={{ fontFamily: "Space Grotesk", color: C.text, fontSize: 17 }}>LearnAI · Admin</span>
        </div>
        <button onClick={onExit} className="text-sm font-medium px-4 py-2 rounded-xl" style={{ color: C.text, border: `1px solid ${C.panelBorder}` }}>Exit admin view</button>
      </div>

      <div className="p-6 md:p-10 space-y-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Total students" value={total} color={C.blue} />
          <StatCard icon={Activity} label="Active now" value={active} color={C.green} />
          <StatCard icon={Sparkles} label="Quizzes generated" value={(quizzesGenerated).toLocaleString()} color={C.purple} />
          <StatCard icon={Target} label="Avg student score" value={`${avgScore}%`} color={C.amber} />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Glass style={{ padding: 22 }}>
            <h3 className="font-semibold mb-3" style={{ fontFamily: "Space Grotesk", color: C.text }}>Popular subjects</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={POPULAR_SUBJECTS} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="subject" width={130} tick={{ fill: C.textDim, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 10, color: C.text }} />
                  <Bar dataKey="count" fill={C.blue} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Glass>
          <Glass style={{ padding: 22 }}>
            <h3 className="font-semibold mb-3" style={{ fontFamily: "Space Grotesk", color: C.text }}>Most difficult topics</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DIFFICULT_TOPICS} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="topic" width={130} tick={{ fill: C.textDim, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 10, color: C.text }} />
                  <Bar dataKey="accuracy" fill={C.red} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Glass>
          <Glass style={{ padding: 22 }} className="md:col-span-2">
            <h3 className="font-semibold mb-3" style={{ fontFamily: "Space Grotesk", color: C.text }}>Signups over time</h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SIGNUPS_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: C.panelSolid, border: `1px solid ${C.panelBorder}`, borderRadius: 10, color: C.text }} />
                  <Line type="monotone" dataKey="signups" stroke={C.green} strokeWidth={2.5} dot={{ fill: C.green, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Glass>
        </div>

        <Glass style={{ padding: 0, overflow: "hidden" }}>
          <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${C.panelBorder}` }}>
            <h3 className="font-semibold flex items-center gap-2" style={{ fontFamily: "Space Grotesk", color: C.text }}><UserPlus size={17} color={C.blue} /> Registered students</h3>
            <span className="text-xs" style={{ color: C.textFaint }}>{total} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: 640 }}>
              <thead>
                <tr style={{ color: C.textFaint }} className="text-xs">
                  <th className="text-left font-medium px-5 py-2.5">Name</th>
                  <th className="text-left font-medium px-5 py-2.5">College / Branch</th>
                  <th className="text-left font-medium px-5 py-2.5">Joined</th>
                  <th className="text-left font-medium px-5 py-2.5">Quizzes</th>
                  <th className="text-left font-medium px-5 py-2.5">Avg score</th>
                  <th className="text-left font-medium px-5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {registeredUsers.map((u, i) => (
                  <tr key={u.id || i} style={{ borderTop: `1px solid ${C.panelBorder}` }}>
                    <td className="px-5 py-3">
                      <div className="font-medium" style={{ color: C.text }}>{u.name}</div>
                      <div className="text-xs" style={{ color: C.textFaint }}>{u.email}</div>
                    </td>
                    <td className="px-5 py-3" style={{ color: C.textDim }}>{u.college} · {u.branch}</td>
                    <td className="px-5 py-3" style={{ color: C.textDim }}>{u.joined}</td>
                    <td className="px-5 py-3" style={{ color: C.textDim }}>{u.quizzes ?? u.totalQuizzes ?? 0}</td>
                    <td className="px-5 py-3" style={{ color: C.textDim }}>{u.avgScore != null ? `${u.avgScore}%` : "—"}</td>
                    <td className="px-5 py-3">{u.active ? <Pill color={C.green}>Active</Pill> : <Pill color={C.textFaint}>Inactive</Pill>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Glass>
      </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* App                                                                      */
/* ----------------------------------------------------------------------- */
export default function App() {
  const [view, setView] = useState("landing");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [session, setSession] = useState(null);
  const [genPrefill, setGenPrefill] = useState(null);
  const [learningSubject, setLearningSubject] = useState(null);
  const openSubject = (subject) => { setLearningSubject(subject); setView("learning"); setMobileOpen(false); };
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]); // real registrations only — nothing seeded
  const [quizzesThisSession, setQuizzesThisSession] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [quizHistory, setQuizHistory] = useState([]); // real submitted quiz results only
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const totalQuizzes = quizHistory.length;
    const avgScore = totalQuizzes ? Math.round(quizHistory.reduce((s, q) => s + q.score, 0) / totalQuizzes) : null;
    const studyHours = Math.round((quizHistory.reduce((s, q) => s + (q.timeTakenSec || 0), 0) / 3600) * 10) / 10;
    setRegisteredUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, quizzes: totalQuizzes, totalQuizzes, avgScore, studyHours, topicsMastered: completedTopics.size } : u)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizHistory, completedTopics, currentUser && currentUser.id]);

  const markTopicComplete = (subject, topic) => {
    const key = `${subject}::${topic}`;
    setCompletedTopics((prev) => { const next = new Set(prev); next.add(key); return next; });
    setCurrentUser((u) => (u ? { ...u, xp: (u.xp || 0) + 40, streak: u.streak || 1 } : u));
  };
  const handleProfileSave = (form) => {
    setCurrentUser((u) => (u ? { ...u, name: form.name, college: form.college, degree: form.degree, branch: form.branch, year: form.year } : u));
    setRegisteredUsers((prev) => prev.map((u) => (currentUser && u.id === currentUser.id ? { ...u, name: form.name, college: form.college, degree: form.degree, branch: form.branch, year: form.year } : u)));
  };

  const [regenerating, setRegenerating] = useState(false);

  const showStub = (label) => { setToast(`${label} is coming in the next build`); setTimeout(() => setToast(null), 2600); };
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3800); };
  const handleGenerated = (meta) => {
    setQuizzesThisSession((n) => n + 1);
    if (!meta) return;
    if (meta.error) { showToast(`⚠ ${meta.message}`); return; }
    if (meta.shortfall) showToast(`Astra generated ${meta.provided} of ${meta.requested} unique questions — that's the max fresh content available right now.`);
    else if (meta.source === "local-fallback") showToast("Astra GPT isn't connected yet — using Astra's local generation engine.");
  };

  const handleRegister = (form) => {
    if (registeredUsers.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) {
      showToast("⚠ An account with that email already exists — try logging in instead.");
      return;
    }
    const u = makeUserFromForm(form);
    setRegisteredUsers((prev) => [u, ...prev.map((x) => ({ ...x, active: false }))]);
    setCurrentUser(u);
    setView("onboarding");
  };
  const handleLogin = (email, password) => {
    const match = registeredUsers.find((u) => u.email.toLowerCase() === (email || "").trim().toLowerCase());
    if (!match) return "No account found with that email. Please create one first.";
    if (match.password !== password) return "Incorrect password.";
    setRegisteredUsers((prev) => prev.map((u) => ({ ...u, active: u.id === match.id })));
    setCurrentUser(match);
    setView("dashboard");
    return null;
  };
  const handleOwnerLogin = (passcode) => {
    if (passcode !== OWNER_PASSCODE) return "Incorrect passcode.";
    setIsOwner(true);
    setView("admin");
    return null;
  };
  const handleOnboardingFinish = (data) => { setCurrentUser((u) => ({ ...u, ...data })); setView("dashboard"); };
  const handleLogout = () => {
    setRegisteredUsers((prev) => prev.map((u) => ({ ...u, active: false })));
    setCurrentUser(null); setSession(null); setView("landing");
  };

  const goGenerator = (prefill) => { setGenPrefill(prefill || null); setView("generator"); };
  const startQuiz = ({ config, quiz, meta }) => { setSession({ config, quiz, answers: {}, timeTakenSec: 0, meta }); setView("quiz"); };
  const submitQuiz = ({ answers, timeTakenSec }) => {
    const results = computeResults(session.quiz, answers);
    const entry = { subject: session.config.subject, topic: session.config.topic, score: results.scorePct, date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }), timeTakenSec, topicStats: results.topicStats, difficultyStats: results.difficultyStats };
    setQuizHistory((prev) => [...prev, entry]);
    setSession((s) => ({ ...s, answers, timeTakenSec }));
    setView("results");
  };
  const tryAgain = async () => {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const result = await runAstraGeneration(session.config, {});
      setSession({ config: session.config, quiz: result.questions, answers: {}, timeTakenSec: 0, meta: result.meta });
      handleGenerated(result.meta);
      setView("quiz");
    } catch (e) {
      showToast("⚠ Astra couldn't regenerate the quiz. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };
  const generateSimilar = () => { setGenPrefill(session.config); setView("generator"); };

  const globalStyle = (
    <style>{`${FONT_IMPORT}
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 8px; }
      select { -webkit-appearance: none; appearance: none; }
      body, html { background: ${C.bg}; }
      .quiz-option { transition: transform .15s ease, background-color .15s ease, border-color .15s ease, box-shadow .15s ease; transform-origin: center; }
      .quiz-option:hover { transform: scale(1.035); box-shadow: 0 10px 26px rgba(0,0,0,0.35); z-index: 2; position: relative; }
      .float-item { animation-name: floatDrift; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
      @keyframes floatDrift {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-22px) rotate(var(--float-rot, 10deg)); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
    `}</style>
  );

  if (view === "landing") return <div style={{ fontFamily: "Inter, sans-serif" }}>{globalStyle}<Landing onStart={setView} stats={{ students: registeredUsers.length, quizzes: quizzesThisSession }} /></div>;
  if (view === "login") return <div style={{ fontFamily: "Inter, sans-serif" }}>{globalStyle}<LoginPage onLogin={handleLogin} onGoRegister={() => setView("register")} onGoOwner={() => setView("owner-login")} /></div>;
  if (view === "register") return <div style={{ fontFamily: "Inter, sans-serif" }}>{globalStyle}<RegisterPage onRegister={handleRegister} onGoLogin={() => setView("login")} /></div>;
  if (view === "onboarding") return <div style={{ fontFamily: "Inter, sans-serif" }}>{globalStyle}<OnboardingPage onFinish={handleOnboardingFinish} /></div>;
  if (view === "owner-login") return <div style={{ fontFamily: "Inter, sans-serif" }}>{globalStyle}<OwnerLoginPage onOwnerLogin={handleOwnerLogin} onBack={() => setView("login")} /></div>;
  if (view === "admin") {
    if (!isOwner) { setView("owner-login"); return null; } // never render admin without passing the owner gate
    return (
      <div style={{ fontFamily: "Inter, sans-serif" }}>
        {globalStyle}
        <AdminDashboard registeredUsers={registeredUsers} quizHistory={quizHistory} quizzesGenerated={quizzesThisSession} onExit={() => { setIsOwner(false); setView(currentUser ? "dashboard" : "landing"); }} />
        <Toast message={toast} />
      </div>
    );
  }

  if (!currentUser) { setView("landing"); return null; } // never fabricate a fallback account — always a real signed-in user past this point

  const totalQuizzes = quizHistory.length;
  const avgScore = totalQuizzes ? Math.round(quizHistory.reduce((s, q) => s + q.score, 0) / totalQuizzes) : null;
  const studyHours = Math.round((quizHistory.reduce((s, q) => s + (q.timeTakenSec || 0), 0) / 3600) * 10) / 10;
  const user = { ...currentUser, totalQuizzes, avgScore, studyHours, topicsMastered: completedTopics.size };

  return (
    <div className="flex w-full" style={{ minHeight: "100vh", background: C.bg, fontFamily: "Inter, sans-serif", position: "relative" }}>
      {globalStyle}
      <FloatingBackground />
      <div style={{ position: "relative", zIndex: 1 }}><Sidebar view={view} setView={(v) => { setLearningSubject(null); setView(v); setMobileOpen(false); }} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} user={user} /></div>
      <div className="flex-1 min-w-0" style={{ position: "relative", zIndex: 1 }}>
        <Topbar setMobileOpen={setMobileOpen} user={user} onLogout={handleLogout} setView={setView} goGenerator={goGenerator} openSubject={openSubject} />

        {regenerating ? (
          <GenerationProgress stepIndex={9} progress={{}} requestedCount={session ? session.config.numQuestions : 10} />
        ) : (
          <>
            {view === "dashboard" && <Dashboard user={user} goGenerator={goGenerator} quizHistory={quizHistory} completedTopics={completedTopics} />}
            {view === "learning" && <LearningPage key={learningSubject || "default"} initialSubject={learningSubject} goGenerator={goGenerator} completedTopics={completedTopics} onComplete={markTopicComplete} />}
            {view === "generator" && <QuizGenerator prefill={genPrefill} onStartQuiz={startQuiz} onGenerated={handleGenerated} user={user} />}
            {view === "pdfquiz" && <PdfToQuiz onStartQuiz={startQuiz} onGenerated={handleGenerated} onStub={showStub} />}
            {view === "notes" && <NotesGenerator goGenerator={goGenerator} />}
            {view === "assistant" && <StudyAssistant />}
            {view === "analytics" && <AnalyticsPage quizHistory={quizHistory} />}
            {view === "achievements" && <AchievementsPage user={user} />}
            {view === "profile" && <ProfilePage user={user} onSave={handleProfileSave} completedTopics={completedTopics} />}

            {view === "quiz" && session && <QuizScreen quiz={session.quiz} config={session.config} onSubmit={submitQuiz} />}
            {view === "results" && session && <ResultsScreen quiz={session.quiz} answers={session.answers} timeTakenSec={session.timeTakenSec} meta={session.meta} onReview={() => setView("review")} onTryAgain={tryAgain} onSimilar={generateSimilar} onStub={showStub} />}
            {view === "review" && session && <ReviewScreen quiz={session.quiz} answers={session.answers} onBack={() => setView("results")} />}
          </>
        )}
      </div>
      <Toast message={toast} />
    </div>
  );
}
