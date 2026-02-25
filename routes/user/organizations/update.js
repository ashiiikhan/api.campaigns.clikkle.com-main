import Organization from "../../../schemas/Organization.js";
import multer from "multer";

async function updateOrganization(req, res, next) {
  try {
    const { id } = req.params; // Get org ID from URL
    const userId = req.user.id;

    // Extract fields from body
    const {
      name,
      Email,
      Website,
      Address,
      Size,
      Country,
      ZipCode,
      City,
      CompanyIndustry,
    } = req.body;

    // Handle uploaded logo if provided
    const uploadedFile = req.files?.logo?.[0];

    // Build update object
    const updateData = {
      ...(name && { name: name.toLowerCase() }),
      ...(Email && { Email }),
      ...(Website && { Website }),
      ...(Address && { Address }),
      ...(Size && { Size }),
      ...(Country && { Country }),
      ...(ZipCode && { ZipCode }),
      ...(City && { City }),
      ...(CompanyIndustry && { CompanyIndustry }),
      ...(uploadedFile && { logo: uploadedFile.filename }),
      updatedAt: new Date(),
    };

    // Find and update the organization
    const updatedOrg = await Organization.findOneAndUpdate(
      { _id: id, userId }, // ensure only the owner can update
      updateData,
      { new: true } // return the updated document
    );

    if (!updatedOrg) {
      return res.status(404).json({
        success: 0,
        message: "Organization not found or not authorized",
      });
    }

    res.json({
      success: 1,
      message: "Organization updated successfully",
      organization: updatedOrg,
    });
  } catch (err) {
    if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: 0,
        message: `Unexpected field '${err.field}' in file upload.`,
      });
    }

    next(err);
  }
}

export default updateOrganization;
