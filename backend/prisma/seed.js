import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import argon2 from "argon2";

async function main() {
  // clear all data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.addressBook.deleteMany({});
  await prisma.shoppingCart.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.pizza.deleteMany({});
  await prisma.food.deleteMany({});
  await prisma.pizzaDetail.deleteMany({});

  // add admin
  const hashPassword = await argon2.hash("password123");
  await prisma.user.createMany({
    data: [
      {
        us_fname: "ROOT",
        us_lname: "ROOT",
        us_fullname: "ROOT ROOT",
        us_gender: "Male",
        us_role: "ADMIN",
        us_phone: "9876543210",
        us_birthdate: "1985-05-15T00:00:00.000Z",
        us_email: "admin@admin.com",
        us_password: hashPassword,
      },
    ],
  });
}

main();
