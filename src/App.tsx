import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
import DealsSection from './components/DealsSection';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AuthCallback from './components/AuthCallback';
import CartModal from './components/CartModal';
import { useProducts } from './hooks/useProducts';
import { useAuth } from './hooks/useAuth';
import './App.css';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const { products, searchProducts, fetchProducts } = useProducts();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchProducts(query);
    } else {
      await fetchProducts();
    }
  };

  const handleAuthRequired = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onSearch={handleSearch}
        onAuthRequired={handleAuthRequired}
        onCartOpen={() => setIsCartModalOpen(true)}
      />
      
      {searchQuery ? (
        <SearchResults results={products} query={searchQuery} />
      ) : (
        <>
          <HeroSection />
          <CategoryGrid />
          <DealsSection />
        </>
      )}
      
      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onAuthRequired={() => handleAuthRequired('signin')}
      />
    </div>
  );
}

function App() {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
