import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useUser } from "../context/UserContext";

const PrintableLabel = ({ orderDetails }) => {
  const { userData } = useUser();
  const labelRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => labelRef.current,
  });

  return (
    <div className="container mt-4">
      <h2 className="text-center">Shipping Label</h2>
      
      {/* Printable Label Section */}
      <div ref={labelRef} className="label-container p-4 border rounded shadow-sm">
        <h4>From:</h4>
        <p>
          Terra'Novare <br />
          123 Business Lane <br />
          Ypsilanti, MI 48197 <br />
        </p>

        <h4>To:</h4>
        <p>
          {userData?.name || "Customer Name"} <br />
          {userData?.address || "Street Address"} <br />
          {userData?.city}, {userData?.state} {userData?.zip} <br />
          {userData?.country || "USA"} <br />
        </p>

        <h4>Order Details:</h4>
        {orderDetails?.map((item) => (
          <p key={item.product_id}>
            {item.quantity}x {item.name}
          </p>
        ))}

        <h4>Total: ${orderDetails?.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</h4>
      </div>

      {/* Print Button */}
      <button className="btn btn-primary mt-3" onClick={handlePrint}>
        Print Label
      </button>

      {/* CSS Styling for Print-Friendly Label */}
      <style>
        {`
          .label-container {
            width: 4in;
            height: 6in;
            background: white;
            padding: 20px;
            font-size: 14px;
          }
          @media print {
            body * {
              visibility: hidden;
            }
            .label-container, .label-container * {
              visibility: visible;
            }
            .label-container {
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintableLabel;
