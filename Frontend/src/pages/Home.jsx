import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero1';
import FeaturedJobs from '../components/FeaturedJobs1';
import About from '../components/About';
import Footer from '../components/Footer';
import RoleSelectModal from '../components/RoleSelectModal'; // NEW

const emptySearch = { query: '', category: '', location: '' };

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState(emptySearch);
  const [roleModalOpen, setRoleModalOpen] = useState(false); // NEW

  const handleSearch = (values) => {
    setSearch(values);
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClear = () => setSearch(emptySearch);

  // Header buttons call this. Register opens the role choice.

const handleAuth = (type) => {
  if (type === 'Register') {
    setRoleModalOpen(true);
    return;
  }

  if (type === 'Sign In') {
    navigate('/login');
  }
};

  const closeRoleModal = useCallback(() => setRoleModalOpen(false), []); // NEW

  // role is 'seeker' or 'provider'
 
const handleRoleSelect = (role) => {
  setRoleModalOpen(false);

  const signupRole = role === 'provider' ? 'employer' : 'jobseeker';

  navigate(`/signup?type=${signupRole}`);
};

const handleSignInFromModal = () => {
  setRoleModalOpen(false);
  navigate('/login');
};

  return (
    <div className="bg-white text-slate-800 antialiased selection:bg-brand-500 selection:text-white">

      <Header onAuth={handleAuth} />
      <main>
        <Hero onSearch={handleSearch} />
        <FeaturedJobs search={search} onClear={handleClear} />
        <About />
      </main>
      <Footer />

      {/* NEW: role choice window */}
      {roleModalOpen && (
        <RoleSelectModal
          onSelect={handleRoleSelect}
          onSignIn={handleSignInFromModal}
          onClose={closeRoleModal}
        />
      )}
    </div>
  );
}