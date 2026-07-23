import test from "node:test";
import assert from "node:assert/strict";
import { cleanOcrText, isValidExplanation } from "../../src/lib/aptitude-validator";

test("Aptitude Validator - cleanOcrText PUA Replacement", () => {
  const puaText = "\uf8eb15 + 10\uf8f6 * \uf8ec5\uf8f7";
  const cleaned = cleanOcrText(puaText);
  assert.equal(cleaned, "(15 + 10) * [5]");
});

test("Aptitude Validator - cleanOcrText Fraction Repairs & Math Notation", () => {
  const fractionNoise = "15days3 and 24days5 and 7 th8";
  const cleaned = cleanOcrText(fractionNoise);
  assert.ok(cleaned.includes("5 1/3 days"), `Expected fraction repair in: ${cleaned}`);
  assert.ok(cleaned.includes("4 2/5 days"), `Expected fraction repair in: ${cleaned}`);
});

test("Aptitude Validator - cleanOcrText Currency and Units", () => {
  const text = "The price was Rs. 500 or Rs 250 for cm2 and m3";
  const cleaned = cleanOcrText(text);
  assert.ok(cleaned.includes("₹ 500") || cleaned.includes("₹500"), `Expected rupee sign in: ${cleaned}`);
  assert.ok(cleaned.includes("cm²"), `Expected superscript 2 in: ${cleaned}`);
  assert.ok(cleaned.includes("m³"), `Expected superscript 3 in: ${cleaned}`);
});

test("Aptitude Validator - isValidExplanation", () => {
  assert.equal(isValidExplanation(undefined), false);
  assert.equal(isValidExplanation(""), false);
  assert.equal(isValidExplanation("Too short"), false);
  assert.equal(isValidExplanation("detailed explanation is currently being prepared and will be available in a future update."), false);
  assert.equal(isValidExplanation("verified detailed explanation unavailable."), false);
  
  const validExp = "First calculate the total speed by adding S1 + S2, then divide total distance by relative speed.";
  assert.equal(isValidExplanation(validExp), true);
});
