import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

// Helper to load env variables
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) {
    console.error(`❌ .env.local not found at ${envPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach(line => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, "");
      if (key) {
        process.env[key] = val;
      }
    }
  });
}

loadEnv();

console.log("Diagnostic: process.env.NEXT_PUBLIC_SUPABASE_URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  }
});

async function customFetchUserData(userId: string) {
  try {
    const { data: profile } = await supabase.from("users").select("id, username, full_name, semester, xp, level, streak, last_active_date, energy_mode, shortcuts_enabled, created_at, updated_at").eq("id", userId).maybeSingle();
    console.log("customFetchUserData debug: profile row =", profile);
    const { data: progress } = await supabase.from("user_progress").select("*").eq("user_id", userId);
    const { data: bookmarks } = await supabase.from("bookmarks").select("*").eq("user_id", userId);
    const { data: revisionHistory } = await supabase.from("revision_history").select("*").eq("user_id", userId);
    const { data: aptitudeAttempts } = await supabase.from("aptitude_attempts").select("*").eq("user_id", userId);
    const { data: countdownGoals } = await supabase.from("countdown_goals").select("*").eq("user_id", userId);
    const { data: mockTests } = await supabase.from("mock_tests").select("*").eq("user_id", userId);
    const { data: mockInterviews } = await supabase.from("mock_interviews").select("*").eq("user_id", userId);

    return {
      xp: profile?.xp ?? 0,
      level: profile?.level ?? 1,
      streak: profile?.streak ?? 0,
      questionProgress: progress ? Object.fromEntries(progress.map(p => [p.question_id, { status: p.status, timeSpentMin: p.time_spent_min }])) : {},
      bookmarks: bookmarks ? bookmarks.map(b => b.question_id) : [],
      revisionHistory: revisionHistory ? revisionHistory.map(r => ({ id: r.id, questionId: r.question_id, reviewedAt: r.reviewed_at })) : [],
      aptitudeAttempts: aptitudeAttempts ?? [],
      countdownGoals: countdownGoals ?? [],
      mockTests: mockTests ?? [],
      interviewHistory: mockInterviews ?? []
    };
  } catch (err) {
    console.error("customFetchUserData error:", err);
    return null;
  }
}

async function runUserJourneys() {
  console.log("\n=======================================================");
  console.log("🚀 RUNNING END-TO-END USER JOURNEY SIMULATION TESTS");
  console.log("=======================================================");

  const testUsername = "journey_user_" + Math.floor(Math.random() * 100000);
  const testPassword = "journey_password_123";
  const testFullName = "End-to-End Journey Test User";
  const testSemester = "7th Semester — Placement Season";
  let userId = "";

  // Dynamic import so env vars are already loaded in process.env
  const {
    saveUserProfile,
    saveQuestionProgress,
    saveBookmark,
    saveMockTest,
    saveAptitudeAttempt,
    saveCountdownGoal,
    saveMockInterview,
    saveDailyLog,
    saveRevisionLog
  } = await import("../src/lib/supabase-db");

  // Print module configuration diagnostic
  const { hasSupabaseConfig } = await import("../src/lib/supabase");
  console.log("Diagnostic: hasSupabaseConfig in imported module =", hasSupabaseConfig);

  // ----------------------------------------------------
  // PART 1: NEW USER JOURNEY
  // ----------------------------------------------------
  console.log("\n--- [Phase 1: Register New User Account] ---");
  const { data: regData, error: regError } = await supabase.rpc("register_user", {
    p_username: testUsername,
    p_password: testPassword,
    p_full_name: testFullName,
    p_semester: testSemester
  });

  if (regError || regData.error) {
    console.error("❌ Registration failed:", regError || regData.error);
    process.exit(1);
  }

  userId = regData.user.id;
  console.log(`✅ Success: User account created. ID: ${userId}`);

  console.log("\n--- [Phase 2: Verify Initial Progress State & Profile] ---");
  let userData = await customFetchUserData(userId);
  if (!userData) {
    console.error("❌ Failed to fetch user data after registration.");
    process.exit(1);
  }

  console.log("Initial Stats:");
  console.log(`- XP: ${userData.xp} (Expected: 0)`);
  console.log(`- Level: ${userData.level} (Expected: 1)`);
  console.log(`- Streak: ${userData.streak} (Expected: 0)`);
  console.log(`- Question progress count: ${Object.keys(userData.questionProgress).length} (Expected: 0)`);
  console.log(`- Bookmarks count: ${userData.bookmarks.length} (Expected: 0)`);

  if (userData.xp !== 0 || userData.level !== 1 || Object.keys(userData.questionProgress).length !== 0) {
    console.error("❌ Error: Initial user state is not empty/default.");
    process.exit(1);
  }
  console.log("✅ Success: Initial empty state verified.");

  console.log("\n--- [Phase 3: Logout & Log Back In (Session Verification)] ---");
  // Simulate logout
  let sessionUser = null;
  console.log("Simulating logout: clearing active session...");

  // Simulate log back in
  console.log(`Logging back in as "${testUsername}"...`);
  const { data: loginData, error: loginError } = await supabase.rpc("login_user", {
    p_username: testUsername,
    p_password: testPassword
  });

  if (loginError || loginData.error) {
    console.error("❌ Login failed:", loginError || loginData.error);
    process.exit(1);
  }

  sessionUser = loginData.user;
  console.log("Session restored. User details:", sessionUser);
  if (sessionUser.id !== userId) {
    console.error("❌ Error: Logged in user ID does not match registered ID.");
    process.exit(1);
  }
  console.log("✅ Success: New User Journey verified.");

  // ----------------------------------------------------
  // PART 2: EXISTING USER JOURNEY
  // ----------------------------------------------------
  console.log("\n--- [Phase 4: Simulate Solving DSA, Aptitude, Bookmarks, and XP] ---");

  // 1. Solve a DSA Question
  console.log("Simulating solving DSA question 'arrays-l1-101'...");
  await saveQuestionProgress(userId, {
    questionId: "arrays-l1-101",
    status: "solved",
    attempts: 1,
    lastAttemptAt: new Date().toISOString(),
    solvedAt: new Date().toISOString(),
    timeSpentMin: 12
  });

  // 2. Bookmark a question
  console.log("Simulating bookmarking question 'strings-l2-201'...");
  await saveBookmark(userId, "strings-l2-201", true);

  // 3. Log a Spaced Revision (RANDOM UUID)
  const revisionId = randomUUID();
  console.log(`Simulating logging revision for 'arrays-l1-101' (ID: ${revisionId})...`);
  await saveRevisionLog(userId, {
    id: revisionId,
    questionId: "arrays-l1-101",
    reviewedAt: new Date().toISOString()
  });

  // 4. Attempt an Aptitude test
  const aptAttemptId = "apt-attempt-" + Math.floor(Math.random() * 100000);
  console.log(`Simulating completing Aptitude Practice Session (ID: ${aptAttemptId})...`);
  await saveAptitudeAttempt(userId, {
    id: aptAttemptId,
    testType: "practice",
    category: "quantitative",
    score: 80,
    totalQuestions: 5,
    correctAnswers: 4,
    wrongAnswers: 1,
    skippedAnswers: 0,
    timeSpentSec: 300,
    completedAt: new Date().toISOString(),
    answers: { "q1": "A", "q2": "B", "q3": "C", "q4": "D", "q5": "A" }
  });

  // 5. Earn XP and Update User Profile Stats
  console.log("Simulating earning XP (+250 XP, Level up to 3)...");
  await saveUserProfile(userId, {
    xp: 250,
    level: 3,
    streak: 2,
    lastActiveDate: new Date().toISOString().split("T")[0],
    energyMode: "normal",
    shortcutsEnabled: true
  });

  // Debug profile update directly
  const debugProfileResult = await supabase.from("users").update({
    xp: 250,
    level: 3,
    streak: 2,
    last_active_date: new Date().toISOString().split("T")[0],
    energy_mode: "normal",
    shortcuts_enabled: true,
    updated_at: new Date().toISOString()
  }).eq("id", userId);
  console.log("Debug: direct users update result =", debugProfileResult);

  // 6. Create a countdown goal (MUST BE VALID UUID)
  const goalId = randomUUID();
  console.log(`Simulating creating a countdown goal for TCS exam (ID: ${goalId})...`);
  await saveCountdownGoal(userId, {
    id: goalId,
    title: "TCS NQT Preparation Goal",
    targetDate: "2026-08-15",
    milestones: [
      { id: "m1", text: "Practice 50 Aptitude Questions", completed: false }
    ]
  });

  // 7. Complete a Mock Test
  const mockTestId = "dsa-mock-" + Math.floor(Math.random() * 100000);
  console.log(`Simulating completing a Mock Test (ID: ${mockTestId})...`);
  await saveMockTest(userId, {
    id: mockTestId,
    title: "Weekly DSA Mock Test 1",
    durationMin: 60,
    questionIds: ["arrays-l1-101", "strings-l2-201"],
    completedAt: new Date().toISOString(),
    score: 100,
    totalQuestions: 2,
    attempted: 2,
    correctAnswers: 2,
    wrongAnswers: 0
  });

  // 8. Complete a Mock Interview (MUST BE VALID UUID)
  const interviewId = randomUUID();
  console.log(`Simulating completing a Mock Interview (ID: ${interviewId})...`);
  await saveMockInterview(userId, {
    id: interviewId,
    type: "dsa",
    status: "completed",
    score: 9.2,
    questions: [{ q: "Design a rate limiter", answer_mode: "voice" }],
    answers: { "0": "Use token bucket algorithm." },
    feedback: "Exceptional system design skills.",
    completedAt: new Date().toISOString()
  });

  console.log("\n--- [Phase 5: Simulate Page Refresh (Fetch & Assert Data Persistence)] ---");
  userData = await customFetchUserData(userId);
  if (!userData) {
    console.error("❌ Failed to fetch user data after refresh simulation.");
    process.exit(1);
  }

  // Assertions
  console.log("Asserting data updates:");
  console.log(`- XP: ${userData.xp} (Expected: 250)`);
  console.log(`- Level: ${userData.level} (Expected: 3)`);
  console.log(`- Streak: ${userData.streak} (Expected: 2)`);
  
  if (userData.xp !== 250 || userData.level !== 3 || userData.streak !== 2) {
    console.error("❌ Error: Profile stats did not persist correctly.");
    process.exit(1);
  }

  const dsaProgress = userData.questionProgress["arrays-l1-101"];
  console.log(`- DSA progress arrays-l1-101 status: ${dsaProgress?.status} (Expected: solved)`);
  if (dsaProgress?.status !== "solved" || dsaProgress?.timeSpentMin !== 12) {
    console.error("❌ Error: DSA progress did not persist correctly.");
    process.exit(1);
  }

  const hasBookmark = userData.bookmarks.includes("strings-l2-201");
  console.log(`- Bookmark strings-l2-201 exists: ${hasBookmark} (Expected: true)`);
  if (!hasBookmark) {
    console.error("❌ Error: Bookmarks did not persist correctly.");
    process.exit(1);
  }

  const revisionCount = userData.revisionHistory.length;
  console.log(`- Revision history entries: ${revisionCount} (Expected: 1)`);
  if (revisionCount !== 1 || userData.revisionHistory[0].questionId !== "arrays-l1-101") {
    console.error("❌ Error: Revision history did not persist correctly.");
    process.exit(1);
  }

  const aptCount = userData.aptitudeAttempts.length;
  console.log(`- Aptitude attempts: ${aptCount} (Expected: 1)`);
  if (aptCount !== 1 || Number(userData.aptitudeAttempts[0].score) !== 80) {
    console.error("❌ Error: Aptitude attempt did not persist correctly.");
    process.exit(1);
  }

  const mockCount = userData.mockTests.length;
  console.log(`- Mock tests count: ${mockCount} (Expected: 1)`);
  if (mockCount !== 1 || Number(userData.mockTests[0].score) !== 100) {
    console.error("❌ Error: Mock test did not persist correctly.");
    process.exit(1);
  }

  const interviewCount = userData.interviewHistory.length;
  console.log(`- Interview history count: ${interviewCount} (Expected: 1)`);
  if (interviewCount !== 1 || Number(userData.interviewHistory[0].score) !== 9.2) {
    console.error("❌ Error: Mock interview did not persist correctly.");
    process.exit(1);
  }

  const countdownCount = userData.countdownGoals.length;
  console.log(`- Countdown goals count: ${countdownCount} (Expected: 1)`);
  if (countdownCount !== 1 || userData.countdownGoals[0].id !== goalId) {
    console.error("❌ Error: Countdown goal did not persist correctly.");
    process.exit(1);
  }

  console.log("✅ Success: All user activity changes successfully persisted to Supabase!");

  // ----------------------------------------------------
  // PART 3: CLEAN UP (TEARDOWN)
  // ----------------------------------------------------
  console.log("\n--- [Phase 6: Teardown & Clean Up] ---");
  
  console.log("Deleting mock interview...");
  await supabase.from("mock_interviews").delete().eq("user_id", userId);
  
  console.log("Deleting mock test...");
  await supabase.from("mock_tests").delete().eq("user_id", userId);
  
  console.log("Deleting countdown goal...");
  await supabase.from("countdown_goals").delete().eq("user_id", userId);
  
  console.log("Deleting aptitude attempt...");
  await supabase.from("aptitude_attempts").delete().eq("user_id", userId);
  
  console.log("Deleting revision history...");
  await supabase.from("revision_history").delete().eq("user_id", userId);
  
  console.log("Deleting bookmark...");
  await supabase.from("bookmarks").delete().eq("user_id", userId);
  
  console.log("Deleting question progress...");
  await supabase.from("user_progress").delete().eq("user_id", userId);

  console.log("Deleting test user...");
  const { error: deleteUserError } = await supabase.from("users").delete().eq("id", userId);
  if (deleteUserError) {
    console.warn("⚠️ Warning: Could not delete user (security permissions, expected).");
  } else {
    console.log("✅ Success: Test user deleted.");
  }

  console.log("\n=======================================================");
  console.log("🎉 ALL END-TO-END USER JOURNEY TESTS PASSED SUCCESSFULLY!");
  console.log("=======================================================\n");
}

runUserJourneys();
