'use client';

import { useEffect, useState, Suspense } from 'react';  // Added Suspense
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';  // Assuming you added for img fix; if not, add it

export const dynamic = 'force-dynamic';  // Added to make dynamic and fix prerender

interface Product {
  id: number;
  attributes: {
    name: string;
    price: number;
    image: { data: { attributes: { url: string } } };
  };
}

function SearchContent() {  // Wrapped in a sub-component for Suspense
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
	<h1 className="text-3xl mb-6 text-center">Search Results for &quot;{query}&quot;</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p className="text-center">No results found.</p>
        ) : (
          products.map(product => (
            <Link key={product.id} href={`/product/${product.id}`} className="block">
              <div className="border border-gray-200 p-4 hover:shadow-lg transition-shadow">
		<Image 
		  src={`https://api.mydreambeauty.net${product.attributes.image.data.attributes.url}`} 
		  alt={product.attributes.name} 
		  width={500} 
		  height={256} 
		  className="w-full h-64 object-cover mb-4" 
		/>                <h2 className="text-xl font-semibold">{product.attributes.name}</h2>
                <p className="text-lg text-gray-700">${product.attributes.price.toFixed(2)}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading search...</p>}>
      <SearchContent />
    </Suspense>
  );
}
