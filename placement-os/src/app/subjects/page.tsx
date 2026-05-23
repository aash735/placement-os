"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  HelpCircle,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";

interface SubjectTopic {
  id: string;
  name: string;
  desc: string;
}

interface Subject {
  id: string;
  name: string;
  description: string;
  topics: SubjectTopic[];
  quiz: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
}

const SUBJECTS_DATA: Subject[] = [
  {
    id: "dbms",
    name: "DBMS & SQL",
    description: "SQL Joins, Normalization, Transactions, and Indexing",
    topics: [
      { id: "dbms-joins", name: "SQL Joins & Subqueries", desc: "Inner, Left, Right, Full, and Self joins with complex nested queries." },
      { id: "dbms-norm", name: "Normalization Theory", desc: "1NF, 2NF, 3NF, and BCNF schemas to reduce data redundancy." },
      { id: "dbms-acid", name: "ACID Properties & Transactions", desc: "Atomicity, Consistency, Isolation, and Durability guarantees." },
      { id: "dbms-index", name: "Indexing Mechanisms", desc: "Clustered vs Non-Clustered indexing and B-Tree database indexing." },
      { id: "dbms-nosql", name: "SQL vs NoSQL scaling", desc: "Architectural differences, CAP theorem, and when to use MongoDB vs Postgres." }
    ],
    quiz: [
      {
        question: "Which of the following Normal Forms resolves partial dependency (where non-prime attributes depend on a subset of candidate keys)?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        answer: "2NF",
        explanation: "Second Normal Form (2NF) requires that the table is in 1NF and there are no partial dependencies. All non-key attributes must be fully functionally dependent on the entire primary key."
      },
      {
        question: "Which transaction isolation level completely prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads?",
        options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
        answer: "Serializable",
        explanation: "Serializable is the highest isolation level. It locks the affected range of rows, preventing other transactions from inserting or modifying data, thereby eliminating all three phenomena."
      }
    ]
  },
  {
    id: "os",
    name: "Operating Systems",
    description: "Process management, Deadlocks, Paging, and Threading",
    topics: [
      { id: "os-sched", name: "CPU Scheduling Algorithms", desc: "First-Come First-Served (FCFS), Shortest Job First (SJF), and Round Robin." },
      { id: "os-deadlock", name: "Deadlock Detection & Prevention", desc: "Mutual exclusion, hold & wait, no preemption, circular wait, and Banker's Algorithm." },
      { id: "os-mem", name: "Paging & Virtual Memory", desc: "Page tables, Translation Lookaside Buffer (TLB), and page faults." },
      { id: "os-cache", name: "Page Replacement Algorithms", desc: "Least Recently Used (LRU), FIFO, and Optimal page replacements." },
      { id: "os-thread", name: "Processes vs Threads & Sync", desc: "Process creation, thread shared memories, mutexes, and semaphores." }
    ],
    quiz: [
      {
        question: "Which of the following conditions is NOT required for a deadlock to occur?",
        options: ["Mutual Exclusion", "Hold and Wait", "Preemption allowed", "Circular Wait"],
        answer: "Preemption allowed",
        explanation: "The four Coffman conditions for deadlock are: Mutual Exclusion, Hold & Wait, No Preemption (meaning resources cannot be forcibly taken), and Circular Wait. If preemption is allowed, deadlocks can be broken."
      },
      {
        question: "What is the purpose of the Translation Lookaside Buffer (TLB) in virtual memory systems?",
        options: ["To store data blocks", "To translate physical addresses to cache slots", "To cache page table translations", "To handle disk page swaps"],
        answer: "To cache page table translations",
        explanation: "The TLB is a high-speed hardware cache that stores recent virtual-to-physical address translations, skipping slow memory lookups in the main page table."
      }
    ]
  },
  {
    id: "cn",
    name: "Computer Networks",
    description: "OSI Stack, TCP handshakes, HTTP/S, and IP Protocols",
    topics: [
      { id: "cn-osi", name: "TCP/IP vs OSI Layers", desc: "Standard 7-layer OSI model and 4-layer TCP/IP protocol encapsulation." },
      { id: "cn-handshake", name: "TCP 3-Way Handshake & Congestion", desc: "SYN, SYN-ACK, ACK sequences, congestion window, and flow control." },
      { id: "cn-http", name: "HTTP vs HTTPS & SSL/TLS", desc: "Stateless HTTP methods, SSL/TLS handshake encryption, and ports." },
      { id: "cn-dns", name: "DNS Lookup & IP Addressing", desc: "Recursive DNS queries, CIDR notation, and IPv4 vs IPv6 addressing." },
      { id: "cn-socket", name: "WebSockets vs HTTP Polling", desc: "Bidirectional full-duplex TCP connections vs short/long polling methods." }
    ],
    quiz: [
      {
        question: "What flags are set in the packets during the standard TCP 3-Way Handshake connection initialization?",
        options: ["SYN -> ACK -> SYN-ACK", "SYN -> SYN-ACK -> ACK", "SYN -> SYN -> ACK", "INIT -> INIT-ACK -> ACK"],
        answer: "SYN -> SYN-ACK -> ACK",
        explanation: "The sequence is: 1) Client sends SYN. 2) Server replies with SYN-ACK. 3) Client completes handshake by sending ACK."
      },
      {
        question: "Which layer of the OSI model is responsible for routing packets across networks using logical IP addresses?",
        options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
        answer: "Network Layer",
        explanation: "The Network Layer handles packet routing, forwarding, and logical addressing (IP addresses)."
      }
    ]
  },
  {
    id: "oop",
    name: "OOP Concepts",
    description: "Inheritance, Polymorphism, Abstraction, and SOLID Design",
    topics: [
      { id: "oop-inherit", name: "Inheritance Models", desc: "Single, Multiple, Multilevel, and Diamond problem in Java/C++." },
      { id: "oop-poly", name: "Polymorphism Mechanics", desc: "Method Overloading (compile-time) vs Method Overriding (runtime)." },
      { id: "oop-encap", name: "Encapsulation & Access Control", desc: "Data hiding, getters/setters, and private vs protected access modifiers." },
      { id: "oop-abstract", name: "Abstraction & Interfaces", desc: "Abstract classes vs interfaces and pure virtual functions." },
      { id: "oop-solid", name: "SOLID Principles of Design", desc: "Single responsibility, Open/Closed, Liskov substitution, Interface segregation, Dependency inversion." }
    ],
    quiz: [
      {
        question: "Which SOLID principle states that 'subtypes must be substitutable for their base types' without breaking the program behavior?",
        options: ["Single Responsibility", "Open/Closed Principle", "Liskov Substitution Principle", "Dependency Inversion"],
        answer: "Liskov Substitution Principle",
        explanation: "The Liskov Substitution Principle (LSP) ensures that any subclass or derived class can stand in for its parent class without altering code correctness."
      },
      {
        question: "What is the key difference between Method Overloading and Method Overriding?",
        options: [
          "Overloading happens at compile-time in the same class; Overriding happens at runtime in child classes.",
          "Overriding happens at compile-time; Overloading happens at runtime.",
          "Overloading requires inheritance; Overriding does not.",
          "They are synonyms in standard C++ and Java."
        ],
        answer: "Overloading happens at compile-time in the same class; Overriding happens at runtime in child classes.",
        explanation: "Method Overloading allows multiple methods in the same class to share a name but have different parameters (static/compile-time binding). Method Overriding allows a subclass to provide a specific implementation of a method inherited from its parent (dynamic/runtime binding)."
      }
    ]
  }
];

export default function SubjectsPage() {
  const { csSubjects = {}, updateCsSubject } = useProgressStore();
  const [expandedSubject, setExpandedSubject] = useState<string | null>("dbms");
  
  // Quiz runner states
  const [activeQuizSubject, setActiveQuizSubject] = useState<Subject | null>(null);
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const toggleExpand = (subId: string) => {
    setExpandedSubject(expandedSubject === subId ? null : subId);
  };

  const handleTopicCheck = (subId: string, topicId: string) => {
    const currentSub = csSubjects[subId] || { status: "not-started", checkedItems: [] };
    const isChecked = currentSub.checkedItems.includes(topicId);
    
    let updatedChecks: string[];
    if (isChecked) {
      updatedChecks = currentSub.checkedItems.filter((id) => id !== topicId);
    } else {
      updatedChecks = [...currentSub.checkedItems, topicId];
    }

    const status = updatedChecks.length === 5 ? "completed" : "studying";
    updateCsSubject(subId, status, currentSub.score, updatedChecks);
  };

  const startQuiz = (sub: Subject) => {
    setActiveQuizSubject(sub);
    setQuizIdx(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
  };

  const handleAnswerSubmit = () => {
    if (!activeQuizSubject || !selectedOpt) return;
    const currentQuiz = activeQuizSubject.quiz[quizIdx];
    const isCorrect = selectedOpt === currentQuiz.answer;
    
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
    
    setShowExplanation(true);
  };

  const handleNextQuizQuestion = () => {
    if (!activeQuizSubject) return;
    
    if (quizIdx < activeQuizSubject.quiz.length - 1) {
      setQuizIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      // Quiz finished
      setQuizFinished(true);
      // If passed (2/2 correct)
      const passed = correctAnswersCount + (selectedOpt === activeQuizSubject.quiz[quizIdx].answer ? 1 : 0) === 2;
      const currentSubState = csSubjects[activeQuizSubject.id] || { status: "not-started", checkedItems: [] };
      
      updateCsSubject(
        activeQuizSubject.id, 
        passed ? "completed" : currentSubState.status, 
        passed ? 100 : 50,
        currentSubState.checkedItems
      );
    }
  };

  return (
    <AppShell title="CS Core Subjects" subtitle="High-yield placement theory revision">
      <PageHeader 
        title="Core Computer Science Revision" 
        description="Interviewers focus heavily on DBMS, OS, CN, and OOP fundamentals to filter candidates. Complete the syllabus checklists below." 
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* SUBJECT CARDS LAYOUT */}
        <div className="lg:col-span-2 space-y-4">
          {SUBJECTS_DATA.map((subject) => {
            const isExpanded = expandedSubject === subject.id;
            const subState = csSubjects[subject.id] || { status: "not-started", checkedItems: [], score: 0 };
            const checkedCount = subState.checkedItems.length;
            const progressPercent = Math.round((checkedCount / 5) * 100);

            return (
              <GlassCard key={subject.id} className="overflow-hidden border-white/5" hover={false}>
                {/* Subject Header Banner */}
                <div 
                  onClick={() => toggleExpand(subject.id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all select-none"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white">{subject.name}</h3>
                      {subState.status === "completed" && (
                        <CheckCircle className="h-4 w-4 text-emerald-400 fill-emerald-500/10" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{subject.description}</p>
                  </div>

                  <div className="flex items-center space-x-4 pl-4">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {progressPercent}% Complete
                      </span>
                      <p className="text-[9px] text-zinc-500 mt-0.5">{checkedCount}/5 Topics</p>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                  </div>
                </div>

                {/* Progress Indicator Bar */}
                <div className="h-1 w-full bg-white/5">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Expanded Syllabus Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-black/30 overflow-hidden"
                    >
                      <div className="p-5 space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          Interview Syllabus Checklist
                        </span>

                        <div className="space-y-3">
                          {subject.topics.map((topic) => {
                            const isChecked = subState.checkedItems.includes(topic.id);
                            return (
                              <div 
                                key={topic.id} 
                                className="flex items-start space-x-3 p-3 rounded-xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all"
                              >
                                <button
                                  onClick={() => handleTopicCheck(subject.id, topic.id)}
                                  className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isChecked 
                                      ? "border-cyan-400 bg-cyan-500 text-black" 
                                      : "border-zinc-600 hover:border-zinc-400 bg-black/40"
                                  }`}
                                >
                                  {isChecked && <CheckCircle className="h-3.5 w-3.5" />}
                                </button>
                                <div>
                                  <h4 className={`text-xs font-bold ${isChecked ? "text-zinc-500 line-through" : "text-white"}`}>
                                    {topic.name}
                                  </h4>
                                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                                    {topic.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Quiz Action */}
                        <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                          <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5 text-cyan-400" />
                            Pass the quiz to complete this subject module.
                          </p>
                          <button
                            onClick={() => startQuiz(subject)}
                            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_2px_10px_rgba(6,182,212,0.15)]"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Run Subject Quiz</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>

        {/* ROADMAP STATS COLUMN */}
        <div className="space-y-4">
          <GlassCard className="p-6" hover={false}>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1">
              <Award className="h-4 w-4 text-amber-400" />
              Syllabus Weight (10%)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Core CS subjects make up 10% of the overall Placement Readiness score. Mark syllabus items complete to unlock higher readiness!
            </p>

            <div className="space-y-3 mt-4 text-xs">
              {SUBJECTS_DATA.map((sub) => {
                const subState = csSubjects[sub.id] || { status: "not-started", checkedItems: [] };
                return (
                  <div key={sub.id} className="flex justify-between items-center p-2.5 rounded bg-white/5 border border-white/5">
                    <span className="font-semibold text-zinc-300">{sub.name}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      subState.status === "completed" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-zinc-800 text-zinc-400 border border-white/5"
                    }`}>
                      {subState.status.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="text-sm font-bold text-white mb-3">Interview Pro-Tips</h3>
            <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-2 leading-relaxed">
              <li>
                DBMS: Be ready to write SQL queries on live code pads. Nested joins are highly queried.
              </li>
              <li>
                OS: Deadlock Coffman conditions and Banker&apos;s algorithm calculations are regular filters.
              </li>
              <li>
                CN: Understanding HTTPS TLS handshake flow determines junior engineering status.
              </li>
              <li>
                OOP: Interviewers will ask you to design real-life systems (like Parking Lot) applying SOLID designs.
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>

      {/* INTERACTIVE MINI-QUIZ MODAL */}
      <AnimatePresence>
        {activeQuizSubject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 backdrop-blur-sm"
          >
            <GlassCard className="max-w-md w-full p-6 border-white/10 relative" hover={false}>
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="h-4.5 w-4.5 text-cyan-400" />
                  {activeQuizSubject.name} Mini-Quiz
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  Question {quizIdx + 1} of {activeQuizSubject.quiz.length}
                </span>
              </div>

              {!quizFinished ? (
                <div>
                  {/* Question */}
                  <p className="text-xs font-semibold text-white mb-4 leading-relaxed">
                    {activeQuizSubject.quiz[quizIdx].question}
                  </p>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {activeQuizSubject.quiz[quizIdx].options.map((opt) => {
                      const isSelected = selectedOpt === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => !showExplanation && setSelectedOpt(opt)}
                          disabled={showExplanation}
                          className={`w-full text-left p-3 rounded-xl border text-[11px] transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-cyan-500/10 border-cyan-400 text-white"
                              : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10"
                          }`}
                        >
                          <span>{opt}</span>
                          <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-cyan-400 bg-cyan-400" : "border-zinc-500"
                          }`}>
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-black" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation panel */}
                  {showExplanation && (
                    <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/5 text-[10px] leading-relaxed">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {selectedOpt === activeQuizSubject.quiz[quizIdx].answer ? (
                          <span className="text-emerald-400 font-bold">✓ Correct!</span>
                        ) : (
                          <span className="text-rose-400 font-bold">✗ Incorrect &mdash; Correct answer: {activeQuizSubject.quiz[quizIdx].answer}</span>
                        )}
                      </div>
                      <p className="text-zinc-400">{activeQuizSubject.quiz[quizIdx].explanation}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex justify-end">
                    {!showExplanation ? (
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={!selectedOpt}
                        className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold disabled:opacity-40"
                      >
                        Submit Response
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold"
                      >
                        {quizIdx < activeQuizSubject.quiz.length - 1 ? "Next Question" : "Finish Assessment"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Assessment Concluded!</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      You answered <span className="text-cyan-400 font-bold">{correctAnswersCount}</span> out of{" "}
                      <span className="text-white font-bold">{activeQuizSubject.quiz.length}</span> questions correctly.
                    </p>
                  </div>

                  {correctAnswersCount === activeQuizSubject.quiz.length ? (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] leading-relaxed">
                      🎉 Perfect score! You have unlocked the subject completion status and earned 50 XP. Keep it up!
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 text-[11px] leading-relaxed">
                      Practice makes perfect. Revise the checklist items above and attempt the quiz again to verify your placement readiness.
                    </div>
                  )}

                  <button
                    onClick={() => setActiveQuizSubject(null)}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 text-xs font-semibold transition-all mt-4"
                  >
                    Close Assessment
                  </button>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
