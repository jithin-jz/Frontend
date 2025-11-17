import { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

import Filters from "./Filters";
import Section from "./Section";

const priceRanges = [
  { label: "₹0 - ₹999", min: 0, max: 999 },
  { label: "₹1000 - ₹1999", min: 1000, max: 1999 },
  { label: "₹2000 - ₹2999", min: 2000, max: 2999 },
  { label: "₹3000+", min: 3000, max: Infinity },
];

const categories = ["Men", "Women"];

const sectionBanners = {
  Men: "https://prod-img.thesouledstore.com/public/theSoul/uploads/users/artists/20250507115108-cp-1.jpg?format=webp&w=1500&dpr=1.5",
  Women:
    "https://prod-img.thesouledstore.com/public/theSoul/uploads/users/artists/20241202232928-cp-1.jpg?format=webp&w=1500&dpr=1.5",
};

const Products = () => {
  const location = useLocation();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { wishlist, addToWishlist, removeFromWishlist, addToCart, cart } =
    useCart();
  const { user } = useAuth();

  // --------------------------------------
  // Apply category filter if coming from SingleProduct
  // --------------------------------------
  useEffect(() => {
    if (location.state?.category) {
      const cat =
        location.state.category.toLowerCase() === "men" ? "Men" : "Women";
      setSelectedCategories([cat]);
      window.history.replaceState({}, document.title); // clean state
    }
  }, [location.state]);

  // --------------------------------------
  // Fetch Products with backend filters
  // --------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {};

        // Search
        if (searchTerm.trim()) params.search = searchTerm;

        // Category
        if (selectedCategories.length === 1)
          params.category = selectedCategories[0].toLowerCase();

        // Price range
        if (selectedPrices.length === 1) {
          const range = selectedPrices[0];
          params.min_price = range.min;
          if (range.max !== Infinity) params.max_price = range.max;
        }

        const res = await api.get("/products/", { params });
        setAllProducts(res.data);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchProducts();
  }, [searchTerm, selectedCategories, selectedPrices]);

  // --------------------------------------
  // Wishlist Handling
  // --------------------------------------
  const handleToggleWishlist = useCallback(
    (product) => {
      if (!user) {
        toast.warn("Please login to manage wishlist");
        return;
      }

      const isInWishlist = wishlist.some((item) => item.id === product.id);

      if (isInWishlist) {
        removeFromWishlist(product.id);
        toast.info(`${product.name} removed from wishlist`);
      } else {
        addToWishlist(product);
        toast.success(`${product.name} added to wishlist`);
      }
    },
    [user, wishlist, addToWishlist, removeFromWishlist]
  );

  // --------------------------------------
  // Add to Cart
  // --------------------------------------
  const handleAddToCart = useCallback(
    (product) => {
      if (!user) {
        toast.warn("Please login to add items to cart");
        return;
      }

      const isInCart = cart.some((item) => item.id === product.id);

      if (isInCart) {
        toast.info(`${product.name} is already in the cart`);
      } else {
        addToCart(product);
        toast.success(`${product.name} added to cart`);
      }
    },
    [user, cart, addToCart]
  );

  // --------------------------------------
  // Group by category sections
  // --------------------------------------
  const groupedByCategory = useMemo(
    () =>
      categories.map((cat) => ({
        category: cat,
        banner: sectionBanners[cat],
        products: allProducts.filter(
          (p) => p.category.toLowerCase() === cat.toLowerCase()
        ),
      })),
    [allProducts]
  );

  // --------------------------------------
  // Filter Toggles
  // --------------------------------------
  const togglePriceFilter = (range) => {
    setSelectedPrices((prev) =>
      prev.some((r) => r.label === range.label) ? [] : [range]
    );
  };

  const toggleCategoryFilter = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? [] : [category]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-900 text-white mb-0">
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedPrices={selectedPrices}
        togglePriceFilter={togglePriceFilter}
        selectedCategories={selectedCategories}
        toggleCategoryFilter={toggleCategoryFilter}
        priceRanges={priceRanges}
        categories={categories}
      />

      {loading ? (
        <Loader />
      ) : allProducts.length === 0 ? (
        <p className="text-center text-gray-400">No products found.</p>
      ) : (
        groupedByCategory.map(({ category, banner, products }) => (
          <Section
            key={category}
            category={category}
            banner={banner}
            products={products}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
          />
        ))
      )}
    </div>
  );
};

export default Products;
