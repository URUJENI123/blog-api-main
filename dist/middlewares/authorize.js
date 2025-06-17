"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const authReq = req;
        // If user is not authenticated at all
        if (!authReq.user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        // If role is not authorized?
        if (!allowedRoles.includes(authReq.user.role)) {
            res
                .status(403)
                .json({ message: "This User has insufficient permission" });
            return;
        }
        // if everthing is ok
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map