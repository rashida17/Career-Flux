import { useState } from "react";
import AuthLayout, {
  Field,
  GoogleButton,
  Divider,
  FormError,
  SubmitButton,
  MailIcon,
  LockIcon,
} from "../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";

const LOGIN = {
  seeker: {
    badge: "Your Journey Begins Here",
    cta: "Sign In",
    slides: [
      {
        title: "Your Career, Your Future",
        text: "Explore opportunities and take the next step toward your goals.",
        icon: "globe",
      },
      {
        title: "Smart Matches, Better Opportunities",
        text: "Connect with the right opportunities and talent through CareerFlux.",
        icon: "bulb",
      },
      {
        title: "Make Your Next Move",
        text: "Discover possibilities, build connections, and move forward with confidence.",
        icon: "rocket",
      },
    ],
  },

  employer: {
    badge: "Your Journey Begins Here",
    cta: "Sign In",
    slides: [
      {
        title: "Your Career, Your Future",
        text: "Explore opportunities and take the next step toward your goals.",
        icon: "globe",
      },
      {
        title: "Smart Matches, Better Opportunities",
        text: "Connect with the right opportunities and talent through CareerFlux.",
        icon: "bulb",
      },
      {
        title: "Make Your Next Move",
        text: "Discover possibilities, build connections, and move forward with confidence.",
        icon: "rocket",
      },
    ],
  },
};

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") || params.get("role");

  const role =
    type === "employer" || type === "provider"
      ? "employer"
      : "seeker";

  // Navbar Register button handler
  const handleAuth = (action) => {
    if (action === "Register") {
      const signupType =
        role === "employer" ? "employer" : "jobseeker";

      navigate(`/signup?type=${signupType}`);
    }
  };

  
const update = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  setError("");
  setSuccess("");
};


  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          remember,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

   setError("");

// Save the login state according to "Keep me signed in"
const loggedInUser = JSON.stringify({
  email: form.email,
  role: role,
});

if (remember) {
  localStorage.setItem("careerFluxUser", loggedInUser);
  sessionStorage.removeItem("careerFluxUser");
} else {
  sessionStorage.setItem("careerFluxUser", loggedInUser);
  localStorage.removeItem("careerFluxUser");
}

// Notify the shared navbar immediately
window.dispatchEvent(new Event("careerFluxAuthChange"));

setSuccess(data.message || "Login successful!");

setTimeout(() => {
  navigate("/");
}, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setError("Server is not working.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      role={role}
      onAuth={handleAuth}
     
      showcase={LOGIN[role]}
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to={`/signup?type=${
              role === "employer" ? "employer" : "jobseeker"
            }`}
           className="font-bold text-[#C84B31]"
          >
            Create account
          </Link>
        </>
      }
    >
      {/* <GoogleButton />
      <Divider>or continue with email</Divider> */}

      <form onSubmit={submit}>
        <Field
          icon={<MailIcon />}
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={update}
          autoComplete="email"
        />

        <Field
          icon={<LockIcon />}
          password
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={update}
          autoComplete="current-password"
        />

        <label className="my-3 flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Keep me signed in
        </label>

<SubmitButton>
  {loading ? "Signing in..." : LOGIN[role].cta}
</SubmitButton>

<FormError message={error} />

{success && (
  <p className="mb-2 text-[13px] font-semibold text-brand-700">
    {success}
  </p>
)}
      </form>
    </AuthLayout>
  );
}