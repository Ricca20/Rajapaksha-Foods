import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Phone,
  Mail,
  MapPin,
  DollarSign
} from 'lucide-react';
import {
  useGetAllEmployeesQuery,
  useGetEmployeeStatisticsQuery,
  useDeleteEmployeeMutation
} from '../lib/api';
import EmployeeForm from '../components/EmployeeForm';
import AttendanceManager from '../components/AttendanceManager';
import EmployeeSalaryModal from '../components/EmployeeSalaryModal';

const EmployeesPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    position: '',
    page: 1,
    limit: 10
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showSalary, setShowSalary] = useState(false);
  const [salaryEmployee, setSalaryEmployee] = useState(null);

  const { 
    data: employeesData, 
    isLoading: employeesLoading, 
    refetch: refetchEmployees 
  } = useGetAllEmployeesQuery(filters);
  
  const { 
    data: statistics, 
    isLoading: statsLoading 
  } = useGetEmployeeStatisticsQuery();
  
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee? This will also delete all attendance records.')) {
      try {
        await deleteEmployee(employeeId).unwrap();
        refetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const handleViewAttendance = (employee) => {
    setSelectedEmployee(employee);
    setShowAttendance(true);
  };

  const handleViewSalary = (employee) => {
    setSalaryEmployee(employee);
    setShowSalary(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(salary);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showForm) {
    return (
      <EmployeeForm
        employee={editingEmployee}
        onClose={() => {
          setShowForm(false);
          setEditingEmployee(null);
        }}
        onSuccess={() => {
          setShowForm(false);
          setEditingEmployee(null);
          refetchEmployees();
        }}
      />
    );
  }

  if (showAttendance) {
    return (
      <AttendanceManager
        employee={selectedEmployee}
        onClose={() => {
          setShowAttendance(false);
          setSelectedEmployee(null);
        }}
      />
    );
  }

  if (showSalary) {
    return (
      <EmployeeSalaryModal
        isOpen={showSalary}
        employee={salaryEmployee}
        onClose={() => {
          setShowSalary(false);
          setSalaryEmployee(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Employee Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">Manage employees and track attendance</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {!statsLoading && statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-600">{statistics.active}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Inactive</p>
                  <p className="text-3xl font-bold text-yellow-600">{statistics.inactive}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <UserX className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Terminated</p>
                  <p className="text-3xl font-bold text-red-600">{statistics.terminated}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>

              <select
                value={filters.position}
                onChange={(e) => handleFilterChange('position', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Positions</option>
                <option value="Manager">Manager</option>
                <option value="Chef">Chef</option>
                <option value="Assistant Chef">Assistant Chef</option>
                <option value="Delivery Person">Delivery Person</option>
                <option value="Cashier">Cashier</option>
                <option value="Kitchen Helper">Kitchen Helper</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Waiter/Waitress">Waiter/Waitress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employee List */}
        {employeesLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading employees...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {employeesData?.employees?.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 text-lg font-semibold mb-2">No employees found</p>
                <p className="text-gray-500">Add your first employee to get started</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Salary
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {employeesData?.employees?.map((employee) => (
                          <motion.tr
                            key={employee._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {employee.name}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <Calendar className="w-3 h-3" />
                                  Hired {formatDate(employee.hireDate)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">{employee.position}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center gap-1 mb-1">
                                  <Mail className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs">{employee.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs">{employee.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-gray-900">
                                  {formatSalary(employee.salary)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(employee.status)}`}>
                                {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewSalary(employee)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="View Salary"
                                >
                                  <DollarSign className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleViewAttendance(employee)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Attendance"
                                >
                                  <Calendar className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditEmployee(employee)}
                                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                  title="Edit Employee"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(employee._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Employee"
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

                {/* Pagination */}
                {employeesData?.pagination && employeesData.pagination.pages > 1 && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 font-medium">
                        Showing {((employeesData.pagination.page - 1) * employeesData.pagination.limit) + 1} to{' '}
                        {Math.min(employeesData.pagination.page * employeesData.pagination.limit, employeesData.pagination.total)} of{' '}
                        {employeesData.pagination.total} employees
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFilterChange('page', employeesData.pagination.page - 1)}
                          disabled={employeesData.pagination.page === 1}
                          className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-600 font-medium px-3 flex items-center">
                          Page {employeesData.pagination.page} of {employeesData.pagination.pages}
                        </span>
                        <button
                          onClick={() => handleFilterChange('page', employeesData.pagination.page + 1)}
                          disabled={employeesData.pagination.page === employeesData.pagination.pages}
                          className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;