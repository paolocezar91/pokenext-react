import Tooltip from "@/components/shared/tooltip/tooltip";
import { useUser } from "@/context/user-context";
import { Squares2X2Icon, TableCellsIcon } from "@heroicons/react/24/solid";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import PokedexFilter from "./pokedex-filter";
import TableSettings from "./table-settings";
import ThumbSettings from "./thumb-settings";

export function SidebarSettings() {
  const { settings, upsertSettings } = useUser();
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

  return settings &&
    <div className="flex flex-col items-center bg-(--pokedex-red) py-2 pl-2 md:w-max border-b-2 border-solid border-black rounded-l-lg">
      <PokedexFilter
        name={settings.filter.name}
        types={settings.filter.types ? settings.filter.types.split(",") : []}
        onFilterName={filterName}
        onFilterTypes={filterTypes}
      />
      {
        settings.listTable ?
          <TableSettings />:
          <ThumbSettings />
      }
      <hr className="border-1 border-solid border-white my-2 w-full" />
      {/* List Table Toggle */}
      <Tooltip className="mt-1"
        position="right"
        content={
          settings.listTable ?
            t('settings.thumbnailView') :
            t('settings.tableView')
        }
      >
        <div className="ltr">
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
        </div>
      </Tooltip>
    </div>;
}





