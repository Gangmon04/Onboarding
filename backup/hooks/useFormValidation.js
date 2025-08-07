import { useState } from 'react';

export function useFormValidation() {
  // Doctor Form
  const [doctorFirstName, setDoctorFirstName] = useState('');
  const [doctorLastName, setDoctorLastName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorFirstNameError, setDoctorFirstNameError] = useState('');
  const [doctorLastNameError, setDoctorLastNameError] = useState('');
  const [doctorEmailError, setDoctorEmailError] = useState('');
  const [doctorDepartmentError, setDoctorDepartmentError] = useState('');
  
  // Department Form
  const [departmentInput, setDepartmentInput] = useState("");
  const [departmentInputError, setDepartmentInputError] = useState("");
  const [departmentSpecialtyInputError, setDepartmentSpecialtyInputError] = useState("");
  
  // Product Form
  const [productsInput, setProductsInput] = useState('');
  const [unitPriceInput, setUnitPriceInput] = useState('');
  const [productNameError, setProductNameError] = useState('');
  const [productTypeError, setProductTypeError] = useState('');
  const [unitPriceError, setUnitPriceError] = useState('');
  
  // Other
  const [doctorInputError, setDoctorInputError] = useState("");
  const [durationInputError, setDurationInputError] = useState("");
  const [specialtyInputError, setSpecialtyInputError] = useState('');

  // Reset doctor form fields
  const resetDoctorsModalFields = () => {
    setDoctorFirstName('');
    setDoctorLastName('');
    setDoctorEmail('');
    setDoctorFirstNameError('');
    setDoctorLastNameError('');
    setDoctorEmailError('');
    setDoctorDepartmentError('');
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate doctor form
  const validateDoctorForm = (selectedDepartment) => {
    let isValid = true;
    
    if (!doctorFirstName.trim()) {
      setDoctorFirstNameError('First name is required');
      isValid = false;
    } else {
      setDoctorFirstNameError('');
    }
    
    if (!doctorLastName.trim()) {
      setDoctorLastNameError('Last name is required');
      isValid = false;
    } else {
      setDoctorLastNameError('');
    }
    
    if (!doctorEmail) {
      setDoctorEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(doctorEmail)) {
      setDoctorEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setDoctorEmailError('');
    }
    
    if (!selectedDepartment) {
      setDoctorDepartmentError('Department is required');
      isValid = false;
    } else {
      setDoctorDepartmentError('');
    }
    
    return isValid;
  };

  // Validate product form
  const validateProductForm = (selectedProductType) => {
    let isValid = true;
    
    if (!productsInput.trim()) {
      setProductNameError('Product name is required');
      isValid = false;
    } else {
      setProductNameError('');
    }
    
    if (!selectedProductType) {
      setProductTypeError('Product type is required');
      isValid = false;
    } else {
      setProductTypeError('');
    }
    
    if (!unitPriceInput) {
      setUnitPriceError('Unit price is required');
      isValid = false;
    } else if (isNaN(unitPriceInput) || parseFloat(unitPriceInput) <= 0) {
      setUnitPriceError('Please enter a valid price');
      isValid = false;
    } else {
      setUnitPriceError('');
    }
    
    return isValid;
  };

  // Handle form key down for submission
  const handleFormKeyDown = (e, onSubmit) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (onSubmit) onSubmit();
      return false;
    }
  };

  return {
    // Doctor Form
    doctorFirstName,
    setDoctorFirstName,
    doctorLastName,
    setDoctorLastName,
    doctorEmail,
    setDoctorEmail,
    doctorFirstNameError,
    doctorLastNameError,
    doctorEmailError,
    doctorDepartmentError,
    setDoctorDepartmentError,
    
    // Department Form
    departmentInput,
    setDepartmentInput,
    departmentInputError,
    setDepartmentInputError,
    departmentSpecialtyInputError,
    setDepartmentSpecialtyInputError,
    
    // Product Form
    productsInput,
    setProductsInput,
    unitPriceInput,
    setUnitPriceInput,
    productNameError,
    productTypeError,
    unitPriceError,
    
    // Other
    doctorInputError,
    setDoctorInputError,
    durationInputError,
    setDurationInputError,
    specialtyInputError,
    setSpecialtyInputError,
    
    // Methods
    resetDoctorsModalFields,
    validateDoctorForm,
    validateProductForm,
    handleFormKeyDown
  };
}
