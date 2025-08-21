export default function Home() {
  return (
    <main>
      <section className="relative h-96">
        <img src="/hero.jpg" alt="Beauty Hero" className="w-full h-full object-cover" /> {/* Upload your hero image to public/ */}
        <div className="absolute inset-0 flex items-center justify-center text-center text-white bg-black bg-opacity-30">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold">Timeless Beauty Awaits</h1>
            <a href="/shop" className="mt-4 inline-block bg-white text-black px-6 py-3 font-semibold">Shop Now</a>
          </div>
        </div>
      </section>
      <section className="p-8 max-w-7xl mx-auto">
        <h2 className="text-2xl mb-6 text-center">Featured Collections</h2>
        {/* Add featured products grid here later via API */}
      </section>
    </main>
  );
}
