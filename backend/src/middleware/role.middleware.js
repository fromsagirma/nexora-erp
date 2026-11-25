
/**
 * Restricts access to users with specific roles.
 *
 * Must run AFTER authenticate middleware.
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {

    // 1. Ensure authentication middleware has identified the user.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // 2. Check whether the employee has an allowed role.
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    // 3. User has permission. Continue to the next middleware/controller.
    return next();
  };
}
