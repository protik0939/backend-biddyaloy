import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  console.log("===== Creating Super Admin =====");
  try {
    const backendPublicUrl = process.env.BACKEND_PUBLIC_URL ?? process.env.BETTER_AUTH_URL;
    const frontendPublicUrl = process.env.FRONTEND_PUBLIC_URL ?? process.env.APP_URL;

    if (!backendPublicUrl || !frontendPublicUrl) {
      throw new Error("BACKEND_PUBLIC_URL and FRONTEND_PUBLIC_URL are required for seeding");
    }

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
      `${backendPublicUrl}/api/v1/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: frontendPublicUrl,
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      console.log("===== Super Admin created =====");
      await prisma.user.update({
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

await seedAdmin();
