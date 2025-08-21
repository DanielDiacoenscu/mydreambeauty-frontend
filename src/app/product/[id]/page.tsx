'use client';

import { useEffect, useState } from 'react';  // Added for state/effect
import axios from 'axios';
import Image from 'next/image';
import { addToCart } from '@/utils/cart';

interface Product {
  name: string;
  price: number;
  description: string;
  image: { data: { attributes: { url: string } } };
}

export default function ProductPage({ params }: { params: { id: string } }) {  // Removed async
  const [product, setProduct] = useState<Product | null>(null);  // Typed properly, no any
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`https://api.mydreambeauty.net/api/products/${params.id}?populate=*`)
      .then(response => {
        setProduct(response.data.data.attributes);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load product');
        setLoading(false);
        console.error(err);
      });
  }, [params.id]);

  if (loading) return <p className="p-8 text-center">Loading product...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!product) return <p className="p-8 text-center">Product not found</p>;  // Fixed: Proper JSX, no escapes

  return (
    <main className="p-4 md:p-8 flex flex-col md:flex-row max-w-7xl mx-auto">
      <Image
        src={`https://api.mydreambeauty.net${product.image.data.attributes.url}`}
        alt={product.name}
        width={500}
        height={384}
        className="w-full md:w-1/2 h-96 object-cover mb-4 md:mb-0 md:mr-8"
      />
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-xl text-gray-700 mb-4">${product.price.toFixed(2)}</p>
        <p className="mb-6">{product.description}</p>
        <button
          onClick={() => addToCart({ id: Number(params.id), name: product.name, price: product.price })}
          className="bg-black text-white px-6 py-3 font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </main>
  );
}
