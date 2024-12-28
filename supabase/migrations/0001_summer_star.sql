/*
  # Create tasks and user_tasks tables

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `date` (date)
      - `end_date` (date, optional)
      - `start_time` (time)
      - `end_time` (time)
      - `priority` (text)
      - `description` (text, optional)
      - `category` (text)
      - `status` (text)
      - `recurrence_pattern` (text, optional)
      - `recurrence_week_days` (text[], optional)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

    - `completed_tasks`
      - `id` (uuid, primary key)
      - `task_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `completed_at` (timestamptz)
      - `duration` (integer)
      - `start_time` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date date NOT NULL,
  end_date date,
  start_time time NOT NULL,
  end_time time NOT NULL,
  priority text NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  description text,
  category text NOT NULL CHECK (category IN ('Work', 'Personal')),
  status text NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  recurrence_pattern text CHECK (recurrence_pattern IN ('None', 'Daily', 'Weekly', 'Weekdays', 'Weekends')),
  recurrence_week_days text[],
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create completed_tasks table
CREATE TABLE IF NOT EXISTS completed_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz DEFAULT now(),
  duration integer NOT NULL,
  start_time timestamptz NOT NULL
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks table
CREATE POLICY "Users can create their own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for completed_tasks table
CREATE POLICY "Users can create their own completed tasks"
  ON completed_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own completed tasks"
  ON completed_tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_date_idx ON tasks(date);
CREATE INDEX IF NOT EXISTS completed_tasks_user_id_idx ON completed_tasks(user_id);
CREATE INDEX IF NOT EXISTS completed_tasks_completed_at_idx ON completed_tasks(completed_at);