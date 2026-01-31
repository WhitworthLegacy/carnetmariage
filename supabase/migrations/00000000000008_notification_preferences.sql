-- Add notification preferences to profiles (Premium only)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{
  "email_task_reminders": true,
  "email_rsvp_updates": true,
  "email_budget_alerts": true,
  "push_enabled": true
}'::jsonb;

-- Add push subscription for web push notifications
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS push_subscription jsonb DEFAULT NULL;

-- Comment
COMMENT ON COLUMN profiles.notification_preferences IS 'User notification preferences - Premium feature';
COMMENT ON COLUMN profiles.push_subscription IS 'Web Push API subscription object for browser notifications';
