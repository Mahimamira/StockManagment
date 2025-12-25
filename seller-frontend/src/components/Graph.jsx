import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

export default function Graph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/seller/analytics').then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#ff7e29" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
