import { Router } from "express";
import { getAllAddressBooks, getAddressBookById, getAddressBookByUserId, createAddressBook, updateAddressBook, deleteAddressBook } from "../controllers/AddressBookController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = Router();

router.get("/addressbooks", verifyUser, adminOnly, getAllAddressBooks);
router.get("/addressbooks/:id", verifyUser, getAddressBookById);
router.get("/addressbooks/user/:id", verifyUser, getAddressBookByUserId);
router.post("/addressbooks", verifyUser, createAddressBook);
router.put("/addressbooks/:id", verifyUser, updateAddressBook);
router.delete("/addressbooks/:id", verifyUser, deleteAddressBook);

export default router;