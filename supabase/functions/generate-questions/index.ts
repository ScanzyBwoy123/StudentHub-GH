import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL =
  Deno.env.get("SUPABASE_URL")!;

const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const GEMINI_API_KEY =
  Deno.env.get("GEMINI_API_KEY");

const GEMINI_MODEL =
  "gemini-3.1-flash-lite";

const supabaseAdmin =
  createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
  "Cache-Control": "no-store"
};

Deno.serve(async (req) => {

  /*
   * =====================================================
   * CORS
   * =====================================================
   */

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 204,
      headers: corsHeaders
    });
  }

  /*
   * =====================================================
   * METHOD CHECK
   * =====================================================
   */

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error:
          "Only POST requests are allowed."
      }),
      {
        status: 405,
        headers: corsHeaders
      }
    );
  }

  try {

    /*
     * =====================================================
     * AUTHENTICATION
     * =====================================================
     */

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
          headers: corsHeaders
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
          headers: corsHeaders
        }
      );
    }

    const {
      data: userData,
      error: userError
    } =
      await supabaseAdmin.auth.getUser(
        token
      );

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
          headers: corsHeaders
        }
      );
    }

    const user =
      userData.user;

    /*
     * =====================================================
     * ADMIN ROLE CHECK
     * =====================================================
     */

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
          headers: corsHeaders
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
          headers: corsHeaders
        }
      );
    }

    /*
     * =====================================================
     * READ REQUEST
     * =====================================================
     */

    const body =
      await req.json();

    const subject =
      String(
        body.subject || ""
      ).trim();

    const topic =
      String(
        body.topic || "General"
      ).trim();

    const difficulty =
      String(
        body.difficulty || "medium"
      ).trim().toLowerCase();

    const source =
      String(
        body.source || "StudentHub GH"
      ).trim();

    const school =
      String(
        body.school || ""
      ).trim();

    const academicYear =
      String(
        body.academic_year || ""
      ).trim();

    const requestedCount =
      Number(body.count);

    const count =
      Number.isInteger(
        requestedCount
      )
        ? Math.min(
            Math.max(
              requestedCount,
              1
            ),
            50
          )
        : 10;

    /*
     * =====================================================
     * VALIDATION
     * =====================================================
     */

    if (!subject) {
      return new Response(
        JSON.stringify({
          error:
            "Subject is required."
        }),
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }

    if (
      ![
        "easy",
        "medium",
        "hard"
      ].includes(difficulty)
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Difficulty must be easy, medium, or hard."
        }),
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "Gemini API key is not configured."
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }

    /*
     * =====================================================
     * GEMINI PROMPT
     * =====================================================
     */

    const prompt = `
You are a professional nursing question writer
for StudentHub GH.

Create exactly ${count} original, high-quality
multiple-choice questions for nursing students.

SUBJECT:
${subject}

TOPIC:
${topic}

DIFFICULTY:
${difficulty}

SOURCE:
${source}

SCHOOL:
${school || "Not specified"}

ACADEMIC YEAR:
${academicYear || "Not specified"}

The questions should be useful for:

- nursing school examinations
- professional nursing examinations
- clinical knowledge assessment
- revision and exam preparation

IMPORTANT REQUIREMENTS:

1. Generate exactly ${count} questions.

2. Every question must have exactly four options.

3. Use exactly one correct answer.

4. The correct answer must match exactly one
   of the four options.

5. Provide a clear educational explanation
   for every question.

6. Questions must be medically accurate.

7. Questions must be academically appropriate
   for nursing students.

8. Match the requested difficulty.

9. Avoid duplicate questions.

10. Avoid questions that are almost identical.

11. Avoid ambiguous wording.

12. Avoid "all of the above" unless absolutely
    necessary.

13. Avoid "none of the above" unless absolutely
    necessary.

14. Do not invent dangerous or clinically false
    information.

15. Do not include markdown.

16. Do not include numbering.

17. Do not include commentary outside the JSON.

18. Return valid JSON only.

RETURN EXACTLY THIS STRUCTURE:

{
  "questions": [
    {
      "question": "Question text",
      "option_a": "Option A",
      "option_b": "Option B",
      "option_c": "Option C",
      "option_d": "Option D",
      "correct_answer": "A",
      "explanation": "Clear educational explanation."
    }
  ]
}
`;

    /*
     * =====================================================
     * GEMINI REQUEST
     * =====================================================
     */

    let geminiData: any = null;

    let lastGeminiError =
      "";

    const maxAttempts = 3;

    for (
      let attempt = 1;
      attempt <= maxAttempts;
      attempt++
    ) {

      try {

        const response =
          await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
                "x-goog-api-key":
                  GEMINI_API_KEY
              },

              body: JSON.stringify({
                systemInstruction: {
                  parts: [
                    {
                      text:
                        "You are a professional nursing question writer for StudentHub GH. Create accurate, educational, exam-quality nursing MCQs and follow the requested JSON structure exactly."
                    }
                  ]
                },

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
                  responseMimeType:
                    "application/json",
                  temperature: 0.7
                }
              })
            }
          );

        if (!response.ok) {

          const errorText =
            await response.text();

          lastGeminiError =
            errorText;

          console.error(
            `Gemini attempt ${attempt} failed:`,
            errorText
          );

          if (
            [
              408,
              429,
              500,
              502,
              503,
              504
            ].includes(
              response.status
            ) &&
            attempt < maxAttempts
          ) {

            await new Promise(
              (resolve) =>
                setTimeout(
                  resolve,
                  1000 * attempt
                )
            );

            continue;
          }

          break;
        }

        geminiData =
          await response.json();

        break;

      } catch (error) {

        lastGeminiError =
          error instanceof Error
            ? error.message
            : String(error);

        console.error(
          `Gemini attempt ${attempt} error:`,
          error
        );

        if (
          attempt < maxAttempts
        ) {

          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                1000 * attempt
              )
          );
        }
      }
    }

    if (!geminiData) {

      console.error(
        "Gemini failed after retries:",
        lastGeminiError
      );

      return new Response(
        JSON.stringify({
          error:
            "Gemini failed to generate questions."
        }),
        {
          status: 502,
          headers: corsHeaders
        }
      );
    }

    /*
     * =====================================================
     * READ GEMINI RESPONSE
     * =====================================================
     */

    const generatedText =
      geminiData
        ?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (!generatedText) {

      return new Response(
        JSON.stringify({
          error:
            "Gemini returned an empty response."
        }),
        {
          status: 502,
          headers: corsHeaders
        }
      );
    }

    /*
     * =====================================================
     * PARSE JSON
     * =====================================================
     */

    let parsedData: any;

    try {

      parsedData =
        JSON.parse(
          generatedText
        );

    } catch (error) {

      console.error(
        "Gemini JSON parse error:",
        generatedText
      );

      return new Response(
        JSON.stringify({
          error:
            "Gemini returned invalid question data."
        }),
        {
          status: 502,
          headers: corsHeaders
        }
      );
    }

    const questions =
      parsedData?.questions;

    if (
      !Array.isArray(
        questions
      )
    ) {

      return new Response(
        JSON.stringify({
          error:
            "Gemini response did not contain a valid question list."
        }),
        {
          status: 502,
          headers: corsHeaders
        }
      );
    }

    /*
     * =====================================================
     * VALIDATE QUESTIONS
     * =====================================================
     */

    const validQuestions =
      questions
        .filter((item: any) => {

          if (
            !item ||
            typeof item.question !==
              "string"
          ) {
            return false;
          }

          const options = [
            item.option_a,
            item.option_b,
            item.option_c,
            item.option_d
          ];

          if (
            options.some(
              (option) =>
                typeof option !==
                "string" ||
                !option.trim()
            )
          ) {
            return false;
          }

          if (
            ![
              "A",
              "B",
              "C",
              "D"
            ].includes(
              String(
                item.correct_answer
              ).trim().toUpperCase()
            )
          ) {
            return false;
          }

          if (
            typeof item.explanation !==
            "string" ||
            !item.explanation.trim()
          ) {
            return false;
          }

          return true;
        })
        .map((item: any) => {

          const correctAnswer =
            String(
              item.correct_answer
            )
              .trim()
              .toUpperCase();

          const options = [
            String(
              item.option_a
            ).trim(),

            String(
              item.option_b
            ).trim(),

            String(
              item.option_c
            ).trim(),

            String(
              item.option_d
            ).trim()
          ];

          return {
            question:
              String(
                item.question
              ).trim(),

            options,

            answer:
              options[
                ["A", "B", "C", "D"]
                  .indexOf(
                    correctAnswer
                  )
              ],

            explanation:
              String(
                item.explanation
              ).trim(),

            topic
          };
        });

    /*
     * =====================================================
     * FINAL VALIDATION
     * =====================================================
     */

    if (
      validQuestions.length === 0
    ) {

      return new Response(
        JSON.stringify({
          error:
            "No valid questions were generated."
        }),
        {
          status: 502,
          headers: corsHeaders
        }
      );
    }

    /*
     * =====================================================
     * RETURN QUESTIONS
     * =====================================================
     */

    return new Response(
      JSON.stringify({
        success: true,

        subject,

        topic,

        difficulty,

        source,

        school,

        academic_year:
          academicYear,

        requestedCount:
          count,

        generatedCount:
          validQuestions.length,

        questions:
          validQuestions
      }),
      {
        status: 200,
        headers: corsHeaders
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
        headers: corsHeaders
      }
    );
  }
});
