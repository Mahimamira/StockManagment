// pages/user/Home.jsx
import React, { useEffect, useState } from "react";
import axiosUser from "../../utils/axiosUser";
import UserNavbar from "../../components/user/UserNavbar";
import ProductCard from "../../components/user/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      const { data } = await axiosUser.get("/products/all", {
        params: { search, sort: sortOrder, page: currentPage }
      });
      
      if (data.length < 10) setHasMore(false);
      else setHasMore(true);
      
      if (reset) {
        setProducts(data);
      } else {
        setProducts((prev) => {
          const combined = [...prev, ...data];
          const unique = combined.filter(
            (item, index, self) => index === self.findIndex((t) => t._id === item._id)
          );
          return unique;
        });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset when search or sort changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(true);
  }, [search, sortOrder]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchProducts(false);
    }
  }, [page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <>
      <UserNavbar setSearch={setSearch} />
      
      <div className="px-4 py-6 bg-white dark:bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-600">🛍️ All Products</h2>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <option value="default">Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="name_asc">Name: A → Z</option>
            <option value="name_desc">Name: Z → A</option>
          </select>
        </div>

        {loading && products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center my-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md transition"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
