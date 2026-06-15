"use client";

import { create } from "zustand";
import type { PlatformData } from "@/lib/sheets/loader";
import type { DSAQuestion, DSATopicMeta } from "@/types";
import type { CompanyProfile, AptitudeTopic, MockTestSet, StudyResource } from "@/lib/sheets/transformers";

type DataState = {
  data: PlatformData | null;
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
  fetchData: (force?: boolean) => Promise<void>;
  getQuestionById: (id: string) => DSAQuestion | undefined;
  questions: DSAQuestion[];
  topics: DSATopicMeta[];
  mockTests: MockTestSet[];
  companies: CompanyProfile[];
  aptitudeTopics: AptitudeTopic[];
  resources: StudyResource[];
};

const CACHE_MS = 60_000;

export const useDataStore = create<DataState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
  questions: [],
  topics: [],
  mockTests: [],
  companies: [],
  aptitudeTopics: [],
  resources: [],

  fetchData: async (force = false) => {
    const { lastFetched, loading } = get();
    if (loading) return;
    if (!force && lastFetched && Date.now() - new Date(lastFetched).getTime() < CACHE_MS) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("Failed to load sheet data");
      const data: PlatformData = await res.json();
      set({
        data,
        questions: data.questions,
        topics: data.topics,
        mockTests: data.mockTests,
        companies: data.companies,
        aptitudeTopics: data.aptitudeTopics,
        resources: data.resources || [],
        loading: false,
        lastFetched: new Date().toISOString(),
        error: null,
      });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
  },

  getQuestionById: (id) => get().questions.find((q) => q.id === id),
}));
