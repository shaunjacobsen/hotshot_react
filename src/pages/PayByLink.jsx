import React, { useEffect, useRef } from 'react';

import { adyenSessionInstance } from './../helpers/http';

import {
  AdyenPlatformExperience,
  PaymentLinksOverview,
  PaymentLinkDetails,
  PaymentLinkCreation,
  PaymentLinkSettings,
  all_locales,
} from '@adyen/adyen-platform-experience-web';

import '@adyen/adyen-platform-experience-web/adyen-platform-experience-web.css';

export default function PayByLink() {
  const componentContainer = useRef(null);
  const settingsContainer = useRef(null);
  const creationContainer = useRef(null);
  // const CLIENT_KEY = 'test_5FBJST2S2ZE4BMBCNTQZ6PY734ELVUSP';

  // call api to get session token
  async function handleCreateSession() {
    try {
      const response = await adyenSessionInstance.post(
        '/api/paybylink/session',
        {
          id: 'AH32CPR22322B75NZ7P564JRG',
        },
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let ignore = false;

    if (!componentContainer.current) return;

    async function createComponent() {
      const config = {};
      const adyenPlatformExperience = await AdyenPlatformExperience({
        onSessionCreate: handleCreateSession,
        availableTranslations: [all_locales],
        // environment,
        locale: 'en_US',
      });

      const overview = new PaymentLinksOverview({
        core: adyenPlatformExperience,
      });
      const settingsComponent = new PaymentLinkSettings({
        core: adyenPlatformExperience,
      });
      const creationComponent = new PaymentLinkCreation({
        core: adyenPlatformExperience,
        fieldsConfig: {
          data: {
            amount: { currency: 'USD', value: 1000 }, // ten US dollars pre-filled
            merchantReference: 'test',
            country: 'US',
          },
        },
      });

      if (
        componentContainer.current &&
        settingsContainer.current &&
        creationContainer.current &&
        !ignore
      ) {
        overview.mount(componentContainer.current);
        settingsComponent.mount(settingsContainer.current);
        creationComponent.mount(creationContainer.current);
      }
    }

    createComponent();

    return () => (ignore = true);
  }, []);

  return (
    <div>
      <h1 className="text-4xl">Platform Experience: Payment Links</h1>
      <p className="text-gray-700 mb-12">This page shows components from Adyen Platform Experience.</p>
      <h3 className="text-2xl">Payment Links component</h3>
      <div className="my-6" ref={componentContainer}></div>
      <h3 className="text-2xl">Payment Settings component</h3>
      <div className="my-6" ref={settingsContainer}></div>
      <h3 className="text-2xl">Payment Link Creation component</h3>
      <div className="my-6" ref={creationContainer}></div>
    </div>
  );
}
