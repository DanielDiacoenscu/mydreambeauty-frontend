'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { addToCart } from '@/utils/cart';  // Assuming you have this utils file; create if not
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
  const [loading, setLoading] = useState(true);  // Added for better UX
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('https://api.mydreambeauty.net/api/products?populate=image')
      .then(response => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p className="p-8 text-center">Loading products...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl mb-6 text-center">Shop All</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Link key={product.id} href={`/product/${product.id}`} className="block">
            <div className="border border-gray-200 p-4 hover:shadow-lg transition-shadow">
		<Image 
		  src={`https://api.mydreambeauty.net${product.attributes.image.data.attributes.url}`} 
		  alt={product.attributes.name} 
		  width={500}  // Adjust based on your images
		  height={256} 
		  className="w-full h-64 object-cover mb-4" 
		/> 
             <h2 className="text-xl font-semibold">{product.attributes.name}</h2>
              <p className="text-lg text-gray-700">${product.attributes.price.toFixed(2)}</p>
		<button 
		  onClick={(e) => {
		    e.preventDefault();
		    addToCart({ id: product.id, name: product.attributes.name, price: product.attributes.price });
		  }} 
		  className="bg-black text-white px-4 py-2 mt-2 w-full"
		>
		  Add to Cart
		</button>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
