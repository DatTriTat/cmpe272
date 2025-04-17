export function checkRole(requiredRole) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) return res.status(403).json({ error: "No role found in user." });
    if (userRole !== requiredRole) return res.status(403).json({ error: "Forbidden: insufficient role." });
    next();
  };
}
