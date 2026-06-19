"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { dropdownTheme } from "./dropdown-theme";
import { Portal } from "./portal";
import { useOverlayPosition } from "@/hooks/use-overlay-position";
import { Z_INDEX } from "@/lib/z-index";

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = React.createContext<PopoverContextType | null>(null);

export function Popover({ children }: { children: React.ReactNode }) {
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
    <PopoverContext.Provider value={{ open, setOpen, containerRef, overlayRef }}>
      <div ref={containerRef} className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error("PopoverTrigger must be inside a Popover");
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

export function PopoverContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error("PopoverContent must be inside a Popover");
  const { open, containerRef, overlayRef } = context;

  const { style, placement } = useOverlayPosition({
    triggerRef: containerRef,
    overlayRef,
    open,
    zIndex: Z_INDEX.popover,
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
            className={cn(
              dropdownTheme.content,
              "m-0 p-4 min-w-[280px] max-h-[400px]",
              className
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
