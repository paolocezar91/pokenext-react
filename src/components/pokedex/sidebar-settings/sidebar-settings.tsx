import Tooltip from "@/components/shared/tooltip/tooltip";
import { useUser } from "@/context/user-context";
import {
  ChevronDownIcon,
  Squares2X2Icon,
  TableCellsIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useTranslations } from "next-intl";
import PokedexFilter from "./pokedex-filter";
import TableSettings from "./table-settings";
import ThumbSettings from "./thumb-settings";

export function SidebarSettings() {
  const { settings, upsertSettings } = useUser();
  const t = useTranslations();
  const containerControls = useAnimation();
  const contentControls = useAnimation();
  const chevronControls = useAnimation();

  useEffect(() => {
    if (settings?.showSettings) {
      // Show: expand height, then fade in content
      chevronControls.start({ rotate: -180, transition: { duration: 0.3 }});
      containerControls
        .start({ height: "auto", transition: { duration: 0.3 }})
        .then(() => {
          contentControls.start({ opacity: 1, transition: { duration: 0.2 }});
        });
    } else {
      // Hide: fade out content, then collapse height
      contentControls
        .start({ opacity: 0, transition: { duration: 0.2 }})
        .then(() => {
          chevronControls.start({ rotate: 0, transition: { duration: 0.3 }});
          containerControls.start({ height: 0, transition: { duration: 0.3 }});
        });
    }
  }, [
    settings?.showSettings,
    containerControls,
    contentControls,
    chevronControls,
  ]);

  const filterName = (name: string) => {
    if (name !== settings?.filter.name) {
      const filter = { name, types: settings?.filter?.types ?? "" };
      upsertSettings({ filter });
    }
  };

  const filterTypes = (types: string[]) => {
    if (types.join(",") !== settings?.filter.types) {
      const filter = {
        name: settings?.filter?.name ?? "",
        types: types.join(","),
      };
      upsertSettings({ filter });
    }
  };

  return (
    settings &&
      <div className="absolute z-2 flex flex-col items-center bg-(--pokedex-red) py-2 px-2 md:w-max rounded-br-xl">
        <Tooltip
          position="right"
          content={
            !settings.showSettings
              ? t("settings.showSettings")
              : t("settings.hideSettings")
          }
        >
          <Button
            onClick={() =>
              upsertSettings({ showSettings: !settings.showSettings })
            }
            className="
            cursor-pointer
            flex
            px-2
            rounded
            transition-colors
            hover:bg-(--pokedex-red-dark)
            active:bg-white
            active:text-(--pokedex-red-dark)
          "
          >
            <motion.div animate={chevronControls} initial={{ rotate: 0 }}>
              <ChevronDownIcon className="w-5" />
            </motion.div>
          </Button>
        </Tooltip>
        <AnimatePresence>
          <motion.div animate={containerControls} initial={{ height: 0 }}>
            <motion.div animate={contentControls} initial={{ opacity: 0 }}>
              <hr className="border-1 border-solid border-white my-1 w-full" />
              <PokedexFilter
                name={settings.filter.name}
                types={
                  settings.filter.types ? settings.filter.types.split(",") : []
                }
                onFilterName={filterName}
                onFilterTypes={filterTypes}
              />
              {settings.listTable ? <ThumbSettings /> : <TableSettings />}
              <Tooltip
                position="right"
                content={
                  settings.listTable
                    ? t("settings.thumbnailView")
                    : t("settings.tableView")
                }
              >
                <div className="ltr">
                  <Button
                    onClick={() =>
                      upsertSettings({ listTable: !settings.listTable })
                    }
                    className="
                    mt-1
                    cursor-pointer
                    flex
                    p-2
                    rounded
                    transition-colors
                    hover:bg-(--pokedex-red-dark)
                    active:bg-white
                    active:text-(--pokedex-red-dark)
                  "
                  >
                    {settings.listTable ?
                      <Squares2X2Icon className="w-5" />
                      :
                      <TableCellsIcon className="w-5" />
                    }
                  </Button>
                </div>
              </Tooltip>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

  );
}
