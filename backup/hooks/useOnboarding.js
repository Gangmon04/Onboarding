import { useState, useEffect } from 'react';
import { setOnboardCompleted } from '../utils/api';

export function useOnboarding() {
  const [onboardingData, setOnboardingData] = useState({});
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('onboardingCurrentStep');
    return savedStep ? Number(savedStep) : 1;
  });
  const [isSingleUser, setIsSingleUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const totalSteps = 4;

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem('onboardingCurrentStep', currentStep);
  }, [currentStep]);

  // Show success/error message
  const showMessage = (message, duration = 5000) => {
    setSuccessMessage(message);
    setShowSuccessBanner(true);
    const timer = setTimeout(() => setShowSuccessBanner(false), duration);
    return () => clearTimeout(timer);
  };

  // Check if a step is completed
  const isStepCompleted = (step, data = onboardingData) => {
    if (!data) return false;

    const stepData = {
      1: !!data.users,
      2: !!data.Specialty,
      3: !!data.Department,
      4: !!data.Products
    };

    return stepData[step] || step < currentStep;
  };

  // Handle navigation
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
    if (currentStep > 1) {
      setIsNavigatingBack(true);
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  // Handle completion of onboarding
  const handleProceed = async () => {
    try {
      const success = await setOnboardCompleted(true);
      if (success) {
        try {
          if (typeof $Client !== 'undefined' && typeof $Client.close === 'function') {
            $Client.close("Completed");
          } else if (window.opener && typeof window.opener.postMessage === 'function') {
            window.opener.postMessage({ action: 'closeWidget', status: 'Completed' }, '*');
          } else {
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
      showMessage("An error occurred while completing onboarding.");
    }
  };

  // Get step label
  const getStepLabel = (step) => {
    const labels = [
      '',
      'Step 1 of 4: Add Your Doctors',
      'Step 2 of 4: Set up your specialties',
      'Step 3 of 4: Create departments',
      'Step 4 of 4: List your products'
    ];
    return labels[step] || '';
  };

  // Initialize onboarding
  const initializeOnboarding = (data) => {
    setOnboardingData(data);
    setIsSingleUser(data.SINGLE_USER_ORG === "ON" || data.isSingleUserOrg === true);
    setIsLoading(false);
  };

  return {
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
    setShowSuccessBanner,
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
  };
}
