import { useState } from "react";
import AuthLayout, {
  Field,
  FormError,
  SubmitButton,
  MailIcon,
  LockIcon,
} from "../components/AuthLayout";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
// Address of the Node/Express backend
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SIGNUP = {
  seeker: {
    badge: "For job seekers",
    cta: "Create Job Seeker Account",
    slides: [
      {
        title: "Jobs Matched To You",
        text: "Discover roles that fit your skills, in your city or fully remote, and apply in a few taps.",
        icon: "globe",
      },
      {
        title: "Smart Skill Insights",
        text: "Identify in-demand skills to raise your market value and land better offers faster.",
        icon: "bulb",
      },
      {
        title: "Accelerated Roadmaps",
        text: "Follow curated career tracks and watch each application move forward until you are hired.",
        icon: "rocket",
      },
    ],
  },
  employer: {
    badge: "For job providers",
    cta: "Create Job Provider Account",
    slides: [
      {
        title: "Hire The Right Talent",
        text: "Post a job and reach candidates whose skills match exactly what your team needs.",
        icon: "globe",
      },
      {
        title: "Smart Candidate Matching",
        text: "Review ranked profiles and shortlist the best-fit applicants in a fraction of the time.",
        icon: "bulb",
      },
      {
        title: "Faster Hiring Pipeline",
        text: "Manage every applicant from one dashboard, from first look to signed offer.",
        icon: "rocket",
      },
    ],
  },
};

function passwordProblems(p) {
  const problems = [];
  if (p.length < 8) problems.push("is too short (minimum 8 characters)");
  if (p.length > 64) problems.push("is too long (maximum 64 characters)");
  if (!/[A-Z]/.test(p)) problems.push("has no uppercase letter");
  if (!/[a-z]/.test(p)) problems.push("has no lowercase letter");
  if (!/\d/.test(p)) problems.push("has no number");
  if (!/[^A-Za-z0-9\s]/.test(p))
    problems.push("has no special character (like ! @ # $)");
  if (/\s/.test(p)) problems.push("contains spaces");
  return problems;
}
const joinList = (items) =>
  items.length > 1
    ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
    : items[0];

export default function SignUp() {
  const [params, setParams] = useSearchParams();
  const type = params.get("type") || params.get("role");
  const role =
    type === "employer" || type === "provider" ? "employer" : "seeker";
  const setRole = (r) =>
    setParams(
      { type: r === "employer" ? "employer" : "jobseeker" },
      { replace: true },
    );

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const problems = passwordProblems(form.password);
  const showPwMessage =
    pwTouched && form.password.length > 0 && problems.length > 0;
  const mismatch = form.confirm.length > 0 && form.confirm !== form.password;

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setPwTouched(true);
    if (problems.length) return; // the message under the field explains why
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          confirmPassword: form.confirm,
          role: role === "employer" ? "employer" : "jobseeker",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.message || "Signup failed. Please try again.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Is the backend running?"
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      role={role}
      onRoleChange={setRole}
      showcase={SIGNUP[role]}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-brand">
            Sign in
          </Link>
        </>
      }
    >
      {/* <GoogleButton /> */}
      {/* <Divider>or continue with email</Divider> */}
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
          placeholder="Create a strong password"
          value={form.password}
          onChange={update}
          onBlur={() => setPwTouched(true)}
          autoComplete="new-password"
          maxLength={64}
        />
        {showPwMessage && (
          <p
            role="alert"
            className="-mt-1.5 mb-2 px-1 text-xs font-semibold leading-snug text-brand-700"
          >
            Password not accepted: it {joinList(problems)}.
          </p>
        )}
        <Field
          icon={<LockIcon />}
          password
          type="password"
          name="confirm"
          placeholder="Confirm password"
          value={form.confirm}
          onChange={update}
          autoComplete="new-password"
          maxLength={64}
        />
        {mismatch && (
          <p className="-mt-1.5 mb-2 px-1 text-xs font-semibold text-brand-700">
            Passwords do not match.
          </p>
        )}
        <FormError message={error} />
        <SubmitButton>
          {loading ? "Creating account..." : SIGNUP[role].cta}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
