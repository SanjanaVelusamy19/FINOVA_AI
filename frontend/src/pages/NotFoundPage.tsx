import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight px-4 py-10 text-slate-100">
      <div className="glass-card max-w-xl p-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">The page you are looking for doesn’t exist or has been moved.</p>
        <Link to="/" className="mt-8 inline-flex rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-cyan-300">Return home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
