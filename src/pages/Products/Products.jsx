import { useEffect, useState, useMemo, useCallback } from "react";
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
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { wishlist, addToWishlist, removeFromWishlist, addToCart, cart } =
    useCart();
  const { user } = useAuth();

  // ----------------------------
  // Fetch Products
  // ----------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/");
        setAllProducts(res.data);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ----------------------------
  // Filtering Logic (Memoized)
  // ----------------------------
  const filteredProducts = useMemo(() => {
    let data = [...allProducts];

    if (selectedPrices.length) {
      data = data.filter((product) =>
        selectedPrices.some(
          (range) => product.price >= range.min && product.price <= range.max
        )
      );
    }

    if (selectedCategories.length) {
      data = data.filter((p) => selectedCategories.includes(p.category));
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter((p) => p.name.toLowerCase().includes(term));
    }

    return data;
  }, [allProducts, selectedPrices, selectedCategories, searchTerm]);

  // ----------------------------
  // Wishlist Handling
  // ----------------------------
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

  // ----------------------------
  // Add to Cart Handling
  // ----------------------------
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

  // ----------------------------
  // Group by category
  // ----------------------------
  const groupedByCategory = useMemo(
    () =>
      categories.map((cat) => ({
        category: cat,
        banner: sectionBanners[cat],
        products: filteredProducts.filter((p) => p.category === cat),
      })),
    [filteredProducts]
  );

  // ----------------------------
  // Toggle Filters
  // ----------------------------
  const togglePriceFilter = (range) => {
    setSelectedPrices((prev) =>
      prev.some((r) => r.label === range.label)
        ? prev.filter((r) => r.label !== range.label)
        : [...prev, range]
    );
  };

  const toggleCategoryFilter = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // ----------------------------
  // Render
  // ----------------------------
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
      ) : filteredProducts.length === 0 ? (
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
