import mongoose from "mongoose";
import DataSource from "../../../classes/DataSource.js";
import SignUpForm from "../../../schemas/SignUpForm.js";

async function signUpForms(req, res, next) {
    try {
        const userId = mongoose.Types.ObjectId(req.user.id);

        const dataSource = new DataSource(SignUpForm, req.query);
        const forms = await dataSource.find({ userId });

        res.json({
            success: 1,
            forms,
            pageData: dataSource.pageData,
        });
    } catch (err) {
        next(err);
    }
}

export default signUpForms;
