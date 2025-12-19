import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_REACT_APP_SUPABASE_URL,
  import.meta.env.VITE_REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);