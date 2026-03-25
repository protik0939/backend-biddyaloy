import { InstitutionType } from "../../../generated/prisma/enums";

export interface IApply {
    name: string;
    email: string;
    password: string;
    instituteName: string;
    instituteShortname: string;
    description: string;
    instituteType: InstitutionType;
    instituteLogo: string;
}