/* =========================================
   StudentHub GH
   Main Application
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       Navigation
    ========================================= */

    const navItems = document.querySelectorAll("[data-page]");
    const pages = document.querySelectorAll(".page");

    function openPage(pageId) {

        pages.forEach((page) => {
            page.classList.remove("active");
        });

        navItems.forEach((item) => {
            item.classList.remove("active");
        });

        const selectedPage = document.getElementById(pageId);

        if (selectedPage) {
            selectedPage.classList.add("active");
        }

        document
            .querySelectorAll(`[data-page="${pageId}"]`)
            .forEach((item) => {
                item.classList.add("active");
            });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    navItems.forEach((item) => {

        item.addEventListener("click", () => {

            const pageId = item.dataset.page;

            if (pageId) {
                openPage(pageId);
            }

        });

    });


    /* =========================================
       Current Date
    ========================================= */

    const currentDateElement =
        document.getElementById("currentDate");

    if (currentDateElement) {

        const today = new Date();

        const formattedDate =
            today.toLocaleDateString("en-GH", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric"
            });

        currentDateElement.textContent = formattedDate;
    }


    /* =========================================
       Notification Button
    ========================================= */

    const notificationButton =
        document.querySelector(".notification-btn");

    if (notificationButton) {

        notificationButton.addEventListener("click", () => {

            alert(
                "You don't have any new notifications yet."
            );

        });

    }


    /* =========================================
       Welcome Message
    ========================================= */

    const welcomeHeading =
        document.querySelector(".welcome h2");

    if (welcomeHeading) {

        const hour = new Date().getHours();

        let greeting = "Welcome back";

        if (hour < 12) {
            greeting = "Good morning";
        } else if (hour < 18) {
            greeting = "Good afternoon";
        } else {
            greeting = "Good evening";
        }

        welcomeHeading.textContent =
            `${greeting}, Hacker Pro! 👋`;
    }


    /* =========================================
       Prevent Empty Buttons From Refreshing Page
    ========================================= */

    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {

        if (!button.dataset.page) {

            button.addEventListener("click", () => {

                const buttonText =
                    button.textContent.trim();

                if (
                    buttonText.includes("Add") ||
                    buttonText.includes("Create") ||
                    buttonText.includes("Start")
                ) {

                    alert(
                        "This feature is coming next. 🚀"
                    );

                }

            });

        }

    });


    /* =========================================
       Initial Page
    ========================================= */

    openPage("dashboard");

});
