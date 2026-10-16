import { act, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import MainLayout from "../app/(main)/layout";
import Home from "../components/pages/Home/Home";
import Resume from "../components/pages/Resume/Resume";
import Contacts from "../components/pages/Contacts/Contacts";
import Showcase from "../components/pages/Showcase/Showcase";
import Appetta from "../components/pages/Appetta/Appetta";
import GoatPage from "../components/pages/Goat/GoatPage";
import NotFoundPage from "../app/not-found";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// next/link's viewport prefetching schedules state updates outside act();
// a plain anchor is all these markup checks need.
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, ...props }: { href: string }) => <a href={href} {...props} />,
}));

// The particles canvas is decorative and browser-only; stub it out.
jest.mock("../components/atoms/ParticlesBg/Particles", () => ({
  __esModule: true,
  default: () => null,
}));

// Pages under the (main) route group render inside its layout (nav + main
// landmark); the others provide their own <main>.
const pages = {
  "/": <MainLayout><Home /></MainLayout>,
  "/resume": <MainLayout><Resume /></MainLayout>,
  "/showcase": <MainLayout><Showcase /></MainLayout>,
  "/contacts": <MainLayout><Contacts /></MainLayout>,
  "/appetta": <Appetta />,
  "/goat": <GoatPage />,
  "404": <NotFoundPage />,
};

describe.each(Object.entries(pages))("%s", (_path, page) => {
  test("has no axe violations", async () => {
    const { container } = render(page);
    expect(await axe(container)).toHaveNoViolations();
  });

  test("has exactly one h1 and a main landmark", () => {
    render(page);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});

test("social links have accessible names", () => {
  render(<Contacts />);
  for (const name of ["GitHub", "LinkedIn", "CodePen"]) {
    expect(screen.getByRole("link", { name: new RegExp(name) })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  }
});

test("each showcase card links to its project, named by its title", () => {
  render(<Showcase />);
  expect(screen.getByRole("link", { name: "Goat Companion" })).toHaveAttribute("href", "/goat");

  const external = screen.getByRole("link", { name: /Pixel Art & Pattern Generator/ });
  expect(external).toHaveAccessibleName(/opens in a new tab/);
  expect(external).toHaveAttribute("rel", "noopener noreferrer");
});

test("work cards sit under their own heading and show my role", () => {
  render(<Showcase />);
  expect(screen.getByRole("heading", { level: 2, name: "Things I worked on" })).toBeInTheDocument();
  const truelayer = screen.getByRole("link", { name: /truelayer\.com/ });
  expect(truelayer).toHaveAttribute("href", "https://truelayer.com/");
  expect(truelayer.closest("article")).toHaveTextContent("Web Developer at TrueLayer");
});

test("showcase cards list their technologies", () => {
  render(<Showcase />);
  const goat = screen.getByRole("link", { name: "Goat Companion" }).closest("article");
  expect(goat).toHaveTextContent("Built with: Next.js");
});

test("typing the goat's name doesn't make it do tricks", () => {
  const { container } = render(<GoatPage />);
  const input = screen.getByLabelText("Name");
  // The first live region says what the goat does in response to the visitor.
  const status = () => container.querySelector("[aria-live]")?.textContent;
  fireEvent.keyDown(input, { key: "c" });
  fireEvent.keyDown(input, { key: "s" });
  fireEvent.keyDown(input, { key: "ArrowLeft" });
  expect(status()).toBe("");

  fireEvent.change(input, { target: { value: "  Biscuit " } });
  fireEvent.submit(input.closest("form")!);
  expect(screen.getByText("Your goat is now called Biscuit.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Cuddle Biscuit" }));
  expect(status()).toBe("Biscuit enjoys a cuddle!");
});

test("goat shortcuts only work while focus is on the goat page", () => {
  // Start from an unnamed goat, not the one an earlier test saved.
  window.localStorage.clear();
  const { container } = render(<GoatPage />);
  const status = () => container.querySelector("[aria-live]")?.textContent;

  fireEvent.keyDown(document.body, { key: "c" });
  expect(status()).toBe("");
  // Arrows elsewhere still scroll: the keydown isn't cancelled.
  expect(fireEvent.keyDown(document.body, { key: "ArrowDown" })).toBe(true);

  fireEvent.keyDown(screen.getByRole("main"), { key: "c" });
  expect(status()).toBe("The goat enjoys a cuddle!");
});

test("the goat's wandering can be switched off", () => {
  render(<GoatPage />);
  const toggle = screen.getByRole("button", { name: "Wandering" });
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByRole("main")).toHaveClass("goatPage--still");
});

test("the 404 turnip patch can be harvested and replanted", () => {
  // Every pull pops its turnip on the first try.
  const random = jest.spyOn(Math, "random").mockReturnValue(0);
  render(<NotFoundPage />);
  expect(screen.getByRole("link", { name: "Take me home" })).toHaveAttribute("href", "/");

  for (let i = 1; i <= 6; i++) {
    fireEvent.click(screen.getByRole("button", { name: `Pull turnip ${i}` }));
  }
  expect(screen.getByRole("status")).toHaveTextContent(
    "Under turnip 6: nothing at all. The page was the turnips we pulled along the way."
  );
  expect(screen.getByText(/Turnips pulled: 6 \/ 6/)).toHaveTextContent("pages found: 0");

  fireEvent.click(screen.getByRole("button", { name: "Replant the patch" }));
  expect(screen.getByRole("button", { name: "Pull turnip 1" })).toHaveFocus();
  random.mockRestore();
});

test("a stuck turnip stays in the ground until a later pull", () => {
  // 0.99 is above every pop chance except the guaranteed third pull.
  const random = jest.spyOn(Math, "random").mockReturnValue(0.99);
  render(<NotFoundPage />);
  const turnip = screen.getByRole("button", { name: "Pull turnip 1" });
  fireEvent.click(turnip);
  fireEvent.click(turnip);
  expect(turnip).toHaveAccessibleName("Pull turnip 1");
  fireEvent.click(turnip);
  expect(turnip).not.toHaveAccessibleName("Pull turnip 1");
  random.mockRestore();
});

test("an untouched turnip fidgets every few seconds", () => {
  jest.useFakeTimers();
  // Shortest delay, first turnip, first move.
  const random = jest.spyOn(Math, "random").mockReturnValue(0);
  const { container } = render(<NotFoundPage />);
  const fidgeting = () => container.querySelectorAll("[class*='plot--idle-']");

  act(() => jest.advanceTimersByTime(2499));
  expect(fidgeting()).toHaveLength(0);
  act(() => jest.advanceTimersByTime(1));
  expect(fidgeting()).toHaveLength(1);
  expect(fidgeting()[0]).toHaveClass("plot--idle-rustle");
  // A fidget is decoration: nothing is announced.
  expect(screen.getByRole("status")).toHaveTextContent("Nothing dug up yet.");

  act(() => jest.advanceTimersByTime(1000));
  expect(fidgeting()).toHaveLength(0);
  random.mockRestore();
  jest.useRealTimers();
});
