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
       StudentHub Storage
       -----------------------------------------
       We use localStorage for now.
       No database or paid service required.
    ========================================= */

    const STORAGE_KEY = "studenthub_courses";

    function getCourses() {

        const savedCourses =
            localStorage.getItem(STORAGE_KEY);

        if (!savedCourses) {
            return [];
        }

        try {
            return JSON.parse(savedCourses);
        } catch (error) {
            return [];
        }
    }

    function saveCourses(courses) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(courses)
        );
    }


    /* =========================================
       Courses
    ========================================= */

    const coursesPage =
        document.getElementById("courses");

    if (coursesPage) {

        coursesPage.innerHTML = `

            <div class="page-heading">

                <span class="eyebrow">
                    ACADEMICS
                </span>

                <h2>
                    My Courses
                </h2>

                <p>
                    Manage the courses and subjects you are studying.
                </p>

            </div>


            <div class="course-toolbar">

                <div>
                    <strong id="courseCount">
                        0 Courses
                    </strong>

                    <span>
                        in your workspace
                    </span>
                </div>

                <button
                    class="primary-button"
                    id="addCourseButton"
                >
                    + Add Course
                </button>

            </div>


            <div
                class="courses-grid"
                id="coursesGrid"
            ></div>


            <div
                class="empty-page"
                id="coursesEmpty"
            >

                <div class="large-icon">
                    📚
                </div>

                <h3>
                    No courses yet
                </h3>

                <p>
                    Add your first course to start building your academic workspace.
                </p>

                <button
                    class="primary-button"
                    id="emptyAddCourseButton"
                >
                    + Add Course
                </button>

            </div>

        `;

    }


    const coursesGrid =
        document.getElementById("coursesGrid");

    const coursesEmpty =
        document.getElementById("coursesEmpty");

    const courseCount =
        document.getElementById("courseCount");

    const addCourseButton =
        document.getElementById("addCourseButton");

    const emptyAddCourseButton =
        document.getElementById("emptyAddCourseButton");


    function renderCourses() {

        if (!coursesGrid) {
            return;
        }

        const courses = getCourses();

        coursesGrid.innerHTML = "";

        if (courseCount) {

            courseCount.textContent =
                `${courses.length} ${
                    courses.length === 1
                        ? "Course"
                        : "Courses"
                }`;
        }


        if (courses.length === 0) {

            coursesGrid.style.display = "none";

            if (coursesEmpty) {
                coursesEmpty.style.display = "flex";
            }

            return;
        }


        coursesGrid.style.display = "grid";

        if (coursesEmpty) {
            coursesEmpty.style.display = "none";
        }


        courses.forEach((course, index) => {

            const card =
                document.createElement("div");

            card.className = "course-card";

            card.innerHTML = `

                <div class="course-icon">
                    📚
                </div>

                <div class="course-content">

                    <span class="course-code">
                        ${escapeHTML(course.code)}
                    </span>

                    <h3>
                        ${escapeHTML(course.name)}
                    </h3>

                    <p>
                        ${escapeHTML(course.description || "No description added.")}
                    </p>

                </div>

                <button
                    class="delete-course"
                    data-index="${index}"
                    title="Delete course"
                >
                    ×
                </button>

            `;

            coursesGrid.appendChild(card);

        });


        document
            .querySelectorAll(".delete-course")
            .forEach((button) => {

                button.addEventListener("click", () => {

                    const index =
                        Number(button.dataset.index);

                    deleteCourse(index);

                });

            });

    }


    function addCourse() {

        const name =
            prompt("Enter the course or subject name:");

        if (!name || !name.trim()) {
            return;
        }


        const code =
            prompt("Enter the course code (optional):");


        const description =
            prompt("Add a short description (optional):");


        const courses = getCourses();


        courses.push({

            name: name.trim(),

            code:
                code && code.trim()
                    ? code.trim().toUpperCase()
                    : "COURSE",

            description:
                description
                    ? description.trim()
                    : ""

        });


        saveCourses(courses);

        renderCourses();

        updateDashboardStats();

    }


    function deleteCourse(index) {

        const courses = getCourses();

        if (!courses[index]) {
            return;
        }


        const confirmed =
            confirm(
                `Remove "${courses[index].name}" from your courses?`
            );


        if (!confirmed) {
            return;
        }


        courses.splice(index, 1);

        saveCourses(courses);

        renderCourses();

        updateDashboardStats();

    }


    function escapeHTML(value) {

        return String(value)

            .replaceAll("&", "&amp;")

            .replaceAll("<", "&lt;")

            .replaceAll(">", "&gt;")

            .replaceAll('"', "&quot;")

            .replaceAll("'", "&#039;");
    }


    if (addCourseButton) {

        addCourseButton.addEventListener(
            "click",
            addCourse
        );

    }


    if (emptyAddCourseButton) {

        emptyAddCourseButton.addEventListener(
            "click",
            addCourse
        );

    }


    /* =========================================
       Dashboard Statistics
    ========================================= */

    function updateDashboardStats() {

        const courses =
            getCourses();

        const statCards =
            document.querySelectorAll(".stat-card strong");

        if (statCards.length >= 1) {

            statCards[0].textContent =
                courses.length;
        }

    }


    /* =========================================
       Start Courses
    ========================================= */

    renderCourses();

    updateDashboardStats();


    /* =========================================
       Initial Page
    ========================================= */

    openPage("dashboard");

});
