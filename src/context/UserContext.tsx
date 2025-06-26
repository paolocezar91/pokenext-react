import PokeApiQuery from "@/app/query";
import { TypeUrl } from "@/components/[id]/details/types";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

const pokeApiQuery = new PokeApiQuery();

const getUser = async (email: string) => {
  const user = await pokeApiQuery.fetchURL<User>(`/api/user/${email}`);
  return user;
};

const createUser = async (email: string) => {
  const user = await pokeApiQuery.postUrl<User>(`/api/user`, { email });
  return user;
};

const getSettings = async (user_id: number) => {
  const settings = await pokeApiQuery.fetchURL<Settings>(`/api/user/${user_id}/settings`);
  return settings;
};

const upsertSettings = async (body: Partial<Settings>, id?: number,) => {
  const user = await pokeApiQuery.postUrl<Settings>(`/api/user/${id}/settings`, body as Record<string, unknown>);
  return user;
};

type User = { id: number; email: string } | null;

type Settings = {
  artworkUrl: TypeUrl,
  descriptionLang: string,
  listTable: boolean,
  showColumn: boolean[],
  showShowColumn: boolean,
  showThumbTable: boolean,
  thumbLabelList: string,
  thumbSizeList: string,
  typeArtworkUrl: TypeUrl
} | null;

interface IUserContext {
  user: User;
  loading: boolean;
  settings: Settings;
  upsertSettings: (body: Record<string, unknown>, id?: number) => Promise<Settings>;
}

const UserContext = createContext<IUserContext>({
  loading: true,
  user: null,
  settings: null,
  upsertSettings,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
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
    if(updatedSettings)
      setSettings(prev => ({ ...prev, ...updatedSettings }));
    return updatedSettings;
  };

  const handleGetSettings = async (user_id: number) => {
    const settings = await getSettings(user_id);
    if(settings)
      setSettings(settings);
    return user;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const email = session?.user?.email;
      if (email) {
        const user = await handleGetUser(email);
        if(!user) {
          const createdUser = await handleCreateUser(email);
          if(createdUser){
            await handleUpsertSettings(createdUser.id, {
              artworkUrl: "home",
              descriptionLang: "en",
              listTable: false,
              showColumn: "yyyyyyyyy",
              showShowColumn: false,
              showThumbTable: true,
              thumbLabelList: "tooltip",
              thumbSizeList: "sm",
              typeArtworkUrl: "sword-shield"
            });
          }
        }
      }
      setLoading(false);
    };

    if (status === "authenticated") {
      fetchUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    const fetchSettings = async (userId: number) => {
      await handleGetSettings(userId);
      setLoading(false);
    };

    if(user && !settings) {
      fetchSettings(user.id);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, settings, loading, upsertSettings: handleUpsertSettings }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);