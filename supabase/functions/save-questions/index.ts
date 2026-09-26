import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL =
  Deno.env.get("SUPABASE_URL")!;

const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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

    if (
      !SUPABASE_URL ||
      !SUPABASE_SERVICE_ROLE_KEY
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Supabase server configuration is missing."
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const body = await req.json();

    const subject =
      String(body.subject || "").trim();

    const topic =
      String(body.topic || "General").trim();

    const difficulty =
      String(
        body.difficulty || "medium"
      ).trim();

    const questions =
      Array.isArray(body.questions)
        ? body.questions
        : [];

    const publish =
      body.publish === true;

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

    if (questions.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "At least one question is required."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    if (questions.length > 50) {
      return new Response(
        JSON.stringify({
          error:
            "A maximum of 50 questions can be saved at once."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const cleanedQuestions =
      questions.map((item) => {

        const options =
          Array.isArray(item.options)
            ? item.options
                .map((option) =>
                  String(option || "").trim()
                )
                .filter(Boolean)
            : [];

        return {
          subject,
          topic:
            String(
              item.topic || topic
            ).trim(),

          difficulty,

          question:
            String(
              item.question || ""
            ).trim(),

          options,

          answer:
            String(
              item.answer || ""
            ).trim(),

          explanation:
            String(
              item.explanation || ""
            ).trim(),

          is_premium:
            item.is_premium === true,

          published:
            publish
        };

      });


    for (const item of cleanedQuestions) {

      if (!item.question) {
        return new Response(
          JSON.stringify({
            error:
              "Every question must contain question text."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      if (item.options.length !== 4) {
        return new Response(
          JSON.stringify({
            error:
              "Every question must have exactly 4 options."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      if (
        !item.options.includes(
          item.answer
        )
      ) {
        return new Response(
          JSON.stringify({
            error:
              "The correct answer must match one of the four options."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      if (!item.explanation) {
        return new Response(
          JSON.stringify({
            error:
              "Every question must contain an explanation."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }


    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/question_bank`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            apikey:
              SUPABASE_SERVICE_ROLE_KEY,

            Authorization:
              `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,

            Prefer:
              "return=representation"
          },

          body:
            JSON.stringify(
              cleanedQuestions.map(
                (item) => ({
                  subject:
                    item.subject,

                  topic:
                    item.topic,

                  difficulty:
                    item.difficulty,

                  question:
                    item.question,

                  options:
                    item.options,

                  answer:
                    item.answer,

                  explanation:
                    item.explanation,

                  is_premium:
                    item.is_premium,

                  published:
                    item.published
                })
              )
          )
        }
      );


    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "Supabase database error:",
        errorText
      );

      return new Response(
        JSON.stringify({
          error:
            "Unable to save questions to the database."
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


    const savedQuestions =
      await response.json();


    return new Response(
      JSON.stringify({
        success: true,

        published: publish,

        savedCount:
          savedQuestions.length,

        questions:
          savedQuestions
      }),
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/json"
        }
      }
    );


  } catch (error) {

    console.error(
      "Save questions error:",
      error
    );

    return new Response(
      JSON.stringify({
        error:
          "Unable to save questions."
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
});
