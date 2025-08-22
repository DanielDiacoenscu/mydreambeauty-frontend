'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  attributes: {
    name: string;
    price: number;
    image: { data: { attributes: { url: string } } };
  };
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('https://api.mydreambeauty.net/api/products?populate=Images')  // Specific for v5; use =* if no fields error
      .then(response => {
        setProducts(response.data.data || []);  // Fallback to empty array
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products—check Strapi data or version.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p className="p-8 text-center">Loading shop...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (products.length === 0) return <p className="p-8 text-center">No products yet—add some in Strapi!</p>;

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl mb-6 text-center">Shop All</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Link key={product.id} href={`/product/${product.id}`} className="block">
            <div className="border border-gray-200 p-4 hover:shadow-lg transition-shadow">
              <Image
                src={`https://api.mydreambeauty.net${product.attributes?.Images?.data?.attributes?.url || '/placeholder.jpg'}`}  // Safe + fallback
                alt={product.attributes?.name || 'Product'}
                width={500}
                height={256}
                className="w-full h-64 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{product.attributes.name}</h2>
              <p className="text-lg text-gray-700">${product.attributes.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
