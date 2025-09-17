import Footer from "@/components/layout/footer";
import { VersionInfo } from "@/components/layout/version-info";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

describe("VersionInfo", () => {
  it("should match snapshot with no valid description", () => {
    const { asFragment } = render(<VersionInfo />);
    expect(asFragment()).toMatchSnapshot();
  });
});
