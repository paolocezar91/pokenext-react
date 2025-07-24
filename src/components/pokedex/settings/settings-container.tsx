import { ChevronLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { SettingsContent } from "./settings-content";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import Tooltip from "@/components/shared/tooltip/tooltip";


export function SettingsContainer({ children, className = "" }: { children: ReactNode, className: string }) {
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

  return <AnimatePresence>
    <div
      ref={settingsRef}
      className={`settings relative z-2 ${className}`}
    >
      <Tooltip
        content={
          !showSettings ?
            t("settings.openSettings") :
            t("settings.closeSettings")
        }
      >
        <Button
          className={`
          cursor-pointer
          flex
          p-2
          rounded
          transition-colors
          ${showSettings ?
            "bg-(--pokedex-red-darker) hover:text-(--pokedex-red-darker) hover:bg-white" :
            "hover:bg-(--pokedex-red-darker)"}
        `}
          onClick={() => setShowSettings(!showSettings)}
        >
          { showSettings ? <ChevronLeftIcon className="w-6" />: <Cog6ToothIcon className="w-6" />}
        </Button>
      </Tooltip>
      {showSettings && <motion.div
        initial={{ left: '2rem', opacity: 0 }}
        animate={{ left: '2.5rem', opacity: 1 }}
        exit={{ left: "2rem", opacity: 0 }}
        style={{ position: 'absolute', zIndex: '2', top: '-0.5rem' }}
        transition={{ duration: 0.3 }}
      >
        <SettingsContent title={t('menu.settings')}>
          { children }
        </SettingsContent>
      </motion.div>}
    </div>
  </AnimatePresence>;
}