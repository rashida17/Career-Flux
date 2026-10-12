import { useCallback, useState } from 'react';

import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedJobs from '../components/FeaturedJobs';
import About from '../components/About';
import Footer from '../components/Footer';
import RoleSelectModal from '../components/RoleSelectModal'; // NEW

const emptySearch = { query: '', category: '', location: '' };

export default function Home() {
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
      setRoleModalOpen(true); // NEW
      return;
    }
    // Sign In belongs to your teammate (Nabi). Connect their page here.
    alert('Sign In: connect this to the Sign In page.');
  };

  const closeRoleModal = useCallback(() => setRoleModalOpen(false), []); // NEW

  // role is 'seeker' or 'provider'
  const handleRoleSelect = (role) => {
    setRoleModalOpen(false); // NEW
    // CONNECT HERE: send the user to your teammate's Sign Up page.
    // With React Router:  navigate(`/signup?role=${role}`)
    alert(`Selected role: ${role}\n\nConnect this to the Sign Up page.`);
  };

  const handleSignInFromModal = () => {
    setRoleModalOpen(false); // NEW
    // CONNECT HERE: send the user to the Sign In page.
    alert('Connect this to the Sign In page.');
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