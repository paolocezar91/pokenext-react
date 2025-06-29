import { signIn, signOut } from "next-auth/react";

export const signInWithGithub = async () => {
  await signIn("github");
};

export const handleSignOut = async () => {
  await signOut();
};
