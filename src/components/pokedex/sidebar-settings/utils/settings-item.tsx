import { ReactNode } from "react";

export function SettingsItem(
  { children, title, htmlFor, className = "" }:
  { children: ReactNode, title?: string, htmlFor?: string, className?: string }
) {
  return <div className={`settings-item ${className}`}>
    <label className="text-xs" htmlFor={htmlFor}>
      {title}
    </label>
    {children}
  </div>;
}