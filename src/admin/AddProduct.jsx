import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import AdminNavbar from './AdminNavbar';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    stock: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, category, stock, image } = formData;

    if (!name || !description || !price || !category || !stock || !image) {
      toast.error('Please fill out all fields');
      return;
    }

    if (parseFloat(price) <= 0 || parseInt(stock) < 0) {
      toast.error('Price and Stock must be positive values');
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('price', price);
    data.append('category', category.toLowerCase());
    data.append('stock', stock);
    data.append('image', image);

    try {
      await api.post('/products/create/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product added successfully');
      navigate('/admin/products');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.description?.[0] || 'Failed to add product';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <AdminNavbar />
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider uppercase">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm mb-1 font-semibold">Product Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Iron Man T-Shirt"
                className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm mb-1 font-semibold">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description..."
                rows="3"
                className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm mb-1 font-semibold">Price (₹)</label>
              <input
                id="price"
                type="number"
                name="price"
                min="1"
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm mb-1 font-semibold">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-800 text-white outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm mb-1 font-semibold">Stock</label>
              <input
                id="stock"
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="100"
                className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm mb-1 font-semibold">Product Image</label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 px-6 py-3 rounded-xl font-bold text-white transition duration-200 uppercase shadow-lg"
            >
              Add Product
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-sm p-4 bg-gray-950 text-slate-400 border-t border-slate-800">
        &copy; {new Date().getFullYear()} <span className="text-white font-semibold">Souled Admin</span>. All rights reserved.
      </footer>
    </div>
  );
};

export default AddProduct;

