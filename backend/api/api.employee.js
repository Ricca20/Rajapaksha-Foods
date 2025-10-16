import express from 'express';
import employeeApp from '../application/application.employee.js';

const router = express.Router();

// Validation middleware
const validateEmployeeData = (req, res, next) => {
  const { name, email, phone, position, salary } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Employee name is required' });
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  
  if (!phone || phone.trim().length === 0) {
    return res.status(400).json({ error: 'Phone number is required' });
  }
  
  if (!position || position.trim().length === 0) {
    return res.status(400).json({ error: 'Position is required' });
  }
  
  if (!salary || isNaN(salary) || salary < 0) {
    return res.status(400).json({ error: 'Valid salary is required' });
  }
  
  next();
};

const validateAttendanceData = (req, res, next) => {
  const { employeeId, date, status, markedBy } = req.body;
  
  if (!employeeId || employeeId.trim().length === 0) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }
  
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }
  
  if (!status || !['present', 'absent', 'late', 'half-day', 'sick-leave', 'vacation'].includes(status)) {
    return res.status(400).json({ error: 'Valid attendance status is required' });
  }
  
  if (!markedBy || markedBy.trim().length === 0) {
    return res.status(400).json({ error: 'Marked by field is required' });
  }
  
  next();
};

// Employee Routes

// GET /api/employees - Get all employees with filtering
router.get('/', async (req, res) => {
  try {
    const result = await employeeApp.getAllEmployees(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/employees/statistics - Get employee statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = await employeeApp.getEmployeeStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching employee statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/employees/:id - Get specific employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await employeeApp.getEmployeeById(req.params.id);
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(404).json({ error: error.message });
  }
});

// POST /api/employees - Create new employee
router.post('/', validateEmployeeData, async (req, res) => {
  try {
    const employee = await employeeApp.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', validateEmployeeData, async (req, res) => {
  try {
    const employee = await employeeApp.updateEmployee(req.params.id, req.body);
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const result = await employeeApp.deleteEmployee(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(400).json({ error: error.message });
  }
});

// Attendance Routes

// GET /api/employees/attendance/records - Get attendance records with filtering
router.get('/attendance/records', async (req, res) => {
  try {
    const result = await employeeApp.getAttendanceRecords(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/employees/attendance/today - Get today's attendance
router.get('/attendance/today', async (req, res) => {
  try {
    const result = await employeeApp.getTodayAttendance();
    res.json(result);
  } catch (error) {
    console.error('Error fetching today\'s attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/employees/:id/attendance - Get attendance for specific employee
router.get('/:id/attendance', async (req, res) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
    const result = await employeeApp.getAttendanceByEmployee(req.params.id, parseInt(month), parseInt(year));
    res.json(result);
  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/employees/attendance - Mark attendance
router.post('/attendance', validateAttendanceData, async (req, res) => {
  try {
    const attendance = await employeeApp.markAttendance(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/employees/attendance/:id - Update attendance
router.put('/attendance/:id', async (req, res) => {
  try {
    const attendance = await employeeApp.updateAttendance(req.params.id, req.body);
    res.json(attendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/employees/attendance/:id - Delete attendance record
router.delete('/attendance/:id', async (req, res) => {
  try {
    const result = await employeeApp.deleteAttendance(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;