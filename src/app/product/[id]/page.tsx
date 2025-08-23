'use client';  // Enables client-side hooks

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

interface Product {
  id: number;
  name?: string;
  price?: number;
  Images?: { data: Array<{ attributes: { url: string } }> };
  Description?: string;
  slug?: string;
  documentId?: string;
  // Add other fields from logs
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) {
      setError('No product ID provided');
      setLoading(false);
      return;
    }
    axios.get(`https://api.mydreambeauty.net/api/products/${params.id}?populate=Images`)  // Full URL to fix 404
      .then(response => {
        console.log('Product Raw API Response:', response.data);  // Debug
        const productData = response.data?.data || response.data || null;
        setProduct(productData);
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to load product: ${err.message}`);
        setLoading(false);
        console.error(err);
      });
  }, [params.id]);

  if (loading) return <p className="p-8 text-center text-gray-600">Loading product...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!product) return <p className="p-8 text-center text-gray-600">Product not found—try adding one in Strapi!</p>;

  const name = product.name || 'Unnamed Product';
  const price = product.price || 0;
  const imageUrl = product.Images?.data?.[0]?.attributes?.url;
  const src = (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('/'))
    ? `https://api.mydreambeauty.net${imageUrl}`
    : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

  return (
    <main className="bg-white p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center tracking-wide text-black">{name}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <Image
            src={src}
            alt={name}
            width={600}
            height={800}
            loading="lazy"
            unoptimized={true}  // Bypass to stop 400s
            style={{ width: 'auto', height: 'auto' }}
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <p className="text-3xl font-bold mb-4 text-black">${price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.Description || 'No description available.'}</p>
          <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors">Add to Cart</button>
        </div>
      </div>
    </main>
  );
}
