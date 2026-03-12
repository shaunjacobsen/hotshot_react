import { useEffect, useRef, useState } from 'react';
import { AdyenCheckout, Dropin } from '@adyen/adyen-web/auto';

import { adyenSessionInstance } from '../helpers/http';

import '@adyen/adyen-web/styles/adyen.css';

export default function DropIn() {
  const [paymentSession, setPaymentSession] = useState();
  const checkoutContainer = useRef();

  const shopperReference = 'TEST_12345';

  // get payment session
  useEffect(() => {
    if (!paymentSession) {
      adyenSessionInstance
        .post('/api/sessions', {
          amount: { value: 1000, currency: 'EUR' },
          countryCode: 'NL',
          reference: 'order_' + Date.now(),
          returnUrl: location.hostname,
          store: 'ST3295P223229Q5P2RMH86SLW',
        })
        .then((data) => {
          console.log('paymentSession', data.data);
          setPaymentSession(data.data);
        });
    }
  }, []);

  // initialize checkout
  useEffect(() => {
    let ignore = false;

    if (!paymentSession || !checkoutContainer.current) {
      // initiateCheckout is not finished yet.
      return;
    }

    const config = {
      session: {
        id: paymentSession.id,
        sessionData: paymentSession.sessionData,
      },
      environment: 'test',
      clientKey: import.meta.env.VITE_ADYEN_CLIENT_KEY,
    };

    const createCheckout = async () => {
      const checkout = await AdyenCheckout({
        session: {
          id: paymentSession.id,
          sessionData: paymentSession.sessionData,
        },
        ...config,
        // ...paymentSession,
        // onPaymentCompleted: async (response, _component) => {
        //   console.log('response', response);
        //   // return setPayment(response);
        //   // the below part is optional for sessions flow
        //   // it is used to get the pspReference
        //   const sessionsResp = await adyenSessionInstance.get(
        //     `/api/session/status/${session.id}`,
        //     // @ts-ignore
        //     { params: { sessionResult: response.sessionResult } },
        //   );
        //   console.log('sessionsResp', sessionsResp.data);
        //   setPayment(sessionsResp.data);
        //   navigate(getRedirectUrl(response.resultCode), { replace: true });
        // },
        onError: (error, _component) => {
          console.error(error);
          navigate(`/status/error?reason=${error.message}`, { replace: true });
        },
      });

      const dropinConfig = {
        paymentMethodsConfiguration: {
          card: {
            showStoredPaymentMethods: true,
            hasHolderName: true,
            holderNameRequired: true,
          },
          // applePay: {
          //   domainName: '' // Set the top level hostname for the apple pay call
          // }
        },
      };

      // The 'ignore' flag is used to avoid double re-rendering caused by React 18 StrictMode
      // More about it here: https://beta.reactjs.org/learn/synchronizing-with-effects#fetching-data
      if (checkoutContainer.current && !ignore) {
        const dropin = new Dropin(checkout, dropinConfig);
        dropin.mount(checkoutContainer.current);
      }
    };

    createCheckout();

    return () => {
      ignore = true;
    };
  }, [paymentSession]);

  return (
    <>
      <h1 className="text-4xl">Drop-in Checkout</h1>
      <div className="my-6" ref={checkoutContainer}></div>
    </>
  );
}
