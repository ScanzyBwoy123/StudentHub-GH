import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";


/* =====================================================
   CORS
===================================================== */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS"
};


/* =====================================================
   SUPABASE CONFIG
===================================================== */

const SUPABASE_URL =
  Deno.env.get("SUPABASE_URL")!;

const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;


const supabaseAdmin =
  createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );


/* =====================================================
   EDGE FUNCTION
===================================================== */

Deno.serve(async (req) => {

  try {

    /* =================================================
       CORS PREFLIGHT
    ================================================= */

    if (req.method === "OPTIONS") {

      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });

    }


    /* =================================================
       METHOD CHECK
    ================================================= */

    if (req.method !== "POST") {

      return new Response(
        JSON.stringify({
          error:
            "Only POST requests are allowed."
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json"
          }
        }
      );

    }


    /* =================================================
       AUTHORIZATION HEADER
    ================================================= */

    const authorization =
      req.headers.get(
        "Authorization"
      );


    if (!authorization) {

      return new Response(
        JSON.stringify({
          error:
            "Authentication is required."
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json"
          }
        }
      );

    }


    const token =
      authorization
        .replace("Bearer ", "")
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
            ...corsHeaders,
            "Content-Type":
              "application/json"
          }
        }
      );

    }


    /* =================================================
       VERIFY LOGGED-IN USER
    ================================================= */

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
            ...corsHeaders,
            "Content-Type":
              "application/json"
          }
        }
      );

    }


    const user =
      userData.user;


    /* =================================================
       VERIFY ADMIN ROLE
    ================================================= */

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
            ...corsHeaders,
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
            ...corsHeaders,
            "Content-Type":
              "application/json"
          }
        }
      );

    }


    /* =================================================
       READ REQUEST BODY
    ================================================= */

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
      ).trim();


    const questions =
      Array.isArray(
        body.questions
      )
        ? body.questions
        : [];


    const publish =
      body.publish === true;


    /* =================================================
       VALIDATE REQUEST
    ================================================= */

    if (!subject) {

      return new Response(
        JSON.stringify({
          error:
            "Subject is required."
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json"
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
            ...corsHeaders,
            "Content-Type":
              "application/json"
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
            ...corsHeaders,
            "Content-Type":
              "application/json"
          }
        }
      );

    }


    /* =================================================
       CLEAN QUESTIONS
    ================================================= */

    const cleanedQuestions =
      questions.map(
        (item) => {

          const options =
            Array.isArray(
              item.options
            )
              ? item.options
                  .map(
                    (option) =>
                      String(
                        option || ""
                      ).trim()
                  )
                  .filter(Boolean)
              : [];


          return {

            subject,

            topic:
              String(
                item.topic ||
                topic
              ).trim(),

            difficulty,

            question:
              String(
                item.question ||
                ""
              ).trim(),

            options,

            answer:
              String(
                item.answer ||
                ""
              ).trim(),

            explanation:
              String(
                item.explanation ||
                ""
              ).trim(),

            is_premium:
              item.is_premium === true,

            published:
              publish,

            created_by:
              user.id

          };

        }
      );


    /* =================================================
       VALIDATE EACH QUESTION
    ================================================= */

    for (
      const item
      of cleanedQuestions
    ) {

      if (!item.question) {

        return new Response(
          JSON.stringify({
            error:
              "Every question must contain question text."
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type":
                "application/json"
            }
          }
        );

      }


      if (
        item.options.length !== 4
      ) {

        return new Response(
          JSON.stringify({
            error:
              "Every question must have exactly 4 options."
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type":
                "application/json"
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
              ...corsHeaders,
              "Content-Type":
                "application/json"
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
              ...corsHeaders,
              "Content-Type":
                "application/json"
            }
          }
        );

      }

    }


    /* =================================================
       SAVE TO QUESTION BANK
    ================================================= */

    const {
      data: savedQuestions,
      error: saveError
    } =
      await supabaseAdmin
        .from("question_bank")
        .insert(
          cleanedQuestions
        )
        .select();


    if (saveError) {

      console.error(
        "Question bank error:",
        saveError
      );

      return new Response(
        JSON.stringify({
          error:
            "Unable to save questions to the database."
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type":
              "application/json"
          }
        }
      );

    }


    /* =================================================
       SUCCESS
    ================================================= */

    return new Response(
      JSON.stringify({

        success: true,

        published:
          publish,

        savedCount:
          savedQuestions?.length ||
          0,

        questions:
          savedQuestions || []

      }),
      {
        status: 200,

        headers: {
          ...corsHeaders,
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
          ...corsHeaders,
          "Content-Type":
            "application/json"
        }
      }
    );

  }

});
