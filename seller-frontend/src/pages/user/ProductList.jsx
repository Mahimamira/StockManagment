import React, { useEffect, useState } from "react";
import axiosUser from '../utils/axiosUser';


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosUser.get("/products/all", {
        params: { search, sort, page },
      });
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, sort, page]);

  return (
    <div className="p-4 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="border px-4 py-2 rounded-md w-full md:w-1/3 dark:bg-gray-800 dark:border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-md dark:bg-gray-800 dark:border-gray-700"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 shadow-sm dark:bg-gray-800"
            >
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-sm">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">{page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
