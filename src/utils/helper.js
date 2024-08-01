import { dateFields } from '../constants/types';

export function formatFieldName(fieldName) {
  // Add a space before each uppercase letter and split into words
  const words = fieldName
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ');

  // Capitalize the first letter of each word and join them back together
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper functions to handle date serialization
export const serializeDate = (date) =>
  date instanceof Date ? date.toISOString() : date;
export const deserializeDate = (isoString) =>
  isoString ? new Date(isoString) : isoString;

export function transformKeys(inputString) {
  // Split the string by underscore, map each part to capitalize the first letter
  // and then join them back with a space.
  return inputString
    .split('_')
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize the first letter and convert the rest to lowercase
    )
    .join(' ');
}

export function extractYearFromDatetime(datetimeStr) {
  // Split the datetime string by '-' and take the first element
  // console.log("datetimeStr-----------------------------",datetimeStr)
  const year = datetimeStr.getFullYear();
  // Parse the year string to integer
  // console.log(year,'year')
  return year;
}

export function getLang() {
  if (navigator.languages != undefined) return navigator.languages[0];
  return navigator.language;
}

export const formatDateToLocaleString = (inputDateTime) => {
  // Input date and time in the format "YYYY-MM-DD HH:mm:ss"
  // const inputDateTime = '2023-05-15 12:30:45';
  // Convert the input date and time to a Date object
  const dateTimeObject = new Date(inputDateTime);
  // Convert the Date object to a new format (e.g., "DD/MM/YYYY HH:mm:ss")
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const currentLocale = getLang() || 'en-US';
  const formattedDateTime = dateTimeObject.toLocaleString(
    currentLocale,
    options
  );
  // console.log(formattedDateTime); // Output: "15/05/2023, 12:30:45"
  return formattedDateTime;
};

export function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

export function constructPayload(data) {
  // Define which fields should be treated as dates

  return Object.keys(data).reduce((acc, key) => {
    const value = data[key];
    if (dateFields.includes(key)) {
      // Only process as a date if the key is explicitly listed as a date field
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        // Check if it's a valid date
        // Check for specific date fields to return date string
        if (
          [
            'START DATE FROM',
            'START DATE TO',
            'Start Date From',
            'Start Date To',
            'Is Create Date From',
            'Is Create Date To',
            'CREATION DATE FROM',
            'Creation Date From',
            'Creation Date To',
            'CREATION DATE TO',
            'POCREATION FROM',
            'POCreation From',
            'POCreation To',
            'POCREATION TO'
          ].includes(key)
        ) {
          // Format date as 'YYYYMMDD'
          const formattedDate =
            date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0');
          acc[key] = formattedDate;
        } else {
          acc[key] = String(date.getFullYear()); // Extract the year for other date fields
        }
      } else {
        acc[key] = value; // If not a valid date, use the value as is
      }
    } else {
      acc[key] = value; // Non-date fields are directly assigned
    }
    return acc;
  }, {});
}

export function validatePayload(formData) {
  const filteredData = {};
  for (const key in formData) {
    const value = formData[key];
    // Trim the value to remove spaces and check if it's not empty or "NaN"
    if (value.trim() !== '' && value.trim() !== 'NaN') {
      filteredData[key] = value;
    }
  }
  return filteredData;
}

export function convertDateFormat(dateStr) {
  // Ensure the input string is exactly 8 characters long
  if (dateStr.length !== 8) {
      return "Invalid date format";
  }

  // Extract year, month, and day from the input string
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  // Format the extracted components into the desired format
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}

// Example usage:
const dateStr = "20240729";
console.log(convertDateFormat(dateStr));  // Output: 29/07/2024
