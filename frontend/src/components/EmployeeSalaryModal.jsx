import React, { useState, useMemo } from 'react';
import { X, DollarSign, Calendar, TrendingUp, Download, Check } from 'lucide-react';
import { useGetEmployeeAttendanceQuery } from '../lib/api';

const EmployeeSalaryModal = ({ isOpen, onClose, employee }) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  );

  const DAILY_RATE = 1000; // LKR 1,000 per day

  // Parse selected month
  const [year, month] = selectedMonth.split('-').map(Number);

  const { 
    data: attendanceData, 
    isLoading,
    error 
  } = useGetEmployeeAttendanceQuery(
    { 
      id: employee?._id,
      month: month,
      year: year
    },
    { skip: !employee?._id || !isOpen }
  );

  // Calculate salary
  const salaryCalculation = useMemo(() => {
    if (!attendanceData?.attendance) {
      return {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        leaveDays: 0,
        workingDays: 0,
        dailyRate: DAILY_RATE,
        totalSalary: 0,
        attendancePercentage: 0
      };
    }

    const attendance = attendanceData.attendance;
    
    // Get total days in selected month
    const [year, month] = selectedMonth.split('-').map(Number);
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    
    // Count attendance statuses
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const absentDays = attendance.filter(a => a.status === 'absent').length;
    const leaveDays = attendance.filter(a => a.status === 'leave').length;
    
    // Calculate working days (only present days count)
    const workingDays = presentDays;
    
    // Calculate total salary
    const totalSalary = workingDays * DAILY_RATE;
    
    // Attendance percentage
    const attendancePercentage = totalDaysInMonth > 0 
      ? (presentDays / totalDaysInMonth * 100).toFixed(1)
      : 0;

    return {
      totalDays: totalDaysInMonth,
      presentDays,
      absentDays,
      leaveDays,
      workingDays,
      dailyRate: DAILY_RATE,
      totalSalary,
      attendancePercentage
    };
  }, [attendanceData, selectedMonth]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatMonthYear = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleDownloadSlip = () => {
    // CSV format salary slip
    const csvContent = [
      // Header
      ['RAJAPAKSHA FOODS - SALARY SLIP'],
      [],
      // Employee Details
      ['Employee Name', employee.name],
      ['Position', employee.position],
      ['Month', formatMonthYear(selectedMonth)],
      ['Generated Date', new Date().toLocaleDateString('en-US')],
      [],
      // Attendance Summary Section
      ['ATTENDANCE SUMMARY'],
      ['Description', 'Days'],
      ['Total Days in Month', salaryCalculation.totalDays],
      ['Present Days', salaryCalculation.presentDays],
      ['Leave Days', salaryCalculation.leaveDays],
      ['Absent Days', salaryCalculation.absentDays],
      ['Working Days', salaryCalculation.workingDays],
      [],
      // Salary Calculation Section
      ['SALARY CALCULATION'],
      ['Description', 'Amount (LKR)'],
      ['Daily Rate', salaryCalculation.dailyRate.toFixed(2)],
      ['Working Days', salaryCalculation.workingDays],
      ['Attendance Rate', `${salaryCalculation.attendancePercentage}%`],
      [],
      // Total
      ['TOTAL SALARY', salaryCalculation.totalSalary.toFixed(2)],
      [],
      ['Note', 'Salary calculated at LKR 1,000 per day worked.']
    ];

    // Convert to CSV string
    const csvString = csvContent
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Create and download as CSV file
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary-slip-${employee.name.replace(/\s+/g, '-')}-${selectedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Employee Salary Slip</h2>
              <p className="text-sm text-gray-600 mt-1">
                {employee?.name} • {employee?.position}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Month Selector */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              max={`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="text-gray-600 mt-4 text-sm">Calculating salary...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-medium">Error loading attendance data</p>
              <p className="text-red-500 text-sm mt-1">Please try again later</p>
            </div>
          ) : (
            <>
              

              {/* Salary Breakdown */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Salary Breakdown
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Daily Rate</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(salaryCalculation.dailyRate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Working Days</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {salaryCalculation.workingDays} days
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Attendance Rate</span>
                    <span className={`text-sm font-semibold ${
                      salaryCalculation.attendancePercentage >= 90 ? 'text-green-600' :
                      salaryCalculation.attendancePercentage >= 75 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {salaryCalculation.attendancePercentage}%
                    </span>
                  </div>

                  

                  {/* Total Salary */}
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">Total Salary</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {formatCurrency(salaryCalculation.totalSalary)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={handleDownloadSlip}
            disabled={isLoading || error}
            className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download Slip
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalaryModal;
