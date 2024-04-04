import prisma from "../DB/db.config.js";

export const getAllAddressBooks = async (req, res) => {
  try {
    const addressBooks = await prisma.addressBook.findMany({});
    res.status(200).json(addressBooks);
  } catch (error) {
    console.error("Error fetching addressBooks:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAddressBookById = async (req, res) => {
  const addressBookId = req.params.id;

  try {
    const addressBook = await prisma.addressBook.findUnique({
      where: { addb_id: addressBookId },
    });

    if (!addressBook) {
      return res.status(404).json({ error: "AddressBook not found" });
    }

    res.json(addressBook);
  } catch (error) {
    console.error("Error fetching addressBook by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAddressBookByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const addressBook = await prisma.addressBook.findMany({
      where: { addb_user_id: userId },
    });

    if (!addressBook) {
      return res.status(404).json({ error: "AddressBook not found" });
    }

    res.json(addressBook);
  } catch (error) {
    console.error("Error fetching addressBook by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createAddressBook = async (req, res) => {
  const {
    addb_user_id,
    addb_buildingNo,
    addb_buildingName,
    addb_street,
    addb_prov,
    addb_dist,
    addb_subdist,
    addb_zipcode,
    addb_directionguide,
    addb_phone,
    addb_name,
  } = req.body;

  try {
    const newAddressBook = await prisma.addressBook.create({
      data: {
        addb_user_id,
        addb_buildingNo,
        addb_buildingName,
        addb_street,
        addb_prov,
        addb_dist,
        addb_subdist,
        addb_zipcode,
        addb_directionguide,
        addb_phone,
        addb_name,
      },
    });

    res.status(201).json(newAddressBook);
  } catch (error) {
    console.error("Error creating addressBook:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateAddressBook = async (req, res) => {
  // const addressBookId = req.params.addresssId;
  const userId = req.session.userId;
  const {
    addb_user_id,
    addb_buildingNo,
    addb_buildingName,
    addb_street,
    addb_prov,
    addb_dist,
    addb_subdist,
    addb_zipcode,
    addb_directionguide,
    addb_phone,
    addb_name,
  } = req.body;

  try {
    const existingAddressBook = await prisma.user.findUnique({
      where: { user_id: userId },
      include: { addressbooks: true },
    });

    console.log(existingAddressBook);

    if (
      !existingAddressBook ||
      existingAddressBook.addressbooks[0].addb_user_id !== userId
    ) {
      // If the address book does not exist or does not belong to the user, return an unauthorized response
      return res
        .status(403)
        .json({ message: "Unauthorized to update this address book" });
    }

    const updatedAddressBook = await prisma.addressBook.update({
      where: { addb_id: existingAddressBook.addressbooks[0].addb_id },
      data: {
        addb_user_id,
        addb_buildingNo,
        addb_buildingName,
        addb_street,
        addb_prov,
        addb_dist,
        addb_subdist,
        addb_zipcode,
        addb_directionguide,
        addb_phone,
        addb_name,
      },
    });

    res.status(200).json(updatedAddressBook);
  } catch (error) {
    console.error("Error updating addressBook:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddressBook = async (req, res) => {
  const addressBookId = req.params.id;
  const userId = req.session.userId;
  const user = await prisma.user.findUnique({
    where: { user_id: req.session.userId },
  });
  const userRole = user.us_role;

  try {
    // Check if the user has ADMIN or MANAGER role
    if (userRole === "ADMIN" || userRole === "MANAGER") {
      // If the user has the required role, directly delete the address book
      await prisma.addressBook.delete({
        where: { addb_id: addressBookId },
      });

      return res
        .status(200)
        .json({ message: "AddressBook deleted successfully" });
    }

    // Check if the address book exists and belongs to the authenticated user
    const existingAddressBook = await prisma.addressBook.findUnique({
      where: { addb_id: addressBookId },
      select: { addb_user_id: true },
    });

    if (!existingAddressBook || existingAddressBook.addb_user_id !== userId) {
      // If the address book does not exist or does not belong to the user, return an unauthorized response
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this address book" });
    }

    // Delete the address book
    await prisma.addressBook.delete({
      where: { addb_id: addressBookId },
    });

    res.status(200).json({ message: "AddressBook deleted successfully" });
  } catch (error) {
    console.error("Error deleting addressBook:", error);
    res.status(500).json({ message: error.message });
  }
};
