import mongoose from 'mongoose';

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please provide a valid phone number']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
    enum: {
      values: ['Manager', 'Chef', 'Assistant Chef', 'Delivery Person', 'Cashier', 'Kitchen Helper', 'Cleaner', 'Waiter/Waitress'],
      message: 'Position must be one of: Manager, Chef, Assistant Chef, Delivery Person, Cashier, Kitchen Helper, Cleaner, Waiter/Waitress'
    }
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary cannot be negative']
  },
  hireDate: {
    type: Date,
    required: [true, 'Hire date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'terminated'],
      message: 'Status must be either active, inactive, or terminated'
    },
    default: 'active'
  },
  address: {
    street: String,
    city: String,
    postalCode: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  status: {
    type: String,
    enum: {
      values: ['present', 'absent', 'late', 'half-day', 'sick-leave', 'vacation'],
      message: 'Status must be one of: present, absent, late, half-day, sick-leave, vacation'
    },
    required: [true, 'Attendance status is required']
  },
  checkInTime: {
    type: String, // Storing as string in HH:MM format
    validate: {
      validator: function(v) {
        return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Check-in time must be in HH:MM format'
    }
  },
  checkOutTime: {
    type: String, // Storing as string in HH:MM format
    validate: {
      validator: function(v) {
        return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Check-out time must be in HH:MM format'
    }
  },
  hoursWorked: {
    type: Number,
    min: [0, 'Hours worked cannot be negative'],
    max: [24, 'Hours worked cannot exceed 24']
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  },
  markedBy: {
    type: String, // Admin who marked the attendance
    required: [true, 'Marked by field is required']
  }
}, {
  timestamps: true
});

// Indexes for better performance
employeeSchema.index({ status: 1 });
employeeSchema.index({ position: 1 });

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true }); // Prevent duplicate attendance records for same date
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

// Virtual for full name display
employeeSchema.virtual('displayName').get(function() {
  return this.name;
});

// Virtual to calculate employment duration
employeeSchema.virtual('employmentDuration').get(function() {
  const now = new Date();
  const hire = new Date(this.hireDate);
  const diffTime = Math.abs(now - hire);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to calculate total hours for a date range
attendanceSchema.statics.getTotalHours = function(employeeId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        employeeId: mongoose.Types.ObjectId(employeeId),
        date: { $gte: startDate, $lte: endDate },
        hoursWorked: { $exists: true }
      }
    },
    {
      $group: {
        _id: null,
        totalHours: { $sum: '$hoursWorked' }
      }
    }
  ]);
};

// Pre-save middleware to calculate hours worked
attendanceSchema.pre('save', function(next) {
  if (this.checkInTime && this.checkOutTime && this.status === 'present') {
    const [checkInHour, checkInMin] = this.checkInTime.split(':').map(Number);
    const [checkOutHour, checkOutMin] = this.checkOutTime.split(':').map(Number);
    
    const checkInMinutes = checkInHour * 60 + checkInMin;
    const checkOutMinutes = checkOutHour * 60 + checkOutMin;
    
    if (checkOutMinutes > checkInMinutes) {
      this.hoursWorked = (checkOutMinutes - checkInMinutes) / 60;
    }
  }
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

export { Employee, Attendance };