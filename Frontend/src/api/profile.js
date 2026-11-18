export const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// login saves the token as "careerFluxToken" (localStorage if "Keep me signed in", otherwise sessionStorage)
export const headers = () => {
  const token = localStorage.getItem("careerFluxToken") || sessionStorage.getItem("careerFluxToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, { ...options, headers: { ...headers(), ...options.headers } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.message || "Something went wrong.");
    err.errors = json.errors || {};
    throw err;
  }
  return json.data !== undefined ? json.data : json;
}

// Builds multipart body. File objects are uploaded; strings in file fields (existing URLs) are skipped.
const toFormData = (values, fileFields) => {
  const fd = new FormData();
  Object.entries(values).forEach(([k, v]) => {
    if (k === "isVerified" || k === "id") return;
    if (fileFields.includes(k)) {
      if (v instanceof File) fd.append(k, v);
      return;
    }
    fd.append(k, v ?? "");
  });
  return fd;
};

export const getCompanyProfile = () => request("/company-profile/me");
export const saveCompanyProfile = (v) => request("/company-profile/me", { method: "PUT", body: toFormData(v, ["logo", "coverImage"]) });
export const getEmployerProfile = () => request("/employer-profile/me");
export const saveEmployerProfile = (v) => request("/employer-profile/me", { method: "PUT", body: toFormData(v, ["photo"]) });
export const getMyPublicProfile = () => request("/company-profile/me/public");
export const getPublicCompany = (id) => request(`/companies/${id}/public`);