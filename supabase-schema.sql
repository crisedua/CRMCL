-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create clients table
CREATE TABLE clients (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  company text,
  position text,
  notes text,
  status text DEFAULT 'prospect' CHECK (status IN ('active', 'inactive', 'prospect')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create opportunities table
CREATE TABLE opportunities (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  value decimal(10,2),
  stage text DEFAULT 'prospect' CHECK (stage IN ('prospect', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability integer CHECK (probability >= 0 AND probability <= 100),
  expected_close_date date,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create tasks table
CREATE TABLE tasks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamp with time zone,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create interactions table (for tracking client communications)
CREATE TABLE interactions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note')),
  subject text NOT NULL,
  description text,
  date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_opportunities_user_id ON opportunities(user_id);
CREATE INDEX idx_opportunities_client_id ON opportunities(client_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_client_id ON tasks(client_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_interactions_user_id ON interactions(user_id);
CREATE INDEX idx_interactions_client_id ON interactions(client_id);
CREATE INDEX idx_interactions_date ON interactions(date);

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER update_interactions_updated_at BEFORE UPDATE ON interactions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Clients policies
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Opportunities policies
CREATE POLICY "Users can view own opportunities" ON opportunities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own opportunities" ON opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own opportunities" ON opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own opportunities" ON opportunities FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Interactions policies
CREATE POLICY "Users can view own interactions" ON interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interactions" ON interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interactions" ON interactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interactions" ON interactions FOR DELETE USING (auth.uid() = user_id);
