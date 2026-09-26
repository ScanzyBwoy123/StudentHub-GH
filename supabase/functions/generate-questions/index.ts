import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL =
  Deno.env.get("SUPABASE_URL")!;

const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const GEMINI_MODEL =
  "gemini-3.8-flash";

const supabaseAdmin =
  createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );
Deno.serve(async (req) => {
  try {
        /* =====================================================
       ADMIN AUTHENTICATION
    ===================================================== */

    const authorization =
      req.headers.get("Authorization");

    if (!authorization) {
      return new Response(
        JSON.stringify({
          error:
            "Authentication is required."
        }),
        {
          status: 401,
          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );
    }

    const token =
      authorization
        .replace(/^Bearer\s+/i, "")
        .trim();

    if (!token) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid authentication token."
        }),
        {
          status: 401,
          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );
    }

    const {
      data: userData,
      error: userError
    } =
      await supabaseAdmin.auth
        .getUser(token);

    if (
      userError ||
      !userData?.user
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid or expired authentication."
        }),
        {
          status: 401,
          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );
    }

    const user =
      userData.user;


    /* =====================================================
       CHECK ADMIN ROLE
    ===================================================== */

    const {
      data: profile,
      error: profileError
    } =
      await supabaseAdmin
        .from("student_profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
      console.error(
        "Profile lookup error:",
        profileError
      );

      return new Response(
        JSON.stringify({
          error:
            "Unable to verify administrator permissions."
        }),
        {
          status: 500,
          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );
    }

    if (
      !profile ||
      profile.role !== "admin"
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Administrator permission required."
        }),
        {
          status: 403,
          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );
    }
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

    const subject = String(body.subject || "").trim();
    const topic = String(body.topic || "General").trim();
    const difficulty = String(
      body.difficulty || "medium"
    ).trim();

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

    const geminiApiKey =
      Deno.env.get("GEMINI_API_KEY");

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({
          error: "Gemini API key is not configured."
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
You are an expert nursing education question writer
for StudentHub GH.

Generate ${count} high-quality multiple-choice questions.

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

The questions are for nursing students preparing for
school examinations, professional nursing examinations,
and clinical knowledge assessments.

Requirements:

1. Generate exactly ${count} questions.
2. Each question must have exactly 4 options.
3. Only ONE option must be correct.
4. The correct answer must be the exact text of one option.
5. Give a clear educational explanation.
6. Avoid duplicate questions.
7. Avoid ambiguous questions.
8. Use medically and academically accurate information.
9. Match the requested difficulty.
10. Do not include markdown.
11. Do not include any text outside the JSON.
12. Do not number the questions.

Return ONLY a JSON array using this structure:

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
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],

          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText =
        await geminiResponse.text();

      console.error(
        "Gemini API error:",
        errorText
      );

      return new Response(
        JSON.stringify({
          error:
            "Gemini failed to generate questions."
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const geminiData =
      await geminiResponse.json();

    const generatedText =
      geminiData?.candidates?.[0]
        ?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return new Response(
        JSON.stringify({
          error:
            "Gemini returned an empty response."
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    let questions;

    try {
      questions = JSON.parse(generatedText);
    } catch (parseError) {
      console.error(
        "Unable to parse Gemini JSON:",
        generatedText
      );

      return new Response(
        JSON.stringify({
          error:
            "Gemini returned invalid question data."
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    if (!Array.isArray(questions)) {
      return new Response(
        JSON.stringify({
          error:
            "Gemini response was not a question array."
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const validQuestions = questions
      .filter((item) => {
        return (
          item &&
          typeof item.question === "string" &&
          Array.isArray(item.options) &&
          item.options.length === 4 &&
          item.options.every(
            (option) =>
              typeof option === "string"
          ) &&
          typeof item.answer === "string" &&
          typeof item.explanation === "string"
        );
      })
      .map((item) => ({
        question: item.question.trim(),

        options: item.options.map(
          (option) => option.trim()
        ),

        answer: item.answer.trim(),

        explanation:
          item.explanation.trim(),

        topic: topic
      }));

    if (validQuestions.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "No valid questions were generated."
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,

        subject,

        topic,

        difficulty,

        requestedCount: count,

        generatedCount:
          validQuestions.length,

        questions: validQuestions
      }),
      {
        status: 200,

        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error(
      "Generate questions error:",
      error
    );

    return new Response(
      JSON.stringify({
        error:
          "Unable to generate questions."
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
