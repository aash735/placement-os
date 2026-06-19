"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { dropdownTheme } from "./dropdown-theme";

interface CommandContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  matchesCount: number;
  registerMatch: (id: string, matches: boolean) => void;
  unregisterMatch: (id: string) => void;
}

const CommandContext = React.createContext<CommandContextType | null>(null);

export function Command({ children, className }: { children: React.ReactNode; className?: string }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [matches, setMatches] = React.useState<Record<string, boolean>>({});

  const registerMatch = React.useCallback((id: string, matchesQuery: boolean) => {
    setMatches((prev) => {
      if (prev[id] === matchesQuery) return prev;
      return { ...prev, [id]: matchesQuery };
    });
  }, []);

  const unregisterMatch = React.useCallback((id: string) => {
    setMatches((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const matchesCount = React.useMemo(() => {
    return Object.values(matches).filter(Boolean).length;
  }, [matches]);

  return (
    <CommandContext.Provider
      value={{ searchQuery, setSearchQuery, matchesCount, registerMatch, unregisterMatch }}
    >
      <div className={cn(dropdownTheme.commandContainer, className)}>
        {children}
      </div>
    </CommandContext.Provider>
  );
}

export interface CommandInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {}

export function CommandInput({ placeholder, className, ...props }: CommandInputProps) {
  const context = React.useContext(CommandContext);
  if (!context) throw new Error("CommandInput must be inside Command");
  const { searchQuery, setSearchQuery } = context;

  return (
    <div className="flex items-center border-b border-[var(--border-normal)] px-3.5 shrink-0">
      <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)] mr-2.5" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(dropdownTheme.commandInput, className)}
        {...props}
      />
    </div>
  );
}

export function CommandList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-y-auto max-h-[280px] p-1.5 space-y-0.5 scrollbar", className)}>
      {children}
    </div>
  );
}

export function CommandEmpty({ children }: { children: React.ReactNode }) {
  const context = React.useContext(CommandContext);
  if (!context) throw new Error("CommandEmpty must be inside Command");
  const { matchesCount } = context;

  if (matchesCount > 0) return null;

  return (
    <div className="py-6 text-center text-xs text-[var(--text-muted)] select-none">
      {children}
    </div>
  );
}

export function CommandGroup({
  children,
  heading,
  className,
}: {
  children: React.ReactNode;
  heading?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-0.5", className)}>
      {heading && (
        <div className={cn(dropdownTheme.commandGroupLabel, "pt-2 px-3 pb-1")}>
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

export function CommandItem({
  children,
  value,
  onSelect,
  disabled,
  className,
}: {
  children: React.ReactNode;
  value: string;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const context = React.useContext(CommandContext);
  if (!context) throw new Error("CommandItem must be inside Command");
  const { searchQuery, registerMatch, unregisterMatch } = context;

  const id = React.useId();
  const matches = React.useMemo(() => {
    return value.toLowerCase().includes(searchQuery.toLowerCase());
  }, [value, searchQuery]);

  React.useEffect(() => {
    registerMatch(id, matches);
    return () => unregisterMatch(id);
  }, [id, matches, registerMatch, unregisterMatch]);

  if (!matches) return null;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        if (disabled) return;
        onSelect?.();
      }}
      className={cn(
        dropdownTheme.item,
        "w-full text-left flex items-center justify-between",
        className
      )}
    >
      {children}
    </button>
  );
}
