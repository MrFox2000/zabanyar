/**
 * Public Supabase client configuration.
 *
 * These are the browser-safe values (project URL + anon/publishable key). They
 * are meant to be shipped to clients; the database is protected by RLS policies
 * (see docs/supabase-schema.sql). Environment variables win when present.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://dunvmmxssguoxgzuukle.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bnZtbXhzc2d1b3hnenV1a2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUwMzg4OTEsImV4cCI6MjExMDYxNDg5MX0.SiLTtzDAe3_JBVefwFvAiwvIXKwQrsSdhoBoTVoPuSA";
