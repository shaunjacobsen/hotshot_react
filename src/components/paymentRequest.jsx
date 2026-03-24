import react, { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';

export default function PaymentRequestForm({ onSubmit, serviceId }) {
  const terminals = [
    { id: 1, name: 'Terminal A' },
    { id: 2, name: 'Terminal B' },
    { id: 3, name: 'Terminal C' },
  ];
  const currencies = ['USD', 'EUR', 'GBP'];

  const [selectedTerminal, setSelectedTerminal] = useState(terminals[0]);
  const [currency, setCurrency] = useState(currencies[0]);
  const [amount, setAmount] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    return onSubmit({
      terminal: selectedTerminal,
      currency,
      amount,
      serviceId,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <div className="flex">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border rounded-l px-3 py-2"
            placeholder="0.00"
          />
          <Listbox value={currency} onChange={setCurrency}>
            <div className="relative">
              <Listbox.Button className="border border-l-0 rounded-r px-3 py-2 bg-gray-50">
                {currency}
              </Listbox.Button>
              <Listbox.Options className="absolute right-0 mt-1 border rounded bg-white shadow">
                {currencies.map((cur) => (
                  <Listbox.Option
                    key={cur}
                    value={cur}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                  >
                    {cur}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Service ID</label>
        <input
          type="text"
          value={serviceId}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
      >
        Request Payment
      </button>
    </form>
  );
}
