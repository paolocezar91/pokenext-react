import React, { useState } from 'react';
import './tooltip.scss'; // Same CSS as before

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

  const showTooltip = () => {
    if (disabled) return;

    if (delay > 0) {
      const id = setTimeout(() => setIsVisible(true), delay);
      setTimeoutId(id);
    } else {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  return (
    <div className="tooltip-container">
      <div
        className="tooltip-trigger"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onClick={disabled ? undefined : () => setIsVisible(!isVisible)}
        aria-describedby={isVisible ? "tooltip-content" : undefined}
      >
        {children}
      </div>
      {isVisible && <div
        id="tooltip-content"
        role="tooltip"
        className={`tooltip-content tooltip-${position}`}
      >
        {content}
      </div>}
    </div>
  );
};
