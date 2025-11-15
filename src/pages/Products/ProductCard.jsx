import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const ProductCard = ({ product, onToggleWishlist, isWishlisted, onAddToCart }) => {
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="group relative">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-gray-900/80 backdrop-blur-sm"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FiHeart className="text-gray-400 group-hover:text-red-500" />
        )}
      </button>

      {/* Product Link */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="overflow-hidden rounded-lg bg-gray-800">
          <img
            src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name || 'Product'}
            className="w-full h-auto object-contain opacity-0 transition-opacity duration-300 group-hover:scale-105"
            onLoad={(e) => {
              e.currentTarget.style.opacity = 1;
            }}
          />
        </div>

        {/* Name + Price + Add to Cart */}
        <div className="mt-3 flex justify-between items-center gap-2">
          <div>
            <h3 className="text-white font-medium">{product.name}</h3>
            <p className="text-gray-300 font-bold">₹{product.price}</p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-all"
          >
            Add
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
