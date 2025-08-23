'use client';  // Enables client-side hooks

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name?: string;
  Price?: number;  // Matches your capital "Price"
  Images?: Array<{ url: string; formats?: { medium?: { url: string } } }>;  // Matches your structure
  Description?: string;
  slug?: string;
  documentId?: string;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('https://api.mydreambeauty.net/api/products?populate=Images')
      .then(response => {
        console.log('Shop Raw API Response:', response.data);  // For debug
        const productData = response.data?.data || response.data || [];
        console.log('Parsed Products:', productData);
        setProducts(productData);
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to load products: ${err.message}`);
        setLoading(false);
        console.error('Shop Error:', err);
      });
  }, []);

  if (loading) return <p className="p-8 text-center text-gray-600">Loading shop...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (products.length === 0) return <p className="p-8 text-center text-gray-600">No products yet—add some in Strapi and publish!</p>;

  return (
    <main className="bg-white p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center tracking-wide text-black">Shop All</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(product => {
          const name = product.name || 'Unnamed Product';
          const price = product.Price || 0;  // Pulls from "Price" in your JSON
          // Use medium format if available, else main url
          const imageUrl = product.Images?.[0]?.formats?.medium?.url || product.Images?.[0]?.url;
          const src = imageUrl ? `https://api.mydreambeauty.net${imageUrl}` : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

          console.log('Product details for ID', product.id, ':', { rawProduct: product, name, price, imageUrl, src });

          return (
            <Link key={product.id} href={`/product/${product.id}`} className="block group">
              <div className="overflow-hidden bg-gray-200">
                <Image
                  src={src}
                  alt={name}
                  width={400}
                  height={500}
                  loading="lazy"
                  unoptimized={true}
                  style={{ width: 'auto', height: 'auto' }}
                  className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    console.warn('Image failed:', src);
                    e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-black">{name}</h2>
              <p className="text-md text-gray-600">${price.toFixed(2)}</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
