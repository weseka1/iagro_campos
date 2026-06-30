/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ===== Sistema CLARO (Apple / blanco / verde IAGRO) =====
        paper: {
          DEFAULT: "#F7F8F5", // blanco cálido (nunca #fff puro) — fondo de página
          100: "#FFFFFF", // tarjetas / superficies elevadas
          200: "#EEF1EA", // sub-bloques / hairlines suaves
        },
        graph: {
          DEFAULT: "#171A17", // grafito (tinta principal, no negro puro)
          700: "#2A2F2A",
          500: "#5B655B", // texto secundario
          400: "#8A938A", // texto muted
        },
        iagro: {
          // verde bosque IAGRO (acento = información)
          DEFAULT: "#2E7D52",
          600: "#236B45",
          700: "#1B5638",
          400: "#3D9A67",
          300: "#7FBF9C",
          50: "#EAF3EE",
        },

        // ===== Sistema OSCURO heredado (panel, hasta su barrido a blanco) =====
        ink: { DEFAULT: "#11100B", 800: "#1A1813", 700: "#23201A", 600: "#2E2A22" },
        bone: { DEFAULT: "#F6F2E9", 200: "#ECE6D8", 300: "#DED5C2" },
        wheat: { DEFAULT: "#C9A24E", 400: "#D8B566", 600: "#A9842F" },
        field: { DEFAULT: "#5B6B43", 700: "#46532F", 300: "#8FA06B" },
        clay: "#9C6B3C",
      },
      fontFamily: {
        // Apple-clean: una sola familia (Satoshi) para todo
        display: ['"Satoshi"', '"Inter"', "system-ui", "sans-serif"],
        sans: ['"Satoshi"', '"Inter"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        card: "0 14px 44px -18px rgba(23,26,23,0.20)",
        soft: "0 4px 22px -10px rgba(23,26,23,0.14)",
        ring: "0 0 0 1px rgba(23,26,23,0.06)",
      },
      maxWidth: {
        container: "1240px",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1.05) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.18) translate3d(-1.5%,-1.5%,0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        kenburns: "kenburns 22s ease-out forwards",
      },
    },
  },
  plugins: [],
};
