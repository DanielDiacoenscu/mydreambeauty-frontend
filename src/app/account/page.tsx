export default function Account() {
  return (
    <main className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl mb-6 text-center">My Account</h1>
      <section className="mb-8">
        <h2 className="text-2xl mb-4">Login / Register</h2>
        <p>Placeholder: Integrate Strapi user authentication here (e.g., JWT login form).</p>
        {/* Add forms later */}
      </section>
      <section>
        <h2 className="text-2xl mb-4">Order History</h2>
        <p>No orders yet. Shop now!</p>
      </section>
    </main>
  );
}
