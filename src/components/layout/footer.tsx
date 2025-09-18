import LangSelect from "../settings/lang-select";
import { VersionInfo } from "./version-info";

export default function Footer() {
  return (
    <div
      className="
        footer
        container
        w-full
        fixed
        bottom-0
        flex
        justify-between
        border-solid
        border-t-2
        border-(--pokedex-red-light)
        bg-(--pokedex-red)
        py-2
        px-4
      "
    >
      <div className="w-full flex items-center justify-between text-xs text-white">
        <VersionInfo />
        <LangSelect />
      </div>
    </div>
  );
}
