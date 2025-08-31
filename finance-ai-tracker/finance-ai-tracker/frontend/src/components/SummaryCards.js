import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const SummaryCards = ({ refreshKey }) => {
  const [summary, setSummary] = useState({ income: 0, expenses: 0, savings: 0 });
  const { api } = useAuth();

  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.get('/api/analytics/summary');
      setSummary(res.data);
    } catch (error) {
      console.error("Failed to fetch summary", error);
    }
  }, [api]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary, refreshKey]);

  const formatCurrency = (amount) => `$${Number(amount).toFixed(2)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow"><h3 className="font-bold text-green-500">Total Income</h3><p className="text-3xl font-semibold mt-1">{formatCurrency(summary.income)}</p></div>
      <div className="bg-white p-6 rounded-lg shadow"><h3 className="font-bold text-red-500">Total Expenses</h3><p className="text-3xl font-semibold mt-1">{formatCurrency(summary.expenses)}</p></div>
      <div className="bg-white p-6 rounded-lg shadow"><h3 className="font-bold text-blue-500">Net Savings</h3><p className="text-3xl font-semibold mt-1">{formatCurrency(summary.savings)}</p></div>
    </div>
  );
};

export default SummaryCards;
