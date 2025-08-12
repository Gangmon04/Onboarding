import { useState, useEffect, useRef, act } from 'react'
import './App.css'
import { FUNCTION, MODULE_NAMES, FIELD_NAMES, RELATEDLIST_NAMES } from './config'

import CustomSpecialtyDropdown from './CustomSpecialtyDropdown';
import CustomDepartmentDropdown from './CustomDepartmentDropdown';
import CustomDoctorDropdown from './CustomDoctorDropdown';
import CustomDurationDropdown from './CustomDurationDropdown';

function App() {

  // ===== Refs =====
  // const productTypeDropdownRef = useRef(null);
  const doctorDropdownRef = useRef(null);
  const doctorInputRef = useRef(null);
  const specialtyDropdownRef = useRef(null);
  const specialtyInputRef = useRef(null);
  const durationDropdownRef = useRef(null);
  const durationInputRef = useRef(null);
  const departmentDropdownRef = useRef(null);
  const departmentInputRef = useRef(null);

  // ===== App State =====
  const [onboardingData, setOnboardingData] = useState({});
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('onboardingCurrentStep');
    return savedStep ? Number(savedStep) : 1;
  });
  const [isSingleUser, setIsSingleUserState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [profilesAndRoles, setProfilesAndRoles] = useState({ profiles: [], roles: [] });
  const [isSavingDoctor, setIsSavingDoctor] = useState(false);

  // ===== UI State =====
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerType, setBannerType] = useState('success'); // 'success', 'error', or 'warning'

  // ===== Modal States =====
  const [showDoctorsModal, setShowDoctorsModal] = useState(false);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);

  // ===== Doctor Related State =====
  const [doctorFirstName, setDoctorFirstName] = useState('');
  const [doctorLastName, setDoctorLastName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorFirstNameError, setDoctorFirstNameError] = useState('');
  const [doctorLastNameError, setDoctorLastNameError] = useState('');
  const [doctorEmailError, setDoctorEmailError] = useState('');
  const [doctorDepartmentError, setDoctorDepartmentError] = useState('');
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [doctorInputError, setDoctorInputError] = useState("");

  // ===== Department Related State =====
  const [departmentInput, setDepartmentInput] = useState("");
  const [departmentInputError, setDepartmentInputError] = useState("");
  const [departmentSpecialtyInputError, setDepartmentSpecialtyInputError] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // ===== Specialty Related State =====
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [specialtyInputError, setSpecialtyInputError] = useState('');
  const [specialtySearchTerm, setSpecialtySearchTerm] = useState('');
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  // Department Dropdown State
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
  const [departmentOptions, setDepartmentOptions] = useState([]);

  // ===== Product Related State =====
  const [productsInput, setProductsInput] = useState('');
  const [unitPriceInput, setUnitPriceInput] = useState('');
  const [productNameError, setProductNameError] = useState('');
  const [unitPriceError, setUnitPriceError] = useState('');

  // ===== Product Type Related State =====
  const [productTypeError, setProductTypeError] = useState('');
  const [selectedProductType, setSelectedProductType] = useState("Fee");

  // ===== Duration Related State =====
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [durationSearchTerm, setDurationSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [durationOptions, setDurationOptions] = useState([]);
  const [durationInputError, setDurationInputError] = useState("");


  async function executeCRMFunction(functionName, params) {
    try {
      const reqData = {
        arguments: JSON.stringify({
          input: params,
        }),
      };

      const response = await ZOHO.CRM.FUNCTIONS.execute(functionName, reqData);
      if (response && response.details && response.details.output) {
        try {
          const parsedOutput = JSON.parse(response.details.output);
          return parsedOutput;
        } catch (parseError) {
          console.error(`Error parsing Deluge function output for ${functionName}:`, parseError);
          return response.details.output;
        }
      } else if (response && response.details && response.details.error) {
        throw new Error(
          `Deluge function error: ${response.details.error.message || JSON.stringify(response.details.error)
          }`
        );
      } else if (response && response.status === "error") {
        throw new Error(`SDK error: ${response.message || JSON.stringify(response)}`);
      } else {
        return {};
      }
    } catch (error) {
      console.error(`Error in executeCRMFunction for ${functionName}:`, error);
      throw error;
    }
  }

  async function setOnboardCompleted(value) {
    try {
      const valueToSend = value ? "ON" : "OFF";
      const response = await executeCRMFunction(FUNCTION.ZOHO_ORG_VARIABLE_FUNCTION, {
        method: "SET",
        name: "IS_ONBOARD_COMPLETED",
        value: valueToSend,
      });

      console.log("Raw response received in setOnboardCompleted:", response);
      const isSuccess = response && response.value !== undefined;
      return isSuccess;
    } catch (error) {
      console.error("Error setting onboarding completion: ", error);
      return false;
    }
  }
  // ===== Single User Mode Functions =====
  async function setIsSingleUser(value) {
    try {
      const valueToSend = value ? "ON" : "OFF";
      const response = await executeCRMFunction(FUNCTION.ZOHO_ORG_VARIABLE_FUNCTION, {
        method: "SET",
        name: "SINGLE_USER_ORG",
        value: valueToSend,
      });

      console.log("Single user mode updated:", response);
      const isSuccess = response && response.value !== undefined;
      return isSuccess;
    } catch (error) {
      console.error("Error setting single user mode : ", error);
      return false;
    }
  }

  const handleSingleUserChange = async (isChecked) => {
    const success = await setIsSingleUser(isChecked);
    if (success) {
      setIsSingleUserState(isChecked);
      try {
        const response = await ZOHO.CRM.API.getAllUsers({ Type: "AllUsers" });
        console.log("Raw response received in fetchDoctors:", response);
        let hasActiveUsers = false;

        if (response?.users) {
          const activeUsers = response.users.filter(user => user.status === 'active' && user.profile && user.profile.name.toLowerCase() === 'doctor');
          console.log("activeUsers", activeUsers);
          hasActiveUsers = activeUsers.length > 0;
        }

        console.log('hasActiveUsers:', hasActiveUsers);
        const newCompletionStatus = isChecked || hasActiveUsers;

        setOnboardingData(prev => ({
          ...prev,
          [MODULE_NAMES.USERS]: newCompletionStatus
        }));

      } catch (error) {
        console.error("Error fetching active users:", error);

      }
    } else {
      const checkbox = document.getElementById('single-user-checkbox');
      if (checkbox) checkbox.checked = !isChecked;
      console.error("Failed to update single user mode");
    }
  };

  // Utility function to clean and format error messages
  const formatErrorMessage = (error) => {
    let message = "An unexpected error occurred";

    if (typeof error === 'string') {
      message = error;
    } else if (error?.data?.[0]?.message) {
      message = error.data[0].message;
    } else if (error?.message) {
      message = error.message;
    }
    // Clean up the message
    return message
      .replace(/^API_|^[A-Z_]+:\s*/i, '')
      .replace(/\.$/, '')
      .trim()
      .replace(/^\w/, c => c.toUpperCase());
  };
  function resetDoctorsModalFields() {
    setDoctorFirstName('');
    setDoctorLastName('');
    setDoctorEmail('');
    setSelectedDepartment(null);
    setDoctorFirstNameError('');
    setDoctorLastNameError('');
    setDoctorEmailError('');
    setDoctorDepartmentError('');
  }

  //Fetch Doctors
  const fetchDoctors = async () => {
    try {
      const response = await ZOHO.CRM.API.getAllUsers({ Type: "AllUsers" });
      console.log("Raw response received in fetchDoctors:", response);
      if (response && response.users) {
        const activeUsers = response.users.filter(user => user.status === 'active');
        console.log("activeUsers", activeUsers);
        const transformedUsers = activeUsers.map(user => ({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email
        }));
        console.log("Transformed doctors:", transformedUsers);
        setDoctorOptions(transformedUsers);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  //Fetch Specialties
  const fetchSpecialties = async () => {
    try {
      const response = await ZOHO.CRM.API.getAllRecords({ Entity: MODULE_NAMES.SPECIALTY });
      if (response.data) {
        setSpecialtyOptions(response.data);
      }
    } catch (err) {
      console.error("Error fetching specialties:", err);
    }
  };

  //Fetch Duration Options
  const fetchDurationOptions = async () => {
    try {
      const response = await ZOHO.CRM.META.getFields({ Entity: MODULE_NAMES.DEPARTMENT });
      if (response.fields) {
        const durationField = response.fields.find(f => f.api_name === FIELD_NAMES.DURATION);
        if (durationField && durationField.pick_list_values) {
          setDurationOptions(durationField.pick_list_values.map(opt => opt.display_value));
        }
      }
    }
    catch (err) {
      console.error("Error fetching duration options:", err);
    }
  };

  // Fetch department options when component mounts
  const fetchDepartmentOptions = async () => {
    try {
      const response = await ZOHO.CRM.META.getFields({ Entity: MODULE_NAMES.USERS });
      console.log('Fields response:', response);

      const departmentField = response.fields.find(field => field.api_name === 'Department');
      console.log('Department field:', departmentField);

      if (departmentField?.pick_list_values?.length > 0) {
        console.log('Department picklist values:', departmentField.pick_list_values);
        const deptOptions = departmentField.pick_list_values.map(item => ({
          id: item.id,
          name: item.display_value || item.actual_value || ''
        }));
        console.log('Mapped department options:', deptOptions);
        setDepartmentOptions(deptOptions);
      } else {

        console.warn('No department picklist values found or empty');
      }
    } catch (error) {
      console.error('Error in DepartmentOptions:', error);
    }
  };

  const showMessage = (message, options = {}) => {
    const {
      type = 'success',
      duration = type === 'error' || type === 'warning' ? 10000 : 4000
    } = options;

    setBannerMessage(message);
    setBannerType(type);
    setShowBanner(true);

    // Clear any existing timeout
    if (window.messageTimeout) {
      clearTimeout(window.messageTimeout);
    }

    window.messageTimeout = setTimeout(() => {
      setShowBanner(false);
    }, duration);
  };

  // Aliases for convenience
  const showError = (message, duration) => showMessage(message, { type: 'error', duration });
  const showWarning = (message, duration) => showMessage(message, { type: 'warning', duration });
  const totalSteps = 4;

  // Handle auto-navigation when a step is completed
  useEffect(() => {

    // Skip auto-navigation if we're going back
    if (isNavigatingBack) {
      console.log('Skipping auto-nav because isNavigatingBack is true');
      return;
    }

    // Auto-advance when current step is completed
    if (currentStep === 1 && onboardingData?.users) {
      console.log('Auto-advancing from step 1 to 2');
      setCurrentStep(2);
    } else if (currentStep === 2 && onboardingData?.Specialty) {
      console.log('Auto-advancing from step 2 to 3');
      setCurrentStep(3);
    } else if (currentStep === 3 && onboardingData?.Department) {
      console.log('Auto-advancing from step 3 to 4');
      setCurrentStep(4);
    } else {
      console.log('No auto-navigation conditions met');
      console.log('currentStep === 1 && onboardingData?.users:', currentStep === 1 && onboardingData?.users);
      console.log('currentStep === 2 && onboardingData?.Specialty:', currentStep === 2 && onboardingData?.Specialty);
      console.log('currentStep === 3 && onboardingData?.Department:', currentStep === 3 && onboardingData?.Department);
    }
  }, [onboardingData, currentStep, isNavigatingBack]);

  useEffect(() => {
    localStorage.setItem('onboardingCurrentStep', currentStep);
  }, [currentStep]);

  const main = async (data) => {
    console.log(data);
    setOnboardingData(data);
    const isSingleUserValue = data.SINGLE_USER_ORG === "ON" || data.isSingleUserOrg === true;
    setIsSingleUserState(isSingleUserValue);
    setIsLoading(false);
  };

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", main);
    ZOHO.embeddedApp.init();
  }, []);

  //Fetching Profiles and Roles
  useEffect(() => {
    const initializeZoho = async () => {
      try {
        await ZOHO.embeddedApp.init();
        const fetchStaticData = async () => {
          try {
            const profileRoleData = await executeCRMFunction(FUNCTION.GET_PROFILESANDROLES, {});
            const profiles = profileRoleData?.Profiles?.profiles || [];
            const roles = profileRoleData?.Roles?.roles || [];
            setProfilesAndRoles({ profiles, roles });
          } catch (error) {
            console.error("Error fetching profiles and roles:", error);
          }
        };
        fetchStaticData();
      } catch (err) {
        console.error("Error initializing Zoho SDK:", err);
      }
    };

    initializeZoho();
  }, []);

  // Handle click outside for dropdown events
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(event.target)) {
        setIsDoctorDropdownOpen(false);
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
  }, [doctorDropdownRef, specialtyDropdownRef, durationDropdownRef]);


  //Checking Status of each step
  const isStepCompleted = (step) => {
    if (!onboardingData) return false;

    if (step === 1) {
      return onboardingData[MODULE_NAMES.USERS] === true;
    }

    if (step === 2) {
      return onboardingData[MODULE_NAMES.SPECIALTY] === true;
    }

    if (step === 3) {
      return onboardingData[MODULE_NAMES.DEPARTMENT] === true;
    }

    if (step === 4) {
      return onboardingData[MODULE_NAMES.PRODUCTS] === true;
    }

    return false;
  };


  //Handle Next Button
  const handleNext = () => {
    if (!isStepCompleted(currentStep)) {
      showMessage("Please complete this step before proceeding.");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      showMessage("Onboarding completed!");
    }
  };

  const handleBack = () => {
    console.log('handleBack called', {
      currentStep,
      totalSteps,
      isCompleted: isStepCompleted(currentStep),
      isNavigatingBack
    });

    if (currentStep > 1) {
      console.log('Going back from step', currentStep, 'to', currentStep - 1);
      setIsNavigatingBack(true);
      setTimeout(() => {
        console.log('Actually changing step from', currentStep, 'to', currentStep - 1);
        setCurrentStep(prevStep => {
          console.log('setCurrentStep called with prevStep:', prevStep);
          return prevStep - 1;
        });
      }, 0);
    } else {
      console.log('Cannot go back - already at first step');
    }
  };

  const getStepLabel = (step) => {
    const labels = [
      '',
      'Step 1 of 4: Add Your Doctors',
      'Step 2 of 4: Set up your specialties',
      'Step 3 of 4: Create departments',
      'Step 4 of 4: List your products'
    ];
    return labels[step];
  };

  const handleProceed = async () => {
    try {
      const success = await setOnboardCompleted(true);
      if (success) {
        try {
          if (typeof $Client !== 'undefined' && typeof $Client.close === 'function') {
            $Client.close("Completed");
          } else if (window.opener && typeof window.opener.postMessage === 'function') {
            // Fallback for parent window communication
            window.opener.postMessage({ action: 'closeWidget', status: 'Completed' }, '*');
          } else {
            console.warn("$Client.close not available. Using alert instead.");
            showMessage("Onboarding completed successfully!");
          }
        } catch (err) {
          console.error("Error closing widget:", err);
          showMessage("Onboarding completed! You may close this window.");
        }
      } else {
        showMessage("Failed to complete onboarding. Please try again.");

      }
    } catch (err) {
      console.error("Error in handleProceed:", err);
      showError("An error occurred while completing onboarding.");

    }
  };

  // Handle Save Doctor
  const handleSaveDoctor = async () => {
    setIsSavingDoctor(true);

    let valid = true;
    // Reset previous errors
    setDoctorFirstNameError('');
    setDoctorLastNameError('');
    setDoctorEmailError('');
    setDoctorDepartmentError('');

    const trimmedFirstName = doctorFirstName.trim();
    const trimmedLastName = doctorLastName.trim();
    const trimmedEmail = doctorEmail.trim();

    if (!trimmedFirstName) {
      setDoctorFirstNameError('First Name cannot be empty');
      valid = false;
    }

    if (!trimmedLastName) {
      setDoctorLastNameError('Last Name cannot be empty');
      valid = false;
    }

    if (!trimmedEmail) {
      setDoctorEmailError('Email cannot be empty');
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setDoctorEmailError('Invalid email format');
        valid = false;
      }
    }

    if (!selectedDepartment) {
      setDoctorDepartmentError('Please select a department');
      valid = false;
    }

    // If validation fails, stop here
    if (!valid) {
      setIsSavingDoctor(false);
      return;
    }

    try {
      // Use the pre-fetched profiles and roles from the state to avoid an API call
      const { profiles, roles } = profilesAndRoles;
      const doctorProfile = profiles.find(p => p.name?.toLowerCase() === "doctor");
      const doctorRole = roles.find(r => r.name?.toLowerCase() === "doctor");

      if (!doctorProfile) {
        throw new Error("Doctor profile not found. Please create a profile named 'Doctor' in Zoho CRM.");
      }

      if (!doctorRole) {
        throw new Error("Doctor role not found. Please create a role named 'Doctor' in Zoho CRM.");
      }

      const doctorUser = {
        [FIELD_NAMES.FIRST_NAME]: trimmedFirstName,
        [FIELD_NAMES.LAST_NAME]: trimmedLastName,
        [FIELD_NAMES.EMAIL]: trimmedEmail.toLowerCase(),
        [FIELD_NAMES.ROLE]: { id: doctorRole.id },
        [FIELD_NAMES.PROFILE]: { id: doctorProfile.id },
        [FIELD_NAMES.DEPARTMENT]: selectedDepartment.name
      };

      const insertResp = await ZOHO.CRM.API.insertRecord({
        Entity: MODULE_NAMES.USERS,
        APIData: doctorUser,
        trigger: undefined
      });

      if (insertResp?.data?.[0]?.code === "SUCCESS" || (insertResp?.users?.[0]?.code === "SUCCESS")) {
        setDoctorFirstName('');
        setDoctorLastName('');
        setDoctorEmail('');
        setSelectedDepartment(null);
        setShowDoctorsModal(false);

        // Update onboarding data and mark step 1 as completed.
        setOnboardingData(prev => ({
          ...prev,
          [MODULE_NAMES.USERS]: true
        }));

        // Refresh doctors list to get the latest count of doctors
        await fetchDoctors();
        showMessage('Doctor added successfully!');

        if (currentStep === 1) {
          setCurrentStep(2);
        }

      } else {
        const errorMessage = insertResp?.data?.[0]?.message || insertResp?.users?.[0]?.message || 'Failed to add doctor';
        showError(errorMessage);
        console.error("API Response Error:", insertResp);
      }
    } catch (err) {
      console.error('Error in handleSaveDoctor:', err);
      const errorMessage = formatErrorMessage(err) || 'An error occurred while saving the doctor';
      showWarning(errorMessage);
    } finally {
      setIsSavingDoctor(false);
    }
  };

  // Handle Save Specialty
  const handleSaveSpecialty = async () => {
    setSpecialtyInputError('');

    // Validate input
    const trimmedInput = specialtyInput.trim();
    if (!trimmedInput) {
      const errorMessage = 'Specialty name cannot be empty';
      setSpecialtyInputError(errorMessage);
      return;
    }

    try {
      // Make API call to save specialty
      const response = await ZOHO.CRM.API.insertRecord({
        Entity: MODULE_NAMES.SPECIALTY,
        APIData: { [FIELD_NAMES.SPECIALTY_NAME]: trimmedInput },
        trigger: undefined
      });

      // Handle successful response
      if (response.data?.[0]?.code === "SUCCESS") {
        const successMessage = 'Specialty added successfully';
        showMessage(successMessage);

        // Update state and reset form
        setOnboardingData(prev => ({ ...prev, Specialty: true }));
        setSpecialtyInput('');
        setShowSpecialtyModal(false);

        if (currentStep === 2) {
          setCurrentStep(3);
        }
      } else {
        const errorMessage = response?.data?.[0]?.message || response?.users?.[0]?.message || 'Failed to add Specialty';
        setSpecialtyInputError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      console.error('Error saving specialty:', err);
      const errorMessage = formatErrorMessage(err) || 'An error occurred while saving the specialty';
      setSpecialtyInputError(errorMessage);
      showWarning(errorMessage);
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
        // Show success message and close modal
        showMessage('Department added successfully!');
        resetDepartmentModalFields();
        setShowDepartmentModal(false);
        setDepartmentInput("");
        setSelectedSpecialty("");
        setSelectedDoctors([]);
        setSelectedDuration("");
        setDepartmentInputError("");
        setDepartmentSpecialtyInputError("");
        setDoctorInputError("");
        setDurationInputError("");

        // Mark department step as completed
        setOnboardingData(prev => ({
          ...prev,
          [MODULE_NAMES.DEPARTMENT]: true
        }));

        await fetchDoctors();

        if (currentStep === 3) {
          setCurrentStep(4);
        }
      } else {
        const errorMessage = response?.data?.[0]?.message || response?.users?.[0]?.message || 'Failed to add Department';
        console.error("API Error Response:", errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      console.error("Error Saving Department:", err);
      const errorMessage = formatErrorMessage(err) || "Failed to save department";
      showWarning(errorMessage);
    }
  };

  //Handle Save Products
  const handleSaveProducts = async () => {
    let hasError = false;
    setProductNameError('');
    setProductTypeError('');
    setUnitPriceError('');

    if (!productsInput.trim()) {
      setProductNameError('Product Name cannot be empty');
      hasError = true;
    }

    if (!selectedProductType) {
      setProductTypeError('Product Type cannot be empty');
      hasError = true;
    }

    if (!unitPriceInput.trim()) {
      setUnitPriceError('Unit Price cannot be empty.');
      hasError = true;
    }

    else if (isNaN(parseFloat(unitPriceInput))) {
      setUnitPriceError('Unit Price must be a valid number.');
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await ZOHO.CRM.API.insertRecord({
        Entity: MODULE_NAMES.PRODUCTS,
        APIData: {
          [FIELD_NAMES.PRODUCT_NAME]: productsInput.trim(),
          [FIELD_NAMES.PRODUCT_TYPE]: "Fee",
          [FIELD_NAMES.UNIT_PRICE]: parseFloat(unitPriceInput)
        },
        trigger: undefined
      });

      if (response.data && response.data[0].code === "SUCCESS") {
        const successMessage = "Product added successfully";
        // Show success message for 4 seconds (4000ms) for products
        showMessage(successMessage, 4000);
        setOnboardingData(prev => ({ ...prev, Products: true }));

        // Clear errors first
        setProductNameError('');
        setProductTypeError('');
        setUnitPriceError('');
        setShowProductsModal(false);
        setProductsInput('');
        setSelectedProductType('');
        setUnitPriceInput('');

        // if (currentStep === 4) {
        //   handleProceed();
        // }

      } else {
        const errorMessage = response?.data?.[0]?.message || response?.users?.[0]?.message || 'Failed to add Products';
        showWarning(errorMessage);
        console.error("API Response Error:", response);
      }
    } catch (err) {
      console.log('Error Inserting Record:', err);
      const errorMessage = formatErrorMessage(err) || 'An error occurred while saving the product';
      showWarning(errorMessage);
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
      {showBanner && (
        <div className={`banner ${bannerType}-banner`}>
          <div className='banner-icon'>
            {bannerType === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : bannerType === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
          </div>
          <span>{bannerMessage}</span>
          <button
            className="close-btn"
            onClick={() => setShowBanner(false)}
            aria-label="Close"
            data-testid="close-banner"
          >
            &times;
          </button>
        </div>
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
        <div id="users" className={`container-card doctors ${currentStep === 1 ? '' : 'hidden'}`} onClick={() => { fetchDepartmentOptions(); setShowDoctorsModal(true) }}>
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
          onClick={() => { setShowProductsModal(true); setSelectedProductType("Fee") }}
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
            <div className='modal-contentgroup'>
              <div className='fields'>
                <div className='fields-label'>First Name</div>
                <div className='fields-input-wrapper'>
                  <input
                    type="text"
                    value={doctorFirstName}
                    onChange={e => setDoctorFirstName(e.target.value)}
                    className={!doctorFirstName.trim() || doctorFirstNameError ? 'error' : ''}
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
                    className={!doctorLastName.trim() || doctorLastNameError ? 'error' : ''}
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
                    className={!doctorEmail.trim() || doctorEmailError ? 'error' : ''}
                  />
                  {doctorEmailError && <div className="field-error">{doctorEmailError}</div>}
                </div>
              </div>

              <div className='fields'>
                <div className='fields-label'>Department</div>
                <div className='fields-input-wrapper'>
                  <div ref={departmentDropdownRef} className="custom-dropdown-wrapper">
                    <div
                      className={`custom-dropdown-selected${!selectedDepartment ? " error-border-left" : ""}`}
                      onClick={() => setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
                    >
                      <span>{selectedDepartment ? selectedDepartment.name : 'Select Department'}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    {isDepartmentDropdownOpen && (
                      <CustomDepartmentDropdown
                        inputRef={departmentInputRef}
                        dropdownRef={departmentDropdownRef}
                        options={departmentOptions}
                        searchTerm={departmentSearchTerm}
                        setSearchTerm={setDepartmentSearchTerm}
                        selected={selectedDepartment?.id}
                        setSelected={(deptId) => {
                          const dept = departmentOptions.find(d => d.id === deptId);
                          setSelectedDepartment(dept || null);
                        }}
                        closeDropdown={() => setIsDepartmentDropdownOpen(false)}
                        openUpward={true}
                      />
                    )}
                  </div>
                  {doctorDepartmentError && <div className="field-error">{doctorDepartmentError}</div>}
                </div>
              </div>
              <div className='buttons'>
                <button className="cancelbutton" onClick={() => { resetDoctorsModalFields(); setShowDoctorsModal(false); }}>Cancel</button>
                <button className="addbuton" onClick={handleSaveDoctor} disabled={isSavingDoctor}> {isSavingDoctor ? "Saving..." : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSpecialtyModal && (
        <div className="modal-overlay">
          {/* <div className="modal-content"> */}
          <div className='modal-Specialtygroup'>
            <h2>Add Specialty</h2>
            <div className='fields'>
              <div className='fields-label'>Specialty</div>
              <div className='fields-input-wrapper'>
                <input
                  type="text"
                  value={specialtyInput}
                  onChange={e => {
                    setSpecialtyInput(e.target.value);
                    if (specialtyInputError) setSpecialtyInputError('');
                  }}
                  className={!specialtyInput.trim() || specialtyInputError ? 'error' : ''}
                />
                {specialtyInputError && <div className="field-error">{specialtyInputError}</div>}
              </div>
            </div>
            <div className='buttons'>
              <button className="cancelbutton" onClick={() => { setShowSpecialtyModal(false); setSpecialtyInputError(''); setSpecialtyInput(''); }}>Cancel</button>
              <button className="addbuton" onClick={handleSaveSpecialty}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showDepartmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className='modal-contentgroup'>
              <h2>Add Department</h2>
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
              <button className="cancelbutton" onClick={() => { resetDepartmentModalFields(); setShowDepartmentModal(false); }} style={{ marginTop: '10px' }}>Cancel</button>
              <button className="addbuton" onClick={handleSaveDepartment} style={{ marginTop: '10px' }}>save</button>
            </div>

          </div>
        </div>
      )}

      {showProductsModal && (
        <div className="modal-overlay">
          {/* <div className='modal-content'> */}
          <div className='modal-Productgroup'>
            <h2>Add Products</h2>
            <div className='fields'>
              <div className='fields-label'><label>Product Name</label></div>
              <div className='fields-input-wrapper'>
                <input type="text" className={`product-modal-input${productNameError ? ' error-border-left' : ''}`} value={productsInput} onChange={e => setProductsInput(e.target.value)} placeholder='e.g, Consultation' />
                {productNameError && <div className="field-error">{productNameError}</div>}
              </div>
            </div>
            <div className='fields'>
              <div className='fields-label'><label>Product Type</label></div>
              <div className='fields-input-wrapper locked-input-wrapper'>
                <input
                  type="text"
                  value={selectedProductType}
                  disabled
                  className="product-modal-input"
                  aria-label="Product Type (read-only)"
                />
                <span className="lock-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.6667 7.33333H12V5.33333C12 3.12419 10.2091 1.33333 8 1.33333C5.79086 1.33333 4 3.12419 4 5.33333V7.33333H3.33333C2.59695 7.33333 2 7.93029 2 8.66667V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V8.66667C14 7.93029 13.403 7.33333 12.6667 7.33333ZM10.6667 7.33333H5.33333V5.33333C5.33333 3.86057 6.52724 2.66667 8 2.66667C9.47276 2.66667 10.6667 3.86057 10.6667 5.33333V7.33333Z" fill="#000" />
                  </svg>
                </span>
                {productTypeError && <div className="field-error">{productTypeError}</div>}
              </div>
            </div>
            <div className='fields'>
              <div className='fields-label'><label>Unit Price</label></div>
              <div className='fields-input-wrapper'>
                <input type="text" className={`product-modal-input${unitPriceError ? ' error-border-left' : ''}`} value={unitPriceInput} onChange={e => setUnitPriceInput(e.target.value)} />
                {unitPriceError && <div className="field-error">{unitPriceError}</div>}
              </div>
            </div>

            <div className='buttons'>
              <button className="cancelbutton" onClick={() => {
                setShowProductsModal(false);
                setProductsInput('');
                setSelectedProductType("Fee");
                setUnitPriceInput('');
                setProductNameError('');
                setProductTypeError('');
                setUnitPriceError('');
              }}>Cancel</button>
              <button className="addbuton" onClick={handleSaveProducts}>Save</button>
            </div>
          </div>
          {/* </div> */}
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