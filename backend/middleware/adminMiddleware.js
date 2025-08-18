const raw = process.env.ADMIN_EMAILS || "";
const adminEmails = raw
  .split(",")
  .map(email => email.trim().toLowerCase()) // lowercase check for safety
  .filter(Boolean); // remove empty strings

const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.email) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Compare in lowercase to avoid case mismatch
  if (adminEmails.includes(req.user.email.toLowerCase())) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only" });
  }
};

module.exports = adminOnly;
