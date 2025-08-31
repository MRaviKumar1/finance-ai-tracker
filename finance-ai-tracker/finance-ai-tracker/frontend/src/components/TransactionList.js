import React from 'react';
import { useAuth } from '../context/AuthContext';

const TransactionItem = ({ tx, onDataChange }) => {
  const { api } = useAuth();
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/api/transactions/${tx._id}`);
        onDataChange();
      } catch (error) {
        console.error("Failed to delete transaction", error);
      }
    }
  };

  return (
    <li className="flex justify-between items-center py-3 px-4 odd:bg-white even:bg-gray-50">
      <div>
        <p className="font-medium text-gray-800">{tx.description}</p>
        <p className="text-sm text-gray-500">{tx.category} - {new Date(tx.date).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${tx.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
          {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
        </p>
        <button onClick={handleDelete} className="text-xs text-red-500 hover:text-red-700">Delete</button>
      </div>
    </li>
  );
};

const TransactionList = ({ transactions, onDataChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Transaction History</h3>
      <ul className="divide-y divide-gray-200">
        {transactions.length > 0 ? (
          transactions.map(tx => <TransactionItem key={tx._id} tx={tx} onDataChange={onDataChange} />)
        ) : (
          <p className="text-center text-gray-500 py-4">No transactions yet.</p>
        )}
      </ul>
    </div>
  );
};

export default TransactionList;
