import test from "node:test";
import assert from "node:assert/strict";
import {
  STATUS_ORDER,
  STATUS_XP,
  defaultQuestionProgress,
  defaultTopicProgress,
  isSolvedOrBetter,
  getNextRevisionDate,
  getDueRevisions,
  getTopicCompletionPercent,
  getTopicMasteryLevel,
} from "../../src/lib/dsa-engine";
import type { DSAQuestion, UserQuestionProgress } from "../../src/types";

test("DSA Engine - STATUS_ORDER and STATUS_XP", () => {
  assert.deepEqual(STATUS_ORDER, ["not_started", "attempted", "solved", "revised", "mastered"]);
  assert.equal(STATUS_XP.not_started, 0);
  assert.equal(STATUS_XP.attempted, 10);
  assert.equal(STATUS_XP.solved, 50);
  assert.equal(STATUS_XP.revised, 30);
  assert.equal(STATUS_XP.mastered, 20);
});

test("DSA Engine - defaultQuestionProgress and defaultTopicProgress", () => {
  const qp = defaultQuestionProgress("q-123");
  assert.equal(qp.questionId, "q-123");
  assert.equal(qp.status, "not_started");
  assert.equal(qp.attempts, 0);
  assert.equal(qp.timeSpentMin, 0);

  const tp = defaultTopicProgress("arrays");
  assert.equal(tp.topicId, "arrays");
  assert.equal(tp.levelUnlocked, 1);
  assert.equal(tp.revisionCount, 0);
});

test("DSA Engine - isSolvedOrBetter", () => {
  assert.equal(isSolvedOrBetter("not_started"), false);
  assert.equal(isSolvedOrBetter("attempted"), false);
  assert.equal(isSolvedOrBetter("solved"), true);
  assert.equal(isSolvedOrBetter("revised"), true);
  assert.equal(isSolvedOrBetter("mastered"), true);
});

test("DSA Engine - getNextRevisionDate", () => {
  const baseDate = new Date("2026-01-01T00:00:00.000Z");

  const solvedDate = getNextRevisionDate("solved", baseDate);
  assert.ok(solvedDate);
  // Solved -> +3 days
  assert.equal(new Date(solvedDate).toISOString(), "2026-01-04T00:00:00.000Z");

  const revisedDate = getNextRevisionDate("revised", baseDate);
  assert.ok(revisedDate);
  // Revised -> +7 days
  assert.equal(new Date(revisedDate).toISOString(), "2026-01-08T00:00:00.000Z");

  const masteredDate = getNextRevisionDate("mastered", baseDate);
  assert.ok(masteredDate);
  // Mastered -> +14 days
  assert.equal(new Date(masteredDate).toISOString(), "2026-01-15T00:00:00.000Z");

  const notStartedDate = getNextRevisionDate("not_started", baseDate);
  assert.equal(notStartedDate, undefined);
});

test("DSA Engine - getDueRevisions", () => {
  const questions: DSAQuestion[] = [
    {
      id: "q-1",
      title: "Two Sum",
      topicId: "arrays",
      difficulty: "easy",
      level: 1,
      tier: "must",
      url: "",
    },
    {
      id: "q-2",
      title: "3Sum",
      topicId: "arrays",
      difficulty: "medium",
      level: 2,
      tier: "must",
      url: "",
    },
  ];

  const now = new Date("2026-01-10T00:00:00.000Z");

  const progress: Record<string, UserQuestionProgress> = {
    "q-1": {
      questionId: "q-1",
      status: "solved",
      attempts: 1,
      nextRevisionAt: "2026-01-05T00:00:00.000Z", // past -> due
      timeSpentMin: 15,
    },
    "q-2": {
      questionId: "q-2",
      status: "solved",
      attempts: 1,
      nextRevisionAt: "2026-01-15T00:00:00.000Z", // future -> not due
      timeSpentMin: 30,
    },
  };

  const due = getDueRevisions(questions, progress, now);
  assert.equal(due.length, 1);
  assert.equal(due[0].question.id, "q-1");
});

test("DSA Engine - getTopicCompletionPercent & getTopicMasteryLevel", () => {
  const questions: DSAQuestion[] = [
    { id: "q-1", title: "Q1", topicId: "arrays", difficulty: "easy", level: 1, tier: "must", url: "" },
    { id: "q-2", title: "Q2", topicId: "arrays", difficulty: "medium", level: 1, tier: "must", url: "" },
    { id: "q-3", title: "Q3", topicId: "arrays", difficulty: "hard", level: 1, tier: "must", url: "" },
    { id: "q-4", title: "Q4", topicId: "arrays", difficulty: "hard", level: 1, tier: "must", url: "" },
  ];

  const progress: Record<string, UserQuestionProgress> = {
    "q-1": { questionId: "q-1", status: "solved", attempts: 1, timeSpentMin: 10 },
    "q-2": { questionId: "q-2", status: "mastered", attempts: 2, timeSpentMin: 20 },
    "q-3": { questionId: "q-3", status: "attempted", attempts: 1, timeSpentMin: 5 },
    "q-4": { questionId: "q-4", status: "not_started", attempts: 0, timeSpentMin: 0 },
  };

  // 2 solved out of 4 = 50%
  const pct = getTopicCompletionPercent("arrays", progress, questions);
  assert.equal(pct, 50);

  const mastery = getTopicMasteryLevel("arrays", progress, questions);
  assert.equal(mastery, "learning");
});
