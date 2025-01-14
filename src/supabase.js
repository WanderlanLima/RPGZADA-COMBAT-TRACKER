import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oubarwxkoukttrfxqatm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91YmFyd3hrb3VrdHRyZnhxYXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMTQ3MDAsImV4cCI6MjA1MTg5MDcwMH0.IkJ28kZL8JqoQaLwTChDHIdeXTdFk00VTAMy7O4ULRE';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;