import { getStore } from "@netlify/blobs";

const store = getStore({
  name: "dinner-choice",
  consistency: "strong"
});

const KEY = "partner-selection";

export default async (request) => {
  try {
    if (request.method === "GET") {
      const data = await store.get(KEY, { type: "json" });
      return Response.json(data || { food: "", updatedAt: null });
    }

    if (request.method === "POST") {
      const body = await request.json();

      if (!body || typeof body.food !== "string") {
        return Response.json({ error: "انتخاب نامعتبر" }, { status: 400 });
      }

      const data = {
        food: body.food,
        updatedAt: new Date().toISOString()
      };

      await store.setJSON(KEY, data);
      return Response.json({ ok: true, ...data });
    }

    return new Response("Method Not Allowed", { status: 405 });

  } catch (error) {
    return Response.json({ error: "خطا در ذخیره انتخاب" }, { status: 500 });
  }
};
