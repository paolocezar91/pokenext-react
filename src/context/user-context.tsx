import { TypeUrl } from "@/components/[id]/details/types";
import { useLocalStorage } from "@/components/shared/utils";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createUser, getSettings, getUser, Settings, upsertSettings, User } from "./user-api";

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
  upsertSettings,
});

const setSettingsCookies = async (updatedSettings: unknown) => {
  await fetch('/api/settings', {
    method: 'POST',
    body: JSON.stringify(updatedSettings),
    headers: { 'Content-Type': 'application/json' },
  });
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  // Use localStorage for guest user/settings
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
  const [guestUser] = useLocalStorage<User>("guest_user", { id: 0, email: "guest@local" });
  const [guestSettings, setGuestSettings] = useLocalStorage<Settings>("guest_settings", guestDefaultSettings);
  const [user, setUser] = useState<User>(null);
  const [settings, setSettings] = useState<Settings>(null);
  const [loading, setLoading] = useState(true);

  const handleGetUser = async (email: string) => {
    const user = await getUser(email);
    if(user)
      setUser(user);
    return user;
  };

  const handleCreateUser = async (email: string) => {
    const createdUser = await createUser(email);
    if(createdUser)
      setUser(createdUser);
    return createdUser;
  };

  // Wrapper to update settings state after upsert
  const handleUpsertSettings = async (body: Record<string, unknown>, id?: number) => {
    const updatedSettings = await upsertSettings(body, id ?? user?.id);
    if(updatedSettings) {
      setSettings(updatedSettings);
      setSettingsCookies(updatedSettings);
    }
    return updatedSettings;
  };

  const handleGetSettings = async (user_id: number) => {
    const settings = await getSettings(user_id);
    if(settings){
      setSettings(settings);
      setSettingsCookies(settings);
    }
    return settings;
  };

  // Guest upsertSettings (always returns full Settings)
  const handleGuestUpsertSettings = async (body: Record<string, unknown>) => {
    const updated: Settings = { ...guestDefaultSettings, ...guestSettings, ...body };
    setGuestSettings(updated);
    return updated;
  };

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUser = async () => {
        const email = session?.user?.email;
        if (email) {
          if(!await handleGetUser(email)) {
            const createdUser = await handleCreateUser(email);
            if(createdUser){
              await handleUpsertSettings(guestSettings as Record<string, unknown>, createdUser.id);
            }
          }
        }
      };
      fetchUser();
    } else if(status === 'unauthenticated') {
      // Guest mode: use localStorage
      setUser(guestUser);
      setSettings(guestSettings);
      setLoading(false);
    }
  }, [session, status, guestUser, guestSettings]);

  useEffect(() => {
    if (status === "authenticated" && user && !settings) {
      const fetchSettings = async (userId: number) => {
        if(!await handleGetSettings(userId)){
          await handleUpsertSettings(guestSettings as Record<string, unknown>, userId);
        }
        setLoading(false);
      };
      fetchSettings(user.id);
    }
  }, [user, status]);

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