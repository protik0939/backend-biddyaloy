import { Institution } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createInstitution = async (payload: Institution) => {
  const data = await prisma.institution.create({
    data: payload,
  });
  if (!data) {
    throw new Error("Failed to create institution");
  }
  return data;
};

export const InstituteService = {
  createInstitution,
}; 