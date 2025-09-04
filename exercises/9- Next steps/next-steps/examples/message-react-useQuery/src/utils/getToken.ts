import { queryClient } from "../queryClient";

export function getToken(): string | undefined {
  const token = queryClient.getMutationCache().find({ mutationKey: ["login"] });
  return token?.state.data as string | undefined;
}
