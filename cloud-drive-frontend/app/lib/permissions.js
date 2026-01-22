import { supabase } from "./supabase";

/**
 * Check if user can access a file
 */
export async function canAccessFile(userId, fileName) {
  // Owner access
  const { data: owned } = await supabase
    .from("file_shares")
    .select("id")
    .eq("file_name", fileName)
    .eq("owner_id", userId)
    .maybeSingle();

  if (owned) return true;

  // Shared access
  const { data: shared } = await supabase
    .from("file_shares")
    .select("id")
    .eq("file_name", fileName)
    .eq("shared_with", userId)
    .maybeSingle();

  return !!shared;
}
