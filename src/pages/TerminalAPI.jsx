import { useEffect, useRef, useState } from 'react';
import { Listbox } from '@headlessui/react';

import PaymentRequestForm from '../components/paymentRequest';

import '@adyen/adyen-web/styles/adyen.css';
import { adyenSessionInstance } from '../helpers/http';

export default function TerminalAPI() {
  const [serviceId, setServiceId] = useState('');
  const [stores, setStores] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedStore, setSelectedStore] = useState(undefined);
  const [selectedDevice, setSelectedDevice] = useState(undefined);

  useEffect(() => {
    setServiceId(generateServiceId());
  }, []);

  useEffect(() => {
    adyenSessionInstance
      .get('/api/tapi/stores')
      .then((resp) => setStores(resp.data.data));
  }, []);

  useEffect(() => {
    if (selectedStore) {
      setSelectedDevice(undefined);
      setDevices([]);
      console.log('selected store id', selectedStore);
      adyenSessionInstance
        .get('/api/tapi/devices', { params: { store: selectedStore } })
        .then((resp) => {
          setDevices(resp.data.uniqueDeviceIds);
        });
    }
  }, [selectedStore]);

  const handleSubmit = async (data) => {
    const requestData = {
      terminal: selectedDevice,
      amount: Number(data.amount),
      currency: data.currency,
      serviceId,
    };
    console.log('requestData', requestData);
    try {
      const resp = await adyenSessionInstance.post(
        '/api/tapi/payment',
        requestData,
      );
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  };

  const generateServiceId = (length = 10) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  function handleSelectStore(store) {
    setSelectedStore(store);
  }

  function handleSelectDevice(device) {
    setSelectedDevice(device);
  }

  return (
    <>
      <h1 className="text-4xl">Terminal API</h1>
      <div className="my-6">
        <div>
          <label className="block text-sm font-medium mb-1">Store</label>
          <Listbox value={selectedStore} onChange={handleSelectStore}>
            <div className="relative">
              <Listbox.Button className="w-full border rounded px-3 py-2 text-left bg-white">
                {selectedStore || 'Select a store'}
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 w-[max-content] min-w-full border rounded bg-white shadow max-h-60 overflow-auto">
                {stores.map((store) => (
                  <Listbox.Option
                    key={store.id}
                    value={store.id}
                    className={({ active, selected }) =>
                      `cursor-pointer px-3 py-2 ${
                        active ? 'bg-blue-100' : ''
                      } ${selected ? 'font-semibold' : ''}`
                    }
                  >
                    {store.description} ({store.id})
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Terminal
          </label>
          <Listbox value={selectedDevice} onChange={handleSelectDevice}>
            <div className="relative">
              <Listbox.Button className="w-full border rounded px-3 py-2 text-left bg-white">
                {selectedDevice || 'Select a device'}
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 w-full border rounded bg-white shadow max-h-60 overflow-auto">
                {devices.map((device) => (
                  <Listbox.Option
                    key={device}
                    value={device}
                    className={({ active, selected }) =>
                      `cursor-pointer px-3 py-2 ${
                        active ? 'bg-blue-100' : ''
                      } ${selected ? 'font-semibold' : ''}`
                    }
                  >
                    {device}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <PaymentRequestForm onSubmit={handleSubmit} serviceId={serviceId} />
      </div>
    </>
  );
}
