import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IApply } from "./apply.interface";

const applyForInstitution = async (applicationData: IApply) => {
  const {
    name,
    email,
    password,
    instituteName,
    instituteShortname,
    description,
    instituteType,
    instituteLogo,
  } = applicationData;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: UserRole.ADMIN,
    },
  });
  if (data.user) {
    const createInstitution = await prisma.institution.create({
      data: {
        name: instituteName,
        shortname: instituteShortname,
        description: description,
        type: instituteType,
        logo: instituteLogo,
      },
    });
  }
};

export const applyService = {
    applyForInstitution,
};