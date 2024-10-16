import React, { useState, useEffect } from 'react';
import './statistics.css';

import axios from 'axios';

const Statistics = ({ month }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/statistics/${month}`);
        setStats(response.data);
        setLoading(false);  // stop loading when data is fetched
      } catch (err) {
        setError('Error fetching statistics');
        setLoading(false);  // stop loading in case of error
      }
    };
    fetchStatistics();
  }, [month]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Statistics for {month}</h3>
      <p>Total Sale Amount: ${stats.totalSaleAmount}</p>
      <p>Total Sold Items: {stats.totalSoldItems}</p>
      <p>Total Not Sold Items: {stats.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;
