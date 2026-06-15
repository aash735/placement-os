/**
 * Helper mapping resource IDs to their clean parsed slugs
 */
export function getTcsSlugFromResourceId(resId: string): string {
  const cleanId = resId.replace(/"/g, "").trim();
  
  // Strip company resource prefix
  const slug = cleanId.replace(/^tcs-res-/, "");

  const mappings: Record<string, string> = {
    "tcs-ninja-quantitative-aptitude-21": "tcs-ninja-quantitative-aptitude-2-1",
    "tcs-ninja-quantitative-aptitude-3r1": "tcs-ninja-quantitative-aptitude-3-r-1",
    "tcs-ninja-quantitative-aptitude-41": "tcs-ninja-quantitative-aptitude-4-1",
    "tcs-ninja-quantitative-aptitude-51": "tcs-ninja-quantitative-aptitude-5-1",
    "tcs-ninja-verbal-ability-21": "tcs-ninja-verbal-ability-2-1",
    "tcs-ninja-verbal-ability-31": "tcs-ninja-verbal-ability-3-1",
    "tcs-ninja-verbal-ability-41": "tcs-ninja-verbal-ability-4-1",
    "tcs-ninja-verbal-ability-5r1": "tcs-ninja-verbal-ability-5-r-1",
    "tcs-ninja-verbal-ability-6r": "tcs-ninja-verbal-ability-6-r",
    "tcs17-04tr": "tcs17-04t-r",
  };

  return mappings[slug] || slug;
}

/**
 * Checks if a resource ID corresponds to a parsed native MCQ test
 */
export function isTcsInteractiveMcq(resId: string): boolean {
  const slug = getTcsSlugFromResourceId(resId);
  const mcqSlugs = [
    "tcs-ninja-quantitative-aptitude-2-1",
    "tcs-ninja-quantitative-aptitude-3-r-1",
    "tcs-ninja-quantitative-aptitude-4-1",
    "tcs-ninja-quantitative-aptitude-5-1",
    "tcs-ninja-quantitative-aptitude-6",
    "tcs-ninja-verbal-ability-2-1",
    "tcs-ninja-verbal-ability-3-1",
    "tcs-ninja-verbal-ability-4-1",
    "tcs-ninja-verbal-ability-5-r-1",
    "tcs-ninja-verbal-ability-6-r",
    "tcs17-02t",
    "tcs17-03t",
    "tcs17-04t-r",
    "tcs17-05t",
    "tcs17-06t",
  ];
  return mcqSlugs.includes(slug);
}

/**
 * Checks if a resource ID corresponds to a parsed coding challenge
 */
export function isTcsCodingChallenge(resId: string): boolean {
  const slug = getTcsSlugFromResourceId(resId);
  const codingSlugs = [
    "tcs-02t",
    "tcs-03t",
    "tcs-04c",
    "tcs-05c",
    "tcs-06c",
  ];
  return codingSlugs.includes(slug);
}
