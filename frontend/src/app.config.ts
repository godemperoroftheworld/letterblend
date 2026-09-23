export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      secondary: 'secondary',
      success: 'primary',
      info: 'info',
      warning: 'bulb',
      error: 'danger',
      neutral: 'slate',
    },
    container: {
      base: 'max-w-(--ui-container)'
    },
    main: {
      base: 'min-h-[calc(100vh-var(--ui-header-height))]'
    },
    card: {
      variants: {
        variant: {
          solid: {
            root: 'bg-content shadow-paper/50 inset-shadow-paper/50 border-dark/50 border-3 inset-shadow-md shadow-sm'
          }
        }
      },
      slots: {
        root: 'rounded-3xl',
        body: 'relative',
      }
    },
    switch: {
      variants: {
        size: {
          '2xl': {
            base: 'w-18 h-9',
            thumb: 'size-8 data-[state=checked]:translate-x-9 data-[state=checked]:rtl:-translate-x-9',
          }
        },
        color: {
          dark: {
            base: 'data-[state=checked]:bg-dark outline outline-2 outline-white/25',
            icon: 'text-slate-700! group-data-[state=checked]:text-dark!',
            thumb: 'bg-slate-100 group-data[state=checked]:bg-white'
          }
        }
      }
    },
    avatar: {
      variants: {
        size: {
          unbound: {
            root: ''
          }
        }
      }
    },
  }
});