import { render, screen } from "@testing-library/react";
import MenuLink from "./MenuLink";

const mockPathname = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

describe("MenuLink active state", () => {
  test('the root link is active only on "/"', () => {
    mockPathname.mockReturnValue("/");
    const { rerender } = render(<MenuLink link="/" label="Me" />);
    expect(screen.getByRole("link", { name: "Me" }).className).toContain(
      "menu-link--active"
    );

    mockPathname.mockReturnValue("/resume");
    rerender(<MenuLink link="/" label="Me" />);
    expect(screen.getByRole("link", { name: "Me" }).className).not.toContain(
      "menu-link--active"
    );
  });

  test("other links match their path or a sub-path, but not siblings", () => {
    mockPathname.mockReturnValue("/resume");
    const { rerender } = render(<MenuLink link="/resume" label="Resume" />);
    expect(screen.getByRole("link", { name: "Resume" }).className).toContain(
      "menu-link--active"
    );

    mockPathname.mockReturnValue("/contacts");
    rerender(<MenuLink link="/resume" label="Resume" />);
    expect(screen.getByRole("link", { name: "Resume" }).className).not.toContain(
      "menu-link--active"
    );

    // A path that merely starts with the same characters is not a match.
    mockPathname.mockReturnValue("/resume-notes");
    rerender(<MenuLink link="/resume" label="Resume" />);
    expect(screen.getByRole("link", { name: "Resume" }).className).not.toContain(
      "menu-link--active"
    );
  });
});
