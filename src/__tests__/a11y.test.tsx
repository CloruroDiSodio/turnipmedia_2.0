import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import MainLayout from "../app/(main)/layout";
import Home from "../components/pages/Home/Home";
import Resume from "../components/pages/Resume/Resume";
import Contacts from "../components/pages/Contacts/Contacts";
import Showcase from "../components/pages/Showcase/Showcase";
import Appetta from "../components/pages/Appetta/Appetta";
import GoatPage from "../components/pages/Goat/GoatPage";

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
  // The first live region says what the goat is doing.
  const status = () => container.querySelector("[aria-live]")?.textContent;
  fireEvent.keyDown(input, { key: "c" });
  fireEvent.keyDown(input, { key: "s" });
  fireEvent.keyDown(input, { key: "ArrowLeft" });
  expect(status()).toBe("The goat is facing you.");

  fireEvent.change(input, { target: { value: "  Biscuit " } });
  fireEvent.submit(input.closest("form")!);
  expect(screen.getByText("Your goat is now called Biscuit.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cuddle Biscuit" })).toBeInTheDocument();
  expect(status()).toBe("Biscuit is facing you.");
});
