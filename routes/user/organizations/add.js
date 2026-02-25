import { pushNotification } from "../../../utilities/functions.js";
import Organization from "../../../schemas/Organization.js";
import multer from "multer"; // needed to catch multer errors

async function addOrganization(req, res, next) {
  try {
    const {
      name,
      Email,
      Website,
      Address,
      size:Size,
      Country,
      ZipCode,
      City,
      CompanyIndustry,
    } = req.body;

    const userId = req.user.id;

    // Access uploaded file info from multer
    const uploadedFile = req.files?.logo?.[0]; // or .image?.[0] depending on the field name

    const organization = new Organization({
      name: name.toLowerCase(),
      Email,
      Website,
      Address,
      Country,
      Size,
      ZipCode,
      City,
      CompanyIndustry,
      userId,
      ownerId: userId,
      size: Size,
      createdAt: new Date(),
      logo: uploadedFile ? uploadedFile.filename : null, // optional
    });

    await organization.save();

    await pushNotification({
      userId,
      type: "organization",
      title: "New organization created",
      description: `A new organization ${organization.name} has been created`,
    });

    res.json({
      success: 1,
      message: "New Organization Created",
    });
  } catch (err) {
    // Catch Multer-specific errors
    if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: 0,
        message: `Unexpected field '${err.field}' in file upload.`,
      });
    }

    next(err); // pass to global error handler
  }
}

export default addOrganization;