import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';

const TransactionsBarChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      const response = await axios.get(`/api/v1/barChart/${month}`);
      setData(response.data);
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
