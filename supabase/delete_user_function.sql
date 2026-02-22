-- Function to delete a user (only callable by super_admin)
-- This deletes from auth.users, which should cascade delete from user_roles, pending_admins etc.

CREATE OR REPLACE FUNCTION delete_user(target_user_id UUID)
RETURNS json AS $$
DECLARE
  current_user_role VARCHAR;
BEGIN
  -- Check if current user is super_admin
  SELECT role INTO current_user_role
  FROM user_roles
  WHERE user_id = auth.uid()
  AND role = 'super_admin';

  IF current_user_role IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Only Super Admins can delete users');
  END IF;

  -- Prevent deleting yourself
  IF target_user_id = auth.uid() THEN
    RETURN json_build_object('success', false, 'error', 'You cannot delete yourself');
  END IF;

  -- Delete from auth.users (requires permission, usually only service_role can do this directly, but SECURITY DEFINER helps)
  -- However, deleting from auth.users via SQL function is restricted in Supabase for security.
  -- Alternative: We can delete from 'user_roles' and 'pending_admins' which effectively removes their access.
  -- But to actually delete the account, we need the supabase admin api.
  
  -- Since we are using SQL, we will try to delete from public tables.
  -- Deleting from auth.users creates a constraint violation if not handled carefully, or permission denied.
  -- But usually, RLS/Foreign keys handle cascade.
  
  -- TRICK: Supabase doesn't easily allow deleting from auth.users via RPC for arbitrary users unless using an extension or edge function.
  -- BUT, if we delete from `user_roles`, they lose access.
  -- AND we can mark them as `rejected` or deleted in `pending_admins`.
  
  -- Let's attempt to just remove their roles and approve status.
  
  DELETE FROM user_roles WHERE user_id = target_user_id;
  
  -- Update pending_admins to rejected or deleted status (so they don't show up active)
  UPDATE pending_admins 
  SET status = 'deleted' 
  WHERE user_id = target_user_id;

  -- Note: The actual auth user record remains, but they have no roles and are "deleted" in our system.
  -- This is often safer/easier without Service Key.

  RETURN json_build_object('success', true, 'message', 'User access revoked and marked deleted');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION delete_user(UUID) TO authenticated;
