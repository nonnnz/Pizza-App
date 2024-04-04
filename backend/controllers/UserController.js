import prisma from "../DB/db.config.js";
import argon2 from "argon2";

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        addressbooks: true,
        shoppingcarts: true,
        orders: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        addressbooks: true,
        shoppingcarts: true,
        orders: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUserByIdforUpdate = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        addressbooks: true,
        shoppingcarts: true,
        orders: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};

export const createUser = async (req, res) => {
  const {
    us_fname,
    us_lname,
    us_gender,
    us_phone,
    us_birthdate,
    us_email,
    us_password,
    confirm_password,
  } = req.body;
  let { us_role } = req.body;

  const us_fullname = `${us_fname} ${us_lname}`;

  try {
    if (!req.session.userId) {
      us_role = "USER";
    } else {
      const user = await prisma.user.findUnique({
        where: { user_id: req.session.userId },
      });

      if (user.us_role !== "ADMIN" && user.us_role !== "MANAGER") {
        return res
          .status(403)
          .json({ error: "You are not authorized to perform this action" });
      }
    }

    if (us_password !== confirm_password)
      return res.status(400).json({ error: "Passwords do not match" });
    if (us_password === "" || us_password === null)
      return res.status(404).json({ msg: "Empty Password" });
    const hashPassword = await argon2.hash(us_password);

    const newUser = await prisma.user.create({
      data: {
        us_fname,
        us_lname,
        us_fullname,
        us_gender,
        us_role,
        us_phone,
        us_birthdate,
        us_email,
        us_password: hashPassword,
      },
    });

    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    us_fname,
    us_lname,
    us_gender,
    us_role,
    us_phone,
    us_birthdate,
    us_email,
    us_password,
    confirm_password,
  } = req.body;
  const currentUser = await getUserByIdforUpdate(userId);
  let hashPassword = currentUser.us_password;
  if (
    us_password &&
    us_password !== "" &&
    us_password !== undefined &&
    us_password !== currentUser.us_password
  ) {
    hashPassword = await argon2.hash(us_password);
  }

  if (us_password !== confirm_password)
    return res.status(400).json({ error: "Passwords do not match" });

  const us_fullname = `${us_fname} ${us_lname}`;

  try {
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        us_fname,
        us_lname,
        us_fullname,
        us_gender,
        us_role,
        us_phone,
        us_birthdate,
        us_email,
        us_password: hashPassword,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await prisma.user.delete({
      where: { user_id: userId },
    });

    res.status(200).json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
};
