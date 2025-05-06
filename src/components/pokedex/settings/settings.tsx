import { Cog8ToothIcon } from "@heroicons/react/24/solid";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export function Settings({ children }: { children: ReactNode }) {
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation('common');
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return <div
    ref={settingsRef}
    className="settings absolute right-[3rem] top-[-3rem] z-15 text-xs"
  >
    <Button
      onClick={() => setShowSettings(!showSettings)}
      className={`p-1
        rounded
        absolute
        right-[-2.25rem]
        top-0
        shadow-lg
        border-2
        border-solid
        border-transparent
        hover:border-white
        ${showSettings ? 'bg-foreground text-(--pokedex-red-dark)' : 'bg-(--pokedex-red-dark) text-foreground '}
      `}
    >
      <Cog8ToothIcon className="w-6" />
    </Button>
    {showSettings && <SettingsContent title={t('settings.title')}>
      { children }
    </SettingsContent>}
  </div>;
}

export function SettingsItem({ children, title, htmlFor, className }: { children: ReactNode, title?: string, htmlFor?: string, className?: string }) {
  return <div className={`settings-item ${className}`}>
    <label className="text-xs" htmlFor={htmlFor}>
      {title}
      {children}
    </label>
  </div>;
}

export function SettingsContent({ children, title }: { children: ReactNode, title: string }) {

  return <div className="settings-group bg-background rounded-l-lg border-4 border-(--pokedex-red-dark) shadow-lg p-2">
    <div className="settings-item">
      <div className="text-sm border-b-1 pb-1 mb-2 border-solid border-white">
        { title }
      </div>
      { children }
    </div>
  </div>;
}