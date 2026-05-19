import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Mannager = () => {
  const [form, setForm] = useState({ site: '', username: '', password: '', id: '' });
  const [passwordArray, setPasswordArray] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      setPasswordArray(JSON.parse(storedPasswords));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('passwords', JSON.stringify(passwordArray));
  }, [passwordArray]);

  const notify = (message, type = 'default') => {
    toast(message, {
      position: 'top-right',
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
      type,
    });
  };

  const clearForm = () => {
    setForm({ site: '', username: '', password: '', id: '' });
    setShowPassword(false);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (form.site.trim().length < 4 || form.username.trim().length < 4 || form.password.trim().length < 4) {
      notify('Please complete all fields with at least 4 characters.', 'error');
      return;
    }

    if (isEditing) {
      setPasswordArray((current) => current.map((item) => (item.id === form.id ? { ...form } : item)));
      notify('Password updated successfully ✅', 'success');
    } else {
      const newEntry = { ...form, id: uuidv4(), createdAt: new Date().toISOString() };
      setPasswordArray((current) => [...current, newEntry]);
      notify('Password saved successfully ✅', 'success');
    }

    clearForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this password?')) return;
    setPasswordArray((current) => current.filter((item) => item.id !== id));
    notify('Password deleted 💥', 'success');
  };

  const handleEdit = (id) => {
    const item = passwordArray.find((entry) => entry.id === id);
    if (!item) return;
    setForm(item);
    setShowPassword(true);
    setIsEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      notify('Copied to clipboard 📋', 'success');
    } catch {
      notify('Unable to copy to clipboard.', 'error');
    }
  };

  const generatePassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
    const generated = Array.from({ length: 16 }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
    setForm((current) => ({ ...current, password: generated }));
    setShowPassword(true);
    notify('Generated a secure password 🔐', 'info');
  };

  const filteredPasswords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return passwordArray;
    return passwordArray.filter((entry) =>
      entry.site.toLowerCase().includes(query) ||
      entry.username.toLowerCase().includes(query)
    );
  }, [passwordArray, searchQuery]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>

      <div className="p-4 md:mycontainer md:px-0">
        <h1 className="font-bold text-4xl text-center">
          <span className="text-green-600">&lt;</span>
          Password
          <span className="text-green-600"> Manager</span>
          <span className="text-green-600">/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center mb-8">Your secure password manager with search, copy, and password generation.</p>

        <div className="text-black flex flex-col gap-6 p-4 rounded-3xl bg-white/90 shadow-xl border border-green-200/40 md:max-w-4xl mx-auto">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
            <input
              value={form.site}
              onChange={handleChange}
              name="site"
              type="text"
              placeholder="Enter website URL"
              className="rounded-full border border-green-500 p-4 text-black w-full"
            />
            <button
              type="button"
              onClick={generatePassword}
              className="rounded-full bg-cyan-500 text-white px-5 py-3 font-semibold hover:bg-cyan-600 transition"
            >
              Generate
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.username}
              onChange={handleChange}
              name="username"
              type="text"
              placeholder="Enter username"
              className="rounded-full border border-green-500 p-4 text-black w-full"
            />
            <div className="relative">
              <input
                value={form.password}
                onChange={handleChange}
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                className="rounded-full border border-green-500 p-4 text-black w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-sm text-slate-700 shadow"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <span className="text-sm text-slate-600">Use at least 4 characters for each field.</span>
            <button
              type="button"
              onClick={handleSave}
              className="self-start rounded-full bg-green-500 px-8 py-3 text-white font-semibold hover:bg-green-600 transition"
            >
              {isEditing ? 'Update Password' : 'Save Password'}
            </button>
          </div>
        </div>

        <div className="mt-10 md:max-w-4xl mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
            <h2 className="text-2xl font-bold">Your Passwords</h2>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by site or username"
              className="rounded-full border border-green-500 p-3 text-black w-full md:w-80"
            />
          </div>

          {filteredPasswords.length === 0 ? (
            <div className="rounded-3xl bg-white/90 p-8 text-center text-slate-700 shadow-xl">
              No passwords found. Add one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl bg-white/90 shadow-xl border border-green-200/40">
              <table className="min-w-full text-left">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="px-6 py-3">Site</th>
                    <th className="px-6 py-3">Username</th>
                    <th className="px-6 py-3">Password</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {filteredPasswords.map((item) => (
                    <tr key={item.id} className="border-t border-green-200/80 hover:bg-green-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <a
                            href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-700 font-semibold hover:underline"
                          >
                            {item.site}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.site)}
                            className="text-sm text-slate-500 hover:text-slate-900"
                          >
                            Copy site
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <span>{item.username}</span>
                          <button type="button" onClick={() => handleCopy(item.username)} className="text-sm text-slate-500 hover:text-slate-900">
                            Copy
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-mono">{item.password}</span>
                          <button type="button" onClick={() => handleCopy(item.password)} className="text-sm text-slate-500 hover:text-slate-900">
                            Copy
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(item.id)}
                          className="rounded-full bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-full bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Mannager;
