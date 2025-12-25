// ============================================
// 🛍️ components/user/ProductCard.jsx
// ============================================
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, loading } = useCart();

  // Find the cart item for this product
  const cartItem = cartItems.find((item) => item.product?._id === product._id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    console.log("🛒 Add to cart clicked:", product.name);
    addToCart(product);
  };

  const handleRemoveFromCart = () => {
    console.log("➖ Remove from cart clicked:", product.name);
    removeFromCart(product._id);
  };

  return (
    <div className="border p-3 rounded shadow bg-white dark:bg-zinc-900">
      <h2 className="text-xl font-semibold text-black dark:text-white">
        {product.name}
      </h2>
      <p className="text-black dark:text-gray-300">₹{product.price}</p>
      
      {product.stock > 0 ? (
        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
      ) : (
        <p className="text-sm text-red-500">Out of Stock</p>
      )}

      <div className="flex items-center gap-2 mt-2">
        {quantity > 0 ? (
          <div className="flex items-center gap-2">
            <button
              className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 disabled:opacity-50"
              onClick={handleRemoveFromCart}
              disabled={loading}
            >
              -
            </button>
            <span className="text-black dark:text-white font-semibold px-2">
              {quantity}
            </span>
            <button
              className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 disabled:opacity-50"
              onClick={handleAddToCart}
              disabled={loading || product.stock <= 0}
            >
              +
            </button>
          </div>
        ) : (
          <button
            className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={loading || product.stock <= 0}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;