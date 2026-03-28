import {
  AccountStatus,
  AdminRole,
  InstitutionType,
  StudentAdmissionApplicationStatus,
  UserRole,
} from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import {
  ICreateBatchPayload,
  ICreateCourseRegistrationPayload,
  ICreateCoursePayload,
  ICreateProgramPayload,
  ICreateSectionPayload,
  ICreateSemesterPayload,
  ICreateStudentPayload,
  ICreateTeacherPayload,
  IListStudentAdmissionApplicationsQuery,
  IReviewStudentAdmissionApplicationPayload,
  IUpdateBatchPayload,
  IUpdateCoursePayload,
  IUpdateCourseRegistrationPayload,
  IUpdateDepartmentProfilePayload,
  IUpdateProgramPayload,
  IUpsertSectionCourseTeacherAssignmentPayload,
  IUpdateSectionPayload,
  IUpdateSemesterPayload,
  IUpdateStudentPayload,
  IUpdateTeacherPayload,
} from "./department.interface";

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function normalizeSearch(search?: string) {
  const value = search?.trim();
  return value || undefined;
}

async function resolveDepartmentContext(userId: string, departmentId?: string) {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId,
    },
    select: {
      role: true,
      institutionId: true,
    },
  });

  if (!adminProfile?.institutionId) {
    throw createHttpError(403, "Only department admins can access this resource");
  }

  const institution = await prisma.institution.findUnique({
    where: {
      id: adminProfile.institutionId,
    },
    select: {
      type: true,
    },
  });

  const isInstitutionAdminNonUniversity =
    adminProfile.role === AdminRole.INSTITUTIONADMIN &&
    Boolean(institution?.type) &&
    institution?.type !== InstitutionType.UNIVERSITY;

  if (adminProfile.role !== AdminRole.DEPARTMENTADMIN) {
    if (!isInstitutionAdminNonUniversity) {
      throw createHttpError(403, "Only department admins can access this resource");
    }
  }

  if (departmentId) {
    const byId = await prisma.department.findFirst({
      where: {
        id: departmentId,
        faculty: {
          institutionId: adminProfile.institutionId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!byId) {
      throw createHttpError(404, "Department not found for this institution");
    }

    return {
      institutionId: adminProfile.institutionId,
      departmentId: byId.id,
    };
  }

  const departments = await prisma.department.findMany({
    where: {
      faculty: {
        institutionId: adminProfile.institutionId,
      },
    },
    select: {
      id: true,
    },
    take: 2,
    orderBy: {
      createdAt: "asc",
    },
  });

  if (departments.length === 0) {
    if (isInstitutionAdminNonUniversity) {
      const bootstrap = await prisma.$transaction(async (trx) => {
        const existingFaculty = await trx.faculty.findFirst({
          where: {
            institutionId: adminProfile.institutionId,
          },
          select: {
            id: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        const facultyId = existingFaculty
          ? existingFaculty.id
          : (
              await trx.faculty.create({
                data: {
                  fullName: "General Faculty",
                  shortName: "General",
                  description: "Auto-created for non-university academic workspace",
                  institutionId: adminProfile.institutionId,
                },
                select: {
                  id: true,
                },
              })
            ).id;

        const createdDepartment = await trx.department.create({
          data: {
            fullName: "General Program",
            shortName: "Program",
            description: "Auto-created for non-university academic workspace",
            facultyId,
          },
          select: {
            id: true,
          },
        });

        return createdDepartment;
      });

      return {
        institutionId: adminProfile.institutionId,
        departmentId: bootstrap.id,
      };
    }

    throw createHttpError(
      404,
      "No department found for this institution. Ask faculty admin to create one first",
    );
  }

  if (departments.length > 1) {
    if (isInstitutionAdminNonUniversity) {
      return {
        institutionId: adminProfile.institutionId,
        departmentId: departments[0].id,
      };
    }

    throw createHttpError(400, "Multiple departments found. Please provide departmentId");
  }

  return {
    institutionId: adminProfile.institutionId,
    departmentId: departments[0].id,
  };
}

const getDepartmentProfile = async (userId: string, departmentId?: string) => {
  const context = await resolveDepartmentContext(userId, departmentId);

  const department = await prisma.department.findUnique({
    where: {
      id: context.departmentId,
    },
    select: {
      id: true,
      fullName: true,
      shortName: true,
      description: true,
      facultyId: true,
      faculty: {
        select: {
          fullName: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      contactNo: true,
      presentAddress: true,
      permanentAddress: true,
      bloodGroup: true,
      gender: true,
    },
  });

  return {
    institutionId: context.institutionId,
    ...department,
    user,
  };
};

const updateDepartmentProfile = async (
  userId: string,
  payload: IUpdateDepartmentProfilePayload,
) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId,
    },
    select: {
      role: true,
      institutionId: true,
    },
  });

  if (adminProfile?.role !== AdminRole.DEPARTMENTADMIN) {
    throw createHttpError(403, "Only department admins can access this resource");
  }

  const normalizedFullName = payload.fullName?.trim();
  const normalizedShortName = payload.shortName?.trim() || null;
  const normalizedDescription = payload.description?.trim() || null;
  const hasDepartmentMutation =
    Boolean(payload.fullName || payload.shortName || payload.description) ||
    Boolean(payload.departmentId);

  const savedDepartment = await prisma.$transaction(async (trx) => {
    let nextDepartment:
      | {
          id: string;
          fullName: string;
          shortName: string | null;
          description: string | null;
          updatedAt: Date;
        }
      | null = null;

    if (hasDepartmentMutation) {
      if (!normalizedFullName) {
        throw createHttpError(400, "Department full name is required when updating department details");
      }

      const departmentData = {
        fullName: normalizedFullName,
        shortName: normalizedShortName,
        description: normalizedDescription,
      };

      const createDepartmentForSingleFaculty = async () => {
        const faculties = await trx.faculty.findMany({
          where: {
            institutionId: adminProfile.institutionId,
          },
          select: {
            id: true,
          },
          take: 2,
          orderBy: {
            createdAt: "asc",
          },
        });

        if (faculties.length === 0) {
          throw createHttpError(
            404,
            "No faculty found for this institution. Ask faculty admin to create a faculty first",
          );
        }

        if (faculties.length > 1) {
          throw createHttpError(
            400,
            "Multiple faculties found. Ask faculty admin to create department under a specific faculty",
          );
        }

        return trx.department.create({
          data: {
            ...departmentData,
            facultyId: faculties[0].id,
          },
          select: {
            id: true,
            fullName: true,
            shortName: true,
            description: true,
            updatedAt: true,
          },
        });
      };

      if (payload.departmentId) {
        const departmentById = await trx.department.findFirst({
          where: {
            id: payload.departmentId,
            faculty: {
              institutionId: adminProfile.institutionId,
            },
          },
          select: {
            id: true,
          },
        });

        if (departmentById) {
          nextDepartment = await trx.department.update({
            where: {
              id: departmentById.id,
            },
            data: departmentData,
            select: {
              id: true,
              fullName: true,
              shortName: true,
              description: true,
              updatedAt: true,
            },
          });
        } else {
          const departmentCount = await trx.department.count({
            where: {
              faculty: {
                institutionId: adminProfile.institutionId,
              },
            },
          });

          if (departmentCount > 0) {
            throw createHttpError(404, "Department not found for this institution");
          }

          nextDepartment = await createDepartmentForSingleFaculty();
        }
      } else {
        const departments = await trx.department.findMany({
          where: {
            faculty: {
              institutionId: adminProfile.institutionId,
            },
          },
          select: {
            id: true,
          },
          take: 2,
          orderBy: {
            createdAt: "asc",
          },
        });

        if (departments.length > 1) {
          throw createHttpError(400, "Multiple departments found. Please provide departmentId");
        }

        if (departments.length === 0) {
          nextDepartment = await createDepartmentForSingleFaculty();
        } else {
          nextDepartment = await trx.department.update({
            where: {
              id: departments[0].id,
            },
            data: departmentData,
            select: {
              id: true,
              fullName: true,
              shortName: true,
              description: true,
              updatedAt: true,
            },
          });
        }
      }
    }

    const nextName = payload.name?.trim();
    if (nextName) {
      await trx.user.update({
        where: {
          id: userId,
        },
        data: {
          name: nextName,
        },
      });
    }

    await trx.user.update({
      where: {
        id: userId,
      },
      data: {
        image: payload.image === undefined ? undefined : payload.image.trim() || null,
        contactNo: payload.contactNo === undefined ? undefined : payload.contactNo.trim() || null,
        presentAddress:
          payload.presentAddress === undefined ? undefined : payload.presentAddress.trim() || null,
        permanentAddress:
          payload.permanentAddress === undefined
            ? undefined
            : payload.permanentAddress.trim() || null,
        bloodGroup: payload.bloodGroup === undefined ? undefined : payload.bloodGroup.trim() || null,
        gender: payload.gender === undefined ? undefined : payload.gender.trim() || null,
      },
    });

    if (nextDepartment) {
      return nextDepartment;
    }

    return trx.department.findFirst({
      where: {
        faculty: {
          institutionId: adminProfile.institutionId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        shortName: true,
        description: true,
        updatedAt: true,
      },
    });
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return {
    ...savedDepartment,
    user,
  };
};

const listSemesters = async (userId: string, search?: string) => {
  const context = await resolveDepartmentContext(userId);
  const normalizedSearch = normalizeSearch(search);

  return prisma.semester.findMany({
    where: {
      institutionId: context.institutionId,
      ...(normalizedSearch
        ? {
            OR: [{ name: { contains: normalizedSearch, mode: "insensitive" } }],
          }
        : {}),
    },
    orderBy: {
      startDate: "desc",
    },
  });
};

const createSemester = async (userId: string, payload: ICreateSemesterPayload) => {
  const context = await resolveDepartmentContext(userId);

  if (new Date(payload.endDate).getTime() <= new Date(payload.startDate).getTime()) {
    throw createHttpError(400, "endDate must be greater than startDate");
  }

  return prisma.semester.create({
    data: {
      name: payload.name.trim(),
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      institutionId: context.institutionId,
    },
  });
};

const updateSemester = async (
  userId: string,
  semesterId: string,
  payload: IUpdateSemesterPayload,
) => {
  const context = await resolveDepartmentContext(userId);

  const semester = await prisma.semester.findFirst({
    where: {
      id: semesterId,
      institutionId: context.institutionId,
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
    },
  });

  if (!semester) {
    throw createHttpError(404, "Semester not found");
  }

  const nextStartDate = payload.startDate ? new Date(payload.startDate) : semester.startDate;
  const nextEndDate = payload.endDate ? new Date(payload.endDate) : semester.endDate;

  if (nextEndDate.getTime() <= nextStartDate.getTime()) {
    throw createHttpError(400, "endDate must be greater than startDate");
  }

  return prisma.semester.update({
    where: {
      id: semesterId,
    },
    data: {
      name: payload.name?.trim(),
      startDate: payload.startDate ? new Date(payload.startDate) : undefined,
      endDate: payload.endDate ? new Date(payload.endDate) : undefined,
    },
  });
};

const listBatches = async (userId: string, departmentId?: string, search?: string) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);

  return prisma.batch.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...(normalizedSearch
        ? {
            OR: [
              { name: { contains: normalizedSearch, mode: "insensitive" } },
              { description: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createBatch = async (userId: string, payload: ICreateBatchPayload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);

  return prisma.batch.create({
    data: {
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
  });
};

const updateBatch = async (userId: string, batchId: string, payload: IUpdateBatchPayload) => {
  const context = await resolveDepartmentContext(userId);

  const batch = await prisma.batch.findFirst({
    where: {
      id: batchId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
    },
  });

  if (!batch) {
    throw createHttpError(404, "Batch not found");
  }

  return prisma.batch.update({
    where: {
      id: batchId,
    },
    data: {
      name: payload.name?.trim(),
      description: payload.description?.trim() || undefined,
    },
  });
};

const deleteBatch = async (userId: string, batchId: string) => {
  const context = await resolveDepartmentContext(userId);

  const batch = await prisma.batch.findFirst({
    where: {
      id: batchId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
    },
  });

  if (!batch) {
    throw createHttpError(404, "Batch not found");
  }

  const sectionCount = await prisma.section.count({
    where: {
      batchId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
  });

  if (sectionCount > 0) {
    throw createHttpError(409, "Cannot delete batch with assigned sections");
  }

  await prisma.batch.delete({
    where: {
      id: batchId,
    },
  });

  return {
    id: batchId,
  };
};

const listSections = async (userId: string, departmentId?: string, search?: string) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);

  return prisma.section.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...(normalizedSearch
        ? {
            OR: [
              { name: { contains: normalizedSearch, mode: "insensitive" } },
              { description: { contains: normalizedSearch, mode: "insensitive" } },
              { semester: { name: { contains: normalizedSearch, mode: "insensitive" } } },
              { batch: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    include: {
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
      batch: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createSection = async (userId: string, payload: ICreateSectionPayload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);

  const [semester, batch] = await Promise.all([
    prisma.semester.findFirst({
      where: {
        id: payload.semesterId,
        institutionId: context.institutionId,
      },
      select: {
        id: true,
      },
    }),
    prisma.batch.findFirst({
      where: {
        id: payload.batchId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!semester) {
    throw createHttpError(404, "Semester not found for this institution");
  }

  if (!batch) {
    throw createHttpError(404, "Batch not found for this department");
  }

  return prisma.section.create({
    data: {
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      sectionCapacity: payload.sectionCapacity,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      semesterId: payload.semesterId,
      batchId: payload.batchId,
    },
  });
};

const updateSection = async (
  userId: string,
  sectionId: string,
  payload: IUpdateSectionPayload,
) => {
  const context = await resolveDepartmentContext(userId);

  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
    },
  });

  if (!section) {
    throw createHttpError(404, "Section not found");
  }

  if (payload.semesterId) {
    const semester = await prisma.semester.findFirst({
      where: {
        id: payload.semesterId,
        institutionId: context.institutionId,
      },
      select: {
        id: true,
      },
    });

    if (!semester) {
      throw createHttpError(404, "Semester not found for this institution");
    }
  }

  if (payload.batchId) {
    const batch = await prisma.batch.findFirst({
      where: {
        id: payload.batchId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
      },
    });

    if (!batch) {
      throw createHttpError(404, "Batch not found for this department");
    }
  }

  return prisma.section.update({
    where: {
      id: sectionId,
    },
    data: {
      name: payload.name?.trim(),
      description: payload.description?.trim() || undefined,
      sectionCapacity: payload.sectionCapacity,
      semesterId: payload.semesterId,
      batchId: payload.batchId,
    },
  });
};

const deleteSection = async (userId: string, sectionId: string) => {
  const context = await resolveDepartmentContext(userId);

  const section = await prisma.section.findFirst({
    where: {
      id: sectionId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
    },
  });

  if (!section) {
    throw createHttpError(404, "Section not found");
  }

  const registrationCount = await prisma.courseRegistration.count({
    where: {
      sectionId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
  });

  if (registrationCount > 0) {
    throw createHttpError(409, "Cannot delete section with course registrations");
  }

  await prisma.section.delete({
    where: {
      id: sectionId,
    },
  });

  return {
    id: sectionId,
  };
};

const listPrograms = async (userId: string, departmentId?: string, search?: string) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);

  return prisma.program.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...(normalizedSearch
        ? {
            OR: [
              { title: { contains: normalizedSearch, mode: "insensitive" } },
              { shortTitle: { contains: normalizedSearch, mode: "insensitive" } },
              { description: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createProgram = async (userId: string, payload: ICreateProgramPayload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);

  return prisma.program.create({
    data: {
      title: payload.title.trim(),
      shortTitle: payload.shortTitle?.trim() || null,
      description: payload.description?.trim() || null,
      credits: payload.credits,
      cost: payload.cost,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
  });
};

const updateProgram = async (
  userId: string,
  programId: string,
  payload: IUpdateProgramPayload,
) => {
  const context = await resolveDepartmentContext(userId);

  const program = await prisma.program.findFirst({
    where: {
      id: programId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
    },
  });

  if (!program) {
    throw createHttpError(404, "Program not found");
  }

  return prisma.program.update({
    where: {
      id: programId,
    },
    data: {
      title: payload.title?.trim(),
      shortTitle: payload.shortTitle?.trim() || undefined,
      description: payload.description?.trim() || undefined,
      credits: payload.credits,
      cost: payload.cost,
    },
  });
};

const listCourses = async (userId: string, departmentId?: string, search?: string) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);

  return prisma.course.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...(normalizedSearch
        ? {
            OR: [
              { courseCode: { contains: normalizedSearch, mode: "insensitive" } },
              { courseTitle: { contains: normalizedSearch, mode: "insensitive" } },
              { description: { contains: normalizedSearch, mode: "insensitive" } },
              { program: { is: { title: { contains: normalizedSearch, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    include: {
      program: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createCourse = async (userId: string, payload: ICreateCoursePayload) => {
  const context = await resolveDepartmentContext(userId);

  if (payload.programId) {
    const program = await prisma.program.findFirst({
      where: {
        id: payload.programId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
      },
    });

    if (!program) {
      throw createHttpError(404, "Program not found for this department");
    }
  }

  return prisma.course.create({
    data: {
      courseCode: payload.courseCode.trim(),
      courseTitle: payload.courseTitle.trim(),
      description: payload.description?.trim() || null,
      credits: payload.credits,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      programId: payload.programId,
    },
  });
};

const updateCourse = async (userId: string, courseId: string, payload: IUpdateCoursePayload) => {
  const context = await resolveDepartmentContext(userId);

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw createHttpError(404, "Course not found");
  }

  if (payload.programId) {
    const nextProgram = await prisma.program.findFirst({
      where: {
        id: payload.programId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
      },
    });

    if (!nextProgram) {
      throw createHttpError(404, "Program not found for this department");
    }
  }

  return prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      courseCode: payload.courseCode?.trim(),
      courseTitle: payload.courseTitle?.trim(),
      description: payload.description?.trim() || undefined,
      credits: payload.credits,
      programId: payload.programId,
    },
  });
};

const deleteCourse = async (userId: string, courseId: string) => {
  const context = await resolveDepartmentContext(userId);

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw createHttpError(404, "Course not found");
  }

  await prisma.course.delete({
    where: {
      id: courseId,
    },
  });

  return {
    id: courseId,
  };
};

const listCourseRegistrations = async (userId: string, departmentId?: string, search?: string) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);

  return prisma.courseRegistration.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...(normalizedSearch
        ? {
            OR: [
              { course: { courseCode: { contains: normalizedSearch, mode: "insensitive" } } },
              { course: { courseTitle: { contains: normalizedSearch, mode: "insensitive" } } },
              { section: { name: { contains: normalizedSearch, mode: "insensitive" } } },
              { studentProfile: { studentsId: { contains: normalizedSearch, mode: "insensitive" } } },
              { studentProfile: { user: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } } },
              { teacherProfile: { teacherInitial: { contains: normalizedSearch, mode: "insensitive" } } },
              { teacherProfile: { user: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } } },
            ],
          }
        : {}),
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
        },
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      section: {
        select: {
          id: true,
          name: true,
          batch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      program: {
        select: {
          id: true,
          title: true,
        },
      },
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const listSectionCourseTeacherAssignments = async (
  userId: string,
  departmentId?: string,
  search?: string,
) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);

  return prisma.sectionCourseTeacherAssignment.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...(normalizedSearch
        ? {
            OR: [
              { section: { name: { contains: normalizedSearch, mode: "insensitive" } } },
              { course: { courseCode: { contains: normalizedSearch, mode: "insensitive" } } },
              { course: { courseTitle: { contains: normalizedSearch, mode: "insensitive" } } },
              { teacherProfile: { teacherInitial: { contains: normalizedSearch, mode: "insensitive" } } },
              { teacherProfile: { user: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } } },
            ],
          }
        : {}),
    },
    include: {
      section: {
        select: {
          id: true,
          name: true,
          semesterId: true,
          batch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
        },
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const upsertSectionCourseTeacherAssignment = async (
  userId: string,
  payload: IUpsertSectionCourseTeacherAssignmentPayload,
) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);

  const [course, section, teacher, semester] = await Promise.all([
    prisma.course.findFirst({
      where: {
        id: payload.courseId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
      },
    }),
    prisma.section.findFirst({
      where: {
        id: payload.sectionId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
        semesterId: true,
      },
    }),
    prisma.teacherProfile.findFirst({
      where: {
        id: payload.teacherProfileId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
      },
    }),
    prisma.semester.findFirst({
      where: {
        id: payload.semesterId,
        institutionId: context.institutionId,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!course) {
    throw createHttpError(404, "Course not found for this department");
  }

  if (!section) {
    throw createHttpError(404, "Section not found for this department");
  }

  if (!teacher) {
    throw createHttpError(404, "Teacher not found for this department");
  }

  if (!semester) {
    throw createHttpError(404, "Semester not found for this institution");
  }

  if (section.semesterId !== payload.semesterId) {
    throw createHttpError(400, "Selected section does not belong to the selected semester");
  }

  const assignment = await prisma.sectionCourseTeacherAssignment.upsert({
    where: {
      sectionId_courseId: {
        sectionId: payload.sectionId,
        courseId: payload.courseId,
      },
    },
    create: {
      sectionId: payload.sectionId,
      courseId: payload.courseId,
      teacherProfileId: payload.teacherProfileId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    update: {
      teacherProfileId: payload.teacherProfileId,
    },
    include: {
      section: {
        select: {
          id: true,
          name: true,
          semesterId: true,
          batch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
        },
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  await prisma.courseRegistration.updateMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      sectionId: payload.sectionId,
      courseId: payload.courseId,
    },
    data: {
      teacherProfileId: payload.teacherProfileId,
    },
  });

  return assignment;
};

const createCourseRegistration = async (
  userId: string,
  payload: ICreateCourseRegistrationPayload,
) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);

  const [course, student, section, semester] = await Promise.all([
    prisma.course.findFirst({
      where: {
        id: payload.courseId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
        programId: true,
      },
    }),
    prisma.studentProfile.findFirst({
      where: {
        id: payload.studentProfileId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
      },
    }),
    prisma.section.findFirst({
      where: {
        id: payload.sectionId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
        semesterId: true,
      },
    }),
    prisma.semester.findFirst({
      where: {
        id: payload.semesterId,
        institutionId: context.institutionId,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!course) {
    throw createHttpError(404, "Course not found for this department");
  }

  if (!student) {
    throw createHttpError(404, "Student not found for this department");
  }

  if (!section) {
    throw createHttpError(404, "Section not found for this department");
  }

  if (!semester) {
    throw createHttpError(404, "Semester not found for this institution");
  }

  if (section.semesterId !== payload.semesterId) {
    throw createHttpError(400, "Selected section does not belong to the selected semester");
  }

  const resolvedProgramId = payload.programId ?? course.programId ?? null;

  if (resolvedProgramId) {
    const program = await prisma.program.findFirst({
      where: {
        id: resolvedProgramId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
      },
    });

    if (!program) {
      throw createHttpError(404, "Program not found for this department");
    }
  }

  if (course.programId && course.programId !== resolvedProgramId) {
    throw createHttpError(400, "Selected course does not belong to the selected program");
  }

  const sectionCourseTeacherAssignment = await prisma.sectionCourseTeacherAssignment.findFirst({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      sectionId: payload.sectionId,
      courseId: payload.courseId,
    },
    select: {
      teacherProfileId: true,
    },
  });

  if (!sectionCourseTeacherAssignment) {
    throw createHttpError(
      400,
      "No teacher assigned for the selected section and course. Assign teacher first.",
    );
  }

  const existingRegistration = await prisma.courseRegistration.findFirst({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      courseId: payload.courseId,
      studentProfileId: payload.studentProfileId,
      semesterId: payload.semesterId,
    },
    select: {
      id: true,
    },
  });

  if (existingRegistration) {
    throw createHttpError(409, "Student is already registered for this course in the selected semester");
  }

  return prisma.courseRegistration.create({
    data: {
      courseId: payload.courseId,
      studentProfileId: payload.studentProfileId,
      teacherProfileId: sectionCourseTeacherAssignment.teacherProfileId,
      sectionId: payload.sectionId,
      departmentId: context.departmentId,
      programId: resolvedProgramId,
      semesterId: payload.semesterId,
      institutionId: context.institutionId,
      registrationDate: payload.registrationDate ? new Date(payload.registrationDate) : undefined,
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
        },
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      section: {
        select: {
          id: true,
          name: true,
          batch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      program: {
        select: {
          id: true,
          title: true,
        },
      },
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });
};

const updateCourseRegistration = async (
  userId: string,
  courseRegistrationId: string,
  payload: IUpdateCourseRegistrationPayload,
) => {
  const context = await resolveDepartmentContext(userId);

  const existing = await prisma.courseRegistration.findFirst({
    where: {
      id: courseRegistrationId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
      courseId: true,
      studentProfileId: true,
      sectionId: true,
      programId: true,
      semesterId: true,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Course registration not found");
  }

  const nextCourseId = payload.courseId ?? existing.courseId;
  const nextStudentProfileId = payload.studentProfileId ?? existing.studentProfileId;
  const nextSectionId = payload.sectionId ?? existing.sectionId;
  const nextSemesterId = payload.semesterId ?? existing.semesterId;

  const [course, student, section, semester] = await Promise.all([
    prisma.course.findFirst({
      where: {
        id: nextCourseId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
        programId: true,
      },
    }),
    prisma.studentProfile.findFirst({
      where: {
        id: nextStudentProfileId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
      },
    }),
    prisma.section.findFirst({
      where: {
        id: nextSectionId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
        semesterId: true,
      },
    }),
    prisma.semester.findFirst({
      where: {
        id: nextSemesterId,
        institutionId: context.institutionId,
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!course) {
    throw createHttpError(404, "Course not found for this department");
  }

  if (!student) {
    throw createHttpError(404, "Student not found for this department");
  }

  if (!section) {
    throw createHttpError(404, "Section not found for this department");
  }

  if (!semester) {
    throw createHttpError(404, "Semester not found for this institution");
  }

  if (section.semesterId !== nextSemesterId) {
    throw createHttpError(400, "Selected section does not belong to the selected semester");
  }

  const resolvedProgramId = payload.programId ?? course.programId ?? existing.programId ?? null;

  if (resolvedProgramId) {
    const program = await prisma.program.findFirst({
      where: {
        id: resolvedProgramId,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
      select: {
        id: true,
      },
    });

    if (!program) {
      throw createHttpError(404, "Program not found for this department");
    }
  }

  if (course.programId && course.programId !== resolvedProgramId) {
    throw createHttpError(400, "Selected course does not belong to the selected program");
  }

  const sectionCourseTeacherAssignment = await prisma.sectionCourseTeacherAssignment.findFirst({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      sectionId: nextSectionId,
      courseId: nextCourseId,
    },
    select: {
      teacherProfileId: true,
    },
  });

  if (!sectionCourseTeacherAssignment) {
    throw createHttpError(
      400,
      "No teacher assigned for the selected section and course. Assign teacher first.",
    );
  }

  const duplicate = await prisma.courseRegistration.findFirst({
    where: {
      id: {
        not: courseRegistrationId,
      },
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      courseId: nextCourseId,
      studentProfileId: nextStudentProfileId,
      semesterId: nextSemesterId,
    },
    select: {
      id: true,
    },
  });

  if (duplicate) {
    throw createHttpError(409, "Student is already registered for this course in the selected semester");
  }

  return prisma.courseRegistration.update({
    where: {
      id: courseRegistrationId,
    },
    data: {
      courseId: nextCourseId,
      studentProfileId: nextStudentProfileId,
      teacherProfileId: sectionCourseTeacherAssignment.teacherProfileId,
      sectionId: nextSectionId,
      programId: resolvedProgramId,
      semesterId: nextSemesterId,
      registrationDate: payload.registrationDate ? new Date(payload.registrationDate) : undefined,
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
        },
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          teachersId: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      section: {
        select: {
          id: true,
          name: true,
          batch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      program: {
        select: {
          id: true,
          title: true,
        },
      },
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });
};

const deleteCourseRegistration = async (userId: string, courseRegistrationId: string) => {
  const context = await resolveDepartmentContext(userId);

  const existing = await prisma.courseRegistration.findFirst({
    where: {
      id: courseRegistrationId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Course registration not found");
  }

  await prisma.courseRegistration.delete({
    where: {
      id: courseRegistrationId,
    },
  });

  return {
    id: courseRegistrationId,
  };
};

const listTeachers = async (userId: string, departmentId?: string, search?: string) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);

  return prisma.teacherProfile.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...(normalizedSearch
        ? {
            OR: [
              { teacherInitial: { contains: normalizedSearch, mode: "insensitive" } },
              { teachersId: { contains: normalizedSearch, mode: "insensitive" } },
              { designation: { contains: normalizedSearch, mode: "insensitive" } },
              {
                user: {
                  is: {
                    OR: [
                      { name: { contains: normalizedSearch, mode: "insensitive" } },
                      { email: { contains: normalizedSearch, mode: "insensitive" } },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          accountStatus: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createTeacher = async (userId: string, payload: ICreateTeacherPayload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);

  const registered = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: UserRole.TEACHER,
    },
  });

  if (!registered.user) {
    throw createHttpError(500, "Failed to create teacher account");
  }

  const profile = await prisma.$transaction(async (trx) => {
    await trx.user.update({
      where: {
        id: registered.user.id,
      },
      data: {
        accountStatus: AccountStatus.ACTIVE,
      },
    });

    return trx.teacherProfile.create({
      data: {
        teacherInitial: payload.teacherInitial.trim(),
        teachersId: payload.teachersId.trim(),
        designation: payload.designation.trim(),
        bio: payload.bio?.trim() || null,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
        userId: registered.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true,
          },
        },
      },
    });
  });

  return profile;
};

const updateTeacher = async (
  userId: string,
  teacherProfileId: string,
  payload: IUpdateTeacherPayload,
) => {
  const context = await resolveDepartmentContext(userId);

  const teacher = await prisma.teacherProfile.findFirst({
    where: {
      id: teacherProfileId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!teacher) {
    throw createHttpError(404, "Teacher not found");
  }

  const result = await prisma.$transaction(async (trx) => {
    const updatedTeacher = await trx.teacherProfile.update({
      where: {
        id: teacherProfileId,
      },
      data: {
        designation: payload.designation?.trim(),
        bio: payload.bio?.trim() || undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true,
          },
        },
      },
    });

    if (payload.accountStatus) {
      await trx.user.update({
        where: {
          id: teacher.userId,
        },
        data: {
          accountStatus: payload.accountStatus,
        },
      });

      updatedTeacher.user.accountStatus = payload.accountStatus;
    }

    return updatedTeacher;
  });

  return result;
};

const listStudents = async (userId: string, departmentId?: string, search?: string) => {
  const context = await resolveDepartmentContext(userId, departmentId);
  const normalizedSearch = normalizeSearch(search);

  return prisma.studentProfile.findMany({
    where: {
      institutionId: context.institutionId,
      departmentId: context.departmentId,
      ...(normalizedSearch
        ? {
            OR: [
              { studentsId: { contains: normalizedSearch, mode: "insensitive" } },
              {
                user: {
                  is: {
                    OR: [
                      { name: { contains: normalizedSearch, mode: "insensitive" } },
                      { email: { contains: normalizedSearch, mode: "insensitive" } },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          accountStatus: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const createStudent = async (userId: string, payload: ICreateStudentPayload) => {
  const context = await resolveDepartmentContext(userId, payload.departmentId);

  const registered = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: UserRole.STUDENT,
    },
  });

  if (!registered.user) {
    throw createHttpError(500, "Failed to create student account");
  }

  const profile = await prisma.$transaction(async (trx) => {
    await trx.user.update({
      where: {
        id: registered.user.id,
      },
      data: {
        accountStatus: AccountStatus.ACTIVE,
      },
    });

    return trx.studentProfile.create({
      data: {
        studentsId: payload.studentsId.trim(),
        bio: payload.bio?.trim() || null,
        institutionId: context.institutionId,
        departmentId: context.departmentId,
        userId: registered.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true,
          },
        },
      },
    });
  });

  return profile;
};

const updateStudent = async (
  userId: string,
  studentProfileId: string,
  payload: IUpdateStudentPayload,
) => {
  const context = await resolveDepartmentContext(userId);

  const student = await prisma.studentProfile.findFirst({
    where: {
      id: studentProfileId,
      institutionId: context.institutionId,
      departmentId: context.departmentId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  const result = await prisma.$transaction(async (trx) => {
    const updatedStudent = await trx.studentProfile.update({
      where: {
        id: studentProfileId,
      },
      data: {
        bio: payload.bio?.trim() || undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true,
          },
        },
      },
    });

    if (payload.accountStatus) {
      await trx.user.update({
        where: {
          id: student.userId,
        },
        data: {
          accountStatus: payload.accountStatus,
        },
      });

      updatedStudent.user.accountStatus = payload.accountStatus;
    }

    return updatedStudent;
  });

  return result;
};

const getDashboardSummary = async (userId: string) => {
  const context = await resolveDepartmentContext(userId);

  const [user, institution, department, stats] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    }),
    prisma.institution.findUnique({
      where: {
        id: context.institutionId,
      },
      select: {
        id: true,
        name: true,
        shortName: true,
        institutionLogo: true,
        type: true,
      },
    }),
    prisma.department.findUnique({
      where: {
        id: context.departmentId,
      },
      select: {
        id: true,
        fullName: true,
        shortName: true,
        description: true,
      },
    }),
    Promise.all([
      prisma.semester.count({
        where: {
          institutionId: context.institutionId,
        },
      }),
      prisma.section.count({
        where: {
          institutionId: context.institutionId,
          departmentId: context.departmentId,
        },
      }),
      prisma.teacherProfile.count({
        where: {
          institutionId: context.institutionId,
          departmentId: context.departmentId,
        },
      }),
      prisma.course.count({
        where: {
          institutionId: context.institutionId,
          departmentId: context.departmentId,
        },
      }),
      prisma.studentProfile.count({
        where: {
          institutionId: context.institutionId,
          departmentId: context.departmentId,
        },
      }),
      prisma.teacherJobApplication.count({
        where: {
          institutionId: context.institutionId,
          departmentId: context.departmentId,
          status: "PENDING",
        },
      }),
      prisma.studentAdmissionApplication.count({
        where: {
          posting: {
            institutionId: context.institutionId,
            departmentId: context.departmentId,
          },
          status: "PENDING",
        },
      }),
    ]),
  ]);

  const [totalSemesters, totalSections, totalTeachers, totalCourses, totalStudents, pendingTeacherApplications, pendingStudentApplications] =
    stats;

  return {
    user,
    institution,
    department,
    stats: {
      totalSemesters,
      totalSections,
      totalTeachers,
      totalCourses,
      totalStudents,
      pendingTeacherApplications,
      pendingStudentApplications,
    },
  };
};

const listStudentAdmissionApplications = async (
  userId: string,
  status?: IListStudentAdmissionApplicationsQuery["status"],
) => {
  const context = await resolveDepartmentContext(userId);

  return prisma.studentAdmissionApplication.findMany({
    where: {
      status,
      posting: {
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
          summary: true,
          institutionId: true,
          departmentId: true,
        },
      },
      studentUser: {
        select: {
          id: true,
          name: true,
          email: true,
          accountStatus: true,
          studentApplicationProfile: {
            select: {
              id: true,
              headline: true,
              about: true,
              documentUrls: true,
              academicRecords: true,
              isComplete: true,
              updatedAt: true,
            },
          },
        },
      },
      reviewerUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      studentProfile: {
        select: {
          id: true,
          studentsId: true,
          bio: true,
          departmentId: true,
          institutionId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const reviewStudentAdmissionApplication = async (
  reviewerUserId: string,
  applicationId: string,
  payload: IReviewStudentAdmissionApplicationPayload,
) => {
  const context = await resolveDepartmentContext(reviewerUserId);

  const application = await prisma.studentAdmissionApplication.findFirst({
    where: {
      id: applicationId,
      posting: {
        institutionId: context.institutionId,
        departmentId: context.departmentId,
      },
    },
    include: {
      posting: {
        select: {
          id: true,
          institutionId: true,
          departmentId: true,
        },
      },
    },
  });

  if (!application) {
    throw createHttpError(404, "Student admission application not found");
  }

  if (
    application.status === StudentAdmissionApplicationStatus.APPROVED ||
    application.status === StudentAdmissionApplicationStatus.REJECTED
  ) {
    throw createHttpError(400, "Application has already been reviewed");
  }

  if (payload.status === StudentAdmissionApplicationStatus.REJECTED) {
    return prisma.studentAdmissionApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: StudentAdmissionApplicationStatus.REJECTED,
        institutionResponse: payload.rejectionReason?.trim() || null,
        reviewerUserId,
        reviewedAt: new Date(),
      },
    });
  }

  if (payload.status === StudentAdmissionApplicationStatus.SHORTLISTED) {
    return prisma.studentAdmissionApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: StudentAdmissionApplicationStatus.SHORTLISTED,
        institutionResponse: payload.responseMessage?.trim() || null,
        reviewerUserId,
        reviewedAt: new Date(),
      },
    });
  }

  const studentsId = payload.studentsId?.trim();

  if (!studentsId) {
    throw createHttpError(400, "studentsId is required for approval");
  }

  return prisma.$transaction(async (trx) => {
    const existingProfile = await trx.studentProfile.findFirst({
      where: {
        userId: application.studentUserId,
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let studentProfileId = existingProfile?.id;

    if (studentProfileId) {
      await trx.studentProfile.update({
        where: {
          id: studentProfileId,
        },
        data: {
          studentsId,
          bio: payload.bio?.trim() || undefined,
          institutionId: context.institutionId,
          departmentId: context.departmentId,
        },
      });
    } else {
      const createdProfile = await trx.studentProfile.create({
        data: {
          studentsId,
          bio: payload.bio?.trim() || null,
          userId: application.studentUserId,
          institutionId: context.institutionId,
          departmentId: context.departmentId,
        },
        select: {
          id: true,
        },
      });

      studentProfileId = createdProfile.id;
    }

    await trx.user.update({
      where: {
        id: application.studentUserId,
      },
      data: {
        accountStatus: AccountStatus.ACTIVE,
      },
    });

    return trx.studentAdmissionApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: StudentAdmissionApplicationStatus.APPROVED,
        institutionResponse: payload.responseMessage?.trim() || null,
        reviewerUserId,
        reviewedAt: new Date(),
        studentProfileId,
      },
      include: {
        studentUser: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true,
          },
        },
        posting: {
          select: {
            id: true,
            title: true,
            location: true,
            summary: true,
            institutionId: true,
            departmentId: true,
          },
        },
      },
    });
  });
};

export const DepartmentService = {
  getDepartmentProfile,
  updateDepartmentProfile,
  listSemesters,
  createSemester,
  updateSemester,
  listBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  listSections,
  createSection,
  updateSection,
  deleteSection,
  listPrograms,
  createProgram,
  updateProgram,
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  listCourseRegistrations,
  listSectionCourseTeacherAssignments,
  upsertSectionCourseTeacherAssignment,
  createCourseRegistration,
  updateCourseRegistration,
  deleteCourseRegistration,
  listTeachers,
  createTeacher,
  updateTeacher,
  listStudents,
  createStudent,
  updateStudent,
  getDashboardSummary,
  listStudentAdmissionApplications,
  reviewStudentAdmissionApplication,
};
