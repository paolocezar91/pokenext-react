import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export function PokedexSettings({ children }: { children: ReactNode }) {
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
    className="settings absolute right-[3rem] top-[-3rem] z-2 text-xs"
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
        ${showSettings ?
          'bg-white text-(--pokedex-red) hover:text-(--pokedex-red-dark)' :
          'bg-(--pokedex-red) text-foreground hover:bg-(--pokedex-red-dark)'}
      `}
    >
      <EllipsisHorizontalIcon className="w-6" />
    </Button>
    {showSettings && <SettingsContent title={t('settings.title')}>
      { children }
    </SettingsContent>}
  </div>;
}

export function SettingsItem({ children, title, htmlFor, className }: { children: ReactNode, title?: string, htmlFor?: string, className?: string }) {
  return <div className={`settings-item ${className}`}>
    <label className="text-xs" htmlFor={htmlFor}>
      <span className="mb-2">{title}</span>
      {children}
    </label>
  </div>;
}

export function SettingsContent({ children, title }: { children: ReactNode, title: string }) {

  return <div className="settings-group bg-background rounded-l-lg border-4 border-(--pokedex-red-dark) shadow-lg p-4">
    <div className="settings-item">
      <div className="text-sm pb-1 mb-2">
        { title }
      </div>
      <hr className="mb-2" />
      { children }
    </div>
  </div>;
}