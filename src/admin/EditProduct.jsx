import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import AdminNavbar from './AdminNavbar';
import Loader from '../components/Loader';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    stock: '',
    image: null,
    currentImage: '' // To store the URL of the existing image
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}/`);
        setFormData({
          ...res.data,
          image: null, // Reset image file input
          currentImage: res.data.image // Store current image URL
        });
      } catch {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, category, stock, image } = formData;
    
    // Validation: Image is optional during edit
    if (!name || !description || !price || !category || !stock) {
      toast.error('Please fill out all required fields');
      return;
    }

    setSubmitting(true);
    
    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('price', price);
    data.append('category', category.toLowerCase());
    data.append('stock', stock);
    if (image) {
      data.append('image', image);
    }

    try {
      await api.patch(`/products/${id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product updated');
      navigate('/admin/products');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <AdminNavbar />

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : (
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-slate-800 text-white outline-none border border-slate-700"
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 rounded bg-slate-800 text-white outline-none border border-slate-700"
                />
              </div>

              <div>
                <label className="block mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-slate-800 text-white outline-none border border-slate-700"
                />
              </div>

              <div>
                <label className="block mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-slate-800 text-white outline-none border border-slate-700"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-slate-800 text-white outline-none border border-slate-700"
                />
              </div>

              <div>
                <label className="block mb-1">Product Image</label>
                {formData.currentImage && (
                  <div className="mb-2">
                    <img src={formData.currentImage} alt="Current" className="h-20 w-20 object-cover rounded" />
                    <p className="text-xs text-slate-400 mt-1">Current Image</p>
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-slate-800 text-white outline-none border border-slate-700 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2 rounded font-medium ${
                  submitting
                    ? 'bg-slate-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500'
                } transition`}
              >
                {submitting ? 'Saving...' : 'Update Product'}
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="text-center text-xs p-4 text-slate-500 border-t border-slate-800">
        &copy; {new Date().getFullYear()} <span className="text-white font-semibold">Souled Admin</span>
      </footer>
    </div>
  );
};

export default EditProduct;
