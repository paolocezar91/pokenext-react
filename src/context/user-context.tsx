import UserApi, { Settings, User } from "@/app/user-api";
import { TypeUrl } from "@/components/[id]/details/types";
import { useAsyncQuery, useLocalStorage } from "@/components/shared/utils";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSnackbar } from "./snackbar";

interface IUserContext {
  user: User;
  loading: boolean;
  settings: Settings;
  upsertSettings: (body: Partial<Settings>, id?: string) => Promise<Settings>;
}

const userApi = new UserApi();

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
  showSettings: true,
  thumbLabelList: "tooltip",
  thumbSizeList: "xs",
  typeArtworkUrl: "sword-shield" as TypeUrl,
  filter: { name: "", types: "" },
  sorting: []
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const { showSnackbar } = useSnackbar();
  const isAuthenticated = () => status === "authenticated";
  const isUnauthenticated = () => status === "unauthenticated";
    // State for context values
  const [user, setUser] = useState<User>(null);
  const [settings, setSettings] = useState<Settings>(null);
  const [loading, setLoading] = useState(true);
  // Use localStorage for guest user/settings
  const [guestUser] = useLocalStorage<User>("guest_user", { id: 'guest', email: "guest@local" });
  const [guestSettings, setGuestSettings] = useLocalStorage<Settings>("guest_settings", guestDefaultSettings);
  const { data: fetchedUser, loading: userLoading } = useAsyncQuery<User | null>(
    async () => {
      if (isAuthenticated() && session?.user?.email) {
        let sessionUser = await userApi.getUser(session.user.email);
        if(!sessionUser) {
          // creating user if they're not there yet
          sessionUser = await userApi.createUser(session.user.email);
        }
        return sessionUser;
      }
      return Promise.resolve(null);
    },
    [session, status]
  );

  // useAsyncQuery for settings
  const { data: fetchedSettings, loading: settingsLoading } = useAsyncQuery<Settings | null>(
    async () => {
      if (isAuthenticated() && fetchedUser?.id) {
        let settings = await userApi.getSettings(fetchedUser.id);
        // let redisSettings = await userApi.getSettingsRedis(fetchedUser.id)
        if(!settings) {
          // creating settings if they're not there yet
          settings = await userApi.upsertSettings(guestDefaultSettings, fetchedUser.id);
        }
        return settings;
      }
      return Promise.resolve(null);
    },
    [fetchedUser, status]
  );

  // Guest upsertSettings (always returns full Settings)
  const handleGuestUpsertSettings = async (body: Partial<Settings>) => {
    const updated = { ...guestDefaultSettings, ...guestSettings, ...body } as Settings;
    setGuestSettings(updated);
    return updated;
  };

  // Upsert settings for authenticated user
  const handleUpsertSettings = async (body: Partial<Settings>, id?: string) => {
    // Save previous settings for rollback
    const prevSettings = settings;
    // Optimistically update settings
    const optimisticSettings = { ...settings, ...body } as Settings;
    setSettings(optimisticSettings);
    try {
      const updatedSettings = await userApi.upsertSettings(body, id ?? user?.id);
      if (updatedSettings) {
        setSettings(updatedSettings);
        setSettingsCookies(updatedSettings);
        // userApi.setSettingsRedis(id ?? user?.id ?? '', updatedSettings);
        return updatedSettings;
      }
      // If backend returns null, rollback
      setSettings(prevSettings);
      setSettingsCookies(prevSettings);
      // userApi.setSettingsRedis(id ?? user?.id ?? '', prevSettings);
      return prevSettings;
    } catch (error) {
      // Rollback on error
      setSettings(prevSettings);
      setSettingsCookies(prevSettings);
      // Optionally, show error to user here
      showSnackbar("Error updating settings!")
      console.error(error);
      return prevSettings;
    }
  };

  // Sync context state with fetched data
  useEffect(() => {
    if (isAuthenticated()) {
      if (!user) setUser(fetchedUser);
      if (!settings) setSettings(fetchedSettings);
      setLoading(userLoading || settingsLoading);
    } else if (isUnauthenticated()) {
      setUser(guestUser);
      setSettings(guestSettings);
      setLoading(false);
    }
  }, [status, fetchedUser, fetchedSettings]);

  return (
    <UserContext.Provider
      value={
        {
          loading,
          user: isAuthenticated() ? user :
            isUnauthenticated() ? guestUser :
            null,
          settings: isAuthenticated() ? settings :
            isUnauthenticated() ? guestSettings :
            null,
          upsertSettings: (body: Partial<Settings>, id?: string) => 
            isAuthenticated() ? 
              handleUpsertSettings(body, id) :
              handleGuestUpsertSettings(body)
        }
      }
    >
      {status !== 'loading' && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);