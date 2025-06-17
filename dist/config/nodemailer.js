"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransporter = createTransporter;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Function to create transporter
async function createTransporter() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Missing email credentials");
    }
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // This ensures a secure connection
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    try {
        // Verify the transporter configuration
        await transporter.verify();
        console.log("Email transporter successfully verified.");
    }
    catch (error) {
        console.error("Email configuration nodemailer error:", error);
        throw new Error("Failed to connect to email service. Please check your email configurations.");
    }
    return transporter;
}
//# sourceMappingURL=nodemailer.js.map