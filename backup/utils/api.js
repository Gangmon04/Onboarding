import { FUNCTION, MODULE_NAMES, FIELD_NAMES } from '../config';

/**
 * Execute a Zoho CRM function
 * @param {string} functionName - The name of the Zoho CRM function to execute
 * @param {Object} params - Parameters to pass to the function
 * @returns {Promise<Object>} - The parsed response from the function
 */
export async function executeCRMFunction(functionName, params) {
  try {
    const reqData = {
      arguments: JSON.stringify({
        input: params,
      }),
    };

    const response = await ZOHO.CRM.FUNCTIONS.execute(functionName, reqData);
    
    if (response && response.details && response.details.output) {
      try {
        return JSON.parse(response.details.output);
      } catch (parseError) {
        console.error(`Error parsing Deluge function output for ${functionName}:`, parseError);
        return response.details.output;
      }
    } else if (response && response.details && response.details.error) {
      throw new Error(
        `Deluge function error: ${response.details.error.message || JSON.stringify(response.details.error)}`
      );
    } else if (response && response.status === "error") {
      throw new Error(`SDK error: ${response.message || JSON.stringify(response)}`);
    }
    return {};
  } catch (error) {
    console.error(`Error in executeCRMFunction for ${functionName}:`, error);
    throw error;
  }
}

/**
 * Set the onboarding completion status
 * @param {boolean} value - Whether onboarding is completed
 * @returns {Promise<boolean>} - True if the operation was successful
 */
export async function setOnboardCompleted(value) {
  try {
    const valueToSend = value ? "ON" : "OFF";
    const response = await executeCRMFunction(FUNCTION.ZOHO_ORG_VARIABLE_FUNCTION, {
      method: "SET",
      name: "IS_ONBOARD_COMPLETED",
      value: valueToSend,
    });

    console.log("Raw response received in setOnboardCompleted (parsed Deluge output):", response);
    return response && response.value !== undefined;
  } catch (error) {
    console.error("Error setting onboarding completion (JavaScript): ", error);
    return false;
  }
}

// Data fetching functions
export async function fetchAllUsers() {
  try {
    return await ZOHO.CRM.API.getAllUsers({ Type: "AllUsers" });
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

export async function fetchAllRecords(entity) {
  try {
    return await ZOHO.CRM.API.getAllRecords({ Entity: entity });
  } catch (error) {
    console.error(`Error fetching records for ${entity}:`, error);
    throw error;
  }
}

export async function fetchPicklistValues(entity, fieldName) {
  try {
    const response = await ZOHO.CRM.META.getFields({ Entity: entity });
    if (response.fields) {
      const field = response.fields.find(f => f.api_name === fieldName);
      return field?.pick_list_values?.map(opt => opt.display_value) || [];
    }
    return [];
  } catch (error) {
    console.error(`Error fetching picklist values for ${fieldName} in ${entity}:`, error);
    return [];
  }
}
