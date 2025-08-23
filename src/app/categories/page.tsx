'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: number;
  name?: string;
  products?: Array<Product>;  // Direct array matching your JSON
}

interface Product {
  id: number;
  name?: string;
  Price?: number;  // Matches capital "Price"
  Images?: Array<{ url: string; formats?: { medium?: { url: string } } }>;  // Matches your structure
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('https://api.mydreambeauty.net/api/categories?populate=products.Images')  // Specific populate for products and their Images
      .then(response => {
        console.log('Categories Raw API Response:', response.data);  // Expand for debug
        const categoryData = response.data?.data || response.data || [];
        console.log('Parsed Categories:', categoryData);
        setCategories(categoryData);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load categories: ' + err.message);
        setLoading(false);
        console.error('Categories Error:', err);
      });
  }, []);

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (categories.length === 0) return <p className="p-8 text-center text-gray-600">No categories yet—add some in Strapi, link products, and publish!</p>;

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl mb-6 text-center">Categories</h1>
      {categories.map(category => {
        const catName = category.name || 'Unnamed Category';

        return (
          <section key={category.id} className="mb-8">
            <h2 className="text-2xl mb-4">{catName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(category.products || []).map(product => {  // Direct array access
                const prodName = product.name || 'Unnamed Product';
                const prodPrice = product.Price || 0;  // Pulls from "Price"
                // Use medium format if available, else main url
                const imageUrl = product.Images?.[0]?.formats?.medium?.url || product.Images?.[0]?.url;
                const src = imageUrl ? `https://api.mydreambeauty.net${imageUrl}` : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

                console.log('Product in category', catName, 'ID', product.id, ':', { rawProduct: product, prodName, prodPrice, imageUrl, src });

                return (
                  <Link key={product.id} href={`/product/${product.id}`} className="block">
                    <div className="border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                      <Image
                        src={src}
                        alt={prodName}
                        width={500}
                        height={256}
                        loading="lazy"
                        unoptimized={true}
                        style={{ width: 'auto', height: 'auto' }}
                        className="w-full h-64 object-cover mb-4"
                        onError={(e) => {
                          console.warn('Category image failed:', src);
                          e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
                          e.currentTarget.onerror = null;
                        }}
                      />
                      <h3 className="text-lg font-semibold">{prodName}</h3>
                      <p className="text-md text-gray-600">${prodPrice.toFixed(2)}</p>
                    </div>
                  </Link>
                );
              })}
              {(category.products || []).length === 0 && (
                <p className="text-center text-gray-600">No products in this category yet—link some in Strapi!</p>
              )}
            </div>
          </section>
        );
      })}
    </main>
  );
}
