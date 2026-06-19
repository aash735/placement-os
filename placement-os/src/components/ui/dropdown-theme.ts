// Centralized theme configuration for dropdowns, popovers, select components, and commands
// Ensures consistent states (hover, focus, selected, active) across light and dark modes

export const dropdownTheme = {
  // Trigger button styling
  trigger: "flex items-center justify-between w-full px-3.5 py-2.5 text-xs md:text-sm rounded-xl border border-[var(--border-normal)] bg-[var(--bg-overlay)] hover:bg-[rgba(255,255,255,0.06)] light:hover:bg-[rgba(15,23,42,0.06)] text-[var(--text-primary)] transition-all duration-150 focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)]/30 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer text-left",
  
  // Dropdown list container styling (glassmorphism)
  content: "absolute z-50 min-w-[220px] max-h-[300px] mt-1.5 overflow-y-auto rounded-xl border border-[var(--border-normal)] bg-[color-mix(in_srgb,var(--bg-elevated)_98%,transparent)] shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in-50 slide-in-from-top-1 focus:outline-none scrollbar",
  
  // Individual option styling
  item: "flex w-full items-center justify-between cursor-pointer select-none rounded-lg px-3 py-2 text-xs md:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)] light:hover:bg-[rgba(15,23,42,0.06)] focus:outline-none focus:bg-[rgba(255,255,255,0.06)] light:focus:bg-[rgba(15,23,42,0.06)] transition-colors duration-100 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none text-left",
  
  // Highlighted / active style for currently selected options
  itemSelected: "text-[var(--accent-cyan)] bg-[color-mix(in_srgb,var(--accent-cyan)_10%,transparent)] font-semibold hover:bg-[color-mix(in_srgb,var(--accent-cyan)_15%,transparent)] light:hover:bg-[color-mix(in_srgb,var(--accent-cyan)_15%,transparent)]",
  
  // Command search containers
  commandContainer: "flex flex-col h-full w-full overflow-hidden rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-normal)] text-[var(--text-primary)]",
  commandInput: "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-50 border-none px-3.5 focus:ring-0",
  commandGroupLabel: "px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]",
};
