import argon2 from 'argon2';
import prisma from "../DB/db.config.js";

export const Login = async (req, res) => {
    const { us_email, us_password } = req.body;

    try {
        const user = await prisma.user.findUnique({
        where: { us_email },
        });

        if (!user) {
        return res.status(401).json({ error: "Invalid email" });
        }

        // Verify the password using Argon2
        const passwordValid = await argon2.verify(user.us_password, us_password);

        if (!passwordValid) {
        return res.status(401).json({ error: "Invalid password" });
        }
        
        req.session.userId = user.user_id;
        const user_id = user.user_id;
        const us_fname = user.us_fname;
        const us_lname = user.us_lname
        // const us_email = user.us_email;
        const us_role = user.us_role;

        // Password is valid, user is authenticated
        res.json({ message: "Login successful", user_id, us_fname, us_lname, us_email, us_role});
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: error.message });
    }
}

export const Me = async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "You are not logged in. Please log in and try again" });
      }
  
      const user = await prisma.user.findUnique({
        where: { user_id: req.session.userId },
      });
  
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error during logout:", err);
          res.status(500).json({ message: err.message });
        } else {
          res.json({ message: "Logout successful" });
        }
      });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: error.message });
    }
  };
  