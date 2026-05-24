"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Search, Award, BarChart2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { careerRolesData, jobIcons, AtsRole } from "@/data/ats-roles";

// Helper for basic stemming
function getWordStems(word: string): string[] {
  const stems = [word];
  const w = word.toLowerCase().trim();
  if (w.endsWith('ing')) {
    stems.push(w.slice(0, -3));
    stems.push(w.slice(0, -3) + 'e');
  } else if (w.endsWith('ed')) {
    stems.push(w.slice(0, -2));
    stems.push(w.slice(0, -1));
  } else if (w.endsWith('s') && !w.endsWith('ss')) {
    stems.push(w.slice(0, -1));
  } else if (w.endsWith('es')) {
    stems.push(w.slice(0, -2));
  } else if (w.endsWith('er')) {
    stems.push(w.slice(0, -2));
  } else if (w.endsWith('ly')) {
    stems.push(w.slice(0, -2));
  }
  return Array.from(new Set(stems));
}

// Normalize text for matching
function normalizeText(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check if keyword matches in text
function checkKeywordMatch(text: string, keyword: string): boolean {
  const normText = normalizeText(text);
  const normKeyword = normalizeText(keyword);

  // Exact phrase match
  const exactPattern = new RegExp('\\b' + normKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
  if (exactPattern.test(normText)) {
    return true;
  }

  // Multi-word checks
  const words = normKeyword.split(' ');
  if (words.length > 1) {
    const allWordsPresent = words.every(word => {
      const wordPattern = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + 's?\\b', 'i');
      return wordPattern.test(normText);
    });
    if (allWordsPresent) return true;
  }

  // Stemming check
  const stems = getWordStems(normKeyword);
  return stems.some(stem => {
    const stemPattern = new RegExp('\\b' + stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\w*\\b', 'i');
    return stemPattern.test(normText);
  });
}

// Check alternatives from suggestions
function checkAlternatives(text: string, keyword: string, suggestions?: Record<string, string[]>): boolean {
  if (!suggestions || !suggestions[keyword]) return false;
  return suggestions[keyword].some(alt => checkKeywordMatch(text, alt));
}

export function HireLensATS() {
  const [selectedRole, setSelectedRole] = useState<AtsRole | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  
  // Results states
  const [score, setScore] = useState(0);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"matched" | "missing">("matched");
  const [expandedMissingKey, setExpandedMissingKey] = useState<string | null>(null);
  const [roleRecommendations, setRoleRecommendations] = useState<{ title: string; pct: number }[]>([]);

  // Filter roles based on search
  const filteredRoles = careerRolesData.filter(role => 
    role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract text from PDF using PDF.js dynamically
  const extractText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjs = await import('pdfjs-dist');
    // CDN worker config
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF format resume.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Please upload a file smaller than 10MB.");
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);
    try {
      const extracted = await extractText(file);
      setResumeText(extracted);
      runAnalysis(extracted);
    } catch (err) {
      console.error("PDF extraction error:", err);
      alert("Error parsing PDF resume. Please make sure it's a valid PDF.");
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const runAnalysis = (text: string) => {
    if (!selectedRole) return;

    const matched: string[] = [];
    const missing: string[] = [];

    selectedRole.keywords.forEach(kw => {
      const isMatched = checkKeywordMatch(text, kw) || checkAlternatives(text, kw, selectedRole.suggestions);
      if (isMatched) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const finalScore = Math.round((matched.length / selectedRole.keywords.length) * 100);
    setScore(finalScore);
    setMatchedKeywords(matched);
    setMissingKeywords(missing);

    // Compute Role Fit recommendations against all 32 roles
    const recommendations = careerRolesData.map(role => {
      let matchCount = 0;
      role.keywords.forEach(kw => {
        if (checkKeywordMatch(text, kw) || checkAlternatives(text, kw, role.suggestions)) {
          matchCount++;
        }
      });
      const pct = Math.round((matchCount / role.keywords.length) * 100);
      return { title: role.title, pct };
    })
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

    setRoleRecommendations(recommendations);
    setIsProcessing(false);
  };

  const resetScanner = () => {
    setResumeText("");
    setFileName("");
    setScore(0);
    setMatchedKeywords([]);
    setMissingKeywords([]);
    setRoleRecommendations([]);
  };

  // Render Highlighted Text
  const renderHighlightedResume = () => {
    if (!selectedRole || !resumeText) return "";
    let html = resumeText.replace(/\n/g, '<br />');

    const allMatchTerms = new Set<string>();
    matchedKeywords.forEach(kw => {
      allMatchTerms.add(kw.toLowerCase());
      if (selectedRole.suggestions?.[kw]) {
        selectedRole.suggestions[kw].forEach(alt => allMatchTerms.add(alt.toLowerCase()));
      }
    });

    // Replace terms safely using word boundaries
    allMatchTerms.forEach(term => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');
      html = html.replace(regex, `<span class="bg-cyan-500/20 text-cyan-300 px-1 py-0.5 rounded border border-cyan-500/30 font-semibold">$1</span>`);
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} className="text-xs font-mono text-zinc-400 max-h-60 overflow-y-auto bg-black/30 p-4 rounded-xl border border-white/5 leading-relaxed" />;
  };

  return (
    <div className="space-y-6">
      {/* Target Role Selector View */}
      {!selectedRole && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Select Target Role for ATS Match</h3>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search job roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 pl-9 pr-4 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredRoles.map(role => {
              const icon = jobIcons[role.title] || '💼';
              return (
                <button
                  key={role.title}
                  onClick={() => setSelectedRole(role)}
                  className="text-left rounded-xl border border-white/5 bg-zinc-950/40 p-4 hover:border-cyan-500/40 hover:bg-cyan-950/5 transition-all group flex gap-3.5 items-start"
                >
                  <span className="text-2xl h-11 w-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-cyan-950/40 group-hover:border-cyan-500/30 transition-all">
                    {icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate">{role.title}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-widest">{role.category}</p>
                    <span className="inline-block mt-2.5 text-[9px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-850">
                      {role.keywords.length} Core Keywords
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload/Active Analysis View */}
      {selectedRole && matchedKeywords.length === 0 && !isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                {jobIcons[selectedRole.title] || '💼'}
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Targeting: {selectedRole.title}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{selectedRole.category}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedRole(null)}
              className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors"
            >
              Change Role
            </button>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-cyan-500 bg-cyan-950/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/20"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
            <div className="h-12 w-12 rounded-full bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-center text-cyan-400 mb-4 animate-bounce">
              <Upload className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Drag and drop your PDF resume here</h4>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
              We extract and scan text directly in your browser. Privacy-first, no servers stored.
            </p>
            <span className="mt-4 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-semibold rounded-lg">
              Click to browse files (PDF only, max 10MB)
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
            <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Extracting & Matching Keywords</h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
              Evaluating resume text against {selectedRole?.keywords.length} critical skills for {selectedRole?.title}...
            </p>
          </div>
        </div>
      )}

      {/* Analysis Results View */}
      {selectedRole && matchedKeywords.length > 0 && !isProcessing && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                {jobIcons[selectedRole.title] || '💼'}
              </span>
              <div>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Analysis Complete</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedRole.title}</h3>
                <p className="text-xs text-zinc-400 truncate max-w-xs">{fileName}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedRole(null)}
                className="btn-ghost border border-zinc-800 hover:bg-zinc-900 px-4 py-2 rounded-xl text-xs text-zinc-400 font-semibold"
              >
                Change Role
              </button>
              <button
                onClick={resetScanner}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Scan Again
              </button>
            </div>
          </div>

          {/* Core Match metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Radial Score card */}
            <GlassCard className="flex flex-col items-center justify-center p-6 text-center" hover={false}>
              <div className="relative flex items-center justify-center h-44 w-44 select-none">
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    className="stroke-zinc-900"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    className={score >= 80 ? "stroke-emerald-400" : score >= 60 ? "stroke-amber-400" : "stroke-rose-500"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - score / 100)}
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                </svg>
                <div className="z-10 space-y-0.5">
                  <p className="text-4xl font-extrabold tracking-tight font-mono">{score}%</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">ATS Compatibility</p>
                </div>
              </div>

              <div className="mt-4 flex gap-6 text-center w-full justify-center">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Matched</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">{matchedKeywords.length}</span>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Missing</span>
                  <span className="text-base font-extrabold text-rose-400 font-mono">{missingKeywords.length}</span>
                </div>
                <div className="border-r border-zinc-900 h-8 self-center" />
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Total</span>
                  <span className="text-base font-extrabold text-zinc-300 font-mono">{selectedRole.keywords.length}</span>
                </div>
              </div>
            </GlassCard>

            {/* Keyword Breakdowns List */}
            <GlassCard className="col-span-1 md:col-span-2 flex flex-col p-6 overflow-hidden h-[264px]" hover={false}>
              <div className="flex border-b border-zinc-900 gap-4 mb-4 shrink-0">
                <button
                  onClick={() => setActiveTab("matched")}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === "matched"
                      ? "border-cyan-500 text-cyan-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Matched ({matchedKeywords.length})
                </button>
                <button
                  onClick={() => setActiveTab("missing")}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === "missing"
                      ? "border-cyan-500 text-cyan-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Missing ({missingKeywords.length})
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {activeTab === "matched" ? (
                  <div className="flex flex-wrap gap-2">
                    {matchedKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {missingKeywords.map((kw, idx) => {
                      const isExpanded = expandedMissingKey === kw;
                      const hasSugg = selectedRole.suggestions?.[kw] && selectedRole.suggestions[kw].length > 0;
                      return (
                        <div key={idx} className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-zinc-300">⚠️ {kw}</span>
                            {hasSugg && (
                              <button
                                onClick={() => setExpandedMissingKey(isExpanded ? null : kw)}
                                className="text-[10px] text-cyan-400 hover:text-cyan-300"
                              >
                                {isExpanded ? "Hide Alternatives" : "View Alternatives"}
                              </button>
                            )}
                          </div>
                          {isExpanded && hasSugg && (
                            <div className="pt-2 border-t border-zinc-900 space-y-1.5">
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Suggested Synonyms</p>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedRole.suggestions?.[kw]?.map((sugg, sIdx) => (
                                  <span key={sIdx} className="bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded text-[10px] font-mono">
                                    {sugg}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {missingKeywords.length === 0 && (
                      <p className="text-center text-zinc-500 py-10 text-xs italic">Amazing! Zero missing keywords. Resume is perfectly aligned. 🏆</p>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Recommendations Fit panel */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Top 3 closest fits */}
            <GlassCard className="col-span-1 p-6 space-y-4" hover={false}>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4 text-cyan-400" /> Top Matches Across Roles
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                We also scanned your resume against all other 32 career roles. Here are your top matches:
              </p>
              
              <div className="space-y-4 pt-2">
                {roleRecommendations.map((rec, i) => {
                  const medal = ["🥇 Best Fit", "🥈 Strong Fit", "🥉 Good Fit"][i];
                  return (
                    <div key={rec.title} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{medal}</span>
                        <span className="font-bold text-cyan-400 font-mono">{rec.pct}%</span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-200 truncate">{rec.title}</h4>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${rec.pct}%`, transition: "width 1s ease-out" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Resume Highlighting view */}
            <GlassCard className="col-span-1 md:col-span-2 p-6 space-y-4" hover={false}>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-cyan-400" /> Resume Content Highlight
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Below is the parsed text of your resume. Keywords that matched the target role qualifications are highlighted:
              </p>

              {renderHighlightedResume()}
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
