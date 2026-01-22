import { supabase } from "../supabase.js";

export const createFolder = async (req, res) => {
  const { name, parentId } = req.body;

  const { data, error } = await supabase
    .from("folders")
    .insert([
      {
        name,
        parent_id: parentId || null,
        owner_id: req.user.id
      }
    ])
    .select()
    .single();

  if (error) return res.status(400).json(error);

  res.json(data);
};
export const getFolderContents = async (req, res) => {
  const { id } = req.params;

  // Get folders inside
  const { data: folders } = await supabase
    .from("folders")
    .select("*")
    .eq("parent_id", id)
    .eq("is_deleted", false);

  // Get files inside
  const { data: files } = await supabase
    .from("files")
    .select("*")
    .eq("folder_id", id)
    .eq("is_deleted", false);

  res.json({ folders, files });
};

