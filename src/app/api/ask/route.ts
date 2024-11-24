import OpenAI from "openai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { GetResponse } from "@/lib/GetResponse";
export async function POST(request: Request) {
  const { User_Input } = await request.json();
  const {
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY,
  } = process.env;

  // Creating openai
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  // Initialize the client and get a "Db" object
  const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
  const db = client.db(ASTRA_DB_API_ENDPOINT || "");

  console.log(`* Connected to DB ${db.id}`);

  const Responsee = await GetResponse(
    User_Input,
    db,
    openai,
    ASTRA_DB_COLLECTION || ""
  );

  return Response.json(Responsee, {
    status: 201,
  });
}
