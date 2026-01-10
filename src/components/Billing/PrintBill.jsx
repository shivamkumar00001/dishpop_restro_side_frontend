import React from "react";

export default function PrintBill({ bill, restaurantName }) {
  if (!bill) return null;

  const discountAmount =
    bill.discountType === "PERCENTAGE"
      ? (bill.subtotal * bill.discount) / 100
      : bill.discountType === "FIXED"
      ? bill.discount
      : 0;

  return (
    <div className="hidden print:block">
      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .print-container {
            width: 80mm;
            padding: 10mm;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
          }
          
          .print-restaurant {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
          }
          
          .print-bill-number {
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0;
          }
          
          .print-info {
            margin-bottom: 15px;
            font-size: 11px;
          }
          
          .print-info-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }
          
          .print-items {
            margin: 15px 0;
            border-top: 2px dashed #000;
            border-bottom: 2px dashed #000;
            padding: 10px 0;
          }
          
          .print-item {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          
          .print-item-name {
            flex: 1;
            font-weight: bold;
          }
          
          .print-item-qty {
            width: 40px;
            text-align: center;
          }
          
          .print-item-price {
            width: 60px;
            text-align: right;
          }
          
          .print-totals {
            margin-top: 10px;
          }
          
          .print-total-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          
          .print-total-row.grand {
            font-size: 16px;
            font-weight: bold;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #000;
          }
          
          .print-footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px dashed #000;
            font-size: 10px;
          }
          
          .print-footer-text {
            margin: 5px 0;
          }
        }
      `}</style>

      <div className="print-container">
        {/* Header */}
        <div className="print-header">
          <div className="print-restaurant">{restaurantName || "Restaurant"}</div>
          <div className="print-bill-number">Bill: {bill.billNumber}</div>
          <div style={{ fontSize: '10px', marginTop: '5px' }}>
            {new Date(bill.createdAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {/* Customer Info */}
        <div className="print-info">
          <div className="print-info-row">
            <span>Table:</span>
            <span><strong>{bill.tableNumber}</strong></span>
          </div>
          <div className="print-info-row">
            <span>Customer:</span>
            <span><strong>{bill.customerName}</strong></span>
          </div>
          <div className="print-info-row">
            <span>Phone:</span>
            <span>{bill.phoneNumber}</span>
          </div>
          {bill.status === "FINALIZED" && bill.paymentMethod && (
            <div className="print-info-row">
              <span>Payment:</span>
              <span><strong>{bill.paymentMethod}</strong></span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="print-items">
          <div className="print-item" style={{ fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '8px' }}>
            <div className="print-item-name">Item</div>
            <div className="print-item-qty">Qty</div>
            <div className="print-item-price">Amount</div>
          </div>

          {bill.items.map((item, index) => (
            <div key={index}>
              <div className="print-item">
                <div className="print-item-name">{item.name}</div>
                <div className="print-item-qty">{item.qty}</div>
                <div className="print-item-price">₹{item.totalPrice.toFixed(2)}</div>
              </div>
              {item.variant?.name && (
                <div style={{ fontSize: '10px', marginLeft: '5px', color: '#666' }}>
                  {item.variant.name} @ ₹{item.unitPrice}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="print-totals">
          <div className="print-total-row">
            <span>Subtotal:</span>
            <span>₹{bill.subtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="print-total-row">
              <span>
                Discount
                {bill.discountType === "PERCENTAGE" && ` (${bill.discount}%)`}:
              </span>
              <span>- ₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {bill.serviceCharge?.enabled && (
            <div className="print-total-row">
              <span>Service Charge ({bill.serviceCharge.rate}%):</span>
              <span>₹{bill.serviceCharge.amount.toFixed(2)}</span>
            </div>
          )}

          {bill.taxes?.map((tax, index) => (
            <div key={index} className="print-total-row">
              <span>{tax.name} ({tax.rate}%):</span>
              <span>₹{tax.amount.toFixed(2)}</span>
            </div>
          ))}

          <div className="print-total-row grand">
            <span>GRAND TOTAL:</span>
            <span>₹{bill.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="print-footer">
          <div className="print-footer-text">Thank you for your visit!</div>
          <div className="print-footer-text">Please visit again</div>
          {bill.status === "FINALIZED" && (
            <div className="print-footer-text" style={{ marginTop: '10px', fontWeight: 'bold' }}>
              PAID
            </div>
          )}
        </div>
      </div>
    </div>
  );
}