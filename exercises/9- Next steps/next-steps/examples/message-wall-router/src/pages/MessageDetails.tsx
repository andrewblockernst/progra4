import { useParams } from "@tanstack/react-router";

export function MessageDetails() {
  const { messageId } = useParams({ from: "/messages/$messageId" });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Message Details</h1>
      <p>Viewing message with ID: {messageId}</p>
    </div>
  );
}
