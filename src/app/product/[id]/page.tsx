import axios from 'axios';

export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    const response = await axios.get(`https://api.mydreambeauty.net/api/products/${params.id}?populate=*`);
    const product = response.data.data.attributes;

    return (
      <main className="p-4 md:p-8 flex flex-col md:flex-row max-w-7xl mx-auto">
        <img 
          src={`https://api.mydreambeauty.net${product.image.data.attributes.url}`} 
          alt={product.name} 
          className="w-full md:w-1/2 h-96 object-cover mb-4 md:mb-0 md:mr-8" 
        />
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-6">{product.description}</p>
		<button 
		  onClick={() => addToCart({ id: params.id, name: product.name, price: product.price })} 
		  className="bg-black text-white px-6 py-3 font-semibold"
		>
		  Add to Cart
		</button>
        </div>
      </main>
    );
  } catch (error) {
    return <p className="p-8 text-center text-red-500">Failed to load product. Check console for details.</p>;
  }
}
