import { SpeciesChain } from "@/types/types";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { normalizePokemonName } from "@/components/shared/utils";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "@/components/shared/link";
import { ChainLink, EvolutionChain, Pokemon } from "pokeapi-typescript";
import { useTranslations } from "next-intl";
import PokemonThumb, { getNumber } from "@/components/shared/thumb/thumb";
import PokemonEvolutionHappiness from "./happiness";
import PokemonEvolutionItem from "./item";
import PokemonEvolutionLocation from "./location";
import PokemonEvolutionLevel from "./lvl";
import PokemonEvolutionTrade from "./trade";
import PokemonEvolutionBeauty from "./beauty";
import PokemonEvolutionAffection from "./affection";
import PokemonEvolutionRain from "./rain";
import PokemonEvolutionPartySpecies from "./party-species";
import PokemonEvolutionPartyType from "./party-type";
import PokemonEvolutionPhysicalStats from "./physical-stats";
import PokemonEvolutionTimeOfDay from "./time-of-day";
import PokemonEvolutionTradeSpecies from "./trade-species";
import PokemonEvolutionUpsideDown from "./upside-down";
import PokemonEvolutionGender from "./gender";
import SkeletonImage from "@/components/shared/skeleton-image";

export function PokemonEvolutionChartSkeleton() {
  const t = useTranslations();

  return (
    <div className="evolution-chain col-span-6 ">
      <h3 className="w-fit text-lg font-semibold mb-2">
        {t("pokedex.details.evolutionChart.title")}
      </h3>
      <ul className="w-fit flex items-start justify-start overflow-x-auto mt-4 gap-4">
        <li className="mb-2 items-center flex">
          <SkeletonImage className="w-36 h-36" />
          <span className="font-bold text-xl ml-4">
            <ArrowRightIcon className="w-7" />
          </span>
        </li>
        <li className="mb-2 items-center flex">
          <SkeletonImage className="w-36 h-36" />
          <span className="font-bold text-xl ml-4">
            <ArrowRightIcon className="w-7" />
          </span>
        </li>
        <li>
          <SkeletonImage className="w-36 h-36" />
        </li>
      </ul>
    </div>
  );
}

export default function PokemonEvolutionChart({
  pokemon,
  speciesChain,
  evolutionChain,
}: {
  pokemon?: Pokemon | null;
  speciesChain?: SpeciesChain | null;
  evolutionChain?: EvolutionChain | null;
}) {
  const t = useTranslations();

  // While loading show skeleton
  if (!speciesChain?.loaded || !evolutionChain || !pokemon) {
    return <PokemonEvolutionChartSkeleton />;
  }

  // Pokemon with no evolution
  if (
    !!speciesChain.chain.first?.length &&
    !speciesChain.chain.second?.length
  ) {
    return (
      <div className="evolution-chain col-span-6 ">
        <h3 className="w-fit text-lg font-semibold mb-2">
          {t("pokedex.details.evolutionChart.title")}
        </h3>
        <p>
          {normalizePokemonName(speciesChain.chain.first[0].name)} does not
          evolve
        </p>
      </div>
    );
  }

  const firstPkmn = speciesChain.chain.first[0];
  const firstChainColumn =
    <Tooltip
      content={`${normalizePokemonName(firstPkmn.name)} ${getNumber(
        firstPkmn.id
      )}`}
    >
      <Link className="flex-2" href={`/pokedex/${firstPkmn.name}`}>
        <PokemonThumb
          className={`${
            pokemon.id === firstPkmn.id
              ? "border-foreground border-solid border-4"
              : "border-0"
          } `}
          pokemonData={firstPkmn}
          size="sm"
        />
      </Link>
    </Tooltip>
  ;
  const chainColumn = (chain: Pokemon[], evolves_to: ChainLink[]) =>
    <ul className="flex flex-col">
      {chain.map((pkmn, idx) => {
        const evolution_details = evolves_to[idx].evolution_details[0];
        return (
          <li className="mb-2 items-center flex text-xs" key={pkmn.id}>
            <div className="flex flex-col items-center flex-1 mx-3">
              {evolution_details &&
                <span className="flex text-center flex-col">
                  <PokemonEvolutionLevel
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionItem evolution_details={evolution_details} />
                  <PokemonEvolutionLocation
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionHappiness
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionTrade
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionBeauty
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionAffection
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionRain evolution_details={evolution_details} />
                  <PokemonEvolutionPartySpecies
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionPartyType
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionPhysicalStats
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionTimeOfDay
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionTradeSpecies
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionUpsideDown
                    evolution_details={evolution_details}
                  />
                  <PokemonEvolutionGender
                    evolution_details={evolution_details}
                  />
                </span>
              }
              <span className="font-bold text-xl">
                <ArrowRightIcon className="w-7" />
              </span>
            </div>
            <Tooltip
              content={`${normalizePokemonName(pkmn.name)} ${getNumber(
                pkmn.id
              )}`}
            >
              <Link className="flex-2" href={`/pokedex/${pkmn.name}`}>
                <PokemonThumb
                  className={`${
                    pokemon.id === pkmn.id
                      ? "border-foreground border-solid border-4"
                      : "border-0"
                  } `}
                  pokemonData={pkmn}
                  size="sm"
                />
              </Link>
            </Tooltip>
          </li>
        );
      })}
    </ul>
  ;
  return (
    <div className="evolution-chain col-span-6 ">
      <h3 className="w-fit text-lg font-semibold mb-2">
        {t("pokedex.details.evolutionChart.title")}
      </h3>
      {!!speciesChain.loaded &&
        <ul className="w-fit flex items-start justify-start overflow-x-auto mt-4">
          {!!speciesChain.chain.second?.length &&
            <>
              <li>{firstChainColumn}</li>
              <li>
                {chainColumn(
                  speciesChain.chain.second,
                  evolutionChain.chain.evolves_to
                )}
              </li>
            </>
          }
          {!!speciesChain.chain.third?.length &&
            <li>
              {chainColumn(
                speciesChain.chain.third,
                evolutionChain.chain.evolves_to[0].evolves_to
              )}
            </li>
          }
        </ul>
      }
    </div>
  );
}
