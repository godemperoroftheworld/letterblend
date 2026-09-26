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
        header: 'pb-0!',
        title: 'text-xl font-heading font-black',
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
            base: 'bg-slate-800 data-[state=checked]:bg-dark outline outline-2 outline-white/25 hover:bg-slate-750!',
            icon: 'text-slate-700! group-data-[state=checked]:text-dark!',
            thumb: 'bg-slate-100 group-data[state=checked]:bg-white'
          }
        }
      }
    },
    button: {
      variants: {
        color: {
          dark: {
            base: 'bg-dark outline outline-2 outline-white/25 text-white hover:bg-slate-750 focus:outline-3',
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
    formField: {
      slots: {
        error: 'mt-0! italic'
      }
    }
  }
});