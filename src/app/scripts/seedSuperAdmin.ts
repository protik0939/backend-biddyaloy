import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  console.log("===== Creating Super Admin =====");
  try {
    const adminData = {
      name: process.env.SUPER_ADMIN_NAME as string,
      email: process.env.SUPER_ADMIN_EMAIL as string,
      role: UserRole.SUPERADMIN,
      password: process.env.SUPER_ADMIN_PASS as string,
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("Super Admin Already Exist");
    }

    const signUpAdmin = await fetch(
      `${process.env.BETTER_AUTH_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: process.env.APP_URL as string,
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      console.log("===== Super Admin created =====");
      const updatedAdmin = await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
          accountStatus: "ACTIVE",
        },
      });

      console.log("===== Email verification status updated! =====");
    }
    console.log("===== SUCCESS =====");
  } catch (error) {
    console.error(error);
  }
}

seedAdmin();
