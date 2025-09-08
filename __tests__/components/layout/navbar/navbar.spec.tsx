import Navbar from "@/components/layout/navbar/navbar";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock react-i18next
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock the DefaultMenu and MobileMenu and other child components to simplify testing
jest.mock("@/components/layout/navbar/menu-md", () =>
  jest.fn(({}) => <div data-testid="default-menu">{}</div>),
);
jest.mock("@/components/layout/navbar/menu-xs", () =>
  jest.fn(({}) => <div data-testid="mobile-menu">{}</div>),
);
jest.mock("@/components/layout/navbar/nav-link", () =>
  jest.fn(({ href, children }) => <a href={href}>{children}</a>),
);
jest.mock("@/components/layout/navbar/search", () =>
  jest.fn(() => <div>NavSearch</div>),
);

jest.mock("@/context/user-context", () => ({
  useUser: () => ({
    settings: { descriptionLang: "en" },
  }),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

describe("Navbar Component", () => {
  const mockUsePathname = () => "/";
  const mockUseSession = () => {
    return {
      data: {
        user: "",
        expires: "",
      },
      status: "authenticated",
    };
  };

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue(mockUsePathname);
    (useSession as jest.Mock).mockReturnValue(mockUseSession);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with title", () => {
    render(<Navbar title="Pokedex App" />);
    expect(screen.getByText("Pokedex App")).toBeInTheDocument();
  });

  it("contains a link to home page on the logo", () => {
    render(<Navbar title="Pokedex App" />);
    const logoLink = screen.getByRole("link", { name: /pokedex app/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/en");
  });

  it("renders home link correctly", () => {
    render(<Navbar title="Pokedex App" />);
    const homeLink = screen
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/en");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/en");
  });
});
