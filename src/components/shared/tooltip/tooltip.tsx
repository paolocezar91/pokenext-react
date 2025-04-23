import React, { useState, useRef, useEffect } from 'react';
import './tooltip.scss';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export default function Tooltip({
  children,
  content,
  position = 'top',
  delay = 0,
  disabled = false,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [finalPosition, setFinalPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;

    if (delay > 0) {
      const id = setTimeout(() => {
        setIsVisible(true);
        updatePosition();
      }, delay);
      setTimeoutId(id);
    } else {
      setIsVisible(true);
      updatePosition();
    }
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
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
      case 'top':
        if (triggerRect.top - tooltipRect.height < 0) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewportHeight) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (triggerRect.left - tooltipRect.width < 0) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewportWidth) {
          newPosition = 'left';
        }
        break;
    }

    // Calculate coordinates based on final position
    switch (newPosition) {
      case 'top':
        top = triggerRect.top - tooltipRect.height;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right;
        break;
    }

    // Ensure tooltip stays within viewport bounds
    left = Math.max(10, Math.min(left, viewportWidth - tooltipRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - tooltipRect.height - 10));

    setFinalPosition(newPosition);
    setCoords({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isVisible]);

  return (
    <div className="tooltip-container">
      <div
        ref={triggerRef}
        className="tooltip-trigger"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onClick={disabled ? undefined : () => setIsVisible(!isVisible)}
        aria-describedby={isVisible ? "tooltip-content" : undefined}
      >
        {children}
      </div>
      {isVisible &&
        <div
          ref={tooltipRef}
          id="tooltip-content"
          role="tooltip"
          className={`tooltip-content tooltip-${finalPosition}`}
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
        >
          {content}
        </div>
      }
    </div>
  );
};