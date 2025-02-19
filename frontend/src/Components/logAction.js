// loggingService.js
import axios from "axios";

const logAction = async (action, details) => {
  const log = {
    action,
    details,
    adminUsername: getAddminUsername(),
    timestamp: new Date().toISOString(),
  };

  try {
    await axios.post('http://localhost:3001/logs', log);
  } catch (error) {
    console.error("Error logging action:", error);
  }
};

const getAddminUsername = () => {
  // Retrieve admin ID from localStorage or auth context
  return localStorage.getItem('adminUsername') || 'unknown';
};

export default logAction;
