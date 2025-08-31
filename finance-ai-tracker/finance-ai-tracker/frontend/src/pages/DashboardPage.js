import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Charts from '../components/Charts';

const DashboardPage = () => {
  const { api } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [key, setKey] = useState(0); // Key to force re-renders

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await api.get('/api/transactions');
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  }, [api]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, key]);

  const refreshData = () => {
    setKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <SummaryCards refreshKey={key} />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Charts refreshKey={key} />
          </div>
          <div>
            <TransactionForm onTransactionAdded={refreshData} />
          </div>
        </div>
        <div className="mt-8">
          <TransactionList transactions={transactions} onDataChange={refreshData} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
