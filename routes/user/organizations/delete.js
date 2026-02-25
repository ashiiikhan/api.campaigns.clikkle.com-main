import Organization from "../../../schemas/Organization.js";

async function deleteOrganization(req, res, next) {
  try {
    const { id: userId } = req.user;
    const { id: orgId } = req.params;

    // Ensure the organization belongs to the user
    const deleted = await Organization.deleteOne({ _id: orgId, userId });

    if (!deleted.acknowledged || deleted.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Organization not found or not authorized" });
    }

    res.json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}

export default deleteOrganization;