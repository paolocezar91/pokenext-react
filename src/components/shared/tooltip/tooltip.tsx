import React, { useEffect, useReducer, useRef } from "react";
import "./tooltip.scss";

type TooltipPosition = "top" | "bottom" | "left" | "right";

type TooltipState = {
  isVisible: boolean;
  timeoutId: NodeJS.Timeout | null;
  coords: { top: number; left: number };
  finalPosition: TooltipPosition;
};

type TooltipAction =
  | { type: "SET_IS_VISIBLE"; payload: boolean }
  | { type: "SET_TIMEOUT_ID"; payload: NodeJS.Timeout | null }
  | { type: "SET_COORDS"; payload: { top: number; left: number } }
  | { type: "SET_FINAL_POSITION"; payload: TooltipPosition }
  | { type: "RESET_STATE" };

export default function Tooltip({
  children,
  content,
  position = "top",
  delay = 0,
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  className?: string;
}) {
  const initialState: TooltipState = {
    isVisible: false,
    timeoutId: null,
    coords: { top: 0, left: 0 },
    finalPosition: position,
  };

  const tooltipReducer = (
    state: TooltipState,
    action: TooltipAction,
  ): TooltipState => {
    switch (action.type) {
      case "SET_IS_VISIBLE":
        return { ...state, isVisible: action.payload };
      case "SET_TIMEOUT_ID":
        return { ...state, timeoutId: action.payload };
      case "SET_COORDS":
        return { ...state, coords: action.payload };
      case "SET_FINAL_POSITION":
        return { ...state, finalPosition: action.payload };
      case "RESET_STATE":
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(tooltipReducer, initialState);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;

    if (delay > 0) {
      const id = setTimeout(() => {
        dispatch({ type: "SET_IS_VISIBLE", payload: true });
        updatePosition();
      }, delay);
      dispatch({ type: "SET_TIMEOUT_ID", payload: id });
    } else {
      dispatch({ type: "SET_IS_VISIBLE", payload: true });
      updatePosition();
    }
  };

  const hideTooltip = () => {
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
      dispatch({ type: "SET_TIMEOUT_ID", payload: null });
    }
    dispatch({ type: "SET_IS_VISIBLE", payload: false });
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate initial position
    let newPosition = position;
    let top = 0;
    let left = 0;

    // Check if the preferred position fits, otherwise find the best alternative
    switch (position) {
      case "top":
        if (triggerRect.top - tooltipRect.height < 0) {
          newPosition = "bottom";
        }
        break;
      case "bottom":
        if (triggerRect.bottom + tooltipRect.height > viewportHeight) {
          newPosition = "top";
        }
        break;
      case "left":
        if (triggerRect.left - tooltipRect.width < 0) {
          newPosition = "right";
        }
        break;
      case "right":
        if (triggerRect.right + tooltipRect.width > viewportWidth) {
          newPosition = "left";
        }
        break;
    }

    // Calculate coordinates based on final position
    switch (newPosition) {
      case "top":
        top = triggerRect.top - tooltipRect.height;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width;
        break;
      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right;
        break;
    }

    // Ensure tooltip stays within viewport bounds
    left = Math.max(10, Math.min(left, viewportWidth - tooltipRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - tooltipRect.height - 10));

    dispatch({ type: "SET_FINAL_POSITION", payload: newPosition });
    dispatch({ type: "SET_COORDS", payload: { top, left } });
  };

  useEffect(() => {
    if (state.isVisible) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isVisible]);

  return (
    <div className="tooltip-container">
      <div
        ref={triggerRef}
        className="tooltip-trigger"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onClick={
          disabled
            ? undefined
            : () =>
                dispatch({ type: "SET_IS_VISIBLE", payload: !state.isVisible })
        }
        aria-describedby={state.isVisible ? "tooltip-content" : undefined}
      >
        {children}
      </div>
      {state.isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip-content"
          role="tooltip"
          className={`tooltip-content tooltip-${state.finalPosition} rounded py-2 px-3 ${className}`}
          style={{
            top: `${state.coords.top}px`,
            left: `${state.coords.left}px`,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
