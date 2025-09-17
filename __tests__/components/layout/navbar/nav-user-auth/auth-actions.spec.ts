import {
  handleSignOut,
  signInWithGithub,
} from "@/components/layout/navbar/nav-user-auth/auth-actions";
import { signIn, signOut } from "next-auth/react";
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe("Auth Actions", () => {
  it("calls next-auth/react signIn method", () => {
    signInWithGithub();
    expect(signIn).toHaveBeenCalled();
  });

  it("calls next-auth/react signIn method", () => {
    handleSignOut();
    expect(signOut).toHaveBeenCalled();
  });
});
