import { render, screen, fireEvent } from "@testing-library/react";
import UserMenu from "@/components/layout/navbar/nav-user-auth/user-menu";
import "@testing-library/jest-dom";
import React from "react";

describe("UserMenu", () => {
  it("renders children when open is true", () => {
    render(
      <UserMenu open={true} onClose={jest.fn()}>
        <div>Test Child</div>
      </UserMenu>,
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    const { container } = render(
      <UserMenu open={false} onClose={jest.fn()}>
        <div>Should not be visible</div>
      </UserMenu>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("calls onClose when mouse leaves the menu", async () => {
    // Wrapper to control open state
    const Wrapper = () => {
      const [open, setOpen] = React.useState(true);
      return (
        <UserMenu open={open} onClose={() => setOpen(false)}>
          <div>Menu Content</div>
        </UserMenu>
      );
    };
    const { container } = render(<Wrapper />);
    const menu = screen.getByText("Menu Content").parentElement;
    fireEvent.mouseLeave(menu!);
    // Wait for the menu to be removed
    await screen.findByText("Menu Content").catch(() => {}); // Wait for disappearance
    expect(container.firstChild).toBeNull();
  });

  it("renders children content correctly", () => {
    render(
      <UserMenu open={true} onClose={jest.fn()}>
        <span>Child Element</span>
      </UserMenu>,
    );
    expect(screen.getByText("Child Element")).toBeInTheDocument();
  });
});
