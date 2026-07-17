import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Helper to load env variables from .env.local
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key (masked):", supabaseAnonKey.substring(0, 10) + "...");

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  }
});

async function runTests() {
  console.log("\n=======================================================");
  console.log("🚀 RUNNING DATABASE SCHEMA & CRUD VERIFICATION TESTS");
  console.log("=======================================================");

  const testUsername = "release_test_user_" + Math.floor(Math.random() * 100000);
  const testPassword = "secure_password_123";
  const testFullName = "Release Certification Test User";
  const testSemester = "8th Semester — Final Audit";
  let testUserId = "";

  // ──── TEST 1: Register User RPC ────
  console.log("\n--- [Test 1: Custom Registration RPC] ---");
  const registerPayload = {
    p_username: testUsername,
    p_password: testPassword,
    p_full_name: testFullName,
    p_semester: testSemester
  };
  console.log("Request Payload:", registerPayload);

  const { data: regData, error: regError } = await supabase.rpc("register_user", registerPayload);
  
  if (regError) {
    console.error("❌ RPC Error:", regError);
    process.exit(1);
  }
  console.log("Response Payload:", regData);

  if (regData.error) {
    console.error("❌ Registration error in payload:", regData.error);
    process.exit(1);
  }

  testUserId = regData.user.id;
  console.log(`✅ Success: User registered successfully. ID: ${testUserId}`);

  // ──── TEST 2: Login User RPC ────
  console.log("\n--- [Test 2: Custom Login RPC] ---");
  const loginPayload = {
    p_username: testUsername,
    p_password: testPassword
  };
  console.log("Request Payload (Correct Credentials):", loginPayload);
  const { data: loginData, error: loginError } = await supabase.rpc("login_user", loginPayload);
  if (loginError || loginData.error) {
    console.error("❌ Login failed:", loginError || loginData.error);
    process.exit(1);
  }
  console.log("Response Payload:", loginData);
  console.log("✅ Success: Login succeeded for correct credentials.");

  // Test Login with wrong password
  const wrongLoginPayload = {
    p_username: testUsername,
    p_password: "wrong_password"
  };
  console.log("Request Payload (Incorrect Credentials):", wrongLoginPayload);
  const { data: wrongLoginData } = await supabase.rpc("login_user", wrongLoginPayload);
  console.log("Response Payload:", wrongLoginData);
  if (wrongLoginData && wrongLoginData.error) {
    console.log("✅ Success: Login correctly rejected wrong credentials with error:", wrongLoginData.error);
  } else {
    console.error("❌ Error: Login accepted wrong credentials!");
    process.exit(1);
  }

  // ──── TEST 3: CRUD Profiles (users table) ────
  console.log("\n--- [Test 3: CRUD 'users' Table] ---");
  // READ
  const { data: userProfile, error: readProfileError } = await supabase
    .from("users")
    .select("id, username, full_name, semester, xp, level, streak, energy_mode")
    .eq("id", testUserId)
    .maybeSingle();

  if (readProfileError || !userProfile) {
    console.error("❌ Failed to read profile:", readProfileError);
    process.exit(1);
  }
  console.log("Read Profile Output:", userProfile);

  // UPDATE
  console.log("Updating profile stats (XP +100, Level 2)...");
  const { error: updateProfileError } = await supabase
    .from("users")
    .update({
      xp: 100,
      level: 2,
      streak: 1,
      energy_mode: "recovery",
      updated_at: new Date().toISOString()
    })
    .eq("id", testUserId);

  if (updateProfileError) {
    console.error("❌ Failed to update profile:", updateProfileError);
    process.exit(1);
  }

  // READ again to verify update
  const { data: updatedProfile } = await supabase
    .from("users")
    .select("id, xp, level, streak, energy_mode")
    .eq("id", testUserId)
    .maybeSingle();

  console.log("Updated Profile Output:", updatedProfile);
  if (updatedProfile?.xp === 100 && updatedProfile?.level === 2 && updatedProfile?.energy_mode === "recovery") {
    console.log("✅ Success: Profile UPDATE verified.");
  } else {
    console.error("❌ Error: Profile UPDATE values do not match.");
    process.exit(1);
  }

  // ──── TEST 4: CRUD user_progress ────
  console.log("\n--- [Test 4: CRUD 'user_progress' Table] ---");
  const testQuestionId = "arrays-l1-101";
  
  // CREATE (Upsert)
  const progressPayload = {
    user_id: testUserId,
    question_id: testQuestionId,
    status: "solved",
    attempts: 2,
    last_attempt_at: new Date().toISOString(),
    solved_at: new Date().toISOString(),
    time_spent_min: 15,
    notes: "Solved using hash map approach."
  };
  console.log("Upsert Progress Payload:", progressPayload);
  const { error: createProgError } = await supabase.from("user_progress").upsert(progressPayload);
  if (createProgError) {
    console.error("❌ Failed to create user progress:", createProgError);
    process.exit(1);
  }

  // READ
  const { data: progressRead, error: readProgError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", testUserId)
    .eq("question_id", testQuestionId)
    .maybeSingle();

  if (readProgError || !progressRead) {
    console.error("❌ Failed to read progress:", readProgError);
    process.exit(1);
  }
  console.log("Read Progress Output:", progressRead);

  // UPDATE
  console.log("Updating progress status to 'mastered'...");
  const { error: updateProgError } = await supabase
    .from("user_progress")
    .update({ status: "mastered", mastered_at: new Date().toISOString() })
    .eq("user_id", testUserId)
    .eq("question_id", testQuestionId);

  if (updateProgError) {
    console.error("❌ Failed to update progress:", updateProgError);
    process.exit(1);
  }

  // READ again
  const { data: progressUpdated } = await supabase
    .from("user_progress")
    .select("status, mastered_at")
    .eq("user_id", testUserId)
    .eq("question_id", testQuestionId)
    .maybeSingle();
  console.log("Updated Progress Output:", progressUpdated);
  if (progressUpdated?.status === "mastered" && progressUpdated.mastered_at) {
    console.log("✅ Success: Question progress update verified.");
  } else {
    console.error("❌ Error: Question progress status was not updated.");
    process.exit(1);
  }

  // DELETE
  console.log("Deleting progress record...");
  const { error: deleteProgError } = await supabase
    .from("user_progress")
    .delete()
    .eq("user_id", testUserId)
    .eq("question_id", testQuestionId);
  if (deleteProgError) {
    console.error("❌ Failed to delete progress:", deleteProgError);
    process.exit(1);
  }
  console.log("✅ Success: user_progress CRUD operations verified.");

  // ──── TEST 5: CRUD revision_history ────
  console.log("\n--- [Test 5: CRUD 'revision_history' Table] ---");
  const revisionPayload = {
    user_id: testUserId,
    question_id: testQuestionId,
    reviewed_at: new Date().toISOString()
  };
  console.log("Insert Revision Payload:", revisionPayload);
  const { data: revInsert, error: createRevError } = await supabase.from("revision_history").insert(revisionPayload).select();
  if (createRevError || !revInsert || revInsert.length === 0) {
    console.error("❌ Failed to insert revision log:", createRevError);
    process.exit(1);
  }
  const revisionLogId = revInsert[0].id;
  console.log("Inserted Revision Output:", revInsert[0]);

  // READ
  const { data: revList, error: readRevError } = await supabase
    .from("revision_history")
    .select("*")
    .eq("user_id", testUserId);
  if (readRevError) {
    console.error("❌ Failed to read revision list:", readRevError);
    process.exit(1);
  }
  console.log(`Read Revision Output (list length: ${revList.length}):`, revList);

  // DELETE
  console.log("Deleting revision log entry...");
  const { error: deleteRevError } = await supabase
    .from("revision_history")
    .delete()
    .eq("id", revisionLogId);
  if (deleteRevError) {
    console.error("❌ Failed to delete revision log:", deleteRevError);
    process.exit(1);
  }
  console.log("✅ Success: revision_history CRUD operations verified.");

  // ──── TEST 6: CRUD bookmarks ────
  console.log("\n--- [Test 6: CRUD 'bookmarks' Table] ---");
  const bookmarkPayload = {
    user_id: testUserId,
    question_id: testQuestionId,
    created_at: new Date().toISOString()
  };
  console.log("Insert Bookmark Payload:", bookmarkPayload);
  const { error: createBookError } = await supabase.from("bookmarks").insert(bookmarkPayload);
  if (createBookError) {
    console.error("❌ Failed to insert bookmark:", createBookError);
    process.exit(1);
  }

  // READ
  const { data: bookmarksList, error: readBookError } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", testUserId);
  if (readBookError) {
    console.error("❌ Failed to read bookmarks list:", readBookError);
    process.exit(1);
  }
  console.log(`Read Bookmarks Output:`, bookmarksList);

  // DELETE
  console.log("Deleting bookmark...");
  const { error: deleteBookError } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", testUserId)
    .eq("question_id", testQuestionId);
  if (deleteBookError) {
    console.error("❌ Failed to delete bookmark:", deleteBookError);
    process.exit(1);
  }
  console.log("✅ Success: bookmarks CRUD operations verified.");

  // ──── TEST 7: CRUD analytics ────
  console.log("\n--- [Test 7: CRUD 'analytics' Table] ---");
  const todayDate = new Date().toISOString().split("T")[0];
  const analyticsPayload = {
    user_id: testUserId,
    date: todayDate,
    questions_solved: 5,
    revisions_done: 3,
    xp_earned: 50,
    focus_minutes: 45
  };
  console.log("Upsert Analytics Payload:", analyticsPayload);
  const { error: createAnalError } = await supabase.from("analytics").upsert(analyticsPayload);
  if (createAnalError) {
    console.error("❌ Failed to upsert analytics:", createAnalError);
    process.exit(1);
  }

  // READ
  const { data: analyticsRead, error: readAnalError } = await supabase
    .from("analytics")
    .select("*")
    .eq("user_id", testUserId)
    .eq("date", todayDate)
    .maybeSingle();

  if (readAnalError || !analyticsRead) {
    console.error("❌ Failed to read analytics:", readAnalError);
    process.exit(1);
  }
  console.log("Read Analytics Output:", analyticsRead);

  // UPDATE
  console.log("Updating analytics focus minutes to 60 and XP to 70...");
  const { error: updateAnalError } = await supabase
    .from("analytics")
    .update({ focus_minutes: 60, xp_earned: 70 })
    .eq("user_id", testUserId)
    .eq("date", todayDate);
  if (updateAnalError) {
    console.error("❌ Failed to update analytics:", updateAnalError);
    process.exit(1);
  }

  // READ again
  const { data: analyticsUpdated } = await supabase
    .from("analytics")
    .select("focus_minutes, xp_earned")
    .eq("user_id", testUserId)
    .eq("date", todayDate)
    .maybeSingle();
  console.log("Updated Analytics Output:", analyticsUpdated);
  if (analyticsUpdated?.focus_minutes === 60 && analyticsUpdated.xp_earned === 70) {
    console.log("✅ Success: Analytics UPDATE verified.");
  } else {
    console.error("❌ Error: Analytics UPDATE values mismatch.");
    process.exit(1);
  }

  // DELETE
  console.log("Deleting analytics record...");
  const { error: deleteAnalError } = await supabase
    .from("analytics")
    .delete()
    .eq("user_id", testUserId)
    .eq("date", todayDate);
  if (deleteAnalError) {
    console.error("❌ Failed to delete analytics:", deleteAnalError);
    process.exit(1);
  }
  console.log("✅ Success: analytics CRUD operations verified.");

  // ──── TEST 8: CRUD countdown_goals ────
  console.log("\n--- [Test 8: CRUD 'countdown_goals' Table] ---");
  const goalId = "test-goal-id-" + Math.floor(Math.random() * 100000);
  const targetDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]; // 10 days from now
  const goalPayload = {
    id: goalId,
    user_id: testUserId,
    title: "Prepare Arrays DSA Masterclass",
    target_date: targetDate,
    milestones: [
      { id: "m1", text: "Complete Array medium questions", completed: false },
      { id: "m2", text: "Review revision cards", completed: false }
    ]
  };
  console.log("Upsert Countdown Goal Payload:", goalPayload);
  const { error: createGoalError } = await supabase.from("countdown_goals").upsert(goalPayload);
  if (createGoalError) {
    console.error("❌ Failed to upsert countdown goal:", createGoalError);
    process.exit(1);
  }

  // READ
  const { data: goalRead, error: readGoalError } = await supabase
    .from("countdown_goals")
    .select("*")
    .eq("user_id", testUserId)
    .eq("id", goalId)
    .maybeSingle();

  if (readGoalError || !goalRead) {
    console.error("❌ Failed to read countdown goal:", readGoalError);
    process.exit(1);
  }
  console.log("Read Countdown Goal Output:", goalRead);

  // UPDATE
  console.log("Updating countdown goal milestones (milestone 1 completed)...");
  const updatedMilestones = [
    { id: "m1", text: "Complete Array medium questions", completed: true },
    { id: "m2", text: "Review revision cards", completed: false }
  ];
  const { error: updateGoalError } = await supabase
    .from("countdown_goals")
    .update({ milestones: updatedMilestones })
    .eq("user_id", testUserId)
    .eq("id", goalId);
  if (updateGoalError) {
    console.error("❌ Failed to update countdown goal:", updateGoalError);
    process.exit(1);
  }

  // READ again
  const { data: goalUpdated } = await supabase
    .from("countdown_goals")
    .select("milestones")
    .eq("user_id", testUserId)
    .eq("id", goalId)
    .maybeSingle();
  console.log("Updated Countdown Goal Output:", goalUpdated);
  if (goalUpdated?.milestones && (goalUpdated.milestones as any)[0].completed === true) {
    console.log("✅ Success: Countdown Goal UPDATE verified.");
  } else {
    console.error("❌ Error: Countdown Goal UPDATE values mismatch.");
    process.exit(1);
  }

  // DELETE
  console.log("Deleting countdown goal...");
  const { error: deleteGoalError } = await supabase
    .from("countdown_goals")
    .delete()
    .eq("user_id", testUserId)
    .eq("id", goalId);
  if (deleteGoalError) {
    console.error("❌ Failed to delete countdown goal:", deleteGoalError);
    process.exit(1);
  }
  console.log("✅ Success: countdown_goals CRUD operations verified.");

  // ──── TEST 9: CRUD mock_tests ────
  console.log("\n--- [Test 9: CRUD 'mock_tests' Table] ---");
  const testId = "test-mock-exam-101";
  const mockTestPayload = {
    id: testId,
    user_id: testUserId,
    title: "Arrays Mock Assessment",
    duration: 45,
    question_ids: ["arrays-l1-101", "arrays-l2-202", "arrays-l3-303"],
    completed_at: new Date().toISOString(),
    score: 85.5
  };
  console.log("Upsert Mock Test Payload:", mockTestPayload);
  const { error: createTestError } = await supabase.from("mock_tests").upsert(mockTestPayload);
  if (createTestError) {
    console.error("❌ Failed to upsert mock test:", createTestError);
    process.exit(1);
  }

  // READ
  const { data: testRead, error: readTestError } = await supabase
    .from("mock_tests")
    .select("*")
    .eq("user_id", testUserId)
    .eq("id", testId)
    .maybeSingle();

  if (readTestError || !testRead) {
    console.error("❌ Failed to read mock test:", readTestError);
    process.exit(1);
  }
  console.log("Read Mock Test Output:", testRead);

  // UPDATE
  console.log("Updating mock test score to 90.0...");
  const { error: updateTestError } = await supabase
    .from("mock_tests")
    .update({ score: 90.0 })
    .eq("user_id", testUserId)
    .eq("id", testId);
  if (updateTestError) {
    console.error("❌ Failed to update mock test:", updateTestError);
    process.exit(1);
  }

  // READ again
  const { data: testUpdated } = await supabase
    .from("mock_tests")
    .select("score")
    .eq("user_id", testUserId)
    .eq("id", testId)
    .maybeSingle();
  console.log("Updated Mock Test Output:", testUpdated);
  if (Number(testUpdated?.score) === 90.0) {
    console.log("✅ Success: Mock Test UPDATE verified.");
  } else {
    console.error("❌ Error: Mock Test UPDATE score mismatch:", testUpdated?.score);
    process.exit(1);
  }

  // DELETE
  console.log("Deleting mock test record...");
  const { error: deleteTestError } = await supabase
    .from("mock_tests")
    .delete()
    .eq("user_id", testUserId)
    .eq("id", testId);
  if (deleteTestError) {
    console.error("❌ Failed to delete mock test:", deleteTestError);
    process.exit(1);
  }
  console.log("✅ Success: mock_tests CRUD operations verified.");

  // ──── TEST 10: CRUD mock_interviews ────
  console.log("\n--- [Test 10: CRUD 'mock_interviews' Table] ---");
  const interviewId = "test-interview-id-" + Math.floor(Math.random() * 100000);
  const interviewPayload = {
    id: interviewId,
    user_id: testUserId,
    type: "dsa",
    status: "completed",
    score: 8.5,
    questions: [
      { q: "Explain how to detect a loop in a linked list.", answer_mode: "voice" },
      { q: "What is the time complexity of building a heap?", answer_mode: "voice" }
    ],
    answers: {
      "0": "We can use Floyd's Cycle finding algorithm (slow and fast pointers).",
      "1": "It takes O(N) time using bottom-up heap construction."
    },
    feedback: "Solid understanding of linked lists and heap characteristics. Keep it up!",
    completed_at: new Date().toISOString()
  };
  console.log("Upsert Mock Interview Payload:", interviewPayload);
  const { error: createIntError } = await supabase.from("mock_interviews").upsert(interviewPayload);
  if (createIntError) {
    console.error("❌ Failed to upsert mock interview:", createIntError);
    process.exit(1);
  }

  // READ
  const { data: interviewRead, error: readIntError } = await supabase
    .from("mock_interviews")
    .select("*")
    .eq("user_id", testUserId)
    .eq("id", interviewId)
    .maybeSingle();

  if (readIntError || !interviewRead) {
    console.error("❌ Failed to read mock interview:", readIntError);
    process.exit(1);
  }
  console.log("Read Mock Interview Output:", interviewRead);

  // UPDATE
  console.log("Updating mock interview feedback and score (score 9.0)...");
  const { error: updateIntError } = await supabase
    .from("mock_interviews")
    .update({ score: 9.0, feedback: "Excellent performance!" })
    .eq("user_id", testUserId)
    .eq("id", interviewId);
  if (updateIntError) {
    console.error("❌ Failed to update mock interview:", updateIntError);
    process.exit(1);
  }

  // READ again
  const { data: interviewUpdated } = await supabase
    .from("mock_interviews")
    .select("score, feedback")
    .eq("user_id", testUserId)
    .eq("id", interviewId)
    .maybeSingle();
  console.log("Updated Mock Interview Output:", interviewUpdated);
  if (Number(interviewUpdated?.score) === 9.0 && interviewUpdated?.feedback === "Excellent performance!") {
    console.log("✅ Success: Mock Interview UPDATE verified.");
  } else {
    console.error("❌ Error: Mock Interview UPDATE mismatch:", interviewUpdated);
    process.exit(1);
  }

  // DELETE
  console.log("Deleting mock interview record...");
  const { error: deleteIntError } = await supabase
    .from("mock_interviews")
    .delete()
    .eq("user_id", testUserId)
    .eq("id", interviewId);
  if (deleteIntError) {
    console.error("❌ Failed to delete mock interview:", deleteIntError);
    process.exit(1);
  }
  console.log("✅ Success: mock_interviews CRUD operations verified.");

  // ──── CLEAN UP TEST USER ────
  console.log("\n--- [Clean Up: Deleting Test User Profile] ---");
  const { error: deleteUserError } = await supabase.from("users").delete().eq("id", testUserId);
  if (deleteUserError) {
    console.warn("⚠️ Warning: Anon key cannot delete from users table (expected). Error:", deleteUserError.message);
  } else {
    console.log("✅ Success: Test user deleted successfully.");
  }

  console.log("\n=======================================================");
  console.log("🎉 ALL CRUD VERIFICATION TESTS COMPLETED SUCCESSFULLY!");
  console.log("=======================================================\n");
}

runTests();
