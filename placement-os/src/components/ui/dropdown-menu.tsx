"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { dropdownTheme } from "./dropdown-theme";
import { Portal } from "./portal";
import { useOverlayPosition } from "@/hooks/use-overlay-position";
import { Z_INDEX } from "@/lib/z-index";

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

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

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, containerRef, overlayRef }}>
      <div ref={containerRef} className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuTrigger must be inside a DropdownMenu");
  const { open, setOpen } = context;

  if (asChild && React.isValidElement(children)) {
    const element = children as React.ReactElement<{ onClick?: React.MouseEventHandler }>;
    return React.cloneElement(element, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        element.props.onClick?.(e);
        setOpen(!open);
      },
    });
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(dropdownTheme.trigger, "w-auto")}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuContent must be inside a DropdownMenu");
  const { open, containerRef, overlayRef } = context;

  const { style, placement } = useOverlayPosition({
    triggerRef: containerRef,
    overlayRef,
    open,
    align: "right",
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
            className={cn(dropdownTheme.content, "m-0 min-w-[180px]", className)}
          >
            <div className="p-1.5 space-y-0.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuItem must be inside a DropdownMenu");
  const { setOpen } = context;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
        setOpen(false);
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
