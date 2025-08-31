import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const TransactionForm = ({ onTransactionAdded }) => {
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { api } = useAuth();

  const handleParse = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsLoading(true);
    setError('');
    setParsed(null);
    try {
      const res = await api.post('/api/transactions/parse', { text });
      setParsed(res.data);
    } catch (err) {
      setError('AI could not parse this. Please try a different format.');
    } finally {
      setIsLoading(isLoading);
    }
  };

  const handleConfirm = async () => {
    if (!parsed) return;
    try {
      await api.post('/api/transactions', parsed);
      setText('');
      setParsed(null);
      onTransactionAdded(); // Refresh data on dashboard
    } catch (err) {
      setError('Failed to save transaction.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Add New Transaction</h3>
      <form onSubmit={handleParse}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='E.g., "Monthly salary $4500"'
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button type="submit" disabled={isLoading} className="mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
          {isLoading ? 'Parsing...' : 'Parse with AI'}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {parsed && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 className="font-semibold">Confirm Transaction</h4>
          <p><strong>Amount:</strong> ${parsed.amount}</p>
          <p><strong>Description:</strong> {parsed.description}</p>
          <p><strong>Category:</strong> {parsed.category}</p>
          <p><strong>Type:</strong> {parsed.type}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={handleConfirm} className="flex-1 bg-green-500 text-white px-3 py-1 rounded-md">Confirm</button>
            <button onClick={() => setParsed(null)} className="flex-1 bg-gray-500 text-white px-3 py-1 rounded-md">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;
