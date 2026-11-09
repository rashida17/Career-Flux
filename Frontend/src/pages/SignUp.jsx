import { useState, useEffect } from "react";
import AuthLayout, {
  Field,
  FormError,
  SubmitButton,
  MailIcon,
  LockIcon,
  ArrowIcon,
  GoogleButton,
  Divider,
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

const RESEND_SECONDS = 60;

export default function SignUp() {
  const [params, setParams] = useSearchParams();
  const type = params.get("type") || params.get("role");
  const role =
    type === "employer" || type === "provider" ? "employer" : "seeker";
  const roleValue = role === "employer" ? "employer" : "jobseeker";
  const setRole = (r) =>
    setParams(
      { type: r === "employer" ? "employer" : "jobseeker" },
      { replace: true },
    );

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "", otp: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const update = (e) => {
    const { name, value } = e.target;
    if (name === "otp") {
      return setForm({ ...form, otp: value.replace(/\D/g, "").slice(0, 6) });
    }
    if (name === "email") {
      // a new email needs a new code and a new verification
      setOtpSent(false);
      setVerified(false);
      setCooldown(0);
      setInfo("");
      setError("");
      return setForm({ ...form, email: value, otp: "" });
    }
    setForm({ ...form, [name]: value });
  };

  // countdown for the "Resend code" button
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // auto-verify as soon as the 6th digit is typed
  useEffect(() => {
    if (form.otp.length === 6 && otpSent && !verified) verifyOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.otp]);

  const problems = passwordProblems(form.password);
  const showPwMessage =
    pwTouched && form.password.length > 0 && problems.length > 0;
  const mismatch = form.confirm.length > 0 && form.confirm !== form.password;

  const post = async (path, body) => {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
    return data;
  };
  const friendly = (err) =>
    err.message === "Failed to fetch"
      ? "Cannot reach the server. Is the backend running?"
      : err.message;

  const finish = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate(
      data.user.role === "employer" ? "/employerdashboard" : "/jobseekerdashboard",
    );
  };

  const sendOtp = async () => {
    if (sending || cooldown > 0) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      return setError("Please enter a valid email address first.");
    }
    setError("");
    setInfo("");
    setSending(true);
    try {
      await post("/api/auth/send-otp", { email: form.email });
      setOtpSent(true);
      setForm((f) => ({ ...f, otp: "" }));
      setCooldown(RESEND_SECONDS);
      setInfo(`We sent a 6-digit code to ${form.email.trim()}. It expires in 10 minutes.`);
    } catch (err) {
      setError(friendly(err));
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    if (verifying || verified) return;
    setError("");
    setVerifying(true);
    try {
      await post("/api/auth/verify-otp", { email: form.email, otp: form.otp });
      setVerified(true);
      setInfo("");
    } catch (err) {
      setError(friendly(err));
    } finally {
      setVerifying(false);
    }
  };

  const googleSignup = async (credential) => {
    setError("");
    try {
      finish(await post("/api/auth/google", { credential, role: roleValue }));
    } catch (err) {
      setError(friendly(err));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Enter key before verification just moves to the next step
    if (!otpSent) return sendOtp();
    if (!verified) {
      if (form.otp.length === 6) return verifyOtp();
      return setError("Enter the 6-digit code sent to your email.");
    }

    setPwTouched(true);
    if (problems.length) return;
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setError("");
    setLoading(true);
    try {
      finish(
        await post("/api/auth/signup", {
          email: form.email,
          password: form.password,
          confirmPassword: form.confirm,
          otp: form.otp,
          role: roleValue,
        }),
      );
    } catch (err) {
      setError(friendly(err));
    } finally {
      setLoading(false);
    }
  };

    // same look as <SubmitButton>, but it can run an onClick and be disabled
  const sendBtnLabel = sending
    ? "Sending..."
    : cooldown > 0
      ? `Resend code in ${cooldown}s`
      : otpSent
        ? "Resend code"
        : "Send verification code";

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
      <GoogleButton onCredential={googleSignup} />
      <Divider>or continue with email</Divider>

      <form onSubmit={submit} noValidate>
        {/* Email (locked once verified) */}
        <Field
          icon={<MailIcon />}
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={update}
          autoComplete="email"
          readOnly={verified}
        />

        {/* STEP 1 & 2: OTP field + send button, hidden after verification */}
        {!verified && (
          <>
            <Field
              icon={<LockIcon />}
              type="text"
              name="otp"
              placeholder="6-digit verification code"
              value={form.otp}
              onChange={update}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              disabled={!otpSent}
            />
            {verifying && (
              <p className="-mt-1.5 mb-2 px-1 text-xs font-semibold text-stone-600">
                Verifying...
              </p>
            )}
            {!verifying && info && (
              <p className="-mt-1.5 mb-2 px-1 text-xs font-semibold text-stone-600">
                {info}
              </p>
            )}

            <FormError message={error} />

            <button
              type="button"
              onClick={sendOtp}
              disabled={sending || cooldown > 0}
              className="mt-1.5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-2xl"
            >
              {sendBtnLabel} <ArrowIcon />
            </button>
          </>
        )}

        {/* STEP 3: shown only after the code is verified */}
        {verified && (
          <>
            <p className="-mt-1 mb-2.5 px-1 text-xs font-bold text-green-600">
              ✓ Email verified
            </p>
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
          </>
        )}
      </form>
    </AuthLayout>
  );
}