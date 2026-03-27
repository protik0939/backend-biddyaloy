import { Request, Response } from "express";
import { InstitutionApplicationStatus } from "../../../generated/prisma/enums";
import { InstitutionApplicationService } from "./institutionApplication.service";

const create = async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionApplicationService.create(user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Institution application submitted",
    data: result,
  });
};

const myApplications = async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionApplicationService.getMyApplications(user.id);

  res.status(200).json({
    success: true,
    data: result,
  });
};

const listForSuperAdmin = async (req: Request, res: Response) => {
  const statusRaw = req.query.status;
  const status =
    typeof statusRaw === "string" &&
    [
      InstitutionApplicationStatus.PENDING,
      InstitutionApplicationStatus.APPROVED,
      InstitutionApplicationStatus.REJECTED,
    ].includes(statusRaw as InstitutionApplicationStatus)
      ? (statusRaw as InstitutionApplicationStatus)
      : undefined;

  const result = await InstitutionApplicationService.listForSuperAdmin(status);

  res.status(200).json({
    success: true,
    data: result,
  });
};

const getSuperAdminSummary = async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionApplicationService.getSuperAdminSummary(user.id);

  res.status(200).json({
    success: true,
    data: result,
  });
};

const review = async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const applicationIdParam = req.params.applicationId;
  const applicationId = Array.isArray(applicationIdParam)
    ? applicationIdParam[0]
    : applicationIdParam;

  if (!applicationId) {
    return res.status(400).json({
      success: false,
      message: "Application id is required",
    });
  }

  const result = await InstitutionApplicationService.review(user.id, applicationId, req.body);

  res.status(200).json({
    success: true,
    message: "Application reviewed successfully",
    data: result,
  });
};

export const InstitutionApplicationController = {
  create,
  myApplications,
  listForSuperAdmin,
  getSuperAdminSummary,
  review,
};
