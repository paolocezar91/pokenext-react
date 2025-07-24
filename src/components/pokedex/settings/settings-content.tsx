import { ReactNode } from "react";

export function SettingsContent({ children, title }: { children: ReactNode, title: string }) {
  return <div className="
    settings-group
    bg-black
    border-solid
    border-4
    border-(--pokedex-red-dark)
    rounded
    shadow-lg
    p-4"
  >
    <div className="settings-item">
      <div className="text-sm pb-1 mb-2">
        { title }
      </div>
      <hr className="mb-2" />
      { children }
    </div>
  </div>;
}