import { act, render, screen } from "@testing-library/react";
import BackgroundToggle from "./BackgroundToggle";

beforeEach(() => {
  window.localStorage.clear();
});

describe("background control", () => {
  test("offers moving, still and off, and remembers the choice", () => {
    const { unmount } = render(<BackgroundToggle />);
    const group = screen.getByRole("group", { name: "Background" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Moving background" })).toHaveAttribute("aria-pressed", "true");

    act(() => screen.getByRole("button", { name: "Still background" }).click());
    expect(screen.getByRole("button", { name: "Still background" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Moving background" })).toHaveAttribute("aria-pressed", "false");

    unmount();
    render(<BackgroundToggle />);
    expect(screen.getByRole("button", { name: "Still background" })).toHaveAttribute("aria-pressed", "true");
  });

  test("defaults to still when the OS asks for reduced motion", () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
    try {
      render(<BackgroundToggle />);
      expect(screen.getByRole("button", { name: "Still background" })).toHaveAttribute("aria-pressed", "true");
    } finally {
      // jsdom has no matchMedia by default.
      delete (window as Partial<Window>).matchMedia;
    }
  });
});
