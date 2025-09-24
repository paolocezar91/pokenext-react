import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NavUserAuth from "@/components/layout/navbar/nav-user-auth/nav-user-auth";

// Mocks
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/test-path",
}));

jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock(
  "@/components/layout/navbar/nav-user-auth/user-avatar-button",
  () => ({
    __esModule: true,
    default: ({ image, onClick, onMouseEnter }: any) => (
      <button
        data-testid="avatar-btn"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {image ? "Avatar" : "NoAvatar"}
      </button>
    ),
  }),
);

jest.mock("@/components/layout/navbar/nav-user-auth/user-menu", () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="user-menu">{children}</div>,
}));

jest.mock("@/components/layout/navbar/nav-user-auth/user-menu-content", () => ({
  __esModule: true,
  default: ({ session, pathname, onSignIn, onSignOut }: any) => (
    <div data-testid="user-menu-content">
      {session ? "SignedIn" : "SignedOut"}
      <span>{pathname}</span>
      <button onClick={onSignIn}>SignIn</button>
      <button onClick={onSignOut}>SignOut</button>
    </div>
  ),
}));

describe("NavUserAuth", () => {
  const useSessionMock = require("next-auth/react").useSession;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    useSessionMock.mockReturnValue({ data: null, status: "loading" });
    render(<NavUserAuth />);
    expect(screen.getByTestId("avatar-btn")).toBeInTheDocument();
    expect(screen.getByText("NoAvatar")).toBeInTheDocument();
  });

  it("renders signed out state and opens menu on hover", () => {
    useSessionMock.mockReturnValue({ data: null, status: "unauthenticated" });
    render(<NavUserAuth />);
    const avatarBtn = screen.getByTestId("avatar-btn");
    fireEvent.mouseEnter(avatarBtn);
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu-content")).toHaveTextContent(
      "SignedOut",
    );
  });

  it("renders signed in state and toggles menu on click", () => {
    useSessionMock.mockReturnValue({
      data: { user: { image: "img-url" } },
      status: "authenticated",
    });
    render(<NavUserAuth />);
    const avatarBtn = screen.getByTestId("avatar-btn");
    expect(screen.getByText("Avatar")).toBeInTheDocument();
    fireEvent.click(avatarBtn);
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu-content")).toHaveTextContent(
      "SignedIn",
    );
  });

  it("matches snapshot", () => {
    useSessionMock.mockReturnValue({
      data: { user: { image: "img-url" } },
      status: "authenticated",
    });
    const { asFragment } = render(<NavUserAuth />);
    expect(asFragment()).toMatchSnapshot();
  });
});
