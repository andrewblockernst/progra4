import type { APIRoute } from "astro";
import { addMensaje, getMensajes } from "../../services/mensajes";

export const GET: APIRoute = async ({ request, redirect }) => {
  const search = new URL(request.url).searchParams.get("search");
  const messages = getMensajes(search ?? "");

  return new Response(JSON.stringify({ messages }), {
    status: 200,
  });
};

const parseFormData = (formData: FormData) => {
  const content = formData.get("content")?.toString();
  return content;
};

const parseJson = (json: { content: string }) => {
  return json.content;
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type");
  const content =
    contentType === "application/json"
      ? parseJson(await request.json())
      : parseFormData(await request.formData());

  if (!content) {
    return new Response("Content is required", { status: 400 });
  }

  const message = addMensaje(content);

  if (contentType === "application/json") {
    return new Response(JSON.stringify({ message }), {
      status: 201,
    });
  }

  return redirect("/");
};
