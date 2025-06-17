import { Request, Response, NextFunction, RequestHandler } from "express";

interface AuthRequest extends Request {
  user?: {
    role: "user" | "admin";
  };
}

export const authorize = (
  allowedRoles: ("user" | "admin")[]
): RequestHandler => {
  return (req, res, next) =>  {
    const authReq = req as AuthRequest;
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
