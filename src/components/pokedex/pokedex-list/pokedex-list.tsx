import Tooltip from "@/components/shared/tooltip/tooltip";
import { normalizePokemonName } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import { IPkmn } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { getNumber } from "../../shared/thumb/thumb";
import LazyThumb from "./lazy-thumb";
import "./pokedex-list.scss";

export default function PokedexList({
  pokemons,
  children,
}: Readonly<{
  pokemons: IPkmn[];
  children: React.ReactNode;
}>) {
  const { settings } = useUser();
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(
    undefined
  );
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  useEffect(() => {
    const parent = parentRef.current;
    function updateWidth() {
      if (!parent) return;
      const parentWidth = parent.offsetWidth;
      const itemWidth = (() => {
        switch (settings?.thumbSizeList) {
          case "xs":
            return 120;
          case "sm":
            return 160;
          case "base":
            return 200;
          case "lg":
            return 320;
        }
        return 0;
      })();

      const gap = 16; // gap-4 = 1rem = 16px
      // Calculate how many items fit
      const itemsPerRow = Math.max(
        1,
        Math.floor((parentWidth - 6 * gap) / (itemWidth + gap))
      );
      const totalWidth = itemsPerRow * itemWidth + (itemsPerRow - 1) * gap;
      setContainerWidth(totalWidth);
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);

    // Optional: Use ResizeObserver for more accurate resizing
    let observer: ResizeObserver | undefined;
    if (parent && "ResizeObserver" in window) {
      observer = new ResizeObserver(updateWidth);
      observer.observe(parent);
    }

    return () => {
      window.removeEventListener("resize", updateWidth);
      if (observer && parent) observer.unobserve(parent);
    };
  }, [settings?.thumbSizeList]);

  return (
    settings &&
      <div
        className="list-container w-full p-2 bg-(--pokedex-red) relative"
        ref={parentRef}
      >
        <div
          className="
        list
        relative
        h-[85vh]
        overflow-auto
        rounded-lg
        bg-background
      "
        >
          <div
            className="mx-auto my-4 flex gap-4 content-start flex-row flex-wrap"
            style={containerWidth ? { width: containerWidth } : undefined}
          >
            {pokemons.map((pokemon) => {
              const lazyThumb =
                <LazyThumb
                  pokemon={pokemon}
                  settings={settings}
                  isMobile={isMobile}
                />
              ;
              return (
                <div key={pokemon.id}>
                  {settings.thumbLabelList == "tooltip" &&
                    <Tooltip
                      content={`${normalizePokemonName(
                        pokemon.name
                      )} ${getNumber(pokemon.id)}`}
                    >
                      {lazyThumb}
                    </Tooltip>
                  }
                  {(settings.thumbLabelList == "thumbnail" ||
                    settings.thumbLabelList == "none") &&
                    lazyThumb}
                </div>
              );
            })}
          </div>
          {children}
        </div>
      </div>

  );
}
