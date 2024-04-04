import prisma from "../DB/db.config.js";

export const verifyUser = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res
        .status(401)
        .json({ error: "You are not logged in. Please log in and try again" });
    }
    const user = await prisma.user.findUnique({
      where: { user_id: req.session.userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.userId = user.user_id;
    req.role = user.us_role;
    console.log("user found");
    next();
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.session.userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.us_role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action" });
    }
    next();
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
};

export const empolyeeOnly = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.session.userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (
      user.us_role !== "ADMIN" &&
      user.us_role !== "KITCHEN" &&
      user.us_role !== "DELIVERY"
    ) {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action" });
    }
    next();
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
};
