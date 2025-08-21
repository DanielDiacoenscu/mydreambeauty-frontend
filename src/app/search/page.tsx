'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface Product {
  id: number;
  attributes: {
    name: string;
    price: number;
    image: { data: { attributes: { url: string } } };
  };
}

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      axios.get(`https://api.mydreambeauty.net/api/products?filters[name][$contains]=${query}&populate=image`)
        .then(response => {
          setProducts(response.data.data);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [query]);

  if (loading) return <p className="p-8 text-center">Searching...</p>;

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl mb-6 text-center">Search Results for "{query}"</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p className="text-center">No results found.</p>
        ) : (
          products.map(product => (
            <Link key={product.id} href={`/product/${product.id}`} className="block">
              <div className="border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                <img 
                  src={`https://api.mydreambeauty.net${product.attributes.image.data.attributes.url}`} 
                  alt={product.attributes.name} 
                  className="w-full h-64 object-cover mb-4" 
                />
                <h2 className="text-xl font-semibold">{product.attributes.name}</h2>
                <p className="text-lg text-gray-700">${product.attributes.price.toFixed(2)}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
