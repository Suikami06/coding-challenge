import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import './pieChart.css';

import axios from 'axios';

const TransactionsPieChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPieChartData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/pieChart/${month}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    };
    fetchPieChartData();
  }, [month]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="count"
        nameKey="_id"
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default TransactionsPieChart;
