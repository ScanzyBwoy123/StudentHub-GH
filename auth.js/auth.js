/* =========================================================
   STUDENTHUB GH — SUPABASE AUTHENTICATION
========================================================= */

const STUDENTHUB_SUPABASE_URL =
    "https://gwosailuqdsvttebrhen.supabase.co";

const STUDENTHUB_SUPABASE_KEY =
    "sb_publishable_A4nPzz5JrfMRicGVcyErbQ_IAeJa9Gq";


/* =========================================================
   CREATE SUPABASE CLIENT
========================================================= */

const studentHubSupabase =
    window.supabase.createClient(
        STUDENTHUB_SUPABASE_URL,
        STUDENTHUB_SUPABASE_KEY
    );


/* =========================================================
   SIGN UP
========================================================= */

async function studentHubSignUp(
    email,
    password,
    fullName
) {

    const { data, error } =
        await studentHubSupabase.auth.signUp({

            email: email,

            password: password,

            options: {
                data: {
                    full_name: fullName
                }
            }

        });


    if (error) {
        throw error;
    }


    return data;

}


/* =========================================================
   SIGN IN
========================================================= */

async function studentHubSignIn(
    email,
    password
) {

    const { data, error } =
        await studentHubSupabase.auth
            .signInWithPassword({

                email: email,

                password: password

            });


    if (error) {
        throw error;
    }


    return data;

}


/* =========================================================
   SIGN OUT
========================================================= */

async function studentHubSignOut() {

    const { error } =
        await studentHubSupabase.auth.signOut();


    if (error) {
        throw error;
    }

}


/* =========================================================
   GET CURRENT USER
========================================================= */

async function getStudentHubUser() {

    const {
        data,
        error
    } =
        await studentHubSupabase.auth
            .getUser();


    if (error) {
        return null;
    }


    return data?.user || null;

}


/* =========================================================
   LISTEN FOR AUTH CHANGES
========================================================= */

studentHubSupabase.auth.onAuthStateChange(
    function (
        event,
        session
    ) {

        window.studentHubCurrentSession =
            session;

        window.studentHubCurrentUser =
            session?.user || null;


        window.dispatchEvent(
            new CustomEvent(
                "studenthub-auth-change",
                {
                    detail: {
                        event,
                        session,
                        user:
                            session?.user || null
                    }
                }
            )
        );

    }
);
