import UserAvatarButton from "@/components/layout/navbar/nav-user-auth/user-avatar-button";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe("UserAvatarButton", () => {
  const clickCallback = jest.fn();
  const onMouseEnterCallback = jest.fn();

  it("renders correctly with image", () => {
    render(
      <UserAvatarButton
        image={"image.png"}
        onClick={() => clickCallback()}
        onMouseEnter={() => onMouseEnterCallback()}
      ></UserAvatarButton>,
    );

    const img = document.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "image.png");
  });

  it("tests clicks and onMouseEnter without image", () => {
    render(
      <UserAvatarButton
        image="image.png"
        onClick={() => clickCallback()}
        onMouseEnter={() => onMouseEnterCallback()}
      ></UserAvatarButton>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(clickCallback).toHaveBeenCalled();
    fireEvent.mouseEnter(button);
    expect(onMouseEnterCallback).toHaveBeenCalled();
  });

  it("should match snapshot with image", () => {
    const { asFragment } = render(
      <UserAvatarButton
        image="image.png"
        onClick={() => clickCallback()}
        onMouseEnter={() => onMouseEnterCallback()}
      ></UserAvatarButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly without image", () => {
    render(
      <UserAvatarButton
        image={undefined}
        onClick={() => clickCallback()}
        onMouseEnter={() => onMouseEnterCallback()}
      ></UserAvatarButton>,
    );

    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("h-6", "w-6", "text-white");
  });

  it("tests clicks and onMouseEnter without image", () => {
    render(
      <UserAvatarButton
        image={undefined}
        onClick={() => clickCallback()}
        onMouseEnter={() => onMouseEnterCallback()}
      ></UserAvatarButton>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(clickCallback).toHaveBeenCalled();
    fireEvent.mouseEnter(button);
    expect(onMouseEnterCallback).toHaveBeenCalled();
  });

  it("should match snapshot with image", () => {
    const { asFragment } = render(
      <UserAvatarButton
        image={undefined}
        onClick={() => clickCallback()}
        onMouseEnter={() => onMouseEnterCallback()}
      ></UserAvatarButton>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
