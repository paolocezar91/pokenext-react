import { ChevronLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { SettingsContent } from "./settings-content";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { useUser } from "@/context/user-context";
import { useClickOutside } from "@/components/shared/utils";


export function SettingsContainer({ children, className = "" }: { children: ReactNode, className: string }) {
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation('common');
  const settingsRef = useRef<HTMLDivElement>(null);
  const { settings } = useUser();
  useClickOutside(settingsRef, () => setShowSettings(false));

  const tooltipTableText = !showSettings ? t('settings.openTableSettings') : t('settings.closeTableSettings');
  const tooltipThumbText = !showSettings ? t('settings.openThumbnailSettings') : t('settings.closeThumbnailSettings');

  return <AnimatePresence>
    <div
      ref={settingsRef}
      className={`settings relative z-2 ${className}`}
    >
      <Tooltip
        position="right"
        content={settings?.listTable ? tooltipTableText : tooltipThumbText }
      >
        <Button
          className={`
            cursor-pointer
            flex
            p-2
            transition-colors
            active:bg-white
            active:text-(--pokedex-red-dark)
            ${showSettings ?
              "rounded-s bg-(--pokedex-red-dark) hover:text-(--pokedex-red-dark) hover:bg-white" :
              "rounded hover:bg-(--pokedex-red-dark)"}
          `}
          onClick={() => setShowSettings(!showSettings)}
        >
          { showSettings ? <ChevronLeftIcon className="w-5" />: <Cog6ToothIcon className="w-5" />}
        </Button>
      </Tooltip>
      {showSettings && <motion.div
        initial={{ left: '2rem', opacity: 0 }}
        animate={{ left: '2.5rem', opacity: 1 }}
        exit={{ left: "2rem", opacity: 0 }}
        style={{ position: 'absolute', zIndex: '2', top: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SettingsContent title={t('menu.settings')}>
          { children }
        </SettingsContent>
      </motion.div>}
    </div>
  </AnimatePresence>;
}