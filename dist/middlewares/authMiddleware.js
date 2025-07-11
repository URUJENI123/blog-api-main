"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'You are not authorized' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ message: 'Token is expired or inavalid' });
    }
};
exports.authenticated = authenticated;
// export const requireAdmin = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.userRole !== "admin") {
//     return res.status(403).json({ message: "Forbidden: Admins only" });
//   }
//   next();
// };
//# sourceMappingURL=authMiddleware.js.map