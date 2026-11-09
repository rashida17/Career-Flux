
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserRound, ShieldCheck } from 'lucide-react';

export default function ManageAccounts({ mode = 'recent' }) {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get admin token
  const getToken = () =>
    localStorage.getItem('careerFluxToken') ||
    sessionStorage.getItem('careerFluxToken');

  // Fetch users according to mode
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const token = getToken();

      if (!token) {
        throw new Error('Login token not found. Please login again.');
      }

      const endpoint =
        mode === 'recent'
          ? 'http://localhost:5000/api/admin/users/recent'
          : 'http://localhost:5000/api/admin/users';

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to fetch accounts');
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [mode]);

  // Activate / Deactivate account
  const toggleStatus = async (user) => {
    try {
      const token = getToken();

      if (!token) {
        throw new Error('Login token not found. Please login again.');
      }

      const newStatus = !user.isActive;

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${user._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update account');
      }

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id
            ? { ...item, isActive: data.user.isActive }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user._id} ${user.name} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const isRecentMode = mode === 'recent';

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft sm:p-6">

      {/* Heading */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {isRecentMode ? 'Recently Added Users' : 'Manage Accounts'}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {isRecentMode
              ? 'Users registered in the last 24 hours'
              : 'Manage and monitor registered platform accounts'}
          </p>
        </div>

        {/* Search and View All */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative block w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search accounts..."
              className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </label>

          {isRecentMode && (
            <button
              type="button"
              onClick={() => navigate('/admin/manage-accounts')}
              className="whitespace-nowrap rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Accounts Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full min-w-[750px] text-left">

          <thead className="bg-stone-50">
            <tr className="border-b border-stone-200">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500">#</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500">Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500">Email</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500">Role</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">

            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-sm text-slate-500">
                  Loading accounts...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id} className="transition hover:bg-brand-50/30">

                  <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-500">
                    #{index + 1}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                        {user.role === 'employer' ? (
                          <ShieldCheck size={17} />
                        ) : (
                          <UserRound size={17} />
                        )}
                      </div>

                      <span className="whitespace-nowrap text-sm font-semibold text-slate-800">
                        {user.name || 'Name not provided'}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                    {user.email}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                    {user.role === 'employer' ? 'Company' : 'Job Seeker'}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        user.isActive
                          ? 'bg-brand-50 text-brand-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={user.isActive}
                        aria-label={`${user.isActive ? 'Deactivate' : 'Activate'} ${user.email}`}
                        onClick={() => toggleStatus(user)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                          user.isActive ? 'bg-brand-500' : 'bg-stone-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            user.isActive
                              ? 'translate-x-[18px]'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-10 text-center text-sm text-slate-500">
                  No accounts found.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-slate-500">
        Showing {filteredUsers.length} of {users.length} accounts
      </div>

    </section>
  );
}
