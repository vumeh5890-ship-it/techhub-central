import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "THMS — Tech Hub Management System" },
    { name: "description", content: "Run your tech hub: staff, operations, finance, assets and events." },
    { property: "og:title", content: "THMS — Tech Hub Management System" },
    { property: "og:description", content: "Run your tech hub: staff, operations, finance, assets and events." },
  ] }),
  beforeLoad: () => { throw redirect({ to: "/dashboard" }); },
});
