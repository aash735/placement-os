"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { dropdownTheme } from "./dropdown-theme";
import { Portal } from "./portal";
import { useOverlayPosition } from "@/hooks/use-overlay-position";
import { Z_INDEX } from "@/lib/z-index";

interface SelectContextType {
  value: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  items: Array<{ value: string; label: string; disabled?: boolean }>;
  registerItem: (value: string, label: string, disabled?: boolean) => void;
  unregisterItem: (value: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export function useSelect() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("useSelect must be used within a Select component");
  }
  return context;
}

export interface SelectProps {
  children: React.ReactNode;
  value: string;
  onValueChange?: (value: string) => void;
}

export function Select({ children, value, onValueChange }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [dynamicItems, setDynamicItems] = React.useState<Array<{ value: string; label: string; disabled?: boolean }>>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const registerItem = React.useCallback((val: string, label: string, disabled?: boolean) => {
    setDynamicItems((prev) => {
      if (prev.some((item) => item.value === val)) {
        // If label or disabled status updated, map it
        return prev.map((item) =>
          item.value === val ? { ...item, label, disabled } : item
        );
      }
      return [...prev, { value: val, label, disabled }];
    });
  }, []);

  const unregisterItem = React.useCallback((val: string) => {
    setDynamicItems((prev) => prev.filter((item) => item.value !== val));
  }, []);

  const staticItems = React.useMemo(() => {
    return findSelectItems(children);
  }, [children]);

  const items = React.useMemo(() => {
    const mergedMap = new Map<string, { value: string; label: string; disabled?: boolean }>();
    staticItems.forEach(item => mergedMap.set(item.value, item));
    dynamicItems.forEach(item => mergedMap.set(item.value, item));
    return Array.from(mergedMap.values());
  }, [staticItems, dynamicItems]);

  // Handle clicking outside to close
  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideTrigger = containerRef.current && containerRef.current.contains(target);
      const clickedInsideOverlay = overlayRef.current && overlayRef.current.contains(target);
      
      if (!clickedInsideTrigger && !clickedInsideOverlay) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (!open) {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
        const activeIdx = items.findIndex((item) => item.value === value);
        setFocusedIndex(activeIdx >= 0 ? activeIdx : 0);
      }
      return;
    }

    const enabledItems = items.filter((i) => !i.disabled);
    if (enabledItems.length === 0) return;

    const getEnabledIndex = (index: number) => {
      const item = enabledItems[index];
      return items.findIndex((i) => i.value === item?.value);
    };

    const currentEnabledIndex = enabledItems.findIndex(
      (i) => items[focusedIndex]?.value === i.value
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIdx = (currentEnabledIndex + 1) % enabledItems.length;
      setFocusedIndex(getEnabledIndex(nextIdx));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevIdx = (currentEnabledIndex - 1 + enabledItems.length) % enabledItems.length;
      setFocusedIndex(getEnabledIndex(prevIdx));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const focusedItem = items[focusedIndex];
      if (focusedItem && !focusedItem.disabled) {
        onValueChange?.(focusedItem.value);
        setOpen(false);
      }
    }
  };

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        open,
        setOpen,
        focusedIndex,
        setFocusedIndex,
        items,
        registerItem,
        unregisterItem,
        containerRef,
        overlayRef,
      }}
    >
      <div
        ref={containerRef}
        onKeyDown={handleKeyDown}
        className="relative inline-block w-full"
      >
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelect();
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(dropdownTheme.trigger, className)}
        aria-expanded={open}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "ml-2 h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 shrink-0",
            open && "transform rotate-180"
          )}
        />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const { value, items } = useSelect();
  const selectedItem = items.find((item) => item.value === value);
  return (
    <span className={cn("truncate block", className)}>
      {selectedItem ? selectedItem.label : placeholder}
    </span>
  );
}

export interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ children, className }: SelectContentProps) {
  const { open, containerRef, overlayRef } = useSelect();
  
  const { style, placement } = useOverlayPosition({
    triggerRef: containerRef,
    overlayRef,
    open,
    matchWidth: true,
    zIndex: Z_INDEX.dropdown,
  });

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0, y: placement === "top" ? 4 : -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === "top" ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            style={style}
            className={cn(dropdownTheme.content, "m-0", className)}
          >
            <div className="p-1.5 space-y-0.5 max-h-[260px] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  label?: string; // Fallback display label if children is complex
  disabled?: boolean;
  className?: string;
}

export function SelectItem({
  value: itemValue,
  children,
  label,
  disabled,
  className,
}: SelectItemProps) {
  const {
    value,
    onValueChange,
    setOpen,
    registerItem,
    unregisterItem,
    focusedIndex,
    setFocusedIndex,
    items,
  } = useSelect();

  // Extract text representation for trigger display
  const itemLabel = React.useMemo(() => {
    if (label) return label;
    if (typeof children === "string") return children;
    return String(children);
  }, [children, label]);

  React.useEffect(() => {
    registerItem(itemValue, itemLabel, disabled);
    return () => unregisterItem(itemValue);
  }, [itemValue, itemLabel, disabled, registerItem, unregisterItem]);

  const isSelected = value === itemValue;
  const myIndex = items.findIndex((item) => item.value === itemValue);
  const isFocused = focusedIndex === myIndex;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    onValueChange?.(itemValue);
    setOpen(false);
  };

  const handlePointerOver = () => {
    if (disabled) return;
    setFocusedIndex(myIndex);
  };

  return (
    <div
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      data-disabled={disabled ? "" : undefined}
      data-selected={isSelected ? "true" : undefined}
      className={cn(
        dropdownTheme.item,
        isFocused && "bg-[rgba(255,255,255,0.06)] light:bg-[rgba(15,23,42,0.06)] text-[var(--text-primary)]",
        isSelected && dropdownTheme.itemSelected,
        className
      )}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check className="h-3.5 w-3.5 text-[var(--accent-cyan)] ml-2 shrink-0" />}
    </div>
  );
}

SelectItem.displayName = "SelectItem";

function findSelectItems(children: React.ReactNode): Array<{ value: string; label: string; disabled?: boolean }> {
  const items: Array<{ value: string; label: string; disabled?: boolean }> = [];

  function traverse(node: React.ReactNode) {
    if (!node) return;

    React.Children.forEach(node, (child) => {
      if (!React.isValidElement(child)) return;

      const isSelectItem =
        child.type === SelectItem ||
        (child.type as any).displayName === "SelectItem" ||
        (typeof child.type === "function" && child.type.name === "SelectItem") ||
        (child.type as any === "SelectItem");

      if (isSelectItem) {
        const props = child.props as any;
        const value = props.value;
        let label = props.label;
        if (!label) {
          if (typeof props.children === "string") {
            label = props.children;
          } else if (typeof props.children === "number") {
            label = String(props.children);
          } else if (Array.isArray(props.children)) {
            label = props.children.map((c: any) => typeof c === "string" || typeof c === "number" ? String(c) : "").join("");
          } else {
            label = String(props.children || "");
          }
        }
        items.push({ value, label, disabled: props.disabled });
      } else if (child.props && (child.props as any).children) {
        traverse((child.props as any).children);
      }
    });
  }

  traverse(children);
  return items;
}
