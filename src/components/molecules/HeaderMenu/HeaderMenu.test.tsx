import { act, fireEvent, render, screen } from "@testing-library/react";
import HeaderMenu from "./HeaderMenu";

const mockPathname = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, ...props }: { href: string }) => <a href={href} {...props} />,
}));

beforeEach(() => {
  mockPathname.mockReturnValue("/");
  window.localStorage.clear();
});

const menuButton = () => screen.getByRole("button", { name: "Menu" });

describe("mobile menu", () => {
  test("the menu button controls the link list and toggles it", () => {
    render(<HeaderMenu />);
    const list = screen.getByRole("list");
    expect(menuButton()).toHaveAttribute("aria-controls", list.id);
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton());
    expect(menuButton()).toHaveAttribute("aria-expanded", "true");
    expect(list.className).toContain("header-menu__list--open");

    fireEvent.click(menuButton());
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes the menu and returns focus to the button", () => {
    render(<HeaderMenu />);
    fireEvent.click(menuButton());
    screen.getByRole("link", { name: "Things I made" }).focus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    expect(menuButton()).toHaveFocus();
  });

  test("navigating to another page closes the menu", () => {
    const { rerender } = render(<HeaderMenu />);
    fireEvent.click(menuButton());

    mockPathname.mockReturnValue("/resume");
    rerender(<HeaderMenu />);
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking outside the header closes the menu", () => {
    render(<HeaderMenu />);
    fireEvent.click(menuButton());
    fireEvent.pointerDown(document.body);
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
  });
});

describe("background control", () => {
  test("offers moving, still and off, and remembers the choice", () => {
    const { unmount } = render(<HeaderMenu />);
    const group = screen.getByRole("group", { name: "Background" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Moving background" })).toHaveAttribute("aria-pressed", "true");

    act(() => screen.getByRole("button", { name: "Still background" }).click());
    expect(screen.getByRole("button", { name: "Still background" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Moving background" })).toHaveAttribute("aria-pressed", "false");

    unmount();
    render(<HeaderMenu />);
    expect(screen.getByRole("button", { name: "Still background" })).toHaveAttribute("aria-pressed", "true");
  });

  test("defaults to still when the OS asks for reduced motion", () => {
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
    try {
      render(<HeaderMenu />);
      expect(screen.getByRole("button", { name: "Still background" })).toHaveAttribute("aria-pressed", "true");
    } finally {
      // jsdom has no matchMedia by default.
      delete (window as Partial<Window>).matchMedia;
    }
  });
});

test("the header hides while scrolling down and returns on scroll up", () => {
  jest.useFakeTimers();
  render(<HeaderMenu />);
  const header = screen.getByRole("banner");
  const scrollTo = (y: number) => {
    window.scrollY = y;
    fireEvent.scroll(window);
    act(() => jest.advanceTimersByTime(20));
  };

  scrollTo(400);
  expect(header).toHaveClass("header-menu--hidden");
  expect(header).toHaveClass("header-menu--scrolled");

  // A tiny nudge up is ignored; a real scroll up brings it back.
  scrollTo(396);
  expect(header).toHaveClass("header-menu--hidden");
  scrollTo(300);
  expect(header).not.toHaveClass("header-menu--hidden");

  // An open menu never slides away.
  fireEvent.click(menuButton());
  scrollTo(800);
  expect(header).not.toHaveClass("header-menu--hidden");

  scrollTo(0);
  expect(header).not.toHaveClass("header-menu--scrolled");
  jest.useRealTimers();
});

test("the turnip logo links home and sits outside the main nav", () => {
  render(<HeaderMenu />);
  const logo = screen.getByRole("link", { name: "Home" });
  expect(logo).toHaveAttribute("href", "/");
  expect(screen.getByRole("navigation", { name: "Main" })).not.toContainElement(logo);
});
