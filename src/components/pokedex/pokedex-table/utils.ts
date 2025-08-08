import { Settings } from "@/app/user-api";

export const shouldShowColumn = (settings: Settings, i: number) => settings?.showShowColumn || settings?.showColumn?.[i] || false;


