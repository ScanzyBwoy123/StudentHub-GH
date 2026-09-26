/* =========================================================
   STUDENTHUB GH — SUPABASE AUTHENTICATION
========================================================= */


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

                emailRedirectTo:
                    "https://scanzybwoy123.github.io/StudentHub-GH/login.html",

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
