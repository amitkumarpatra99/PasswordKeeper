"use client";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Mannager() {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [search, setSearch] = useState("");

  // 🧩 Connect to your local backend (connected to MongoDB Compass)
  const API_URL = "http://localhost:5000/api/passwords";



  // ✅ Load all passwords from backend (MongoDB)
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPasswordArray(data))
      .catch(() => toast.error("❌ Unable to connect to database"));
  }, []);

  // ✅ Toggle password visibility
  const showPassword = () => {
    if (passwordRef.current.type === "password") {
      passwordRef.current.type = "text";
      ref.current.src = "/icons/hide.png";
    } else {
      passwordRef.current.type = "password";
      ref.current.src = "/icons/visible.png";
    }
  };

  // ✅ Save new password (POST to backend)
  const savePassword = async () => {
    if (
      form.site.trim().length < 3 ||
      form.username.trim().length < 3 ||
      form.password.trim().length < 3
    ) {
      toast.error("Invalid Input ❌", { theme: "dark" });
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setPasswordArray((prev) => [...prev, data]);
      setForm({ site: "", username: "", password: "" });
      toast.success("Password Saved ☑️", { theme: "dark" });
    } catch {
      toast.error("Failed to save password ❌", { theme: "dark" });
    }
  };

  // ✅ Delete password
  const deletePassword = async (id) => {
    if (confirm("Delete this password?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        setPasswordArray(passwordArray.filter((item) => item._id !== id));
        toast.info("Password Deleted 🗑️", { theme: "dark" });
      } catch {
        toast.error("Failed to delete ❌", { theme: "dark" });
      }
    }
  };

  // ✅ Edit password (PUT)
  const editPassword = async (id) => {
    const found = passwordArray.find((i) => i._id === id);
    if (!found) return;
    setForm(found);
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success("Password Updated ✏️", { theme: "dark" });
    } catch {
      toast.error("Failed to update ❌", { theme: "dark" });
    }
  };

  // ✅ Copy text
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to Clipboard 📋", { theme: "dark" });
  };

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Filtered results
  const filteredPasswords = passwordArray.filter(
    (p) =>
      p.site.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center pt-32 pb-24 px-4 sm:px-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white overflow-hidden">
      <ToastContainer theme="dark" position="top-right" />

      {/* 🔹 Title Section */}
      <div className="animate-fadeIn w-full flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          Password Keeper
        </h1>
        <p className="text-gray-300 text-center mb-8 text-base sm:text-lg">
          Manage your passwords securely — stored in MongoDB 🧩
        </p>

        {/* 🔹 Form */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-lg flex flex-col gap-4 sm:gap-5 shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="🌐 Website URL"
            className="rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all"
            type="text"
            name="site"
          />
          <input
            value={form.username}
            onChange={handleChange}
            placeholder="👤 Username / Email"
            className="rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all"
            type="text"
            name="username"
          />
          <div className="relative w-full">
            <input
              ref={passwordRef}
              value={form.password}
              onChange={handleChange}
              placeholder="🔒 Password"
              className="rounded-xl bg-white/10 border border-white/20 p-3 w-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all"
              type="password"
              name="password"
            />
            <img
              ref={ref}
              onClick={showPassword}
              className="w-6 absolute right-3 top-3 cursor-pointer hover:scale-110 transition"
              src="/icons/visible.png"
              alt="toggle"
            />
          </div>

          <button
            onClick={savePassword}
            className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-700 hover:to-cyan-400 text-white font-semibold rounded-xl py-3 transition-all duration-300"
          >
            💾 Save Password
          </button>
        </div>

        {/* 🔹 Search */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-10 w-full max-w-3xl">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by site or username..."
            className="rounded-xl bg-white/10 border border-white/20 p-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all w-72 sm:w-80"
          />
        </div>

        {/* 🔹 Password Table */}
        <div className="mt-10 w-full max-w-5xl overflow-x-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Saved Passwords
          </h2>

          {filteredPasswords.length === 0 ? (
            <p className="text-gray-400 text-center">No passwords saved yet...</p>
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
                          className="ml-2 text-gray-400 hover:text-white"
                        >
                          📋
                        </button>
                      </td>
                      <td className="p-3 sm:p-4">
                        {item.username}
                        <button
                          onClick={() => copyText(item.username)}
                          className="ml-2 text-gray-400 hover:text-white"
                        >
                          📋
                        </button>
                      </td>
                      <td className="p-3 sm:p-4">
                        {item.password}
                        <button
                          onClick={() => copyText(item.password)}
                          className="ml-2 text-gray-400 hover:text-white"
                        >
                          📋
                        </button>
                      </td>
                      <td className="p-3 sm:p-4 flex justify-center gap-3">
                        <span
                          onClick={() => editPassword(item._id)}
                          className="cursor-pointer hover:text-yellow-400"
                        >
                          ✏️
                        </span>
                        <span
                          onClick={() => deletePassword(item._id)}
                          className="cursor-pointer hover:text-red-400"
                        >
                          🗑️
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
}
