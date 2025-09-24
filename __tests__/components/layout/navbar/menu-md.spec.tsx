import MenuMd from "@/components/layout/navbar/menu-md";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

jest.mock("@/components/layout/navbar/search", () =>
  jest.fn(() => <div>Search</div>),
);
jest.mock("@/components/layout/navbar/nav-link", () =>
  jest.fn(({ href, children }) => <a href={href}>{children}</a>),
);
jest.mock("@/components/layout/navbar/nav-user-auth/nav-user-auth", () =>
  jest.fn(() => <div>nav-user-auth</div>),
);
jest.mock("@/context/user-context", () => ({
  useUser: () => ({
    settings: {},
  }),
}));

describe("MenuMd", () => {
  it("renders children inside the menu", () => {
    render(<MenuMd></MenuMd>);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<MenuMd></MenuMd>);
    expect(asFragment()).toMatchSnapshot();
  });
});
