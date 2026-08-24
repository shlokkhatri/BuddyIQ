import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useTheme } from "../context/ThemeContext";

export default function MainLayout() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white transition-colors duration-200">
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={isDark ? "dark" : "light"}
      />
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
