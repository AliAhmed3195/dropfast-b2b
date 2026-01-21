/**
 * Phone Number Validation Utility
 * 
 * Rules:
 * - Only digits allowed in input (user can only type digits)
 * - Automatic formatting with +, brackets, and spaces
 * - Minimum 11 digits
 * - Maximum 15 digits
 */

/**
 * Clean phone number - remove spaces, +, and other non-digit characters
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

/**
 * Format phone number automatically
 * Formats as: +1 (XXX) XXX-XXXX for 11 digits starting with 1
 * Otherwise formats based on length
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  if (cleaned.length === 0) return '';
  
  // Format for US numbers (11 digits starting with 1)
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Format for other lengths
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `+${cleaned.slice(0, cleaned.length - 3)} (${cleaned.slice(cleaned.length - 3)}`;
  } else if (cleaned.length <= 10) {
    return `+${cleaned.slice(0, cleaned.length - 7)} (${cleaned.slice(cleaned.length - 7, cleaned.length - 4)}) ${cleaned.slice(cleaned.length - 4)}`;
  } else {
    // For numbers longer than 10 digits
    return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(cleaned.length - 10, cleaned.length - 7)}) ${cleaned.slice(cleaned.length - 7, cleaned.length - 4)}-${cleaned.slice(cleaned.length - 4)}`;
  }
}

/**
 * Allow only digits in input - filters out non-digit characters
 */
export function allowOnlyDigits(value: string): string {
  return value.replace(/[^\d]/g, '');
}

/**
 * Validate phone number
 * @param phone - Phone number string
 * @returns Object with isValid and error message
 */
export function validatePhoneNumber(phone: string): {
  isValid: boolean;
  error?: string;
  cleaned?: string;
} {
  if (!phone || phone.trim() === '') {
    return { isValid: true }; // Optional field, empty is valid
  }

  const cleaned = cleanPhoneNumber(phone);
  const digitCount = cleaned.length;

  if (digitCount < 11) {
    return {
      isValid: false,
      error: 'Phone number must have at least 11 digits',
      cleaned,
    };
  }

  if (digitCount > 15) {
    return {
      isValid: false,
      error: 'Phone number must not exceed 15 digits',
      cleaned,
    };
  }

  // Check if contains only digits (after cleaning)
  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Phone number can only contain digits (spaces and + are allowed but will be removed)',
      cleaned,
    };
  }

  return { isValid: true, cleaned };
}
