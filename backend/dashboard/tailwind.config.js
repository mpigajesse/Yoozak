/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#3C50E0',
          foreground: '#FFFFFF',
          dark: '#3545C4',
          50: '#f3f4fe',
          100: '#e6e8fc',
          200: '#c6cbf9',
          300: '#9da7f4',
          400: '#7785ee',
          500: '#5966e8',
          600: '#3c50e0',  // DEFAULT
          700: '#3545c4',  // dark
          800: '#2c389e',
          900: '#27317d',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#121416',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        navy: {
          50: '#f0f5fa',
          100: '#dbe6f3',
          200: '#bcd1e8',
          300: '#8fb2d9',
          400: '#608ec7',
          500: '#4273b5',
          600: '#345b98',
          700: '#2b497a',
          800: '#243d65',
          900: '#213455',
          950: '#121e31',
        },
        yoozak: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Couleurs des boutons
        btn: {
          // Pour les boutons primaires (couleur par défaut)
          primary: {
            DEFAULT: '#3C50E0', // Identique à primary
            hover: '#3545C4',
            focus: '#3C50E0',
            text: '#FFFFFF',
          },
          // Pour les boutons secondaires
          secondary: {
            DEFAULT: '#6c757d',
            hover: '#5a6268',
            focus: '#6c757d',
            text: '#FFFFFF',
          },
          // Pour les boutons de succès
          success: {
            DEFAULT: '#10B981',
            hover: '#0E9F6E',
            focus: '#10B981',
            text: '#FFFFFF',
          },
          // Pour les boutons d'alerte
          warning: {
            DEFAULT: '#F59E0B',
            hover: '#D97706',
            focus: '#F59E0B',
            text: '#FFFFFF',
          },
          // Pour les boutons de danger
          danger: {
            DEFAULT: '#EF4444',
            hover: '#DC2626',
            focus: '#EF4444',
            text: '#FFFFFF',
          },
          // Pour les boutons d'information
          info: {
            DEFAULT: '#3B82F6',
            hover: '#2563EB',
            focus: '#3B82F6',
            text: '#FFFFFF',
          },
          // Pour les boutons de création
          create: {
            DEFAULT: '#10B981',
            hover: '#059669',
            focus: '#10B981',
            text: '#FFFFFF',
          },
          // Pour les boutons d'édition
          edit: {
            DEFAULT: '#4F46E5',
            hover: '#4338CA',
            focus: '#4F46E5',
            text: '#FFFFFF',
          },
          // Pour les boutons d'annulation
          cancel: {
            DEFAULT: '#6B7280',
            hover: '#4B5563',
            focus: '#6B7280',
            text: '#FFFFFF',
          },
          // Pour les boutons de sauvegarde
          save: {
            DEFAULT: '#0D9488',
            hover: '#0F766E',
            focus: '#0D9488',
            text: '#FFFFFF',
          },
        },
        // TailAdmin colors
        meta: {
          1: '#DC3545', // rouge
          2: '#EFF4FB', // bleu très clair
          3: '#10B981', // vert
          4: '#313D4A', // bleu foncé
          5: '#F0950C', // orange
          6: '#637381', // gris
          7: '#F9FAFB', // gris très clair
          8: '#3C50E0', // bleu principal (identique à primary)
          9: '#E5E7EB', // gris clair
        },
        stroke: '#E2E8F0',
        strokedark: '#3D4954',
        bodydark: '#AEB7C0',
        boxdark: '#24303F', 
        title: '#1C2434',
        whiten: '#FFFFFF',
        graydark: '#333A48',
        boxdark2: '#1A222C',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      // TailAdmin text sizes
      fontSize: {
        'title-md': '1.125rem', // 18px
        'title-md2': '1.625rem', // 26px
        'title-lg': '1.25rem',  // 20px
        'title-xl': '1.5rem',   // 24px
        'title-2xl': '1.75rem', // 28px
      },
      boxShadow: {
        default: '0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
        card: '0px 1px 3px rgba(0, 0, 0, 0.12)',
        'card-2': '0px 1px 2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '11': '2.75rem',
        '11.5': '2.875rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '42': '10.5rem',
        '45': '11.25rem',
        '47.5': '11.875rem',
        '49': '12.25rem',
        '50': '12.5rem',
        '60': '15rem',
        '70': '17.5rem',
        '80': '20rem',
        '90': '22.5rem',
        '100': '25rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} 