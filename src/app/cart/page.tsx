'use client';

import { useEffect, useState } from 'react';
import { addToCart } from '@/utils/cart';  // Not used here, but for consistency

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl mb-6 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-4 border-b pb-4">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:underline">Remove</button>
            </div>
          ))}
          <p className="text-xl font-bold mt-4 text-right">Total: ${(total).toFixed(2)}</p>
          <button className="bg-black text-white px-6 py-3 mt-4 w-full md:w-auto float-right">Checkout</button>
        </>
      )}
    </main>
  );
}
