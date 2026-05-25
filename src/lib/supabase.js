import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ylryfyzzhczrxrkiaits.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlscnlmeXp6aGN6cnhya2lhaXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDg2NjYsImV4cCI6MjA5NTI4NDY2Nn0.KzF2ZGN8mwgFcJGw9_pUuYyKbx1inTKViKPxN_jab2I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const isConfigured = true
