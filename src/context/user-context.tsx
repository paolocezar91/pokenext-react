import { TypeUrl } from "@/components/[id]/details/types";
import { useAsyncQuery, useLocalStorage } from "@/components/shared/utils";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import UserApi, { Settings, User } from "./user-api";
const userApi = new UserApi();

interface IUserContext {
  user: User;
  loading: boolean;
  settings: Settings;
  // eslint-disable-next-line no-unused-vars
  upsertSettings: (body: Record<string, unknown>, id?: number) => Promise<Settings>;
}

const UserContext = createContext<IUserContext>({
  loading: true,
  user: null,
  settings: null,
  upsertSettings: userApi.upsertSettings,
});

const setSettingsCookies = async (updatedSettings: unknown) => {
  await fetch('/api/settings', {
    method: 'POST',
    body: JSON.stringify(updatedSettings),
    headers: { 'Content-Type': 'application/json' },
  });
};

const guestDefaultSettings: Settings = {
  artworkUrl: "official-artwork",
  descriptionLang: "en",
  listTable: false,
  showColumn: [true, true, true, true, true, true, true, true, true],
  showShowColumn: false,
  showThumbTable: true,
  thumbLabelList: "tooltip",
  thumbSizeList: "sm",
  typeArtworkUrl: "sword-shield" as TypeUrl,
  filter: { name: "", types: "" },
  sorting: []
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  // Use localStorage for guest user/settings
  const [guestUser] = useLocalStorage<User>("guest_user", { id: 0, email: "guest@local" });
  const [guestSettings, setGuestSettings] = useLocalStorage<Settings>("guest_settings", guestDefaultSettings);

  // useAsyncQuery for user
  const { data: fetchedUser, loading: userLoading } = useAsyncQuery<User | null>(
    () => {
      if (status === "authenticated" && session?.user?.email) {
        return userApi.getUser(session.user.email);
      }
      return Promise.resolve(null);
    },
    [session, status]
  );

  // useAsyncQuery for settings
  const { data: fetchedSettings, loading: settingsLoading } = useAsyncQuery<Settings | null>(
    () => {
      if (status === "authenticated" && fetchedUser?.id) {
        return userApi.getSettings(fetchedUser.id);
      }
      return Promise.resolve(null);
    },
    [fetchedUser, status]
  );

  // State for context values
  const [user, setUser] = useState<User>(null);
  const [settings, setSettings] = useState<Settings>(null);
  const [loading, setLoading] = useState(true);

  // Guest upsertSettings (always returns full Settings)
  const handleGuestUpsertSettings = async (body: Record<string, unknown>) => {
    const updated: Settings = { ...guestDefaultSettings, ...guestSettings, ...body };
    setGuestSettings(updated);
    return updated;
  };

  // Upsert settings for authenticated user
  const handleUpsertSettings = async (body: Record<string, unknown>, id?: number) => {
    const updatedSettings = await userApi.upsertSettings(body, id ?? user?.id);
    if(updatedSettings) {
      setSettings(updatedSettings);
      setSettingsCookies(updatedSettings);
    }
    return updatedSettings;
  };

  // Sync context state with fetched data
  useEffect(() => {
    if (status === "authenticated") {
      setUser(fetchedUser);
      setSettings(fetchedSettings);
      setLoading(userLoading || settingsLoading);
    } else if (status === "unauthenticated") {
      setUser(guestUser);
      setSettings(guestSettings);
      setLoading(false);
    }
  }, [status, fetchedUser, fetchedSettings, userLoading, settingsLoading, guestUser, guestSettings]);

  // Unified upsertSettings signature for context
  const upsertSettingsFn = async (body: Record<string, unknown>, id?: number) => {
    if (status === "authenticated") {
      return handleUpsertSettings(body, id);
    } else {
      return handleGuestUpsertSettings(body);
    }
  };

  const settingsFn = () => {
    return status === "authenticated" ? settings : status === "unauthenticated" ? guestSettings : null;
  };

  const userFn = () => {
    return status === "authenticated" ? user : status === "unauthenticated" ? guestUser : null;
  };

  return (
    <UserContext.Provider
      value={
        {
          user: userFn(),
          settings: settingsFn(),
          loading,
          upsertSettings: upsertSettingsFn
        }
      }
    >
      {status !== 'loading' && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);