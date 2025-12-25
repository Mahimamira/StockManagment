import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="bg-dark text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-primary">SmartRaw Seller</h1>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
        <Link to="/dashboard/add" className="hover:text-primary">Add Product</Link>
        <Link to="/dashboard/stocks" className="hover:text-primary">Stocks</Link>
        <Link to="/dashboard/orders" className="hover:text-primary">Orders</Link>
        <Link to="/dashboard/analytics" className="hover:text-primary">Analytics</Link>
      </div>
    </div>
  );
}



