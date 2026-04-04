export interface Blog {
  title: string;
  href: string;
  cover: string;
  detail: string;
  date: string;
}

export const blogs: Blog[] = [
  {
    title: "Hedystia 2.1 - Reactive UI Engine",
    href: "/blog/2.1",
    cover: "/blog/2.1/cover.png",
    detail:
      "Fine-grained reactive UI framework with no Virtual DOM, surgical DOM updates, and full JSX support",
    date: "04 Apr 2026",
  },
  {
    title: "Hedystia 2.0 - Database ORM",
    href: "/blog/2.0",
    cover: "/blog/2.0/cover.png",
    detail: "Type-safe ORM with multi-database support, smart caching, and migration system",
    date: "16 Mar 2026",
  },
  {
    title: "Hedystia 1.10 - Type Mastery",
    href: "/blog/1.10",
    cover: "/blog/1.10/cover.png",
    detail:
      "Type-safe route testing, conditional routes, real-time WebSockets, and framework-agnostic type generation",
    date: "12 Mar 2026",
  },
  {
    title: "Welcome to Hedystia",
    href: "/blog/welcome",
    cover: "/blog/welcome/cover.png",
    detail: "An introduction to the Hedystia framework and what makes it different.",
    date: "06 Mar 2026",
  },
];
