import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import MainLayout from "../app/(main)/layout";
import Home from "../components/pages/Home/Home";
import Resume from "../components/pages/Resume/Resume";
import Contacts from "../components/pages/Contacts/Contacts";
import Library from "../components/pages/Library/Library";
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

// The real library has hundreds of identical-shaped rows, which makes axe
// very slow; a couple of rows exercise the same markup.
jest.mock("../components/pages/Library/books.json", () => [
  { Titolo: "Decameron Project", Autore: "AAVV", "Casa editrice": "NN Editore", Letto: "FALSE" },
  { Titolo: "1984", Autore: "George Orwell", "Casa editrice": "Mondadori", Letto: "TRUE" },
]);

// Pages under the (main) route group render inside its layout (nav + main
// landmark); the others provide their own <main>.
const pages = {
  "/": <MainLayout><Home /></MainLayout>,
  "/resume": <MainLayout><Resume /></MainLayout>,
  "/contacts": <MainLayout><Contacts /></MainLayout>,
  "/library": <Library />,
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

test("library columns are sortable with buttons exposing aria-sort", () => {
  render(<Library />);
  const title = screen.getByRole("button", { name: "Title" });
  const header = title.closest("th")!;
  expect(header).toHaveAttribute("aria-sort", "none");
  fireEvent.click(title);
  expect(header).toHaveAttribute("aria-sort", "ascending");
});
