import mongoose from "mongoose";
import fs from "fs";

function errorHandler(err, req, res, next) {
    console.log("Handling Error...");
    if (err.name === "Error") {
        return res.json({
            success: 0,
            message: err.message,
        });
    }

    if (err instanceof mongoose.Error) {
        if (err instanceof mongoose.Error.ValidationError) {
            return validationHandler(err, req, res);
        }
    }

    if (err.name === "MongoServerError") {
        if (err.code === 11000) {
            return res.status(409).json({
                success: 0,
                message: "Duplicate entry",
            });
        }
    }

    console.log("Error");
    console.log(err);
    console.log(err.name);
    console.log(Object.keys(err));
    console.log(Object.values(err));
    return error500(err, req, res);
}

function validationHandler(err, req, res) {
    return res.status(400).json({
        success: 0,
        fields: Object.keys(err.errors),
        errors: Object.values(err.errors).map((err) => {
            if (err instanceof mongoose.Error.CastError) {
                return `${err.path} should be a ${err.kind}`;
            } else if (err instanceof mongoose.Error.ValidatorError) {
                switch (err.kind) {
                    case "minlength":
                        return `${err.properties.path} should be at least ${err.properties.minlength} characters long`;
                    case "maxlength":
                        return `${err.properties.path} should be at most ${err.properties.maxlength} characters long`;
                    case "required":
                        return `${err.properties.path} is required`;
                    case "enum":
                        return `${err.properties.path} is not valid`;
                    case "min":
                        return `${err.properties.path} should be a minimum of ${err.properties.min}`;
                    case "max":
                        return `${err.properties.path} should be a maximum of ${err.properties.max}`;
                }
            } else {
                return err.message;
            }
        }),
    });
}

function error500(err, req, res) {
    return res
        .status(500)
        .json({ success: 0, message: "Something went wrong" });
}

export default errorHandler;
