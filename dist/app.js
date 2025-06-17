"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const db_1 = require("./config/db");
const errorHandler_1 = require("./middlewares/errorHandler");
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger-output.json"));
const cors_1 = __importDefault(require("cors"));
dotenv.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "5000");
//Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use(express_1.default.static("public"));
app.use("/api/", routes_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Start the server
const startServer = async () => {
    try {
        // Initialize db connection
        await (0, db_1.initializeDatabase)();
        // Start Express server
        app.listen(PORT, () => {
            console.log(`Express server is running on http://127.0.0.1:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
// Run the server
startServer();
//# sourceMappingURL=app.js.map