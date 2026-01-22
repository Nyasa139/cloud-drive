export const shareResource = async (req, res) => {
  const { resourceType, resourceId, userId, role } = req.body;

  const { data, error } = await supabase
    .from("shares")
    .insert([{
      resource_type: resourceType,
      resource_id: resourceId,
      grantee_user_id: userId,
      role,
      created_by: req.user.id
    }]);

  if (error) return res.status(400).json(error);

  res.json({ success: true });
};
