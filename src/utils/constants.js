export const DISH_STATUS = {
  READY: 'Ready',
  PROCESSING: 'Processing',
  FAILED: 'Failed',
  OUT_OF_STOCK: 'Out of Stock'
};

export const STATUS_COLORS = {
  Ready: {
    bg: 'bg-green-500/20',
    text: 'text-green-500',
    border: 'border-green-500'
  },
  Processing: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-500',
    border: 'border-yellow-500'
  },
  Failed: {
    bg: 'bg-red-500/20',
    text: 'text-red-500',
    border: 'border-red-500'
  },
  'Out of Stock': {
    bg: 'bg-gray-500/20',
    text: 'text-gray-500',
    border: 'border-gray-500'
  }
};

export const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price (Low-High)' },
  { value: 'price-desc', label: 'Price (High-Low)' },
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' }
];

export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
};