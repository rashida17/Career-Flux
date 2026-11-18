import { API, headers, request } from "./profile";

/* employer */
export const getMyVerification = () => request("/verification/me");

export const submitVerification = ({ website, document }) => {
  const fd = new FormData();
  fd.append("website", website || "");
  if (document instanceof File) fd.append("document", document);
  return request("/verification", { method: "POST", body: fd });
};

/* admin */
export const listVerificationRequests = (status = "") =>
  request(`/admin/verification-requests${status ? `?status=${status}` : ""}`);

export const getVerificationRequestCounts = () =>
  request("/admin/verification-requests/counts");

export const approveVerification = (id) =>
  request(`/admin/verification-requests/${id}/approve`, { method: "PATCH" });

export const rejectVerification = (id, reason) =>
  request(`/admin/verification-requests/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });

// The PDF needs the login token, so a plain link will not work: fetch it, then open it in a new tab.
export async function openVerificationDocument(id) {
  const tab = window.open("", "_blank"); // open first so popup blockers allow it
  try {
    const res = await fetch(`${API}/admin/verification-requests/${id}/document`, { headers: headers() });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Could not open the document.");
    const url = URL.createObjectURL(await res.blob());
    if (tab) tab.location.href = url;
    else window.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (err) {
    tab?.close();
    throw err;
  }
}