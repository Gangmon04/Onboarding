import { useEffect, useState } from 'react';
import './App.css';
import { MODULE_NAMES } from './config';
import { useOnboarding } from './hooks/useOnboarding';
import { useDropdowns } from './hooks/useDropdowns';
import { useFormValidation } from './hooks/useFormValidation';
import DepartmentSelect from './departmentSelect';
import CustomSpecialtyDropdown from './CustomSpecialtyDropdown';
import CustomDoctorDropdown from './CustomDoctorDropdown';
import CustomProductTypeDropdown from './CustomProductTypeDropdown';
import CustomDurationDropdown from './CustomDurationDropdown';

function App() {
  // Use custom hooks
  const {
    // State
    onboardingData,
    setOnboardingData,
    currentStep,
    setCurrentStep,
    isSingleUser,
    setIsSingleUser,
    isLoading,
    isNavigatingBack,
    setIsNavigatingBack,
    showSuccessBanner,
    successMessage,
    totalSteps,
    
    // Methods
    showMessage,
    isStepCompleted,
    handleNext,
    handleBack,
    handleProceed,
    getStepLabel,
    initializeOnboarding
  } = useOnboarding();

  // Modal states
  const [showDoctorsModal, setShowDoctorsModal] = useState(false);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);

  // Use dropdowns hook
  const {
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
    
    // Doctor
    isDoctorDropdownOpen,
    setIsDoctorDropdownOpen,
    doctorSearchTerm,
    setDoctorSearchTerm,
    doctorOptions,
    selectedDoctors,
    setSelectedDoctors,
    
    // Specialty
    isSpecialtyDropdownOpen,
    setIsSpecialtyDropdownOpen,
    specialtySearchTerm,
    setSpecialtySearchTerm,
    specialtyOptions,
    
    // Duration
    isDurationDropdownOpen,
    setIsDurationDropdownOpen,
    durationSearchTerm,
    setDurationSearchTerm,
    durationOptions,
    
    // Methods
    fetchDoctors,
    fetchSpecialties,
    fetchDurationOptions,
    fetchProductTypeOptions
  } = useDropdowns();

  // Use form validation hook
  const {
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
    resetDoctorsModalFields: resetDoctorForm,
    validateDoctorForm,
    validateProductForm,
    handleFormKeyDown
  } = useFormValidation();
  
  // Local state for dropdown selections
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');

  // ===== Effect Hooks =====
  
  // Track selected doctors changes
  useEffect(() => {
    console.log('Selected Doctors Updated:', selectedDoctors);
  }, [selectedDoctors]);

  // Track doctor dropdown state
  useEffect(() => {
    if (isDoctorDropdownOpen) {
      console.log('doctorOptions when dropdown opens:', doctorOptions);
    }
  }, [isDoctorDropdownOpen, doctorOptions]);

  // Initialize Zoho embedded app
  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", main);
    ZOHO.embeddedApp.init();
  }, []);

  // Handle click outside for dropdown events
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
    
    // Add click outside listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [doctorDropdownRef, productTypeDropdownRef, specialtyDropdownRef, durationDropdownRef]);

  // ===== API Functions =====
  // Moved to src/utils/api.js

  // ===== Data Fetching Functions =====
  // Moved to src/hooks/useDropdowns.js

  // ===== UI Components =====

  // Success banner component
  const SuccessBanner = ({ message, onClose }) => {
    return (
      <div className="success-banner" data-testid="success-banner">
        <span>{message}</span>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close"
          data-testid="close-banner"
        >
          &times;
        </button>
      </div>
    );
  };

  // ===== Utility Functions =====
  // Moved to src/hooks/useFormValidation.js and src/hooks/useOnboarding.js

  // ===== Event Handlers =====
  // Moved to src/hooks/useOnboarding.js

  // Zoho embedded app initialization
  const main = (data) => {
    console.log(data);
    setOnboardingData(data);
    setIsSingleUser(data.SINGLE_USER_ORG === "ON" || data.isSingleUserOrg === true);
    setIsLoading(false);
  };


  //Handle Save Doctor
  const handleSaveDoctor = async () => {
    let valid = true;
    if (!doctorFirstName.trim()) {
      setDoctorFirstNameError('First Name cannot be empty.');
      valid = false;
    } else {
      setDoctorFirstNameError('');
    }

    if (!doctorLastName.trim()) {
      setDoctorLastNameError('Last Name cannot be empty.');
      valid = false;
    } else {
      setDoctorLastNameError('');
    }

    if (!doctorEmail.trim()) {
      setDoctorEmailError('Email cannot be empty.');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(doctorEmail)) {
      setDoctorEmailError('Please enter a valid email address.');
      valid = false;
    } else {
      setDoctorEmailError('');
    }

    if (!selectedDepartment) {
      setDoctorDepartmentError('Department cannot be empty.');
      valid = false;
    } else {
      setDoctorDepartmentError('');
    }

    if (!valid) return;
    try {

      const profileRoleData = await executeCRMFunction(FUNCTION.GET_PROFILESANDROLES, {});
      console.log("Parsed Deluge Function Response (profileRoleData):", profileRoleData);
      const profiles = profileRoleData?.Profiles?.profiles || [];
      console.log("Extracted Profiles Array:", profiles);
      const roles = profileRoleData?.Roles?.roles || [];
      console.log("Extracted Roles Array:", roles);
      const doctorProfile = profiles.find(profile =>
        profile.name?.toLowerCase() === "doctor"
      );
      const doctorRole = roles.find(role =>
        role.name?.toLowerCase() === "doctor"
      );

      if (!doctorProfile) {
        showMessage("Doctor profile not found. Please create a profile named 'Doctor' in Zoho CRM.");
        return;
      }

      if (!doctorRole) {
        showMessage("Doctor role not found. Please create a role named 'Doctor' in Zoho CRM.");
        return;
      }

      const doctorUser = {
        [FIELD_NAMES.FIRST_NAME]: doctorFirstName.trim(),
        [FIELD_NAMES.LAST_NAME]: doctorLastName.trim(),
        [FIELD_NAMES.EMAIL]: doctorEmail.trim(),
        [FIELD_NAMES.ROLE]: { id: doctorRole.id },
        [FIELD_NAMES.PROFILE]: { id: doctorProfile.id },
        [FIELD_NAMES.DEPARTMENT]: selectedDepartment.name
      };
      console.log("DoctorUser", doctorUser);
      console.log("Department name:", selectedDepartment.name, "Department id:", selectedDepartment.id);

      const insertResp = await ZOHO.CRM.API.insertRecord({
        Entity: MODULE_NAMES.USERS,
        APIData: doctorUser,
        trigger: undefined
      });

      if ((insertResp && insertResp.code === "SUCCESS") ||
        (insertResp.users && insertResp.users.length > 0 && insertResp.users[0].code === "SUCCESS")) {
        // Reset form fields
        setDoctorFirstName('');
        setDoctorLastName('');
        setDoctorEmail('');
        setSelectedDepartment(null);
        setShowDoctorsModal(false);
        setOnboardingData(prev => ({
          ...prev,
          users: true
        }));

        // Refresh doctors list
        await fetchDoctors();

        // Show success message
        showMessage("Doctor added successfully.");
        setShowSuccessBanner(true);

        // Navigate to next step after a short delay
        setTimeout(() => {
          setShowSuccessBanner(false);
          // Move to next step if not on the last step
          if (currentStep < 4) {
            setCurrentStep(prevStep => prevStep + 1);
          }
        }, 1000);
      }
      else {
        const errorMessage = (insertResp?.data?.[0]?.details?.Error) || (insertResp?.data?.[0]?.message) || "Unknown error";
        console.error("Error inserting record (Doctor):", insertResp);
        showMessage(`Failed to create doctor user`);
      }
    } catch (error) {
      console.error("handleSaveDoctor error:", error);
      showMessage("An unexpected error occurred while saving");
    }
  };

  //Hanldle Save Specialty
  const handleSaveSpecialty = async () => {
    setSpecialtyInputError('');

    const trimmedInput = specialtyInput.trim();
    if (!trimmedInput) {
      setSpecialtyInputError('Specialty Name cannot be empty.');
      showMessage('Please enter a specialty name.');
      return;
    }

    try {
      const response = await ZOHO.CRM.API.insertRecord({
        Entity: MODULE_NAMES.SPECIALTY,
        APIData: { [FIELD_NAMES.SPECIALTY_NAME]: trimmedInput },
        trigger: undefined
      });

      if (response.data && response.data[0].code === "SUCCESS") {
        showMessage('Specialty added successfully!');
        setOnboardingData(prev => ({ ...prev, Specialty: true }));
        setSpecialtyInput('');
        setShowSpecialtyModal(false);
        // Hide success message and navigate to next step after a short delay
        setTimeout(() => {
          setShowSuccessBanner(false);
          // Move to next step if not on the last step
          if (currentStep < 4) {
            setCurrentStep(prevStep => prevStep + 1);
          }
        }, 1000);

        // Refresh specialties list
        await fetchSpecialties();
      } else {
        showMessage('Failed to add specialty. Please try again.');

      }
    } catch (err) {
      console.error("Error inserting record (Specialty):", err);
      showMessage('An error occurred while adding the specialty.');

    }
  };

  //Handle Save Department
  const handleSaveDepartment = async () => {
    let valid = true;

    if (!departmentInput.trim()) {
      setDepartmentInputError("Department name cannot be empty.");
      valid = false;
    } else {
      setDepartmentInputError("");
    }

    if (!selectedSpecialty) {
      setDepartmentSpecialtyInputError("Please select a specialty.");
      valid = false;
    } else {
      setDepartmentSpecialtyInputError("");
    }

    if (selectedDoctors.length === 0) {
      setDoctorInputError("Please select at least one doctor.");
      valid = false;
    } else {
      setDoctorInputError("");
    }

    if (!selectedDuration) {
      setDurationInputError("Please select a duration.");
      valid = false;
    } else {
      setDurationInputError("");
    }

    if (!valid) return;

    console.log("[DEBUG] Selected Doctors:", selectedDoctors);
    try {

      const doctorsArrayForMultiSelect = selectedDoctors;
      const payload = {
        [FIELD_NAMES.DEPARTMENT_NAME]: departmentInput.trim(),
        [FIELD_NAMES.SPECIALTY]: { id: selectedSpecialty },
        [FIELD_NAMES.DOCTOR]: doctorsArrayForMultiSelect,
        [FIELD_NAMES.DURATION]: selectedDuration,
      };
      console.log("[DEBUG] Department Payload:", payload);

      const response = await ZOHO.CRM.API.insertRecord({
        Entity: MODULE_NAMES.DEPARTMENT,
        APIData: payload,
        trigger: [],
      });
      console.log("Inserted Record:", response);
      console.log("[DEBUG] Zoho API Response:", response);

      //Link doctors to department via Departments_X_Users
      const departmentId = response.data[0]?.details?.id;
      if (departmentId && selectedDoctors.length > 0) {
        for (const doctorId of selectedDoctors) {
          try {
            const doctorObj = doctorOptions.find(doc => doc.id === doctorId);
            const linkPayload = {
              [FIELD_NAMES.DOCTOR_S]: {
                module: "Users",
                name: doctorObj?.full_name || doctorObj?.first_name || doctorObj?.name || "",
                id: doctorId
              },
              [FIELD_NAMES.USER_LOOKUP_DEPARTMENT]: {
                module: MODULE_NAMES.CUSTOM_MODULE_42,
                name: departmentInput?.trim() || "",
                id: departmentId
              }
            };
            console.log('[DEBUG] Linking payload:', linkPayload);
            const linkResp = await ZOHO.CRM.API.insertRecord({
              Entity: RELATEDLIST_NAMES.DEPARTMENTS_X_USERS,
              APIData: linkPayload,
              trigger: []
            });
            console.log(`[DEBUG] Linked Doctor ${doctorId} to Department ${departmentId}:`, linkResp);
          } catch (linkErr) {
            console.error(`[ERROR] Linking Doctor ${doctorId} to Department ${departmentId}:`, linkErr);
          }
        }
      }
      if (response.data && response.data[0].code === "SUCCESS") {
        showMessage("Department added successfully!");
        setOnboardingData((prev) => ({ ...prev, Department: true }));
        setShowDepartmentModal(false);
        setDepartmentInput("");
        setSelectedSpecialty("");
        setSelectedDoctors([]);
        setSelectedDuration("");
        setDepartmentInputError("");
        setDepartmentSpecialtyInputError("");
        setDoctorInputError("");
        setDurationInputError("");
        setShowDepartmentModal(false);
        await fetchDoctors();
        setTimeout(() => {
          setShowSuccessBanner(false);
          if (currentStep < 4) {
            setCurrentStep(prevStep => prevStep + 1);
          }
        }, 1000);
      } else {
        showMessage("Failed to add department. Please try again.");
      }
    } catch (err) {
      console.error("[DEBUG] Zoho API Error:", err);
      showMessage(`Failed to save department`);
    }
  };

  //Handle Save Products
  const handleSaveProducts = async () => {
    let hasError = false;
    setProductNameError('');
    setProductTypeError('');
    setUnitPriceError('');

    if (!productsInput.trim()) {
      setProductNameError('Product Name is required.');
      showMessage('Please enter a product name');
      hasError = true;
    }

    if (!selectedProductType) {
      setProductTypeError('Product Type is required.');
      if (!hasError) {
        showMessage('Please select a product type');
      }
      hasError = true;
    }

    if (!unitPriceInput.trim()) {
      setUnitPriceError('Unit Price is required.');
      if (!hasError) {
        showMessage('Please enter a unit price');
      }
      hasError = true;
    }

    else if (isNaN(parseFloat(unitPriceInput))) {
      setUnitPriceError('Unit Price must be a valid number.');
      if (!hasError) {
        showMessage('Please enter a valid number for unit price');
      }
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await ZOHO.CRM.API.insertRecord({
        Entity: MODULE_NAMES.PRODUCTS,
        APIData: {
          [FIELD_NAMES.PRODUCT_NAME]: productsInput.trim(),
          [FIELD_NAMES.PRODUCT_TYPE]: selectedProductType,
          [FIELD_NAMES.UNIT_PRICE]: parseFloat(unitPriceInput)
        },
        trigger: undefined
      });

      if (response.data && response.data[0].code === "SUCCESS") {
        showMessage("Product Added Successfully!");
        setOnboardingData(prev => ({ ...prev, Products: true }));
        setShowProductsModal(false);
        setProductsInput('');
        setSelectedProductType('');
        setUnitPriceInput('');
        setProductNameError('');
        setProductTypeError('');
        setUnitPriceError('');

        // Hide success message and navigate to next step after a short delay
        setTimeout(() => {
          setShowSuccessBanner(false);
          if (currentStep < 4) {
            setCurrentStep(prevStep => prevStep + 1);
          }
        }, 1000);
      } else {
        showMessage("Failed to add product. Please try again.");
      }
    } catch (err) {
      console.error("Error inserting record (Products):", err);
      showMessage("Something went wrong. Please try again later.");

    }
  };

  function resetDepartmentModalFields() {
    setDepartmentInput("");
    setDepartmentInputError("");
    setDepartmentSpecialtyInputError("");
    setDoctorInputError("");
    setDurationInputError("");
    setSelectedSpecialty("");
    setSelectedDoctors([]);
    setSelectedDuration("");
  }


  if (isLoading) {
    return (
      <div className="loader-container">
        <span className="loader"></span>
      </div>
    );
  }
  console.log('onboardingData at render:', onboardingData);

  return (
    <div className="main-container show">
      {showSuccessBanner && (
        <SuccessBanner
          message={successMessage}
          onClose={() => setShowSuccessBanner(false)}
        />
      )}

      <div className="header-container">
        <h1 className="heading">Let's get started!</h1>
        <h3 className="sub-heading">Complete these quick steps before creating a record for your patient.</h3>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          {[1, 2, 3, 4].map((step) => {
            const isCompleted = isStepCompleted(step);
            const isCurrent = currentStep === step;
            const isBeforeCurrent = step < currentStep;
            const isAfterCurrent = step > currentStep;

            // Determine progress line classes
            const progressLineClasses = [
              step === 1 ? 'start' : '',
              step === 4 ? 'end' : '',
              isCompleted && isBeforeCurrent ? 'completed' : '',
              (isBeforeCurrent || isCurrent) ? 'active' : ''
            ].filter(Boolean).join(' ');

            // Determine step classes
            const stepClasses = [
              isCompleted ? 'completed' : '',
              isCurrent ? 'active' : ''
            ].filter(Boolean).join(' ');

            return (
              <div key={step} className="progress-section">
                <div className="progress-label-static">
                  {step === 1 && "Add Your Doctors"}
                  {step === 2 && "Set up your specialties"}
                  {step === 3 && "Create departments"}
                  {step === 4 && "List your products"}
                </div>
                <div className={`progress-line ${progressLineClasses}`}></div>
                <div className={`progress-step ${stepClasses}`}>
                  <span className="step-icon">✔</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container-grid">
        {/* Step 1: Add Your Doctors */}
        <div id="users" className={`container-card doctors ${currentStep === 1 ? '' : 'hidden'}`} onClick={() => { setShowDoctorsModal(true) }}> {/* Removed fetchDepartmentOptions from here as it's handled by DepartmentSelect */}
          <div className="card-layout step-row">
            <div className="text-content">
              <h3 className="card-title">Add Your Doctors</h3>
              <p className="card-description">
                Create user profiles for your doctors. Add them as new users and choose their user role, profile, and
                department.
              </p>
              <div className="single-user-container">
                <input
                  type="checkbox"
                  name="single-user"
                  id="single-user-checkbox"
                  checked={isSingleUser}
                  onChange={(e) => handleSingleUserChange(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
                <label className="single-user">I am the only user and will also act as a doctor.</label>
              </div>
            </div>
            <div className="image-wrapper">
              <img className="help" src="assets/doctors.png" alt="Doctors" />
            </div>
          </div>
          <div className="step-buttons bottom-align"></div>
          <span className={`card-icon ${isStepCompleted(1) ? 'completed' : ''}`}></span>
          <h4 className="settings-path">Settings &gt; General &gt; User</h4>
        </div>

        {/* Step 2: Set up your specialties */}
        <div
          id="Specialty"
          className={`container-card specialties ${currentStep === 2 ? '' : 'hidden'}`}
          onClick={() => setShowSpecialtyModal(true)}
        >
          <div className="card-layout">
            <div className="text-content">
              <h3 className="card-title">Set up your Specialties</h3>
              <p className="card-description">Add the specialties offered in your healthcare organization.</p>
            </div>
            <div className="image-wrapper">
              <img className="help" src="assets/Specialities.png" alt="Specialty" />
            </div>
          </div>
          <span className={`card-icon ${isStepCompleted(2) ? 'completed' : ''}`}></span>
          <h4 className="settings-path">Create Menu &gt; Add Specialities</h4>
        </div>

        {/* Step 3: Create departments */}
        <div
          id="Department"
          className={`container-card departments ${currentStep === 3 ? '' : 'hidden'}`}
          onClick={() => { fetchSpecialties(); fetchDoctors(); fetchDurationOptions(); setShowDepartmentModal(true); }}
        >
          <div className="card-layout">
            <div className="text-content">
              <h3 className="card-title">Create departments</h3>
              <p className="card-description">Create departments for the specialties offered in your organization.</p>
            </div>
            <div className="image-wrapper">
              <img className="help" src="assets/departments.png" alt="Departments" />
            </div>
          </div>
          <span className={`card-icon ${isStepCompleted(3) ? 'completed' : ''}`}></span>
          <h4 className="settings-path">Create Menu &gt; Add Department</h4>
        </div>

        {/* Step 4: List your products */}
        <div
          id="Products"
          className={`container-card products ${currentStep === 4 ? '' : 'hidden'}`}
          onClick={() => { setShowProductsModal(true); fetchProductTypeOptions() }}
        >
          <div className="card-layout">
            <div className="text-content">
              <h3 className="card-title">List your products</h3>
              <p className="card-description">Create product lists by entering the essential product and pricing information.</p>
            </div>
            <div className="image-wrapper">
              <img className="help" src="assets/Products.png" alt="Products" />
            </div>
          </div>
          <span className={`card-icon ${isStepCompleted(4) ? 'completed' : ''}`}></span>
          <h4 className="settings-path">Create Menu &gt; Add Product</h4>
        </div>
      </div>

      {showDoctorsModal && (
        <div className="modal-overlay">
          <div className='modal-content'>
            <h2>Add Doctors</h2>
            <div
              className='modal-contentgroup'
              onKeyDown={handleFormKeyDown}
              tabIndex="0"
            >
              <div className='fields'>
                <div className='fields-label'>First Name</div>
                <div className='fields-input-wrapper'>
                  <input
                    type="text"
                    value={doctorFirstName}
                    onChange={e => setDoctorFirstName(e.target.value)}
                    onKeyDown={inputKeyDown}
                    className={!doctorFirstName.trim() || doctorFirstNameError ? 'error' : ''}
                    aria-label="Doctor's first name"
                  />
                  {doctorFirstNameError && <div className="field-error">{doctorFirstNameError}</div>}
                </div>
              </div>

              <div className='fields'>
                <div className='fields-label'>Last Name</div>
                <div className='fields-input-wrapper'>
                  <input
                    type="text"
                    value={doctorLastName}
                    onChange={e => setDoctorLastName(e.target.value)}
                    onKeyDown={inputKeyDown}
                    className={!doctorLastName.trim() || doctorLastNameError ? 'error' : ''}
                    aria-label="Doctor's last name"
                  />
                  {doctorLastNameError && <div className="field-error">{doctorLastNameError}</div>}
                </div>
              </div>

              <div className='fields'>
                <div className='fields-label'>Email</div>
                <div className='fields-input-wrapper'>
                  <input
                    type="email"
                    value={doctorEmail}
                    onChange={e => setDoctorEmail(e.target.value)}
                    onKeyDown={inputKeyDown}
                    className={!doctorEmail.trim() || doctorEmailError ? 'error' : ''}
                    aria-label="Doctor's email address"
                  />
                  {doctorEmailError && <div className="field-error">{doctorEmailError}</div>}
                </div>
              </div>

              <div className='fields'>
                <div className='fields-label'>Department</div>
                <div className='fields-input-wrapper'>
                  <DepartmentSelect
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                  />
                  {doctorDepartmentError && <div className="field-error">{doctorDepartmentError}</div>}
                </div>
              </div>
              <div className='buttons'>
                <button className="cancelbutton" onClick={() => { resetDoctorsModalFields(); setShowDoctorsModal(false); }}>Cancel</button>
                <button className="addbuton" onClick={handleSaveDoctor}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSpecialtyModal && (
        <div className="modal-overlay">
          <div className='modal-content'>
            <h2>Add Specialty</h2>
            <div
              className='modal-contentgroup'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveSpecialty();
                }
              }}
              tabIndex="0"
            >
              <div className='fields'>
                <div className='fields-label'><label htmlFor="specialtyInput">Specialty</label></div>
                <div className='fields-input-wrapper'>
                  <input
                    id="specialtyInput"
                    type="text"
                    value={specialtyInput}
                    onChange={e => {
                      setSpecialtyInput(e.target.value);
                      if (specialtyInputError) setSpecialtyInputError('');
                    }}
                    className={`${!specialtyInput.trim() || specialtyInputError ? 'error error-border-left' : ''}`}
                    aria-label="Specialty name"
                    aria-invalid={!!specialtyInputError}
                    aria-required="true"
                    autoFocus
                  />
                  {specialtyInputError && <div className="field-error" role="alert">{specialtyInputError}</div>}
                </div>
              </div>
              <div className='buttons'>
                <button type="button" className="cancelbutton"
                  onClick={() => {
                    setShowSpecialtyModal(false);
                    setSpecialtyInputError('');
                    setSpecialtyInput('');
                  }}
                >
                  Cancel
                </button>
                <button type="button" className="addbuton" onClick={handleSaveSpecialty}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDepartmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Department</h2>
            <div className='modal-contentgroup' onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSaveDepartment();
              }
            }}
              tabIndex="0"
            >
              <div className='fields'>
                <div className='fields-label'><label>Department</label></div>
                <div className='fields-input-wrapper'>
                  <input
                    type="text"
                    value={departmentInput}
                    onChange={e => {
                      setDepartmentInput(e.target.value);
                      if (departmentInputError) setDepartmentInputError("");
                    }}
                    className={!departmentInput.trim() || departmentInputError ? "error-border-left" : ""}
                    aria-label="Department name"
                    aria-invalid={!!departmentInputError}
                    aria-required="true"
                    autoFocus
                  />
                  {departmentInputError && <div className="field-error">{departmentInputError}</div>}
                </div>
              </div>

              <div className='fields'>
                <div className='fields-label'><label>Specialty</label></div>
                <div className='fields-input-wrapper'>
                  <div ref={specialtyDropdownRef} className="custom-dropdown-wrapper">
                    <div
                      className={`custom-dropdown-selected${!selectedSpecialty || departmentSpecialtyInputError ? " error-border-left" : ""}`}
                      onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
                    >
                      <span>{selectedSpecialty ? (specialtyOptions.find(s => s.id === selectedSpecialty)?.Name || 'Select Specialty') : 'Select Specialty'}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    {isSpecialtyDropdownOpen && (
                      <CustomSpecialtyDropdown
                        inputRef={specialtyInputRef}
                        dropdownRef={specialtyDropdownRef}
                        options={specialtyOptions}
                        searchTerm={specialtySearchTerm}
                        setSearchTerm={setSpecialtySearchTerm}
                        selected={selectedSpecialty}
                        setSelected={setSelectedSpecialty}
                        closeDropdown={() => setIsSpecialtyDropdownOpen(false)}
                        openUpward={true}
                      />
                    )}
                  </div>
                  {departmentSpecialtyInputError && <div className="field-error">{departmentSpecialtyInputError}</div>}
                </div>
              </div>
              <div className='fields'>
                <div className='fields-label'><label>Doctor(s)</label></div>
                <div className='fields-input-wrapper'>
                  <div ref={doctorDropdownRef} className="custom-dropdown-wrapper">
                    <div
                      className={`custom-dropdown-selected${selectedDoctors.length === 0 || doctorInputError ? " error-border-left" : ""}`}
                      onClick={() => setIsDoctorDropdownOpen(!isDoctorDropdownOpen)}
                    >
                      <span>
                        {selectedDoctors.length === 0 ? 'Select Doctor(s)' : doctorOptions.filter(d => selectedDoctors.includes(d.id)).map(d => d.full_name || d.name).join(', ')}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    {isDoctorDropdownOpen && (
                      <CustomDoctorDropdown
                        inputRef={doctorInputRef}
                        dropdownRef={doctorDropdownRef}
                        options={doctorOptions}
                        selected={selectedDoctors}
                        setSelected={setSelectedDoctors}
                        searchTerm={doctorSearchTerm}
                        setSearchTerm={setDoctorSearchTerm}
                        closeDropdown={() => setIsDoctorDropdownOpen(false)}
                        openUpward={true}
                      />
                    )}
                  </div>
                  {doctorInputError && <div className="field-error">{doctorInputError}</div>}
                </div>
              </div>
              <div className='fields'>
                <div className='fields-label'><label>Duration</label></div>
                <div className='fields-input-wrapper'>
                  <div ref={durationDropdownRef} className="custom-dropdown-wrapper">
                    <div
                      className={`custom-dropdown-selected${!selectedDuration || durationInputError ? " error-border-left" : ""}`}
                      onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                    >
                      <span>{selectedDuration || 'Select Duration'}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    {isDurationDropdownOpen && (
                      <CustomDurationDropdown
                        inputRef={durationInputRef}
                        dropdownRef={durationDropdownRef}
                        options={durationOptions}
                        searchTerm={durationSearchTerm}
                        setSearchTerm={setDurationSearchTerm}
                        selected={selectedDuration}
                        setSelected={setSelectedDuration}
                        closeDropdown={() => setIsDurationDropdownOpen(false)}
                      />
                    )}
                  </div>
                  {durationInputError && <div className="field-error">{durationInputError}</div>}
                </div>
              </div>
            </div>
            <div className='buttons'>
              <button type="button" className="cancelbutton" onClick={() => { resetDepartmentModalFields(); setShowDepartmentModal(false); }} style={{ marginTop: '10px' }}>Cancel</button>
              <button type="button" className="addbuton" onClick={handleSaveDepartment} style={{ marginTop: '10px' }}>save</button>
            </div>

          </div>
        </div>
      )}

      {showProductsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Products</h2>
            <div
              className='modal-contentgroup'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSaveProducts();
                }
              }}
              tabIndex="0"
            >
              <div className='fields'>
                <div className='fields-label'><label htmlFor="productName">Product Name</label></div>
                <div className='fields-input-wrapper'>
                  <input
                    id="productName"
                    type="text"
                    className={`product-modal-input${productNameError ? ' error-border-left' : ''}`}
                    value={productsInput}
                    onChange={e => {
                      setProductsInput(e.target.value);
                      if (productNameError) setProductNameError('');
                    }}
                    placeholder='Consultation'
                    aria-label="Product name"
                    aria-invalid={!!productNameError}
                    aria-required="true"
                    autoFocus
                  />
                  {productNameError && <div className="field-error" role="alert">{productNameError}</div>}
                </div>
              </div>

              <div className='fields'>
                <div className='fields-label'><label htmlFor="productType">Product Type</label></div>
                <div className='fields-input-wrapper'>
                  <div ref={productTypeDropdownRef} className="custom-dropdown-wrapper">
                    <div
                      id="productType"
                      className={`custom-dropdown-selected ${isProductTypeDropdownOpen ? 'open' : ''} ${!selectedProductType || productTypeError ? 'error-border-left' : ''}`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!isProductTypeDropdownOpen) {
                          await fetchProductTypeOptions();
                        }
                        setIsProductTypeDropdownOpen(prev => !prev);
                      }}
                      role="button"
                      aria-haspopup="listbox"
                      aria-expanded={isProductTypeDropdownOpen}
                      aria-owns="productType-dropdown"
                      aria-label={selectedProductType || 'Select Product Type'}
                    >
                      <span>{selectedProductType || 'Select Product Type'}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="dropdown-arrow"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    {isProductTypeDropdownOpen && (
                      <CustomProductTypeDropdown
                        inputRef={productTypeInputRef}
                        dropdownRef={productTypeDropdownRef}
                        options={productTypeOptions}
                        selected={selectedProductType}
                        setSelected={(value) => {
                          setSelectedProductType(value);
                          setIsProductTypeDropdownOpen(false);
                          if (productTypeError) setProductTypeError('');
                        }}
                        searchTerm={productTypeSearchTerm}
                        setSearchTerm={setProductTypeSearchTerm}
                        closeDropdown={() => setIsProductTypeDropdownOpen(false)}
                        openUpward={true}
                        error={productTypeError}
                      />
                    )}
                  </div>
                  {productTypeError && <div className="field-error" role="alert">{productTypeError}</div>}
                </div>
              </div>

              <div className='fields'>
                <div className='fields-label'><label htmlFor="unitPrice">Unit Price</label></div>
                <div className='fields-input-wrapper'>
                  <input
                    id="unitPrice"
                    type="text"
                    className={`product-modal-input${unitPriceError ? ' error-border-left' : ''}`}
                    value={unitPriceInput}
                    onChange={e => {
                      setUnitPriceInput(e.target.value);
                      if (unitPriceError) setUnitPriceError('');
                    }}
                    aria-label="Unit price"
                    aria-invalid={!!unitPriceError}
                    aria-required="true"
                  />
                  {unitPriceError && <div className="field-error" role="alert">{unitPriceError}</div>}
                </div>
              </div>

              <div className='buttons'>
                <button
                  type="button"
                  className="cancelbutton"
                  onClick={() => {
                    setShowProductsModal(false);
                    setProductsInput('');
                    setSelectedProductType('');
                    setUnitPriceInput('');
                    setProductNameError('');
                    setProductTypeError('');
                    setUnitPriceError('');
                  }}
                >
                  Cancel
                </button>
                <button type="button" className="addbuton" onClick={handleSaveProducts}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bottom-nav">
        <span className="progress-label">{getStepLabel(currentStep)}</span>
        <button
          className={`next-button global-next${currentStep === totalSteps ? " proceed-button" : ""}${!isStepCompleted(currentStep) ? " inactive" : ""}`}
          onClick={isStepCompleted(currentStep) ? (currentStep === totalSteps ? handleProceed : handleNext) : undefined}>
          {currentStep === totalSteps ? "Proceed" : "Next"}
        </button>
      </div>

      {(currentStep > 1 || (currentStep === totalSteps && isStepCompleted(totalSteps))) && (
        <button
          className="nav-arrow global-back"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Back button clicked');
            handleBack();
          }}
          aria-label="Previous step"
        >
          <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
            <path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App