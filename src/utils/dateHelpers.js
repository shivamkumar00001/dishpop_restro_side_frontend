/**
 * Date Helper Utilities
 * Functions for date formatting and manipulation
 */

/**
 * Format date to Indian locale
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-IN', {
    ...defaultOptions,
    ...options,
  });
}

/**
 * Format time
 */
export function formatTime(date, options = {}) {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Date(date).toLocaleTimeString('en-IN', {
    ...defaultOptions,
    ...options,
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
}

/**
 * Check if date is today
 */
export function isToday(date) {
  const today = new Date();
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === yesterday.getDate() &&
    checkDate.getMonth() === yesterday.getMonth() &&
    checkDate.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Get start of day
 */
export function getStartOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function getEndOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get date range for filter
 */
export function getDateRange(filter) {
  const now = new Date();
  
  switch (filter) {
    case 'today':
      return {
        startDate: getStartOfDay(now),
        endDate: getEndOfDay(now),
      };
    
    case 'yesterday':
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        startDate: getStartOfDay(yesterday),
        endDate: getEndOfDay(yesterday),
      };
    
    case 'week':
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);
      return {
        startDate: getStartOfDay(weekStart),
        endDate: getEndOfDay(now),
      };
    
    case 'month':
      const monthStart = new Date(now);
      monthStart.setMonth(monthStart.getMonth() - 1);
      return {
        startDate: getStartOfDay(monthStart),
        endDate: getEndOfDay(now),
      };
    
    case 'all':
    default:
      return {
        startDate: null,
        endDate: null,
      };
  }
}

/**
 * Format duration (in milliseconds)
 */
export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Parse date string safely
 */
export function parseDate(dateString) {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Get fiscal year
 */
export function getFiscalYear(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth();
  
  // Indian fiscal year: April to March
  if (month >= 3) { // April (3) to December (11)
    return `${year}-${year + 1}`;
  } else { // January (0) to March (2)
    return `${year - 1}-${year}`;
  }
}

/**
 * Get month name
 */
export function getMonthName(monthIndex, short = false) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const shortMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return short ? shortMonths[monthIndex] : months[monthIndex];
}

/**
 * Format for bill number (YYMMDD format)
 */
export function formatForBillNumber(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear().toString().slice(-2);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  
  return `${year}${month}${day}`;
}

export default {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  isToday,
  isYesterday,
  getStartOfDay,
  getEndOfDay,
  getDateRange,
  formatDuration,
  parseDate,
  getFiscalYear,
  getMonthName,
  formatForBillNumber,
};