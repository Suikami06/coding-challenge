import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import './barChart.css';

import axios from 'axios';

const TransactionsBarChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/barChart/${month}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };
    fetchBarChartData();
  }, [month]);

  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#82ca9d" />
    </BarChart>
  );
};

export default TransactionsBarChart;
