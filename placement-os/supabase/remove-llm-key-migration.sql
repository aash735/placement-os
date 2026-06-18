-- Migration: Remove llm_api_key column from public.users to prevent credentials leakage
-- This script safely drops the llm_api_key column from the users table.
-- It is completely safe for production since user API keys will reside client-side in localStorage.

ALTER TABLE public.users DROP COLUMN IF EXISTS llm_api_key;
