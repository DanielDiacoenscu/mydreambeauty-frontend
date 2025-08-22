'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';  // Add if not there for params.id
import axios from 'axios';
import Image from 'next/image';

interface Product {
  name: string;
  price: number;
  description: string;
  image: { data: { attributes: { url: string } } };
}

export default function ProductPage() {
  const params = useParams();  // Gets dynamic [id] from URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;  // Guard if no ID
    axios.get(`https://api.mydreambeauty.net/api/products/${params.id}?populate=*`)  // v5-compatible (all fields incl. image)
      .then(response => {
        setProduct(response.data.data.attributes);  // v5 structure
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load product—check ID, Strapi data, or version.');
        setLoading(false);
        console.error(err);
      });
  }, [params.id]);

  if (loading) return <p className="p-8 text-center">Loading product...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!product) return <p className="p-8 text-center">Product not found—add some in Strapi!</p>;

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl mb-6 text-center">{product.name}</h1>
      <div className="flex flex-col md:flex-row items-center">
        <Image
          src={`https://api.mydreambeauty.net${product?.image?.data?.attributes?.url || '/placeholder.jpg'}`}  // Safe chaining + fallback
          alt={product.name}
          width={500}
          height={384}
          className="w-full md:w-1/2 h-96 object-cover mb-4 md:mb-0 md:mr-8"
        />
        <div className="md:w-1/2">
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <button className="bg-black text-white px-6 py-2 rounded">Add to Cart</button>
        </div>
      </div>
    </main>
  );
}
