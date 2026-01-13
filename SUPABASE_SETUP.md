# Supabase Setup Instructions for Chu Precision Health Center

## 📋 Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Your project credentials (URL and anon key)

## 🚀 Setup Steps

### 1. Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Create a new project or select an existing one
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2. Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Create Database Schema

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase/schema_final.sql` in this project (This contains the COMPLETE schema)
5. Copy the entire contents
6. Paste into the Supabase SQL Editor
7. Click **Run** (or press Ctrl/Cmd + Enter)

This will create:
- ✅ All database tables (profiles, nutrition_logs, activity_logs, etc.)
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for auto-creating user profiles
- ✅ Sample achievements and education content
- ✅ Indexes for better performance

### 4. Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if desired (optional)

### 5. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 📊 Database Schema Overview

Your database includes these tables:

### User Management
- **profiles** - User profile information and precision scores

### Health Tracking
- **nutrition_logs** - Meal and nutrition tracking
- **activity_logs** - Physical activity and exercise
- **stress_logs** - Stress levels and management
- **sleep_logs** - Sleep patterns and quality
- **social_logs** - Social connections and activities
- **substance_logs** - Substance use tracking

### Engagement
- **education_content** - Health education articles
- **education_progress** - User reading progress
- **achievements** - Available achievements
- **user_achievements** - Earned achievements
- **goals** - User health goals

## 🔐 Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own data
- Education content is publicly readable
- Achievements are publicly viewable

## 🧪 Testing the Connection

Use the example component to test your connection:

```typescript
import SupabaseExample from '@/components/SupabaseExample';

// Add to any page to test
<SupabaseExample />
```

## 📚 Usage Examples

### Fetch User Profile
```typescript
import { supabase } from '@/lib/supabase';

const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

### Log a Meal
```typescript
const { data, error } = await supabase
  .from('nutrition_logs')
  .insert([{
    user_id: userId,
    meal_type: 'breakfast',
    meal_name: 'Oatmeal with berries',
    calories: 350,
    protein: 12,
    carbs: 55,
    fats: 8
  }]);
```

### Track Activity
```typescript
const { data, error } = await supabase
  .from('activity_logs')
  .insert([{
    user_id: userId,
    activity_type: 'running',
    duration_minutes: 30,
    intensity: 'moderate',
    calories_burned: 300,
    distance: 3.5
  }]);
```

### Get User Achievements
```typescript
const { data: achievements } = await supabase
  .from('user_achievements')
  .select(`
    *,
    achievements (*)
  `)
  .eq('user_id', userId);
```

## 🔄 Real-time Subscriptions

Subscribe to changes in your data:

```typescript
const subscription = supabase
  .channel('nutrition_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'nutrition_logs' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Don't forget to unsubscribe when done
subscription.unsubscribe();
```

## 🆘 Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` has the correct values
- Restart your dev server after changing environment variables

### "Row Level Security policy violation"
- Make sure you're authenticated
- Check that the user_id matches the authenticated user

### Tables not found
- Run the SQL schema in Supabase SQL Editor
- Check for any SQL errors in the editor

## 📖 Next Steps

1. Implement authentication UI (login/signup pages)
2. Create forms for logging health data
3. Build dashboards to visualize user data
4. Implement the rewards and achievements system
5. Add real-time updates for better UX

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

## 6. Create Members Table (Required for Client Management)

Run this SQL in your Supabase SQL Editor to create the `members` table:

```sql
create table if not exists members (
  id uuid primary key default gen_random_uuid(), -- can link to auth.users.id if desired, or keep separate
  created_at timestamptz default now(),
  email text unique not null,
  first_name text,
  last_name text,
  address text,
  city text,
  state text,
  zip text,
  phone text
  -- auth_id uuid references auth.users(id) -- Optional linking
);

-- Enable RLS (Security)
alter table members enable row level security;

-- Allow all access for now (or configure restrictive policies)
create policy "Enable all access for users" on members for all using (true) with check (true);
```
