const SessionModel = require("../models/session");
const asyncHandler = require("express-async-handler");

module.exports = function (roles) {
  return asyncHandler(async function (req, res, next) {
    console.log("Auth middleware");
    let accessToken = req.get("Authorization");
    if (accessToken && roles.length > 0) {
      const session = await SessionModel.findOne({
        token: accessToken,
        expiry_date: { $gte: new Date() },
      }).populate("user_id");

      if (!session) {
        res.status(403).json({ message: "You're not authorized." });
      }

      if (roles.indexOf(session.user_id.role) != -1) { // User exist, check if the role is applicable
        next();
      } else {
        res.status(403).json({ message: "You're not allowed to use this endpoint" });
      }
    }
  });
};