import Select from "@/components/shared/select";
import Toggle from "@/components/shared/toggle";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { useUser } from "@/context/user-context";
import { ArrowsUpDownIcon, Squares2X2Icon, TableCellsIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import PokedexFilter from "../pokedex-filter/pokedex-filter";
import { SettingsContainer } from "./settings-container";
import { SettingsItem } from "./settings-item";

export function PokedexSettings() {
  const { settings, upsertSettings } = useUser();
  const [sortingActive, setSortingActive] = useState(!!settings?.sorting.length);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const { t } = useTranslation('common');

  useEffect(() => {
    setSortingActive(!!settings?.sorting.length);
  }, [settings?.sorting]);

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

  const handleShowShowColumnChange = (showShowColumn: boolean) => {
    upsertSettings({ showShowColumn });
  };

  const handleShowThumb = (showThumbTable: boolean) => {
    upsertSettings({ showThumbTable });
  };

  const handleThumbSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ thumbSizeList: e.target.value });
  };

  const handleThumbLabelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ thumbLabelList: e.target.value });
  };

  return settings &&
    <div className="flex flex-col items-center bg-(--pokedex-red) p-2 md:w-max border-b-2 border-solid border-black rounded-l-lg">
      <PokedexFilter
        name={settings.filter.name}
        types={settings.filter.types ? settings.filter.types.split(",") : []}
        onFilterName={filterName}
        onFilterTypes={filterTypes}
      />
      <Tooltip
        content="Reset sorting options"
      >
        <Button
          onClick={() => {
            upsertSettings({ sorting: [] });
            setSortingActive(!sortingActive);
          }}
          disabled={!sortingActive}
          className={`
            mt-1
            cursor-pointer
            flex
            p-2
            rounded
            transition-colors
            hover:bg-(--pokedex-red-dark)
            hover:text-white
            active:bg-white
            active:text-(--pokedex-red-dark)
            disabled:opacity-30
            disabled:bg-(--pokedex-red-dark)
            ${sortingActive ? 'bg-white text-(--pokedex-red-dark)' : ''}
          `}>
          <ArrowsUpDownIcon className="w-6" />
        </Button>
      </Tooltip>
      <SettingsContainer className="mt-1">
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
            hover:bg-(--pokedex-red-dark)
            active:bg-white
            active:text-(--pokedex-red-dark)
          ">
          {settings.listTable ?
            <Squares2X2Icon className="w-6" /> :
            <TableCellsIcon className="w-6" />}
        </Button>
      </Tooltip>
    </div>;
}





