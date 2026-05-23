"use client";

import { useEffect } from "react";
import { useDataStore } from "@/store/data-store";
import { useProgressStore } from "@/lib/progress-store";

/** Hydrate platform data from /api/data (sheets) once per session */
export function useSheetData() {
  const fetchData = useDataStore((s) => s.fetchData);
  const data = useDataStore((s) => s.data);
  const loading = useDataStore((s) => s.loading);
  const error = useDataStore((s) => s.error);
  const questions = useDataStore((s) => s.questions);
  const topics = useDataStore((s) => s.topics);
  const mockTests = useDataStore((s) => s.mockTests);
  const companies = useDataStore((s) => s.companies);
  const aptitudeTopics = useDataStore((s) => s.aptitudeTopics);
  const bookmarks = useProgressStore((s) => s.bookmarks ?? []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    questions,
    topics,
    mockTests,
    companies,
    aptitudeTopics,
    bookmarks,
    refetch: () => fetchData(true),
  };
}
