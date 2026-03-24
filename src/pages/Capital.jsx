import React, { useEffect, useRef } from 'react';

import { adyenSessionInstance } from '../helpers/http';

import {
  AdyenPlatformExperience,
  CapitalOverview,
  CapitalOffer,
  all_locales,
} from '@adyen/adyen-platform-experience-web';

import '@adyen/adyen-platform-experience-web/adyen-platform-experience-web.css';

export default function Capital() {
  const capitalOverviewContainer = useRef(null);
  const capitalOfferContainer = useRef(null);
  // const CLIENT_KEY = 'test_5FBJST2S2ZE4BMBCNTQZ6PY734ELVUSP';

  // call api to get session token
  async function handleCreateSession() {
    try {
      const response = await adyenSessionInstance.post('/api/capital/session', {
        id: 'AH32CRH223229R5N8Z23W7Z3T',
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let ignore = false;

    if (!capitalOverviewContainer.current) return;

    async function createComponent() {
      const config = {};
      const adyenPlatformExperience = await AdyenPlatformExperience({
        onSessionCreate: handleCreateSession,
        availableTranslations: [all_locales],
        // environment,
        locale: 'en_US',
      });

      const overview = new CapitalOverview({
        core: adyenPlatformExperience,
      });

      const offer = new CapitalOffer({
        core: adyenPlatformExperience,
      });

      if (
        capitalOverviewContainer.current &&
        capitalOfferContainer.current &&
        !ignore
      ) {
        overview.mount(capitalOverviewContainer.current);
        offer.mount(capitalOfferContainer.current);
      }
    }

    createComponent();

    return () => (ignore = true);
  }, []);

  return (
    <div>
      <h1 className="text-4xl">Platform Experience: Capital</h1>
      <p className="text-gray-700 mb-12">
        This page shows components from Adyen Platform Experience.
      </p>
      <h3 className="text-2xl">Capital Overview component</h3>
      <div className="my-6" ref={capitalOverviewContainer}></div>
      <h3 className="text-2xl">Capital Offer component</h3>
      <div className="my-6" ref={capitalOfferContainer}></div>
    </div>
  );
}
