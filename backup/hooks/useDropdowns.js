import { useState, useEffect, useRef } from 'react';
import { fetchAllUsers, fetchAllRecords, fetchPicklistValues } from '../utils/api';
import { MODULE_NAMES, FIELD_NAMES } from '../config';

export function useDropdowns() {
  // Refs for dropdowns
  const productTypeDropdownRef = useRef(null);
  const productTypeInputRef = useRef(null);
  const doctorDropdownRef = useRef(null);
  const doctorInputRef = useRef(null);
  const specialtyDropdownRef = useRef(null);
  const specialtyInputRef = useRef(null);
  const durationDropdownRef = useRef(null);
  const durationInputRef = useRef(null);

  // Dropdown states
  const [isProductTypeDropdownOpen, setIsProductTypeDropdownOpen] = useState(false);
  const [productTypeSearchTerm, setProductTypeSearchTerm] = useState('');
  const [productTypeOptions, setProductTypeOptions] = useState([]);
  
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [doctorOptions, setDoctorOptions] = useState([]);
  
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [specialtySearchTerm, setSpecialtySearchTerm] = useState('');
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [durationSearchTerm, setDurationSearchTerm] = useState('');
  const [durationOptions, setDurationOptions] = useState([]);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await fetchAllUsers();
      if (response?.users) {
        const activeUsers = response.users.filter(user => user.status === 'active');
        const transformedUsers = activeUsers.map(user => ({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email
        }));
        setDoctorOptions(transformedUsers);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  // Fetch specialties
  const fetchSpecialties = async () => {
    try {
      const response = await fetchAllRecords(MODULE_NAMES.SPECIALTY);
      if (response?.data) {
        setSpecialtyOptions(response.data);
      }
    } catch (err) {
      console.error("Error fetching specialties:", err);
    }
  };

  // Fetch duration options
  const fetchDurationOptions = async () => {
    const options = await fetchPicklistValues(MODULE_NAMES.DEPARTMENT, FIELD_NAMES.DURATION);
    setDurationOptions(options);
  };

  // Fetch product type options
  const fetchProductTypeOptions = async () => {
    const options = await fetchPicklistValues(MODULE_NAMES.PRODUCTS, FIELD_NAMES.PRODUCT_TYPE);
    setProductTypeOptions(options);
    return options;
  };

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(event.target)) {
        setIsDoctorDropdownOpen(false);
      }

      if (productTypeDropdownRef.current && !productTypeDropdownRef.current.contains(event.target)) {
        setIsProductTypeDropdownOpen(false);
      }

      if (specialtyDropdownRef.current && !specialtyDropdownRef.current.contains(event.target)) {
        setIsSpecialtyDropdownOpen(false);
      }

      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) {
        setIsDurationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize data
  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
    fetchDurationOptions();
    fetchProductTypeOptions();
  }, []);

  return {
    // Refs
    productTypeDropdownRef,
    productTypeInputRef,
    doctorDropdownRef,
    doctorInputRef,
    specialtyDropdownRef,
    specialtyInputRef,
    durationDropdownRef,
    durationInputRef,
    
    // Product Type
    isProductTypeDropdownOpen,
    setIsProductTypeDropdownOpen,
    productTypeSearchTerm,
    setProductTypeSearchTerm,
    productTypeOptions,
    setProductTypeOptions,
    
    // Doctor
    isDoctorDropdownOpen,
    setIsDoctorDropdownOpen,
    doctorSearchTerm,
    setDoctorSearchTerm,
    doctorOptions,
    setDoctorOptions,
    
    // Specialty
    isSpecialtyDropdownOpen,
    setIsSpecialtyDropdownOpen,
    specialtySearchTerm,
    setSpecialtySearchTerm,
    specialtyOptions,
    setSpecialtyOptions,
    
    // Duration
    isDurationDropdownOpen,
    setIsDurationDropdownOpen,
    durationSearchTerm,
    setDurationSearchTerm,
    durationOptions,
    setDurationOptions,
    
    // Methods
    fetchDoctors,
    fetchSpecialties,
    fetchDurationOptions,
    fetchProductTypeOptions
  };
}
