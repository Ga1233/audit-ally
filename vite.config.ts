import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // In Lovable Cloud, the backend URL/keys are available as env vars.
  // Some environments may not expose them with the VITE_ prefix, so we
  // provide a safe fallback mapping for the frontend build.
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const supabasePublishableKey =
    env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;

  return {
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    ...(supabaseUrl
      ? { "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl) }
      : {}),
    ...(supabasePublishableKey
      ? {
          "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
            supabasePublishableKey
          ),
        }
      : {}),
  },
  };
});
