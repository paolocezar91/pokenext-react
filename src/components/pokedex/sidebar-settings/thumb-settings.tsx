import Toggle from "@/components/shared/toggle";
import { SettingsContainer } from "./utils/settings-container";
import { SettingsItem } from "./utils/settings-item";
import { useUser } from "@/context/user-context";
import { useTranslation } from "react-i18next";


export default function ThumbSettings() {
  const { settings, upsertSettings } = useUser();
  const { t } = useTranslation('common');
  const handleShowShowColumnChange = (showShowColumn: boolean) => {
    upsertSettings({ showShowColumn });
  };

  const handleShowThumb = (showThumbTable: boolean) => {
    upsertSettings({ showThumbTable });
  };

  return <SettingsContainer className="mt-1">
    <SettingsItem className="mb-2" htmlFor="showThumb">
      <Toggle
        className="w-60"
        value={settings!.showThumbTable}
        id="showThumb"
        onChange={handleShowThumb}
        childrenRight={t('settings.showThumb')}
      />
    </SettingsItem>
    <SettingsItem htmlFor="showShowColumns">
      <Toggle
        className="w-60"
        value={settings!.showShowColumn}
        id="showShowColumns"
        onChange={handleShowShowColumnChange}
        childrenRight={t('settings.showShowColumns')} />
    </SettingsItem>
  </SettingsContainer>;
}