// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://aulfiflberencgsdvyay.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bGZpZmxiZXJlbmNnc2R2eWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjM1NjAsImV4cCI6MjA2NDEzOTU2MH0.r5KVeORNXx95s8BGpJCQrGKmUu5hHsyembSQJsgh8qQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);