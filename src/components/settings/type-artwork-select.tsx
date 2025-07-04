import { useUser } from "@/context/user-context";
import Image from "next/image";
import { ChangeEvent, ReactNode } from "react";
import { getTypeIconById } from "../[id]/details/types";
import Select from "../shared/select";
import { normalizeVersionGroup } from "../shared/utils";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "@/context/snackbar";

const sprites = [
  'omega-ruby-alpha-sapphire',
  'x-y',
  'lets-go-pikachu-lets-go-eevee',
  'sun-moon',
  'ultra-sun-ultra-moon',
  'brilliant-diamond-and-shining-pearl',
  'legends-arceus',
  'sword-shield'
];

export default function TypeArtworkSelect() {
  const { settings, upsertSettings } = useUser();
  const { t } = useTranslation('common');
  const { showSnackbar } = useSnackbar();

  const handleArtworkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    upsertSettings({ typeArtworkUrl: e.target.value });
    showSnackbar(t('settings.artworkOptions.typeArtworkUpdated'), 5);
  };

  return settings && <div className="flex flex-col sm:flex-row">
    <label htmlFor="lang" className="w-full grow">
      <div className="flex flex-col">
        <span>{t('settings.artworkOptions.typeArtworkIcon')}:</span>
        <Select
          data-testid="lang"
          id="lang"
          value={settings.typeArtworkUrl}
          onChange={handleArtworkChange}
        >
          {
            sprites.map((key: string) => {
              return <option className="text-xs" key={key} value={key}>{normalizeVersionGroup(key)}</option>;
            })
          }
        </Select>
      </div>
      <div className="text-xs hover:text-(--pokedex-red)">
        {t('settings.artworkOptions.typeArtworkTooltip')}
      </div>
    </label>
    <Image
      width={128}
      height={28}
      alt="Normal"
      className="h-[28px] md:mt-8 mt-4 md:ml-4 sm:ml-0"
      src={ getTypeIconById('12', settings.typeArtworkUrl) } />
  </div>;
}