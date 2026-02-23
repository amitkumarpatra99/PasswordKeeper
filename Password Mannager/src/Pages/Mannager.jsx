import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEye,
  FaEyeSlash,
  FaClipboard,
  FaEdit,
  FaTrash,
  FaSave,
  FaSearch,
  FaShieldAlt,
  FaLock,
  FaDatabase,
  FaGlobe,
  FaUser,
  FaDice,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";

// ── Password Strength Helper ────────────────────────────────────────────────
function getStrength(password) {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: "Weak", color: "#ef4444" };
  if (score === 2) return { level: 2, label: "Fair", color: "#f97316" };
  if (score === 3 || score === 4) return { level: 3, label: "Good", color: "#22c55e" };
  return { level: 4, label: "Strong", color: "#06b6d4" };
}

// ── Random Password Generator ───────────────────────────────────────────────
function generatePassword(length = 16) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function Mannager() {
  const passwordRef = useRef();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [passwordArray, setPasswordArray] = useState([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const API_URL = "http://localhost:5000/api/passwords";
  const strength = getStrength(form.password);

  // Load all passwords from backend (MongoDB)
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPasswordArray(data))
      .catch(() => toast.error("❌ Unable to connect to database"));
  }, []);

  // Toggle password visibility
  const showPassword = () => {
    setShowPass((prev) => !prev);
    if (passwordRef.current) {
      passwordRef.current.type =
        passwordRef.current.type === "password" ? "text" : "password";
    }
  };

  // Inline validation
  const validate = () => {
    const e = {};
    if (form.site.trim().length < 3) e.site = "Enter a valid website URL";
    if (form.username.trim().length < 3) e.username = "Username must be at least 3 chars";
    if (form.password.trim().length < 3) e.password = "Password must be at least 3 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Generate & fill random password
  const handleGenerate = () => {
    const pwd = generatePassword();
    setForm((prev) => ({ ...prev, password: pwd }));
    setErrors((prev) => ({ ...prev, password: "" }));
    if (passwordRef.current) {
      passwordRef.current.type = "text";
      setShowPass(true);
    }
    toast.info("🎲 Random password generated!", { theme: "dark" });
  };

  // Clear form
  const clearForm = () => {
    setForm({ site: "", username: "", password: "" });
    setErrors({});
    setShowPass(false);
  };

  // Save new password
  const savePassword = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setPasswordArray((prev) => [...prev, data]);
      clearForm();
      toast.success("✅ Password Saved!", { theme: "dark" });
    } catch {
      toast.error("❌ Failed to save password", { theme: "dark" });
    } finally {
      setSaving(false);
    }
  };

  // Delete password
  const deletePassword = async (id) => {
    if (confirm("Delete this password?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        setPasswordArray(passwordArray.filter((item) => item._id !== id));
        toast.info("🗑️ Password Deleted", { theme: "dark" });
      } catch {
        toast.error("❌ Failed to delete", { theme: "dark" });
      }
    }
  };

  // Edit password
  const editPassword = (id) => {
    const found = passwordArray.find((i) => i._id === id);
    if (!found) return;
    setForm({ site: found.site, username: found.username, password: found.password });
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("✏️ Edit mode — update and save", { theme: "dark" });
  };

  // Copy text
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("📋 Copied to Clipboard!", { theme: "dark" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const filteredPasswords = passwordArray.filter(
    (p) =>
      p.site.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase())
  );

  // Field wrapper classes
  const fieldClass = (name) =>
    `w-full pl-10 pr-4 rounded-xl bg-white/10 border p-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 transition-all ${errors[name]
      ? "border-red-500 focus:border-red-400"
      : "border-white/20 focus:border-cyan-400"
    }`;

  return (
    <div className="min-h-screen flex flex-col items-center pt-32 pb-24 px-4 sm:px-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white overflow-hidden">
      <ToastContainer theme="dark" position="top-right" />

      <div className="animate-fadeIn w-full flex flex-col items-center">
        {/* Title */}
        <div className="flex items-center gap-3 mb-3">
          <FaShieldAlt className="text-cyan-400 text-4xl sm:text-5xl drop-shadow-[0_0_12px_#00ffff]" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Password Keeper
          </h1>
        </div>
        <p className="text-gray-300 text-center mb-8 text-base sm:text-lg flex items-center gap-2">
          Manage your passwords securely — stored in MongoDB{" "}
          <FaDatabase className="text-cyan-400" />
        </p>

        {/* ═══════════════════════════════════════════════
            SAVE PASSWORD FORM (Improved)
        ═══════════════════════════════════════════════ */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-lg flex flex-col gap-5 shadow-[0_0_30px_#00ffff18] transition-all duration-300">

          {/* Form Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              <FaLock className="text-cyan-400" /> Add New Password
            </h2>
            <button
              onClick={clearForm}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition"
              title="Clear form"
            >
              <FaTimesCircle /> Clear
            </button>
          </div>

          {/* Website URL */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest pl-1">
              Website URL
            </label>
            <div className="relative">
              <FaGlobe className="absolute left-3 top-3.5 text-cyan-400 text-base" />
              <input
                value={form.site}
                onChange={handleChange}
                placeholder="https://example.com"
                className={fieldClass("site")}
                type="text"
                name="site"
              />
              {form.site.trim().length >= 3 && !errors.site && (
                <FaCheckCircle className="absolute right-3 top-3.5 text-green-400 text-base" />
              )}
            </div>
            {errors.site && (
              <p className="text-red-400 text-xs pl-1 flex items-center gap-1">
                <FaTimesCircle /> {errors.site}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest pl-1">
              Username / Email
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3.5 text-cyan-400 text-base" />
              <input
                value={form.username}
                onChange={handleChange}
                placeholder="you@example.com"
                className={fieldClass("username")}
                type="text"
                name="username"
              />
              {form.username.trim().length >= 3 && !errors.username && (
                <FaCheckCircle className="absolute right-3 top-3.5 text-green-400 text-base" />
              )}
            </div>
            {errors.username && (
              <p className="text-red-400 text-xs pl-1 flex items-center gap-1">
                <FaTimesCircle /> {errors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between pl-1 pr-1">
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                Password
              </label>
              <span className="text-xs text-gray-500">{form.password.length} chars</span>
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-cyan-400 text-base" />
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter or generate a password"
                className={`${fieldClass("password")} pr-16`}
                type="password"
                name="password"
              />
              {/* Eye toggle */}
              <button
                onClick={showPassword}
                className="absolute right-9 top-3 text-gray-400 hover:text-cyan-400 transition"
                title="Show/Hide"
              >
                {showPass ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
              {/* Generate button */}
              <button
                onClick={handleGenerate}
                className="absolute right-2 top-2.5 text-cyan-400 hover:text-cyan-200 transition"
                title="Generate random password"
              >
                <FaDice className="text-xl" />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs pl-1 flex items-center gap-1">
                <FaTimesCircle /> {errors.password}
              </p>
            )}

            {/* ── Strength Meter ────────────────────────── */}
            {form.password.length > 0 && (
              <div className="mt-1 flex flex-col gap-1">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className="flex-1 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor:
                          bar <= strength.level ? strength.color : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
                <p
                  className="text-xs font-semibold pl-0.5 transition-all"
                  style={{ color: strength.color }}
                >
                  {strength.label} password
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-1">
            {/* Save */}
            <button
              onClick={savePassword}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-700 hover:to-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 transition-all duration-300 shadow-[0_0_15px_#00ffff30] hover:shadow-[0_0_25px_#00ffffa0]"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaSave className="text-lg" />
              )}
              {saving ? "Saving..." : "Save Password"}
            </button>
            {/* Generate shortcut */}
            <button
              onClick={handleGenerate}
              className="px-4 flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-cyan-500/20 hover:border-cyan-400 text-cyan-300 font-semibold rounded-xl py-3 transition-all duration-300"
              title="Generate random password"
            >
              <FaDice className="text-lg" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-10 w-full max-w-3xl">
          <div className="relative w-72 sm:w-80">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-base" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by site or username..."
              className="w-full pl-9 rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all"
            />
          </div>
        </div>

        {/* Password Table */}
        <div className="mt-10 w-full max-w-5xl overflow-x-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Saved Passwords
            <span className="ml-3 text-base font-normal text-gray-400">
              ({filteredPasswords.length})
            </span>
          </h2>

          {filteredPasswords.length === 0 ? (
            <div className="text-center text-gray-400 mt-6 flex flex-col items-center gap-3">
              <FaShieldAlt className="text-5xl text-white/10" />
              <p>No passwords saved yet. Add your first one above!</p>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Website</th>
                    <th className="py-3 px-4 sm:px-6">Username</th>
                    <th className="py-3 px-4 sm:px-6">Password</th>
                    <th className="py-3 px-4 sm:px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPasswords.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-white/10 transition-all border-b border-white/10"
                    >
                      <td className="p-3 sm:p-4">
                        <a
                          href={item.site}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-300 underline hover:text-cyan-100"
                        >
                          {item.site}
                        </a>
                        <button
                          onClick={() => copyText(item.site)}
                          className="ml-2 text-gray-400 hover:text-cyan-400 transition"
                          title="Copy"
                        >
                          <FaClipboard className="inline text-base" />
                        </button>
                      </td>
                      <td className="p-3 sm:p-4">
                        {item.username}
                        <button
                          onClick={() => copyText(item.username)}
                          className="ml-2 text-gray-400 hover:text-cyan-400 transition"
                          title="Copy"
                        >
                          <FaClipboard className="inline text-base" />
                        </button>
                      </td>
                      <td className="p-3 sm:p-4">
                        <span className="font-mono tracking-widest">
                          {"•".repeat(Math.min(item.password.length, 10))}
                        </span>
                        <button
                          onClick={() => copyText(item.password)}
                          className="ml-2 text-gray-400 hover:text-cyan-400 transition"
                          title="Copy password"
                        >
                          <FaClipboard className="inline text-base" />
                        </button>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => editPassword(item._id)}
                            className="text-gray-400 hover:text-yellow-400 transition"
                            title="Edit"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => deletePassword(item._id)}
                            className="text-gray-400 hover:text-red-400 transition"
                            title="Delete"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-in-out; }
      `}</style>
    </div>
  );
}
