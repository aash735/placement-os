"use client";

import { useState, useEffect, useLayoutEffect, RefObject } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useOverlayPosition({
  triggerRef,
  overlayRef,
  open,
  placement = "bottom",
  align = "left",
  matchWidth = false,
  zIndex = 100,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  overlayRef: RefObject<HTMLElement | null>;
  open: boolean;
  placement?: "bottom" | "top" | "auto";
  align?: "left" | "right";
  matchWidth?: boolean;
  zIndex?: number;
}) {
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width?: number;
    placement: "top" | "bottom";
  }>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  const updatePosition = () => {
    if (!open || !triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuHeight = overlayRef.current ? overlayRef.current.offsetHeight : 280;
    const menuWidth = overlayRef.current ? overlayRef.current.offsetWidth : 220;

    let top = triggerRect.bottom + window.scrollY;
    let left = triggerRect.left + window.scrollX;
    let computedPlacement: "top" | "bottom" = "bottom";

    // Vertical positioning & collision logic
    if (placement === "auto" || placement === "bottom") {
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      
      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        top = triggerRect.top + window.scrollY - menuHeight - 6; // 6px gap
        computedPlacement = "top";
      } else {
        top = triggerRect.bottom + window.scrollY + 6; // 6px gap
      }
    } else if (placement === "top") {
      top = triggerRect.top + window.scrollY - menuHeight - 6;
      computedPlacement = "top";
    }

    // Horizontal alignment
    if (align === "right") {
      left = triggerRect.right + window.scrollX - menuWidth;
    } else {
      left = triggerRect.left + window.scrollX;
    }

    // Screen edge boundary safety
    if (left < 10) {
      left = 10;
    } else if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    setCoords({
      top,
      left,
      width: matchWidth ? triggerRect.width : undefined,
      placement: computedPlacement,
    });
  };

  useIsomorphicLayoutEffect(() => {
    if (!open) return;

    // Run initial alignment
    updatePosition();

    // Listen to resize and capture scroll event phase (for nested scroll containers)
    window.addEventListener("resize", updatePosition, { passive: true });
    window.addEventListener("scroll", updatePosition, { capture: true, passive: true });

    // Instantly queue a coordinate refresh to correct any layout shifts
    const timerId = setTimeout(updatePosition, 0);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      clearTimeout(timerId);
    };
  }, [open, triggerRef, overlayRef]);

  return {
    style: {
      position: "absolute" as const,
      top: `${coords.top}px`,
      left: `${coords.left}px`,
      width: coords.width !== undefined ? `${coords.width}px` : undefined,
      zIndex,
    },
    placement: coords.placement,
  };
}
