import { ReactNode } from "react";

export function SettingsContent({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="ltr">
      <div
        className="
      settings-group
      bg-black
      border-solid
      border-6
      border-(--pokedex-red-dark)
      rounded
      rounded-tl-none
      px-4
      py-2"
      >
        <div className="settings-item">
          <div className="text-sm pb-1 mb-2">{title}</div>
          <hr className="mb-2" />
          {children}
        </div>
      </div>
    </div>
  );
}
