"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./users"));
const postRoutes_1 = __importDefault(require("./postRoutes"));
const auth_1 = __importDefault(require("./auth"));
const router = express_1.default.Router();
router.use("/users", users_1.default);
router.use('/post', postRoutes_1.default);
router.use('/auth', auth_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map