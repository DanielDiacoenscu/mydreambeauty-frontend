export const addToCart = (product: { id: number; name: string; price: number }) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find((item: { id: number }) => item.id === product.id);  // Typed, no any
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
};
