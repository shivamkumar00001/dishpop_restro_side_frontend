/**
 * Bill Calculations Utility
 * Pure functions for calculating bill amounts
 */

/**
 * Calculate discount amount
 */
export function calculateDiscount(subtotal, discount, discountType) {
  if (discountType === 'PERCENTAGE') {
    return (subtotal * discount) / 100;
  } else if (discountType === 'FIXED') {
    return discount;
  }
  return 0;
}

/**
 * Calculate service charge
 */
export function calculateServiceCharge(amount, serviceChargeRate, enabled = false) {
  if (!enabled) return 0;
  return (amount * serviceChargeRate) / 100;
}

/**
 * Calculate tax amount
 */
export function calculateTax(amount, taxRate) {
  return (amount * taxRate) / 100;
}

/**
 * Calculate total taxes
 */
export function calculateTotalTaxes(taxableAmount, taxes = []) {
  return taxes.reduce((total, tax) => {
    return total + calculateTax(taxableAmount, tax.rate);
  }, 0);
}

/**
 * Calculate grand total
 */
export function calculateGrandTotal(bill) {
  const {
    subtotal = 0,
    discount = 0,
    discountType = 'NONE',
    serviceCharge = { enabled: false, rate: 0 },
    taxes = [],
    additionalCharges = [],
  } = bill;

  // Calculate discount
  const discountAmount = calculateDiscount(subtotal, discount, discountType);
  const afterDiscount = subtotal - discountAmount;

  // Calculate service charge
  const serviceChargeAmount = calculateServiceCharge(
    afterDiscount,
    serviceCharge.rate,
    serviceCharge.enabled
  );
  
  // Taxable amount
  const taxableAmount = afterDiscount + serviceChargeAmount;

  // Calculate taxes
  const totalTax = calculateTotalTaxes(taxableAmount, taxes);

  // Additional charges
  const additionalTotal = additionalCharges.reduce(
    (sum, charge) => sum + (charge.amount || 0),
    0
  );

  // Grand total (rounded)
  const grandTotal = taxableAmount + totalTax + additionalTotal;
  return Math.round(grandTotal);
}

/**
 * Calculate bill breakdown
 */
export function calculateBillBreakdown(bill) {
  const {
    subtotal = 0,
    discount = 0,
    discountType = 'NONE',
    serviceCharge = { enabled: false, rate: 0 },
    taxes = [],
    additionalCharges = [],
  } = bill;

  const discountAmount = calculateDiscount(subtotal, discount, discountType);
  const afterDiscount = subtotal - discountAmount;
  
  const serviceChargeAmount = calculateServiceCharge(
    afterDiscount,
    serviceCharge.rate,
    serviceCharge.enabled
  );
  
  const taxableAmount = afterDiscount + serviceChargeAmount;
  
  const taxBreakdown = taxes.map(tax => ({
    ...tax,
    amount: calculateTax(taxableAmount, tax.rate),
  }));
  
  const totalTax = taxBreakdown.reduce((sum, tax) => sum + tax.amount, 0);
  
  const additionalTotal = additionalCharges.reduce(
    (sum, charge) => sum + (charge.amount || 0),
    0
  );

  const grandTotal = Math.round(taxableAmount + totalTax + additionalTotal);
  const roundingAdjustment = grandTotal - (taxableAmount + totalTax + additionalTotal);

  return {
    subtotal,
    discountAmount,
    afterDiscount,
    serviceChargeAmount,
    taxableAmount,
    taxBreakdown,
    totalTax,
    additionalTotal,
    grandTotal,
    roundingAdjustment,
  };
}

/**
 * Validate bill data
 */
export function validateBillData(bill) {
  const errors = [];

  if (!bill.tableNumber) {
    errors.push('Table number is required');
  }

  if (!bill.customerName || bill.customerName.trim() === '') {
    errors.push('Customer name is required');
  }

  if (!bill.phoneNumber || bill.phoneNumber.trim() === '') {
    errors.push('Phone number is required');
  }

  if (!bill.items || bill.items.length === 0) {
    errors.push('At least one item is required');
  }

  if (bill.items) {
    bill.items.forEach((item, index) => {
      if (!item.itemId) {
        errors.push(`Item ${index + 1}: Item ID is required`);
      }
      if (!item.name) {
        errors.push(`Item ${index + 1}: Name is required`);
      }
      if (!item.qty || item.qty <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
      if (!item.unitPrice || item.unitPrice <= 0) {
        errors.push(`Item ${index + 1}: Unit price must be greater than 0`);
      }
      if (!item.totalPrice || item.totalPrice <= 0) {
        errors.push(`Item ${index + 1}: Total price must be greater than 0`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format currency
 */
export function formatCurrency(amount, currency = 'INR') {
  if (currency === 'INR') {
    return `₹${amount.toFixed(2)}`;
  }
  return amount.toFixed(2);
}

/**
 * Calculate items subtotal
 */
export function calculateItemsSubtotal(items = []) {
  return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
}

/**
 * Update bill calculations
 */
export function updateBillCalculations(bill) {
  const breakdown = calculateBillBreakdown(bill);
  
  return {
    ...bill,
    subtotal: breakdown.subtotal,
    grandTotal: breakdown.grandTotal,
    serviceCharge: {
      ...bill.serviceCharge,
      amount: breakdown.serviceChargeAmount,
    },
    taxes: breakdown.taxBreakdown,
    totalTax: breakdown.totalTax,
    roundingAdjustment: breakdown.roundingAdjustment,
  };
}

export default {
  calculateDiscount,
  calculateServiceCharge,
  calculateTax,
  calculateTotalTaxes,
  calculateGrandTotal,
  calculateBillBreakdown,
  validateBillData,
  formatCurrency,
  calculateItemsSubtotal,
  updateBillCalculations,
};