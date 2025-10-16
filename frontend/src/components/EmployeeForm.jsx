import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  X,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation
} from '../lib/api';

const EmployeeForm = ({ employee, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    salary: '',
    hireDate: '',
    status: 'active',
    address: {
      street: '',
      city: '',
      postalCode: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const isEditing = !!employee;

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || '',
        salary: employee.salary || '',
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
        status: employee.status || 'active',
        address: {
          street: employee.address?.street || '',
          city: employee.address?.city || '',
          postalCode: employee.address?.postalCode || ''
        },
        emergencyContact: {
          name: employee.emergencyContact?.name || '',
          phone: employee.emergencyContact?.phone || '',
          relationship: employee.emergencyContact?.relationship || ''
        },
        notes: employee.notes || ''
      });
    } else {
      // Set default hire date to today for new employees
      setFormData(prev => ({
        ...prev,
        hireDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.position) {
      newErrors.position = 'Position is required';
    }

    if (!formData.salary || isNaN(formData.salary) || formData.salary <= 0) {
      newErrors.salary = 'Please enter a valid salary';
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        salary: parseFloat(formData.salary)
      };

      if (isEditing) {
        await updateEmployee({ id: employee._id, ...submitData }).unwrap();
      } else {
        await createEmployee(submitData).unwrap();
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving employee:', error);
      setErrors({ submit: error.data?.error || 'Failed to save employee' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const positions = [
    'Manager',
    'Chef',
    'Assistant Chef',
    'Delivery Person',
    'Cashier',
    'Kitchen Helper',
    'Cleaner',
    'Waiter/Waitress'
  ];

  const relationships = [
    'Spouse',
    'Parent',
    'Child',
    'Sibling',
    'Friend',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Employees
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <User className="text-orange-500" />
            {isEditing ? 'Edit Employee' : 'Add New Employee'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Update employee information' : 'Enter employee details to add them to the system'}
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.position ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select position</option>
                      {positions.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  </div>
                  {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.salary ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter salary"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hire Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.hireDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.hireDate && <p className="text-red-500 text-sm mt-1">{errors.hireDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Address Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter street address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-orange-500" />
                Emergency Contact
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter contact name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter contact phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <select
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select relationship</option>
                    {relationships.map(relationship => (
                      <option key={relationship} value={relationship}>{relationship}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter any additional notes about the employee"
                maxLength="500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.notes.length}/500 characters
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditing ? 'Update Employee' : 'Create Employee'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeForm;