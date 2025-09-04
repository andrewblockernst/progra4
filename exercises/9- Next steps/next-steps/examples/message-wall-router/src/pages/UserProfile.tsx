import { useParams } from "@tanstack/react-router";

export function UserProfile() {
  const { username } = useParams({ from: "/users/$username" });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p>Viewing profile for user: {username}</p>
    </div>
  );
}
