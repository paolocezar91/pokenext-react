import { render, screen, fireEvent } from "@testing-library/react";
import UserMenuContent, {
  Session,
} from "@/components/layout/navbar/nav-user-auth/user-menu-content";
import "@testing-library/jest-dom";

const baseProps = {
  pathname: "/settings",
  onSignIn: jest.fn(),
  onSignOut: jest.fn(),
};

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

describe("UserMenuContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders sign-in and settings when no session", () => {
    render(<UserMenuContent {...baseProps} session={undefined as any} />);
    expect(screen.getByText(/menu.settings/i)).toBeInTheDocument();
    expect(screen.getByText(/menu.about/i)).toBeInTheDocument();
    expect(screen.getByText(/menu.signIn/i)).toBeInTheDocument();
    expect(screen.queryByText(/menu.signOut/i)).not.toBeInTheDocument();
  });

  it("calls onSignIn when sign-in button is clicked", () => {
    render(<UserMenuContent {...baseProps} session={undefined as any} />);
    fireEvent.click(screen.getByText(/menu.signIn/i));
    expect(baseProps.onSignIn).toHaveBeenCalled();
  });

  it("matches snapshot when no session", () => {
    const { asFragment } = render(
      <UserMenuContent {...baseProps} session={undefined as any} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders user info, sign-out, and settings when session exists", () => {
    const session: Session = {
      user: { name: "Ash", email: "ash@poke.com" } as any,
      expires: "future",
    };
    render(<UserMenuContent {...baseProps} session={session} />);
    expect(screen.getByText("Ash")).toBeInTheDocument();
    expect(screen.getByText(/menu.settings/i)).toBeInTheDocument();
    expect(screen.getByText(/menu.about/i)).toBeInTheDocument();
    expect(screen.getByText(/menu.signOut/i)).toBeInTheDocument();
    expect(screen.queryByText(/menu.signIn/i)).not.toBeInTheDocument();
  });

  it("calls onSignOut when sign-out button is clicked", () => {
    const session: Session = {
      user: { name: "Ash", email: "ash@poke.com" } as any,
      expires: "future",
    };
    render(<UserMenuContent {...baseProps} session={session} />);
    fireEvent.click(screen.getByText(/menu.signOut/i));
    expect(baseProps.onSignOut).toHaveBeenCalled();
  });

  it("shows user email if name is missing", () => {
    const session: Session = {
      user: { email: "misty@poke.com" } as any,
      expires: "future",
    };
    render(<UserMenuContent {...baseProps} session={session} />);
    expect(screen.getByText("misty@poke.com")).toBeInTheDocument();
  });

  it("matches snapshot when session exists", () => {
    const session: Session = {
      user: { name: "Brock", email: "brock@poke.com" } as any,
      expires: "future",
    };
    const { asFragment } = render(
      <UserMenuContent {...baseProps} session={session} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
