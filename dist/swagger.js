"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        version: "v1.0.0",
        title: "Blog API",
        description: "Users can register, log in, and create, update, delete, and view blog posts.",
    },
    host: `localhost:${process.env.PORT || 5000}`,
    basePath: "/",
    schemes: ["http", "https"],
};
const outputFile = "./swagger-output.json";
const endpointsFiles = ["src/routes/index.ts"];
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc);
//# sourceMappingURL=swagger.js.map