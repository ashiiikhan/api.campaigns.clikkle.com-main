import mongoose from "mongoose";

const plan = new mongoose.Schema({
    name: { type: String, required: true },
    prices: {
        year: [Number],
        month: [Number],
    },
    b2c: {
        marketingSuite: [String],
        salesSuite: [String],
        serviceSuite: [String],
        platformAndSupport: [String],
    },
    b2b: {
        marketingSuite: [String],
        salesSuite: [String],
        serviceSuite: [String],
        platformAndSupport: [String],
    },
    ecommerce: {
        marketingSuite: [String],
        salesSuite: [String],
        serviceSuite: [String],
        platformAndSupport: [String],
    },
});

export default mongoose.model("plan", plan);
