import { supabase } from "../supabase.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.body.file; // placeholder (we'll add real upload later)
    const user = req.user;

    return res.json({
      message: "File upload endpoint working",
      userId: user.id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
