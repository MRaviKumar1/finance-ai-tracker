import React, { useState, useEffect, useCallback } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { useAuth } from '../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Charts = ({ refreshKey }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const { api } = useAuth();

  const fetchChartData = useCallback(async () => {
    try {
      const [catRes, trendRes] = await Promise.all([
        api.get('/api/analytics/categories'),
        api.get('/api/analytics/trends')
      ]);

      const catChartData = {
        labels: catRes.data.map(c => c.name),
        datasets: [{
          data: catRes.data.map(c => c.value),
          backgroundColor: ['#4F46E5', '#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6'],
        }],
      };
      setCategoryData(catChartData);

      const trendChartData = {
        labels: trendRes.data.map(t => t.date),
        datasets: [{
          label: 'Expenses Over Time',
          data: trendRes.data.map(t => t.total),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }],
      };
      setTrendData(trendChartData);

    } catch (error) {
      console.error("Failed to fetch chart data", error);
    }
  }, [api]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData, refreshKey]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
        {categoryData ? <Pie data={categoryData} /> : <p>Loading...</p>}
      </div>
      <div className="md:col-span-3 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Spending Trends</h3>
        {trendData ? <Line data={trendData} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default Charts;
