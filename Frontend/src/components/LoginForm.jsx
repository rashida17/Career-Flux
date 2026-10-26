
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Login error:', error);
      alert('Server se connection nahi ho saka.');
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-[#E7E5E4] bg-white p-6 shadow-xl shadow-[#0F172A]/5 sm:p-8">

      <div className="mb-7 text-center">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
          Login to your account
        </h2>

        <p className="text-sm leading-6 text-[#78716C]">
          Welcome back! Please enter your details to sign in.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Email */}
        <label className="flex w-full items-center gap-3 rounded-xl border border-[#E7E5E4] bg-[#FAF8F5] px-4 transition focus-within:border-[#C84B31] focus-within:ring-2 focus-within:ring-[#FDF4F2]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C84B31"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>

          <span className="sr-only">Email address</span>

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            required
            className="min-w-0 w-full bg-transparent py-3 text-sm font-medium text-[#0F172A] outline-none placeholder:font-normal placeholder:text-[#A8A29E]"
          />
        </label>

        {/* Password */}
        <label className="flex w-full items-center gap-3 rounded-xl border border-[#E7E5E4] bg-[#FAF8F5] px-4 transition focus-within:border-[#C84B31] focus-within:ring-2 focus-within:ring-[#FDF4F2]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C84B31"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>

          <span className="sr-only">Password</span>

          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="min-w-0 w-full bg-transparent py-3 text-sm font-medium text-[#0F172A] outline-none placeholder:font-normal placeholder:text-[#A8A29E]"
          />
        </label>

        {/* Remember Me + Forgot Password */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#57534E]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded accent-[#C84B31]"
            />
            Keep me signed in
          </label>

          <a
            href="/forgot-password"
            className="text-xs font-semibold text-[#C84B31] transition hover:text-[#A83B26] hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Sign In */}
        <button
          type="submit"
          className="mt-1 w-full rounded-xl bg-[#C84B31] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#C84B31]/15 transition hover:bg-[#A83B26] focus:outline-none focus:ring-2 focus:ring-[#C84B31] focus:ring-offset-2"
        >
          Sign In
        </button>

      </form>

      <p className="mt-6 text-center text-sm text-[#78716C]">
        Don't have an account?{' '}
        <a
          href="/signup"
          className="font-semibold text-[#C84B31] transition hover:text-[#A83B26] hover:underline"
        >
          Create account
        </a>
      </p>

      <p className="mt-5 text-center text-xs leading-5 text-[#A8A29E]">
        Your information is kept private and secure.
      </p>

    </div>
  );
}
