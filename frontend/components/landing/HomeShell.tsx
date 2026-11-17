import type { ReactNode } from "react";
import { invytoDisplay, invytoSans } from "@/lib/invytoFonts";

export default function HomeShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${invytoDisplay.variable} ${invytoSans.variable} invyto-home relative z-[2] min-h-screen bg-background text-foreground antialiased`}
    >
      <style>{`
        .invyto-home {
          --background: 160 28% 5%;
          --foreground: 150 18% 92%;
          --primary: 38 42% 68%;
          --primary-foreground: 160 30% 8%;
          --secondary: 160 18% 12%;
          --secondary-foreground: 150 15% 90%;
          --muted: 160 14% 10%;
          --muted-foreground: 150 10% 62%;
          --border: 160 12% 18%;
          --card: 160 18% 8%;
          --card-foreground: 150 18% 92%;
          --gold-light: 42 48% 62%;
          --blush: 350 28% 55%;
          font-family: var(--font-invyto-sans), system-ui, sans-serif;
        }
        .invyto-home .font-display {
          font-family: var(--font-invyto-display), Georgia, serif;
        }
        .invyto-home body,
        .invyto-home {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        @keyframes invyto-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes invyto-bloom {
          from { opacity: 0; transform: scale(1.08); }
          to { opacity: 1; transform: scale(1); }
        }
        .invyto-fade { animation: invyto-fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .invyto-fade-2 { animation: invyto-fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both; }
        .invyto-fade-3 { animation: invyto-fade-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both; }
        .invyto-bloom { animation: invyto-bloom 1.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>
      {children}
    </div>
  );
}
