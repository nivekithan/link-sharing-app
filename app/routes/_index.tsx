import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Link sharing app" },
    { name: "description", content: "Submission for frontend mentor" },
  ];
};

export default function Index() {
  return <h1 className="font-semibold">Hello world 4</h1>;
}
