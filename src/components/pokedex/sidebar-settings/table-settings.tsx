import Select from "@/components/shared/select";
import { SettingsItem } from "./utils/settings-item";
import { SettingsContainer } from "./utils/settings-container";
import { useUser } from "@/context/user-context";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";

export default function ThumbSettings() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const { settings, upsertSettings } = useUser();
  const t = useTranslations();
  const handleThumbSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ thumbSizeList: e.target.value });
  };

  const handleThumbLabelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ thumbLabelList: e.target.value });
  };

  return <SettingsContainer className="mt-1">
    {!isMobile && <SettingsItem title={t('settings.size.title')} htmlFor="thumbSize">
      <Select className="w-70" value={settings?.thumbSizeList} id="thumbSize" onChange={handleThumbSizeChange}>
        <option value="xs">{t('settings.size.xs')}</option>
        <option value="sm">{t('settings.size.sm')}</option>
        <option value="base">{t('settings.size.base')}</option>
      </Select>
    </SettingsItem>}
    <SettingsItem title={t('settings.label.title')} htmlFor="thumbLabel">
      <Select className="w-70" value={settings?.thumbLabelList} id="thumbLabel" onChange={handleThumbLabelChange}>
        <option value="tooltip">{t('settings.label.tooltip')}</option>
        <option value="thumbnail">{t('settings.label.thumbnail')}</option>
        <option value="none">{t('settings.label.none')}</option>
      </Select>
    </SettingsItem>
  </SettingsContainer>;
}