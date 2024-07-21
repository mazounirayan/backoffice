import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const Payment: React.FC = () => {
  const initialOptions = {
    clientId: "test",
    enableFunding: "venmo",
    disableFunding: "",
    country: "US",
    currency: "USD",
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
  };

  const [message, setMessage] = useState<string>("");

  const showToast = (text: string, success = true) => {
    Toastify({
      text,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: success ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, #ff5f6d, #ffc371)",
    }).showToast();
  };

  return (
    <div className="App">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          }}
          createOrder={async () => {
            try {
              const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  cart: [
                    {
                      id: "YOUR_PRODUCT_ID",
                      quantity: "YOUR_PRODUCT_QUANTITY",
                    },
                  ],
                }),
              });

              const orderData = await response.json();

              if (orderData.id) {
                return orderData.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : JSON.stringify(orderData);

                throw new Error(errorMessage);
              }
            } catch (error) {
              console.error(error);
              showToast(`Could not initiate PayPal Checkout... ${error}`, false);
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch(
                `/api/orders/${data.orderID}/capture`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              const orderData = await response.json();
              const errorDetail = orderData?.details?.[0];

              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                return actions.restart();
              } else if (errorDetail) {
                throw new Error(
                  `${errorDetail.description} (${orderData.debug_id})`
                );
              } else {
                const transaction = orderData.purchase_units[0].payments.captures[0];
                setMessage(
                  `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                );
                showToast(`Transaction ${transaction.status}: ${transaction.id}`);
                console.log(
                  "Capture result",
                  orderData,
                  JSON.stringify(orderData, null, 2)
                );
              }
            } catch (error) {
              console.error(error);
              showToast(`Sorry, your transaction could not be processed... ${error}`, false);
            }
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Payment;
