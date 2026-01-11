import React from "react";

export default function PrintBill({ bill, restaurantName }) {
  if (!bill) return null;

  const discountAmount =
    bill.discountType === "PERCENTAGE"
      ? (bill.subtotal * bill.discount) / 100
      : bill.discountType === "FIXED"
      ? bill.discount
      : 0;

  const getPrinterWidth = () => {
    try {
      const settings = localStorage.getItem('printerSettings');
      if (settings) {
        return JSON.parse(settings).width || 80;
      }
    } catch (error) {
      console.error('Failed to get printer width:', error);
    }
    return 80;
  };

  const printerWidth = getPrinterWidth();
  const is58mm = printerWidth === 58;

  return (
    <>
      <style>{`
        .thermal-receipt-print {
          display: none;
        }

        @media print {
          /* STEP 1: Reset everything to zero */
          * {
            margin: 0 !important;
            padding: 0 !important;
          }

          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }

          /* STEP 2: Hide everything */
          body * {
            visibility: hidden !important;
          }

          /* STEP 3: Show only receipt */
          .thermal-receipt-print,
          .thermal-receipt-print * {
            visibility: visible !important;
          }

          /* STEP 4: Position receipt */
          .thermal-receipt-print {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
          }

          /* STEP 5: CRITICAL - Page setup to prevent blank pages */
          @page {
            size: ${printerWidth}mm auto;
            margin: 0mm !important;
          }

          @page:first {
            margin-top: 0mm !important;
          }

          @page:last {
            margin-bottom: 0mm !important;
          }

          /* STEP 6: Receipt container - NO extra height */
          .receipt-wrapper {
            width: ${printerWidth}mm !important;
            max-width: ${printerWidth}mm !important;
            padding: ${is58mm ? '2mm' : '3mm'} !important;
            background: white !important;
            color: black !important;
            font-family: 'Courier New', monospace !important;
            font-size: ${is58mm ? '8px' : '9px'} !important;
            line-height: 1.2 !important;
            margin: 0 !important;
            height: auto !important;
            overflow: visible !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }

          /* Prevent page breaks */
          .receipt-wrapper > * {
            page-break-inside: avoid !important;
          }

          .receipt-wrapper:after {
            content: "";
            display: block;
            height: 0 !important;
            clear: both;
          }

          /* Header */
          .r-header {
            text-align: center;
            margin: 0 0 ${is58mm ? '2.5mm' : '3mm'} 0 !important;
            padding: 0 0 ${is58mm ? '2mm' : '2.5mm'} 0 !important;
            border-bottom: 1px dashed #000;
          }

          .r-title {
            font-family: Arial, sans-serif;
            font-size: ${is58mm ? '12px' : '15px'};
            font-weight: bold;
            text-transform: uppercase;
            margin: 0 0 ${is58mm ? '1.5mm' : '2mm'} 0 !important;
            padding: 0 !important;
          }

          .r-bill-no {
            font-size: ${is58mm ? '9px' : '11px'};
            font-weight: bold;
            margin: ${is58mm ? '1mm' : '1.5mm'} 0 !important;
            padding: 0 !important;
          }

          .r-date {
            font-size: ${is58mm ? '7px' : '8px'};
            color: #333;
            margin: ${is58mm ? '0.5mm' : '1mm'} 0 0 0 !important;
            padding: 0 !important;
          }

          .r-info {
            margin: ${is58mm ? '2mm' : '2.5mm'} 0 !important;
            padding: 0 !important;
            font-size: ${is58mm ? '7.5px' : '8.5px'};
          }

          .r-info-row {
            display: flex;
            justify-content: space-between;
            margin: ${is58mm ? '0.8mm' : '1mm'} 0 !important;
            padding: 0 !important;
          }

          .r-label {
            text-transform: uppercase;
            font-size: ${is58mm ? '7px' : '8px'};
          }

          .r-value {
            font-weight: bold;
          }

          .r-items {
            margin: ${is58mm ? '2mm' : '2.5mm'} 0 !important;
            padding: ${is58mm ? '2mm' : '2.5mm'} 0 !important;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
          }

          .r-items-header {
            font-size: ${is58mm ? '7px' : '8px'};
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            padding: 0 0 ${is58mm ? '1.5mm' : '2mm'} 0 !important;
            margin: 0 0 ${is58mm ? '1.5mm' : '2mm'} 0 !important;
            border-bottom: 1px solid #000;
            text-transform: uppercase;
          }

          .r-item {
            margin: ${is58mm ? '1mm' : '1.2mm'} 0 !important;
            padding: 0 !important;
          }

          .r-item-row {
            font-size: ${is58mm ? '8px' : '9px'};
            display: flex;
            justify-content: space-between;
            margin: 0 !important;
            padding: 0 !important;
          }

          .r-item-name {
            flex: 1;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: ${is58mm ? '1mm' : '1.5mm'};
            max-width: ${is58mm ? '26mm' : '42mm'};
            text-transform: uppercase;
          }

          .r-item-qty {
            width: ${is58mm ? '8mm' : '10mm'};
            text-align: center;
          }

          .r-item-amt {
            width: ${is58mm ? '13mm' : '16mm'};
            text-align: right;
            font-weight: bold;
          }

          .r-variant {
            font-size: ${is58mm ? '7px' : '8px'};
            color: #444;
            margin: ${is58mm ? '0.3mm' : '0.5mm'} 0 0 ${is58mm ? '1mm' : '1.5mm'} !important;
            padding: 0 !important;
          }

          .r-totals {
            margin: ${is58mm ? '2mm' : '2.5mm'} 0 !important;
            padding: 0 !important;
            font-size: ${is58mm ? '8px' : '9px'};
          }

          .r-total-row {
            display: flex;
            justify-content: space-between;
            margin: ${is58mm ? '0.8mm' : '1mm'} 0 !important;
            padding: 0 !important;
          }

          .r-total-label {
            text-transform: uppercase;
          }

          .r-grand-total {
            font-size: ${is58mm ? '11px' : '13px'};
            font-weight: bold;
            border-top: 2px solid #000;
            padding: ${is58mm ? '2mm' : '2.5mm'} 0 0 0 !important;
            margin: ${is58mm ? '2mm' : '2.5mm'} 0 0 0 !important;
          }

          .r-footer {
            text-align: center;
            margin: ${is58mm ? '2.5mm' : '3mm'} 0 0 0 !important;
            padding: ${is58mm ? '2mm' : '2.5mm'} 0 0 0 !important;
            border-top: 1px dashed #000;
            font-size: ${is58mm ? '7.5px' : '8.5px'};
          }

          .r-footer-line {
            margin: ${is58mm ? '1mm' : '1.2mm'} 0 !important;
            padding: 0 !important;
          }

          .r-paid {
            font-family: Arial, sans-serif;
            font-size: ${is58mm ? '10px' : '12px'};
            font-weight: bold;
            margin: ${is58mm ? '2mm' : '2.5mm'} 0 !important;
            padding: 0 !important;
          }

          .r-note {
            font-size: ${is58mm ? '6.5px' : '7.5px'};
            color: #555;
            font-style: italic;
            margin: ${is58mm ? '1.5mm' : '2mm'} 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="thermal-receipt-print">
        <div className="receipt-wrapper">
          
          <div className="r-header">
            <div className="r-title">
              {(restaurantName || "RESTAURANT").toUpperCase()}
            </div>
            <div className="r-bill-no">
              BILL NO: {bill.billNumber}
            </div>
            <div className="r-date">
              {new Date(bill.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }).toUpperCase()}
            </div>
          </div>

          <div className="r-info">
            <div className="r-info-row">
              <span className="r-label">Table:</span>
              <span className="r-value">#{bill.tableNumber}</span>
            </div>
            <div className="r-info-row">
              <span className="r-label">Guest:</span>
              <span className="r-value">{bill.customerName.toUpperCase()}</span>
            </div>
            <div className="r-info-row">
              <span className="r-label">Phone:</span>
              <span className="r-value">{bill.phoneNumber}</span>
            </div>
            {bill.status === "FINALIZED" && bill.paymentMethod && (
              <div className="r-info-row">
                <span className="r-label">Payment:</span>
                <span className="r-value">{bill.paymentMethod}</span>
              </div>
            )}
          </div>

          <div className="r-items">
            <div className="r-items-header">
              <span style={{ flex: 1 }}>Item</span>
              <span style={{ width: is58mm ? '8mm' : '10mm', textAlign: 'center' }}>Qty</span>
              <span style={{ width: is58mm ? '13mm' : '16mm', textAlign: 'right' }}>Amount</span>
            </div>

            {bill.items.map((item, index) => (
              <div key={index} className="r-item">
                <div className="r-item-row">
                  <div className="r-item-name">{item.name}</div>
                  <div className="r-item-qty">{item.qty}</div>
                  <div className="r-item-amt">₹{item.totalPrice.toFixed(2)}</div>
                </div>
                {item.variant?.name && (
                  <div className="r-variant">
                    → {item.variant.name} @ ₹{item.unitPrice.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="r-totals">
            <div className="r-total-row">
              <span className="r-total-label">Subtotal:</span>
              <span>₹{bill.subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="r-total-row">
                <span className="r-total-label">
                  Discount {bill.discountType === "PERCENTAGE" && `(${bill.discount}%)`}:
                </span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            {bill.serviceCharge?.enabled && (
              <div className="r-total-row">
                <span className="r-total-label">
                  Service ({bill.serviceCharge.rate}%):
                </span>
                <span>₹{bill.serviceCharge.amount.toFixed(2)}</span>
              </div>
            )}

            {bill.taxes?.map((tax, index) => (
              <div key={index} className="r-total-row">
                <span className="r-total-label">
                  {tax.name} ({tax.rate}%):
                </span>
                <span>₹{tax.amount.toFixed(2)}</span>
              </div>
            ))}

            <div className="r-total-row r-grand-total">
              <span className="r-total-label">TOTAL:</span>
              <span>₹{bill.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="r-footer">
            <div className="r-footer-line">
              ═══════════════════════
            </div>
            <div className="r-footer-line">
              THANK YOU FOR YOUR VISIT!
            </div>
            <div className="r-footer-line">
              PLEASE COME AGAIN
            </div>
            
            {bill.status === "FINALIZED" && (
              <div className="r-paid">
                ★ ★ ★  PAID  ★ ★ ★
              </div>
            )}

            {bill.notes && (
              <div className="r-note">
                Note: {bill.notes}
              </div>
            )}

            {bill.items.length > 20 && (
              <div className="r-note">
                Total Items: {bill.items.length}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}