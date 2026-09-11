import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { useKisanQueue } from "@/lib/store";
import { User } from "@/lib/types";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Wifi,
  Battery,
  Signal,
  CheckCircle2,
  Sparkles,
  UserCheck,
  User as UserIcon,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — KisanQueue" },
      {
        name: "description",
        content: "Sign in to KisanQueue farmer procurement portal.",
      },
    ],
  }),
  component: MinimalLoginPage,
});

export function MinimalLoginPage() {
  const navigate = useNavigate();
  const { setUser, addNotification } = useKisanQueue();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Quick helper to sign in a demo or custom user
  const handleCompleteAuth = (userData: Partial<User>, successMsg: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser((prev: User) => ({
        ...prev,
        ...userData,
      }));
      addNotification({
        title: "Authentication Successful",
        message: successMsg,
        type: "success",
      });
      setIsLoading(false);
      navigate({ to: "/" });
    }, 600);
  };

  // Submit standard Email/Password login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setFeedback("Please enter your email or phone number");
      return;
    }
    if (!password) {
      setFeedback("Please enter your password");
      return;
    }

    setFeedback(null);
    const identifier = email.trim();
    const displayName = mode === "signup" && name ? name : identifier.includes("@") ? identifier.split("@")[0] : "Arun Kumar";

    handleCompleteAuth(
      {
        name: displayName,
        mobile: identifier.includes("@") ? "+91 94471 28930" : identifier,
        farmerId: "KL-KTM-26047",
      },
      mode === "signup" ? `Welcome to KisanQueue, ${displayName}!` : `Welcome back, ${displayName}!`
    );
  };

  // 1-Tap Continue with Google
  const handleGoogleAuth = () => {
    handleCompleteAuth(
      {
        name: "Arun Kumar (Google)",
        farmerId: "KL-KTM-26047",
      },
      "Signed in successfully with Google account"
    );
  };

  // 1-Tap Continue with Apple
  const handleAppleAuth = () => {
    handleCompleteAuth(
      {
        name: "Mathew Joseph (Apple)",
        farmerId: "KL-KTM-19034",
      },
      "Signed in successfully with Apple ID"
    );
  };

  // 1-Tap Continue As Guest
  const handleGuestAuth = () => {
    handleCompleteAuth(
      {
        name: "Guest Farmer",
        farmerId: "KL-GST-99201",
        village: "Kumarakom",
        district: "Kottayam",
      },
      "Signed in as Guest Farmer with instant slot access"
    );
  };

  // Forgot password handler
  const handleForgotPassword = () => {
    setFeedback("Password reset link and SMS OTP sent to your registered contact.");
    addNotification({
      title: "Password Reset Sent",
      message: "Check your email or SMS for reset instructions.",
      type: "info",
    });
  };

  return (
    <div className="min-h-screen bg-[#EDEFEA] flex flex-col items-center justify-center p-3 sm:p-6 font-sans antialiased text-stone-900 selection:bg-emerald-200">
      {/* Mobile Shell / Phone Frame */}
      <div className="relative w-full max-w-[390px] min-h-[780px] bg-white rounded-[44px] shadow-2xl border-[6px] border-white/80 overflow-hidden flex flex-col justify-between p-6 pt-3 pb-8">
        
        {/* Top Status Bar (iPhone aesthetic matching user mockup) */}
        <div className="flex items-center justify-between text-stone-900 text-xs font-semibold px-2 pt-1 select-none">
          <span className="font-bold text-[13px] tracking-tight">9:41</span>
          
          {/* Dynamic Island Pill */}
          <div className="w-[100px] h-[26px] bg-black rounded-full mx-auto -mt-1 flex items-center justify-end px-2.5">
            <div className="size-2 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>

          {/* Network & Battery Status Icons */}
          <div className="flex items-center gap-1.5 text-stone-900">
            <Signal className="size-3.5 stroke-[2.5]" />
            <Wifi className="size-3.5 stroke-[2.5]" />
            <Battery className="size-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Back Button & Brand Header */}
        <div className="flex items-center justify-between mt-3 px-1">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex size-9 items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            title="Go back to Home"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
            KisanQueue
          </span>
          <div className="size-9" /> {/* Spacer */}
        </div>

        {/* Main Content Form */}
        <div className="my-auto px-2 space-y-6">
          {/* Title: "Login" in deep forest green */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-[#1C3E1B]">
              {mode === "login" ? "Login" : "Sign Up"}
            </h1>
          </div>

          {/* Notification / Feedback Banner */}
          {feedback && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-700" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <div className="relative flex items-center">
                <div className="absolute left-4 pointer-events-none text-stone-400">
                  <UserIcon className="size-4" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 rounded-2xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all shadow-sm"
                />
              </div>
            )}

            {/* Email / Identifier Field */}
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-stone-400">
                <Mail className="size-4" />
              </div>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-2xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all shadow-sm"
              />
            </div>

            {/* Password Field */}
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-stone-400">
                <Lock className="size-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-2xl border border-stone-200 bg-white pl-11 pr-11 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-stone-400 hover:text-stone-600 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {/* Forgot Password Link */}
            {mode === "login" && (
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-stone-500 hover:text-stone-800 underline underline-offset-4 transition-colors font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Main Green Action Button: "Login" */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 rounded-full bg-[#183917] hover:bg-[#132d12] active:scale-[0.98] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{mode === "login" ? "Login" : "Sign Up"}</span>
              )}
            </button>
          </form>

          {/* Divider with "or" */}
          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-xs text-stone-400 font-medium absolute">
              or
            </span>
          </div>

          {/* Alternate Action Buttons matching user mockup */}
          <div className="space-y-2.5">
            {/* 1. Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[#F3F5F2] hover:bg-[#EAECE9] active:scale-[0.98] text-stone-800 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              {/* Google 4-color SVG */}
              <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* 2. Continue with Apple (exact lime green accent from mockup) */}
            <button
              type="button"
              onClick={handleAppleAuth}
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[#9DEB6B] hover:bg-[#8FDA5D] active:scale-[0.98] text-stone-950 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              {/* Apple SVG Logo */}
              <svg className="size-4 shrink-0 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.79-11.73-14.24-5.78-8.9-10.23-18.72-13.34-29.47-3.1-10.74-4.66-21.32-4.66-31.73 0-14.24 3.52-25.79 10.57-34.65 7.05-8.86 15.93-13.35 26.65-13.48 4.79 0 10.18 1.25 16.17 3.76 5.99 2.51 10.11 3.82 12.37 3.93 1.85 0 6.17-1.39 12.98-4.17 6.81-2.77 12.7-3.99 17.68-3.66 13.52 1.09 23.95 6.05 31.3 14.88-12.08 7.39-17.98 17.47-17.7 30.23.27 10.11 4.14 18.66 11.62 25.64 7.48 6.98 16.32 10.98 26.52 12-1.96 6.09-4.13 12.01-6.52 17.76zM119.22 31.85c0-7.39 2.67-14.38 8-20.97 5.33-6.59 11.87-10.49 19.61-11.7 1.09 7.72-1.39 14.93-7.44 21.63-6.05 6.7-12.78 10.55-20.17 11.04z" />
              </svg>
              <span>Continue with Apple</span>
            </button>

            {/* 3. Continue As Guest */}
            <button
              type="button"
              onClick={handleGuestAuth}
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[#F3F5F2] hover:bg-[#EAECE9] active:scale-[0.98] text-stone-800 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              {/* Guest Silhouette Icon */}
              <div className="size-5 shrink-0 rounded-full bg-[#183917]/10 flex items-center justify-center text-[#183917]">
                <UserCheck className="size-3.5 stroke-[2.5]" />
              </div>
              <span>Continue As Guest</span>
            </button>
          </div>
        </div>

        {/* Footer: Need an account? Sign up */}
        <div className="text-center pt-4 border-t border-stone-100">
          <p className="text-xs text-stone-500 font-medium">
            {mode === "login" ? (
              <>
                Need an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setFeedback(null);
                  }}
                  className="font-bold text-stone-900 hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setFeedback(null);
                  }}
                  className="font-bold text-stone-900 hover:underline cursor-pointer"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>

      </div>
    </div>
  );
}
