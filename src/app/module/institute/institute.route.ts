import { Router } from 'express';
import { requireSessionRole } from '../../middleware/requireSessionRole';
import { validateRequest } from '../../middleware/validateRequest';
import { InstituteValidation } from './interface.validation';
import { InstituteController } from './institute.controller';

const router = Router();

router.post('/create', validateRequest(InstituteValidation.createInstitutionSchema), InstituteController.createInstitution);
router.get(
	'/options',
	requireSessionRole('ADMIN', 'FACULTY', 'DEPARTMENT'),
	validateRequest(InstituteValidation.listInstitutionOptionsSchema),
	InstituteController.listInstitutionOptions,
);

export const InstituteRoutes = router;
