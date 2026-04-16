import { Router } from 'express';
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from '../controllers/employeeController.runtime.js';

const router = Router();

router.route('/').get(getEmployees).post(createEmployee);
router
  .route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
