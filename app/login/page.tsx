"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import ThemeToggle from "@/components/ThemeToggle";
import LoginAnimation from "@/components/LoginAnimation";
import { LogIn, KeyRound, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "access_code">("password");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password", username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/teacher");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleAccessCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "access_code", accessCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      router.push("/teacher");
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary-400/10 dark:bg-primary-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-300/8 dark:bg-primary-700/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Theme Toggle - Fixed position */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Left Side - SVG Animation */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] items-center justify-center relative overflow-hidden">
        {/* Glass background panel */}
        <div className="absolute inset-4 rounded-3xl bg-white/20 dark:bg-white/[0.03] backdrop-blur-xl border border-white/30 dark:border-white/[0.08] overflow-hidden">
          {/* Inner refraction highlight */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #16a34a 1.5px, transparent 1.5px), radial-gradient(circle at 75% 75%, #16a34a 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-xl px-8">
          <div className="mb-8 animate-glass-card-entrance">
            <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-400 mb-2">
              Artier Attendance
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Solusi absensi modern untuk institusi pendidikan
            </p>
          </div>

          <div className="animate-glass-card-entrance-delay-1">
            <LoginAnimation />
          </div>

          <div className="mt-6 text-center animate-glass-card-entrance-delay-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Absensi lebih mudah, cepat, dan akurat
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-glass-card-entrance">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Artier Attendance
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Solusi absensi modern
            </p>
          </div>

          {/* Login Card - Glass */}
          <div className="glass-card p-8 animate-glass-card-entrance refraction-highlight">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Selamat Datang
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Silakan masuk untuk melanjutkan
              </p>
            </div>

            {/* Mode Tabs - Glass */}
            <div className="glass-surface p-1 flex mb-6 gap-1">
              <button
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  mode === "password"
                    ? "bg-white/70 dark:bg-white/10 shadow-sm backdrop-blur-sm text-primary-600 dark:text-primary-400 border border-primary-400/20 dark:border-primary-400/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5"
                }`}
                onClick={() => {
                  setMode("password");
                  setError("");
                }}
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Username & Password</span>
                <span className="sm:hidden">Password</span>
              </button>
              <button
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  mode === "access_code"
                    ? "bg-white/70 dark:bg-white/10 shadow-sm backdrop-blur-sm text-primary-600 dark:text-primary-400 border border-primary-400/20 dark:border-primary-400/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/30 dark:hover:bg-white/5"
                }`}
                onClick={() => {
                  setMode("access_code");
                  setError("");
                }}
              >
                <KeyRound size={16} />
                <span>Kode Akses</span>
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert type="error" message={error} onClose={() => setError("")} />
            )}

            {/* Password Login Form */}
            {mode === "password" ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <Input
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                />

                {/* Password with toggle */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm font-medium
                        bg-white/50 dark:bg-white/[0.06]
                        backdrop-blur-lg
                        border border-white/30 dark:border-white/10
                        text-gray-900 dark:text-gray-100
                        placeholder-gray-400/60 dark:placeholder-gray-500/60
                        transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400/50
                        focus:shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" loading={loading}>
                  Masuk
                </Button>
              </form>
            ) : (
              /* Access Code Login Form */
              <form onSubmit={handleAccessCodeLogin} className="space-y-4">
                <Input
                  label="Kode Akses (6 digit)"
                  type="text"
                  value={accessCode}
                  onChange={(e) =>
                    setAccessCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  placeholder="Masukkan kode akses"
                  maxLength={6}
                  required
                />
                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  disabled={accessCode.length !== 6}
                >
                  Masuk
                </Button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                &copy; {new Date().getFullYear()} Artier Attendance. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
