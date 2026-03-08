export interface Blog {
  title: string;
  href: string;
  cover: string;
  detail: string;
  date: string;
}

export const blogs: Blog[] = [
  {
    title: "Welcome to Hedystia",
    href: "/blog/welcome",
    cover: "/blog/welcome/cover.png",
    detail: "An introduction to the Hedystia framework and what makes it different.",
    date: "06 Mar 2026",
  },
];
