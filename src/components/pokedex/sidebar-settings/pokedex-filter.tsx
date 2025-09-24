/* eslint-disable no-unused-vars */
import PokeApiQuery from "@/app/api/poke-api-query";
import MultiSelect from "@/components/shared/multi-select";
import { capitilize, useClickOutside } from "@/components/shared/utils";
import { ChevronLeftIcon, FunnelIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Tooltip from "../../shared/tooltip/tooltip";
import { SettingsContent } from "./utils/settings-content";
import { SettingsItem } from "./utils/settings-item";
import { useTranslations } from "next-intl";

const pokeApiQuery = new PokeApiQuery();

export default function PokedexFilter({
  name,
  types,
  onFilterName,
  onFilterTypes,
}: {
  name?: string;
  types?: string[];
  onFilterName: (value: string) => void;
  onFilterTypes: (values: string[]) => void;
}) {
  const t = useTranslations();
  const [filterName, setFilterName] = useState(name);
  const [filterType, setFilterType] = useState<string[]>(types ?? []);
  const [open, setOpen] = useState<boolean>(!!name || !!types?.length);
  const { data: typeOptions } = useQuery({
    queryKey: ["filterTypes"],
    queryFn: () => pokeApiQuery.getAllTypes(),
  });
  const filterRef = useRef<HTMLDivElement>(null);
  // Close the menu if clicking outside
  useClickOutside(filterRef, () => setOpen(false));

  useEffect(() => {
    if (
      filterName !== undefined &&
      (filterName?.length === 0 || filterName?.length > 2)
    ) {
      const timeOutId = setTimeout(() => onFilterName(filterName), 300);
      return () => clearTimeout(timeOutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName]);

  const handleTypeFilter = (t: string[]) => {
    setFilterType(t);
    onFilterTypes(t);
  };

  const isFiltered =
    !!filterType.length || filterName !== undefined && filterName?.length > 2;

  const toggleFilterForm =
    <Tooltip
      position="right"
      content={`${t("filters.title")} ${isFiltered ? "(active)" : ""}`}
    >
      <Button
        className={`
          cursor-pointer
          flex
          p-2
          transition-colors
          active:bg-white
          active:text-(--pokedex-red-dark)
          ${
            open
              ? "rounded-s bg-(--pokedex-red-dark) hover:text-(--pokedex-red-dark) hover:bg-white"
              : "rounded hover:bg-(--pokedex-red-dark)"
          }
        `}
        onClick={() => setOpen(!open)}
      >
        {open ?
          <ChevronLeftIcon className="w-5" />
          :
          <FunnelIcon className="w-5" />
        }
        {isFiltered &&
          <span className="absolute right-1 top-1 bg-green-400 rounded-lg w-2 h-2" />
        }
      </Button>
    </Tooltip>
  ;

  const filterForm = typeOptions &&
    <div>
      <SettingsItem
        title={t("filters.filterName.title")}
        className="name-filter"
      >
        <Tooltip content={t("filters.filterName.tooltip")}>
          <input
            value={filterName}
            name="filter"
            className={`w-30
            md:w-75
            text-xs
            bg-white
            rounded-lg
            border-2
            border-[#212529]
            text-[#212529]
            p-2
            min-h-[2.5rem]
            hover:border-(--pokedex-red)
          `}
            type="text"
            placeholder={t("filters.filterName.placeholder")}
            onChange={(event) => setFilterName(event.target.value)}
          />
        </Tooltip>
      </SettingsItem>
      <SettingsItem
        title={t("filters.filterTypes.title")}
        className="type-filter"
      >
        <MultiSelect
          placeholder={t("filters.filterTypes.placeholder")}
          onChange={handleTypeFilter}
          value={filterType}
          options={typeOptions.map(({ name }: { name: string }) => ({
            label: capitilize(name),
            value: name,
          }))}
        />
      </SettingsItem>
    </div>
  ;

  return (
    <AnimatePresence>
      <div className="settings relative z-2" ref={filterRef}>
        {toggleFilterForm}
        {open &&
          <motion.div
            initial={{ left: "2rem", opacity: 0 }}
            animate={{ left: "2.5rem", opacity: 1 }}
            exit={{ left: "2rem", opacity: 0 }}
            style={{ position: "absolute", zIndex: "2", top: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsContent
              title={`${t("filters.title")} ${isFiltered ? "(active)" : ""}`}
            >
              {filterForm}
            </SettingsContent>
          </motion.div>
        }
      </div>
    </AnimatePresence>
  );
}
