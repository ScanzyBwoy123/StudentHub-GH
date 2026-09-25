import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Only POST requests are allowed."
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const body = await req.json();

    const subject = body.subject;
    const topic = body.topic || "General";
    const difficulty = body.difficulty || "medium";
    const count = Math.min(
      Math.max(Number(body.count) || 10, 1),
      50
    );

    if (!subject) {
      return new Response(
        JSON.stringify({
          error: "Subject is required."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const aiApiKey = Deno.env.get("AI_API_KEY");

    if (!aiApiKey) {
      return new Response(
        JSON.stringify({
          error: "AI API key is not configured."
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const prompt = `
You are an expert nursing education question writer.

Generate ${count} high-quality multiple-choice questions.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Return ONLY valid JSON.

Use exactly this structure:

[
  {
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Correct option text",
    "explanation": "Clear educational explanation",
    "topic": "${topic}"
  }
]

Requirements:
- Exactly 4 options.
- Only one correct answer.
- Questions must be educationally accurate.
- Avoid duplicate questions.
- No markdown.
- No text outside the JSON array.
`;

    /*
      AI provider connection will be added next.
      The secret API key stays on the server.
    */

    return new Response(
      JSON.stringify({
        success: true,
        message: "Question generation request received.",
        subject,
        topic,
        difficulty,
        count,
        prompt
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Unable to process question request."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
});
