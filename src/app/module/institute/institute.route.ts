import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { InstituteValidation } from './interface.validation';
import { InstituteController } from './institute.controller';

const router = Router();

router.post('/create', validateRequest(InstituteValidation.createInstitutionSchema), InstituteController.createInstitution);

export const InstituteRoutes = router;
