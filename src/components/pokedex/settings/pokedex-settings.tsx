import Select from "@/components/shared/select";
import Toggle from "@/components/shared/toggle";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { useUser } from "@/context/user-context";
import { Squares2X2Icon, TableCellsIcon } from "@heroicons/react/24/solid";
import { ChangeEvent } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import PokedexFilter from "../pokedex-filter/pokedex-filter";
import { SettingsItem } from "./settings-item";
import { SettingsContainer } from "./settings-container";

export function PokedexSettings() {
  const { user, settings, upsertSettings } = useUser();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const { t } = useTranslation('common');

  const filterName = (name: string) => {
    if(name !== settings?.filter.name) {
      const filter = { name, types: settings?.filter?.types ?? '' };
      upsertSettings({ filter });
    }
  };

  const filterTypes = (types: string[]) => {
    if(types.join(',') !== settings?.filter.types) {
      const filter = { name: settings?.filter?.name ?? '', types: types.join(",") };
      upsertSettings({ filter });
    }
  };

  const handleShowShowColumnChange = (value: boolean) => {
    if(user)
      upsertSettings({ showShowColumn: value }, user?.id);
  };

  const handleShowThumb = (showThumbTable: boolean) => {
    if(user)
      upsertSettings({ showThumbTable }, user?.id);
  };

  const handleThumbSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ thumbSizeList: e.target.value });
  };

  const handleThumbLabelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ thumbLabelList: e.target.value });
  };

  return settings &&
    <div className="flex flex-col items-center bg-(--pokedex-red-dark) p-2 md:w-max border-b-2 border-solid border-black rounded-l-lg">
      <PokedexFilter
        name={settings.filter.name}
        types={settings.filter.types ? settings.filter.types.split(",") : []}
        onFilterName={filterName}
        onFilterTypes={filterTypes}
      />
      <SettingsContainer className="mt-2">
        {settings.listTable ?
          <>
            <SettingsItem className="mb-2" htmlFor="showThumb">
              <Toggle
                className="w-60"
                value={settings.showThumbTable}
                id="showThumb"
                onChange={handleShowThumb}
                childrenRight={t('settings.showThumb')}
              />
            </SettingsItem>
            <SettingsItem htmlFor="showShowColumns">
              <Toggle
                className="w-60"
                value={settings.showShowColumn}
                id="showShowColumns"
                onChange={handleShowShowColumnChange}
                childrenRight={t('settings.showShowColumns')} />
            </SettingsItem>
          </>:
          <>
            {!isMobile &&
            <SettingsItem title={t('settings.size.title')} htmlFor="thumbSize">
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
          </>
        }
      </SettingsContainer>
      <hr className="border-1 border-solid border-white my-2 w-full" />
      <Tooltip className="mt-1"
        content={
          settings.listTable ?
            t('settings.thumbnailView') :
            t('settings.tableView')
        }
      >
        <Button
          onClick={() => upsertSettings({ listTable: !settings.listTable })}
          className="
            cursor-pointer
            flex
            p-2
            rounded
            transition-colors
            hover:bg-(--pokedex-red-darker)
          ">
          {settings.listTable ?
            <Squares2X2Icon className="w-6" /> :
            <TableCellsIcon className="w-6" />}
        </Button>
      </Tooltip>
    </div>;
}





