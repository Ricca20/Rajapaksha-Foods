import { Employee, Attendance } from '../infastructure/infastructure.employee.js';
import mongoose from 'mongoose';

class EmployeeApplication {
  // Employee CRUD Operations

  async createEmployee(employeeData) {
    try {
      // Check if employee with email already exists
      const existingEmployee = await Employee.findOne({ email: employeeData.email });
      if (existingEmployee) {
        throw new Error('Employee with this email already exists');
      }

      const employee = new Employee(employeeData);
      await employee.save();
      return employee;
    } catch (error) {
      throw new Error(`Failed to create employee: ${error.message}`);
    }
  }

  async getAllEmployees(filters = {}) {
    try {
      const { status, position, search, page = 1, limit = 10 } = filters;
      
      let query = {};
      
      // Apply filters
      if (status) query.status = status;
      if (position) query.position = position;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      
      const [employees, total] = await Promise.all([
        Employee.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Employee.countDocuments(query)
      ]);

      // Get basic statistics
      const stats = await this.getEmployeeStatistics();

      return {
        employees,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        statistics: stats
      };
    } catch (error) {
      throw new Error(`Failed to fetch employees: ${error.message}`);
    }
  }

  async getEmployeeById(employeeId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        throw new Error('Invalid employee ID');
      }

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      return employee;
    } catch (error) {
      throw new Error(`Failed to fetch employee: ${error.message}`);
    }
  }

  async updateEmployee(employeeId, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        throw new Error('Invalid employee ID');
      }

      // Check if email is being updated and if it already exists
      if (updateData.email) {
        const existingEmployee = await Employee.findOne({ 
          email: updateData.email,
          _id: { $ne: employeeId }
        });
        if (existingEmployee) {
          throw new Error('Employee with this email already exists');
        }
      }

      const employee = await Employee.findByIdAndUpdate(
        employeeId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!employee) {
        throw new Error('Employee not found');
      }

      return employee;
    } catch (error) {
      throw new Error(`Failed to update employee: ${error.message}`);
    }
  }

  async deleteEmployee(employeeId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        throw new Error('Invalid employee ID');
      }

      const employee = await Employee.findByIdAndDelete(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Also delete all attendance records for this employee
      await Attendance.deleteMany({ employeeId });

      return { message: 'Employee and related attendance records deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete employee: ${error.message}`);
    }
  }

  async getEmployeeStatistics() {
    try {
      const stats = await Employee.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
            terminated: { $sum: { $cond: [{ $eq: ['$status', 'terminated'] }, 1, 0] } }
          }
        }
      ]);

      const positionStats = await Employee.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$position',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return {
        total: stats[0]?.total || 0,
        active: stats[0]?.active || 0,
        inactive: stats[0]?.inactive || 0,
        terminated: stats[0]?.terminated || 0,
        byPosition: positionStats
      };
    } catch (error) {
      throw new Error(`Failed to fetch employee statistics: ${error.message}`);
    }
  }

  // Attendance Management

  async markAttendance(attendanceData) {
    try {
      const { employeeId, date, status, checkInTime, checkOutTime, notes, markedBy } = attendanceData;

      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        throw new Error('Invalid employee ID');
      }

      // Check if employee exists and is active
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
      if (employee.status !== 'active') {
        throw new Error('Cannot mark attendance for inactive employee');
      }

      // Check if attendance already exists for this date
      const existingAttendance = await Attendance.findOne({ employeeId, date });
      if (existingAttendance) {
        throw new Error('Attendance already marked for this date');
      }

      const attendance = new Attendance({
        employeeId,
        date,
        status,
        checkInTime,
        checkOutTime,
        notes,
        markedBy
      });

      await attendance.save();
      await attendance.populate('employeeId', 'name email position');
      return attendance;
    } catch (error) {
      throw new Error(`Failed to mark attendance: ${error.message}`);
    }
  }

  async updateAttendance(attendanceId, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
        throw new Error('Invalid attendance ID');
      }

      const attendance = await Attendance.findByIdAndUpdate(
        attendanceId,
        updateData,
        { new: true, runValidators: true }
      ).populate('employeeId', 'name email position');

      if (!attendance) {
        throw new Error('Attendance record not found');
      }

      return attendance;
    } catch (error) {
      throw new Error(`Failed to update attendance: ${error.message}`);
    }
  }

  async getAttendanceRecords(filters = {}) {
    try {
      const { employeeId, startDate, endDate, status, page = 1, limit = 10 } = filters;
      
      let query = {};
      
      if (employeeId && mongoose.Types.ObjectId.isValid(employeeId)) {
        query.employeeId = employeeId;
      }
      
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }
      
      if (status) query.status = status;

      const skip = (page - 1) * limit;
      
      const [attendance, total] = await Promise.all([
        Attendance.find(query)
          .populate('employeeId', 'name email position')
          .sort({ date: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Attendance.countDocuments(query)
      ]);

      return {
        attendance,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch attendance records: ${error.message}`);
    }
  }

  async getAttendanceByEmployee(employeeId, month, year) {
    try {
      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        throw new Error('Invalid employee ID');
      }

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const attendance = await Attendance.find({
        employeeId,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: 1 });

      // Calculate statistics
      const stats = {
        totalDays: attendance.length,
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        late: attendance.filter(a => a.status === 'late').length,
        halfDay: attendance.filter(a => a.status === 'half-day').length,
        sickLeave: attendance.filter(a => a.status === 'sick-leave').length,
        vacation: attendance.filter(a => a.status === 'vacation').length,
        totalHours: attendance.reduce((sum, a) => sum + (a.hoursWorked || 0), 0)
      };

      return { attendance, statistics: stats };
    } catch (error) {
      throw new Error(`Failed to fetch employee attendance: ${error.message}`);
    }
  }

  async deleteAttendance(attendanceId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
        throw new Error('Invalid attendance ID');
      }

      const attendance = await Attendance.findByIdAndDelete(attendanceId);
      if (!attendance) {
        throw new Error('Attendance record not found');
      }

      return { message: 'Attendance record deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete attendance: ${error.message}`);
    }
  }

  async getTodayAttendance() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const attendance = await Attendance.find({
        date: { $gte: today, $lt: tomorrow }
      }).populate('employeeId', 'name email position');

      const totalActiveEmployees = await Employee.countDocuments({ status: 'active' });
      
      const stats = {
        totalActive: totalActiveEmployees,
        marked: attendance.length,
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        late: attendance.filter(a => a.status === 'late').length,
        onLeave: attendance.filter(a => ['sick-leave', 'vacation'].includes(a.status)).length
      };

      return { attendance, statistics: stats };
    } catch (error) {
      throw new Error(`Failed to fetch today's attendance: ${error.message}`);
    }
  }
}

export default new EmployeeApplication();