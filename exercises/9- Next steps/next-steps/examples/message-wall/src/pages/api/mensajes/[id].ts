import type { APIRoute } from "astro";
import { likeMensaje } from "../../../services/mensajes";
import { deleteMensaje } from "../../../services/mensajes";
import type { Mensaje } from "../../../types";

type Action = "like" | "delete";

const parseFromJSON = (data: { action?: Action }) => {
  return data.action;
};

const parseFromFormData = (formData: FormData) => {
  return formData.get("action")?.toString() as Action | undefined;
};

export const POST: APIRoute = async ({ request, params, redirect }) => {
  const { id } = params;
  const contentType = request.headers.get("content-type");

  const action =
    contentType === "application/json"
      ? parseFromJSON(await request.json())
      : parseFromFormData(await request.formData());

  if (!action) {
    return new Response("Action is required", { status: 400 });
  }

  if (!id) {
    return new Response("Id is required", { status: 404 });
  }

  let mensaje: Mensaje | null = null;

  try {
    if (action === "like") {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      mensaje = likeMensaje(id);
    } else if (action === "delete") {
      mensaje = deleteMensaje(id);
    }
  } catch (error) {
    return new Response("Error", { status: 404 });
  }

  if (contentType === "application/json") {
    return new Response(JSON.stringify({ success: true, mensaje }), {
      status: 200,
    });
  }

  return redirect("/");
};
