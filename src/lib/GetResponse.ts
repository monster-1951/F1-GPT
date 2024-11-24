import { Db } from "@datastax/astra-db-ts";
import OpenAI from "openai";

export const GetResponse = async (input: string,db:Db,openai:OpenAI,ASTRA_DB_COLLECTION:string) => {
    let docContext = "";
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: input,
      encoding_format: "float",
    });
  
    try {
      const F1Gpt = db.collection(ASTRA_DB_COLLECTION || "");
      const responseDocs = F1Gpt.find(
        {},
        {
          sort: { $vector: embedding.data[0].embedding },
          limit: 10,
          includeSimilarity: true,
        }
      );
      const documents = await responseDocs.toArray();
  
      const docsMap = documents?.map((doc) => doc.text);
  
      docContext = JSON.stringify(docsMap);
    } catch (error) {
      console.log("Error querying db...", error);
      docContext = "";
    }
    const templateContent = `content: You are an AI assistant who knows everything about Formula One.Use the below context to augment what you know about Formula One racing.The context will provide you with the most recent page data from wikipedia, the official F1 website and others.If the context doesn't include the information you need answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include.Format responses using markdown where applicable and don't return images.
        
            ----------------------------
            START CONTEXT
            ${docContext}
            END CONTEXT
            ----------------------------
            QUESTION:${input}
            ----------------------------`;
  
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: templateContent,
        },
        {
          role: "user",
          content: input,
        },
      ],
      stream: true,
    });
  
    let fullResponse = ""; // Initialize an empty string to accumulate the response
  
    // Iterate through the stream and accumulate the response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content; // Append the chunk to the full response string
    }
  
    return fullResponse; // Return the accumulated response once the stream ends
  };
  