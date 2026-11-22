import { useRef, useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  GraduationCap,
  Building2,
  FileText,
  LayoutDashboard,
  UserRound,
  Code,
  Search,
  CalendarCheck,
  Map,
  Settings,
  LogOut,
} from "lucide-react";

import ConfigForm from "../components/FormLayout";
import DashboardLayout from "../components/DashboardLayout";

/* ---------- Shared input styles ---------- */

const inputBase =
  "w-full rounded-2xl border bg-stone-50 px-4 py-3.5 text-sm font-medium text-slate-800 " +
  "placeholder:text-stone-400 outline-none transition-colors focus:bg-white";

const inputOk = "border-stone-200 focus:border-brand-400";
const inputErr = "border-brand-300 bg-white focus:border-brand-400";

const PK_PHONE = /^(\+92|0)?3\d{2}[-\s]?\d{7}$/;

const THIS_YEAR = new Date().getFullYear();

const PAST_YEARS = Array.from(
  { length: 40 },
  (_, i) => String(THIS_YEAR - i)
);

const END_YEARS = Array.from(
  { length: 46 },
  (_, i) => String(THIS_YEAR + 6 - i)
);

const MAX_ENTRIES = 5;

/* ---------- Sidebar navigation ---------- */

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Profile", icon: UserRound },
  { label: "My Skills", icon: Code },
  { label: "Find Jobs", icon: Search },
  { label: "My Applications", icon: FileText },
  { label: "Interviews", icon: CalendarCheck },
  { label: "Career Roadmap", icon: Map },
  { label: "Settings", icon: Settings },
  { label: "Logout", icon: LogOut },
];

/* ---------- Profile Photo Upload Component ---------- */

function PhotoUpload({ photo, setPhoto }) {
  const fileRef = useRef(null);
  const [error, setError] = useState("");

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Please choose a PNG or JPG image.");
    } else if (file.size > 2 * 1024 * 1024) {
      setError("Image must be 2MB or smaller.");
    } else {
      setError("");
      // Base64 conversion taake photo MongoDB mein save ho sake aur re-login par bhi dikhe
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

  const removePhoto = () => {
    setPhoto("");
    setError("");
  };

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-brand-200 bg-brand-50">
        {photo ? (
          <img
            src={photo}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <User
            size={44}
            strokeWidth={1.75}
            className="text-brand-400"
            aria-label="Default profile icon"
          />
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:bg-brand-50 hover:text-brand-600"
          >
            {photo ? "Change Photo" : "Upload Photo"}
          </button>

          {photo && (
            <button
              type="button"
              onClick={removePhoto}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
            >
              Remove
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handlePhoto}
          className="hidden"
        />

        <p className="mt-2 text-xs text-stone-400">
          Optional. PNG, JPG up to 2MB
        </p>

        {error && (
          <p className="mt-1 text-sm font-semibold text-brand-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Basic profile fields ---------- */

const profileFields = [
  {
    name: "full_name",
    label: "Full Name",
    type: "text",
    icon: User,
    placeholder: "e.g. Rashida Iqbal",
    autoComplete: "name",
    minLength: 3,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    icon: Mail,
    placeholder: "you@example.com",
    disabled: true,
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "tel",
    icon: Phone,
    placeholder: "03XX-XXXXXXX",
    autoComplete: "tel",
    validate: (v) =>
      !v || PK_PHONE.test(v.trim())
        ? ""
        : "Enter a valid number, e.g. 0300-1234567.",
  },
  {
    name: "location",
    label: "City / Location",
    type: "text",
    icon: MapPin,
    placeholder: "Enter your city",
    optional: true,
  },
  {
    name: "bio",
    label: "About Me",
    type: "textarea",
    rows: 4,
    maxLength: 500,
    optional: true,
    placeholder:
      "Write 2-3 lines about yourself, your strengths and the kind of role you want.",
  },
];

/* ---------- Entry helpers ---------- */

const emptyEducation = () => ({
  institute: "",
  degree: "",
  startYear: "",
  endYear: "",
  current: false,
});

const emptyExperience = () => ({
  company: "",
  title: "",
  startYear: "",
  endYear: "",
  current: false,
});

/* ---------- Validation ---------- */

function validateEntry(e, req) {
  const err = {};

  req.forEach(([key, msg]) => {
    if (!String(e[key] || "").trim()) {
      err[key] = msg;
    }
  });

  if (!e.startYear) {
    err.startYear = "Select start year.";
  }

  if (!e.current && !e.endYear) {
    err.endYear = "Select end year.";
  }

  if (
    e.startYear &&
    e.endYear &&
    !e.current &&
    Number(e.endYear) < Number(e.startYear)
  ) {
    err.endYear = "End year can't be before start year.";
  }

  return err;
}

function validateEntries(values) {
  const education = (values.education || []).map((e) =>
    validateEntry(e, [
      ["institute", "Enter institute name."],
      ["degree", "Enter degree or program."],
    ])
  );

  const experience = values.is_fresher
    ? []
    : (values.experience || []).map((e) =>
        validateEntry(e, [
          ["company", "Enter company name."],
          ["title", "Enter job title."],
        ])
      );

  let general = "";

  if (!(values.education || []).length) {
    general = "Add at least one education entry.";
  } else if (
    !values.is_fresher &&
    !(values.experience || []).length
  ) {
    general = 'Add an experience entry or tick "I am a fresher".';
  }

  const hasError =
    Boolean(general) ||
    education.some((o) => Object.keys(o).length) ||
    experience.some((o) => Object.keys(o).length);

  return {
    education,
    experience,
    general,
    hasError,
  };
}

/* ---------- Small UI components ---------- */

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </span>

      {children}

      {error && (
        <span className="mt-2 block text-sm font-semibold text-brand-700">
          {error}
        </span>
      )}
    </label>
  );
}

function YearSelect({
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputBase} appearance-none disabled:cursor-not-allowed disabled:opacity-50 ${
        value ? "" : "text-stone-400"
      } ${error ? inputErr : inputOk}`}
    >
      <option value="">{placeholder}</option>

      {options.map((y) => (
        <option key={y} value={y} className="text-slate-800">
          {y}
        </option>
      ))}
    </select>
  );
}

/* ---------- Reusable Education / Experience section ---------- */

function EntrySection({
  title,
  icon: Icon,
  addLabel,
  items,
  errors = [],
  onChange,
  newItem,
  config,
  disabledNote,
}) {
  const update = (i, patch) =>
    onChange(
      items.map((it, idx) =>
        idx === i ? { ...it, ...patch } : it
      )
    );

  const remove = (i) =>
    onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className="text-brand-500" />

        <h3 className="text-base font-extrabold text-slate-900">
          {title}
        </h3>
      </div>

      {disabledNote ? (
        <p className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          {disabledNote}
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((it, i) => {
            const er = errors[i] || {};

            return (
              <div
                key={i}
                className="rounded-2xl border border-stone-200 bg-white p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    {title} {i + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label={`Remove ${title} ${i + 1}`}
                    className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    label={config.primaryLabel}
                    error={er[config.primaryKey]}
                  >
                    <input
                      value={it[config.primaryKey]}
                      onChange={(e) =>
                        update(i, {
                          [config.primaryKey]: e.target.value,
                        })
                      }
                      placeholder={config.primaryPlaceholder}
                      className={`${inputBase} ${
                        er[config.primaryKey] ? inputErr : inputOk
                      }`}
                    />
                  </Field>

                  <Field
                    label={config.secondaryLabel}
                    error={er[config.secondaryKey]}
                  >
                    <input
                      value={it[config.secondaryKey]}
                      onChange={(e) =>
                        update(i, {
                          [config.secondaryKey]: e.target.value,
                        })
                      }
                      placeholder={config.secondaryPlaceholder}
                      className={`${inputBase} ${
                        er[config.secondaryKey] ? inputErr : inputOk
                      }`}
                    />
                  </Field>

                  <Field label="Start Year" error={er.startYear}>
                    <YearSelect
                      value={it.startYear}
                      options={PAST_YEARS}
                      placeholder="Select year"
                      error={er.startYear}
                      onChange={(v) => update(i, { startYear: v })}
                    />
                  </Field>

                  <Field label="End Year" error={er.endYear}>
                    <YearSelect
                      value={it.current ? "" : it.endYear}
                      options={END_YEARS}
                      placeholder={
                        it.current ? config.currentText : "Select year"
                      }
                      error={er.endYear}
                      disabled={it.current}
                      onChange={(v) => update(i, { endYear: v })}
                    />
                  </Field>
                </div>

                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={it.current}
                    onChange={(e) =>
                      update(i, {
                        current: e.target.checked,
                        endYear: "",
                      })
                    }
                    className="h-4 w-4 rounded border-stone-300 accent-[#DC4A1F]"
                  />

                  {config.currentText}
                </label>
              </div>
            );
          })}

          {items.length < MAX_ENTRIES && (
            <button
              type="button"
              onClick={() => onChange([...items, newItem()])}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm font-bold text-brand-600 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              <Plus size={16} />
              {addLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Helper to get stored user email/name fallback ---------- */

const getStoredUserFallback = () => {
  try {
    const raw =
      localStorage.getItem("careerFluxUser") ||
      sessionStorage.getItem("careerFluxUser");
    if (!raw) return { full_name: "", email: "" };
    const parsed = JSON.parse(raw);
    const u = parsed.user || parsed.data?.user || parsed;
    return {
      full_name: u?.name || "",
      email: u?.email || "",
    };
  } catch {
    return { full_name: "", email: "" };
  }
};

/* ---------- Job Seeker Profile Page ---------- */

export default function JobSeekerProfileForm({ onNavigate }) {
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fallbackUser = getStoredUserFallback();

  const [profile, setProfile] = useState({
    full_name: fallbackUser.full_name,
    email: fallbackUser.email,
    phone_number: "",
    location: "",
    bio: "",
    education: [emptyEducation()],
    experience: [],
    is_fresher: false,
    photo: "",
  });

  const [entryErrors, setEntryErrors] = useState({
    education: [],
    experience: [],
    general: "",
  });

  /* ---------- Fetch live profile from MongoDB on load ---------- */
  useEffect(() => {
    const fetchProfileFromDB = async () => {
      try {
        const token =
          localStorage.getItem("careerFluxToken") ||
          sessionStorage.getItem("careerFluxToken") ||
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        if (!token) {
          setFetching(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/jobseeker/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.profile) {
          setProfile((prev) => ({
            ...prev,
            ...data.profile,
            email: data.profile.email || prev.email,
            education:
              data.profile.education && data.profile.education.length > 0
                ? data.profile.education
                : [emptyEducation()],
            experience: data.profile.experience || [],
          }));
        }
      } catch (err) {
        console.error("Failed to fetch job seeker profile:", err);
        setEntryErrors((prev) => ({
          ...prev,
          general: "Unable to load profile data from server.",
        }));
      } finally {
        setFetching(false);
      }
    };

    fetchProfileFromDB();
  }, []);

  /* ---------- Save profile to MongoDB ---------- */
  const handleSubmit = async (values) => {
    setSaving(true);
    setEntryErrors({ education: [], experience: [], general: "" });

    const result = validateEntries(values);
    setEntryErrors(result);

    if (result.hasError) {
      setSaving(false);
      return;
    }

    try {
      const token =
        localStorage.getItem("careerFluxToken") ||
        sessionStorage.getItem("careerFluxToken") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/jobseeker/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      if (data.profile) {
        setProfile((prev) => ({ ...prev, ...data.profile }));
      }

      setToast("Profile successfully saved to local MongoDB!");
      window.dispatchEvent(new Event("careerFluxProfileUpdate"));
    } catch (err) {
      console.error("Profile save error:", err);
      setEntryErrors((prev) => ({
        ...prev,
        general: err.message || "Network error.",
      }));
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 4000);
    }
  };

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      activeTab="My Profile"
      onNavigate={onNavigate}
      workspaceLabel="Job Seeker Workspace"
      menuTitle="Job Seeker Menu"
      user={{
        name: profile.full_name || "Job Seeker",
        email: profile.email,
      }}
      role="jobseeker"
    >
      <div className="w-full max-w-none space-y-5">
        {toast && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {toast}
          </div>
        )}

        {entryErrors.general && (
          <div className="rounded-2xl border border-brand-300 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">
            {entryErrors.general}
          </div>
        )}

        {fetching ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm font-semibold text-stone-500">
            Loading your profile...
          </div>
        ) : (
          <ConfigForm
            key={profile._id || "profile-form"}
            title="My Profile"
            description="Keep your details up to date so employers and our AI can match you better."
            submitLabel={saving ? "Saving..." : "Save Changes"}
            submitPlacement="header"
            fields={profileFields}
            initialValues={{
              education: [emptyEducation()],
              experience: [],
              is_fresher: false,
              photo: "",
              ...profile,
            }}
            onSubmit={handleSubmit}
            before={({ values, setValue }) => (
              <PhotoUpload
                photo={values.photo}
                setPhoto={(p) => setValue("photo", p)}
              />
            )}
            after={({ values, setValue }) => (
              <div className="space-y-8">
                <EntrySection
                  title="Education"
                  icon={GraduationCap}
                  addLabel="Add another education"
                  items={values.education || []}
                  errors={entryErrors.education}
                  onChange={(v) => setValue("education", v)}
                  newItem={emptyEducation}
                  config={{
                    primaryKey: "institute",
                    primaryLabel: "Institute / University",
                    primaryPlaceholder: "e.g. University of the Punjab",
                    secondaryKey: "degree",
                    secondaryLabel: "Degree / Program",
                    secondaryPlaceholder: "e.g. BS Computer Science",
                    currentText: "Currently studying",
                  }}
                />

                <div>
                  <label className="mb-4 flex cursor-pointer items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={Boolean(values.is_fresher)}
                      onChange={(e) => {
                        setValue("is_fresher", e.target.checked);

                        if (e.target.checked) {
                          setValue("experience", []);
                        }
                      }}
                      className="h-4 w-4 rounded border-stone-300 accent-[#DC4A1F]"
                    />
                    I am a fresher (no work experience yet)
                  </label>

                  <EntrySection
                    title="Experience"
                    icon={Building2}
                    addLabel="Add another experience"
                    items={values.experience || []}
                    errors={entryErrors.experience}
                    onChange={(v) => setValue("experience", v)}
                    newItem={emptyExperience}
                    disabledNote={
                      values.is_fresher
                        ? "Marked as fresher. Untick the box above to add work experience."
                        : ""
                    }
                    config={{
                      primaryKey: "company",
                      primaryLabel: "Company",
                      primaryPlaceholder: "e.g. TechSolutions",
                      secondaryKey: "title",
                      secondaryLabel: "Job Title",
                      secondaryPlaceholder: "e.g. Frontend Intern",
                      currentText: "Currently working here",
                    }}
                  />

                  {!values.is_fresher &&
                    (values.experience || []).length === 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setValue("experience", [emptyExperience()])
                        }
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm font-bold text-brand-600 transition-colors hover:border-brand-300 hover:bg-brand-50"
                      >
                        <Plus size={16} />
                        Add experience
                      </button>
                    )}
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-stone-600">
                    Skills and proof (GitHub, certificates) are managed separately.
                  </p>

                  <button
                    type="button"
                    onClick={() => onNavigate?.("My Skills")}
                    className="shrink-0 rounded-xl border border-brand-500 px-4 py-2 text-sm font-bold text-brand-600 transition-colors hover:bg-brand-50"
                  >
                    Manage Skills
                  </button>
                </div>
              </div>
            )}
          />
        )}
      </div>
    </DashboardLayout>
  );
}