import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coffee,
  Heart,
  Plane
} from 'lucide-react';
import {
  useGetEmployeeAttendanceQuery,
  useGetTodayAttendanceQuery,
  useMarkAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation
} from '../lib/api';
import { useUser } from '@clerk/clerk-react';

const AttendanceManager = ({ employee, onClose }) => {
  const { user } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [markFormData, setMarkFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkInTime: '',
    checkOutTime: '',
    notes: ''
  });

  const { 
    data: attendanceData, 
    isLoading: attendanceLoading,
    refetch: refetchAttendance 
  } = useGetEmployeeAttendanceQuery({
    id: employee._id,
    month: selectedMonth,
    year: selectedYear
  });

  const { 
    data: todayData,
    refetch: refetchToday 
  } = useGetTodayAttendanceQuery();

  const [markAttendance] = useMarkAttendanceMutation();
  const [updateAttendance] = useUpdateAttendanceMutation();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'late': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'half-day': return <Coffee className="w-4 h-4 text-blue-500" />;
      case 'sick-leave': return <Heart className="w-4 h-4 text-purple-500" />;
      case 'vacation': return <Plane className="w-4 h-4 text-indigo-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'half-day': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sick-leave': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'vacation': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      const attendanceData = {
        ...markFormData,
        employeeId: employee._id,
        markedBy: user?.emailAddresses?.[0]?.emailAddress || 'Admin'
      };

      if (editingAttendance) {
        await updateAttendance({ id: editingAttendance._id, ...attendanceData }).unwrap();
      } else {
        await markAttendance(attendanceData).unwrap();
      }

      setShowMarkForm(false);
      setEditingAttendance(null);
      setMarkFormData({
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        checkInTime: '',
        checkOutTime: '',
        notes: ''
      });
      refetchAttendance();
      refetchToday();
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert(error.data?.error || 'Failed to mark attendance');
    }
  };

  const handleEditAttendance = (attendance) => {
    setEditingAttendance(attendance);
    setMarkFormData({
      date: new Date(attendance.date).toISOString().split('T')[0],
      status: attendance.status,
      checkInTime: attendance.checkInTime || '',
      checkOutTime: attendance.checkOutTime || '',
      notes: attendance.notes || ''
    });
    setShowMarkForm(true);
  };

  const handleDeleteAttendance = async (attendanceId) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await deleteAttendance(attendanceId).unwrap();
        refetchAttendance();
        refetchToday();
      } catch (error) {
        console.error('Error deleting attendance:', error);
        alert('Failed to delete attendance record');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateMonthOptions = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.map((month, index) => (
      <option key={index + 1} value={index + 1}>{month}</option>
    ));
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 2; year <= currentYear + 1; year++) {
      years.push(year);
    }
    return years.map(year => (
      <option key={year} value={year}>{year}</option>
    ));
  };

  // Check if employee has attendance marked for today
  const hasAttendanceToday = todayData?.attendance?.some(
    record => record.employeeId._id === employee._id
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Employees
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="text-orange-500" />
                Attendance Management
              </h1>
              <p className="text-gray-600 mt-2">
                Managing attendance for {employee.name} - {employee.position}
              </p>
            </div>
            
            <button
              onClick={() => setShowMarkForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Mark Attendance
            </button>
          </div>
        </div>

        {/* Employee Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{employee.name}</h3>
              <p className="text-gray-600">{employee.position}</p>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
            
            {/* Today's Status */}
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Today's Status</p>
              {hasAttendanceToday ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  <CheckCircle className="w-3 h-3" />
                  Marked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                  <XCircle className="w-3 h-3" />
                  Not Marked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Month/Year Selector and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Month/Year Selector */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">View Period</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {generateMonthOptions()}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {generateYearOptions()}
                </select>
              </div>
            </div>
          </div>

          {/* Attendance Statistics */}
          {attendanceData && (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{attendanceData.statistics.present}</div>
                  <div className="text-sm text-gray-600">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{attendanceData.statistics.absent}</div>
                  <div className="text-sm text-gray-600">Absent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{attendanceData.statistics.late}</div>
                  <div className="text-sm text-gray-600">Late</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{attendanceData.statistics.totalHours.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attendance Records */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
          </div>

          {attendanceLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading attendance records...</p>
            </div>
          ) : attendanceData?.attendance?.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No attendance records found</p>
              <p className="text-gray-400">Mark attendance to see records here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {attendanceData?.attendance?.map((record) => (
                      <motion.tr
                        key={record._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                            {getStatusIcon(record.status)}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.checkInTime || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.checkOutTime || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.hoursWorked ? `${record.hoursWorked.toFixed(1)}h` : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {record.notes || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditAttendance(record)}
                              className="text-orange-600 hover:text-orange-900 p-1 rounded"
                              title="Edit Attendance"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAttendance(record._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Delete Attendance"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mark Attendance Modal */}
        <AnimatePresence>
          {showMarkForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingAttendance ? 'Edit Attendance' : 'Mark Attendance'}
                </h3>

                <form onSubmit={handleMarkAttendance} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={markFormData.date}
                      onChange={(e) => setMarkFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={markFormData.status}
                      onChange={(e) => setMarkFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="half-day">Half Day</option>
                      <option value="sick-leave">Sick Leave</option>
                      <option value="vacation">Vacation</option>
                    </select>
                  </div>

                  {(markFormData.status === 'present' || markFormData.status === 'late') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check In Time</label>
                        <input
                          type="time"
                          value={markFormData.checkInTime}
                          onChange={(e) => setMarkFormData(prev => ({ ...prev, checkInTime: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check Out Time</label>
                        <input
                          type="time"
                          value={markFormData.checkOutTime}
                          onChange={(e) => setMarkFormData(prev => ({ ...prev, checkOutTime: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={markFormData.notes}
                      onChange={(e) => setMarkFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Optional notes..."
                      maxLength="200"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMarkForm(false);
                        setEditingAttendance(null);
                        setMarkFormData({
                          date: new Date().toISOString().split('T')[0],
                          status: 'present',
                          checkInTime: '',
                          checkOutTime: '',
                          notes: ''
                        });
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      {editingAttendance ? 'Update' : 'Mark'} Attendance
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AttendanceManager;