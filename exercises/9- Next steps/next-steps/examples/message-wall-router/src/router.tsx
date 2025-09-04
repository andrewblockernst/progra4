import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { App } from "./App";
import { Index } from "./pages";
import { MessageDetails } from "./pages/MessageDetails";
import { UserProfile } from "./pages/UserProfile";

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Index,
  path: "/",
});

const userProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users/$username",
  component: UserProfile,
});

const messageDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages/$messageId",
  component: MessageDetails,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  messageDetailsRoute,
  userProfileRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
