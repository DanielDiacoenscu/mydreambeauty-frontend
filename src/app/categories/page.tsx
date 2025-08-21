'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: number;
  attributes: {
    name: string;
    products: { data: Array<{ id: number; attributes: { name: string; price: number; image: { data: { attributes: { url: string } } } } }> };
  };
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('https://api.mydreambeauty.net/api/categories?populate=products,image')
      .then(response => {
        setCategories(response.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load categories');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl mb-6 text-center">Categories</h1>
      {categories.map(category => (
        <section key={category.id} className="mb-8">
          <h2 className="text-2xl mb-4">{category.attributes.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.attributes.products.data.map(product => (
              <Link key={product.id} href={`/product/${product.id}`} className="block">
                <div className="border border-gray-200 p-4 hover:shadow-lg transition-shadow">
		<Image 
		  src={`https://api.mydreambeauty.net${product.attributes.image.data.attributes.url}`} 
		  alt={product.attributes.name} 
		  width={500}  // Adjust based on your images
		  height={256} 
		  className="w-full h-64 object-cover mb-4" 
		/>                  <h3 className="text-xl font-semibold">{product.attributes.name}</h3>
                  <p className="text-lg text-gray-700">${product.attributes.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
