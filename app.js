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
       Storage
       -----------------------------------------
       Everything currently uses localStorage.
       No database or paid service required.
    ========================================= */

    const COURSE_STORAGE_KEY =
        "studenthub_courses";

    const ASSIGNMENT_STORAGE_KEY =
        "studenthub_assignments";


    /* =========================================
       Generic Storage Helpers
    ========================================= */

    function getStoredData(key) {

        const savedData =
            localStorage.getItem(key);

        if (!savedData) {
            return [];
        }

        try {

            const parsedData =
                JSON.parse(savedData);

            return Array.isArray(parsedData)
                ? parsedData
                : [];

        } catch (error) {

            return [];

        }
    }


    function saveStoredData(key, data) {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    }


    /* =========================================
       Courses
    ========================================= */

    function getCourses() {

        return getStoredData(
            COURSE_STORAGE_KEY
        );

    }


    function saveCourses(courses) {

        saveStoredData(
            COURSE_STORAGE_KEY,
            courses
        );

    }


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
                    type="button"
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
                    type="button"
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

        const courses =
            getCourses();

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

            card.className =
                "course-card";


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
                        ${escapeHTML(
                            course.description ||
                            "No description added."
                        )}
                    </p>

                </div>


                <button
                    class="delete-course"
                    data-index="${index}"
                    title="Delete course"
                    type="button"
                >
                    ×
                </button>

            `;


            coursesGrid.appendChild(card);

        });


        document
            .querySelectorAll(".delete-course")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        deleteCourse(index);

                    }
                );

            });

    }


    function addCourse() {

        const name =
            prompt(
                "Enter the course or subject name:"
            );


        if (!name || !name.trim()) {
            return;
        }


        const code =
            prompt(
                "Enter the course code (optional):"
            );


        const description =
            prompt(
                "Add a short description (optional):"
            );


        const courses =
            getCourses();


        courses.push({

            name:
                name.trim(),

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

        const courses =
            getCourses();


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
       Assignments
    ========================================= */

    function getAssignments() {

        return getStoredData(
            ASSIGNMENT_STORAGE_KEY
        );

    }


    function saveAssignments(assignments) {

        saveStoredData(
            ASSIGNMENT_STORAGE_KEY,
            assignments
        );

    }


    const assignmentsPage =
        document.getElementById("assignments");


    if (assignmentsPage) {

        assignmentsPage.innerHTML = `

            <div class="page-heading">

                <span class="eyebrow">
                    ACADEMICS
                </span>

                <h2>
                    My Assignments
                </h2>

                <p>
                    Keep track of assignments, deadlines and completed work.
                </p>

            </div>


            <div class="course-toolbar">

                <div>

                    <strong id="assignmentCount">
                        0 Assignments
                    </strong>

                    <span>
                        in your workspace
                    </span>

                </div>


                <button
                    class="primary-button"
                    id="addAssignmentButton"
                    type="button"
                >
                    + Add Assignment
                </button>

            </div>


            <div
                class="assignments-list"
                id="assignmentsList"
            ></div>


            <div
                class="empty-page"
                id="assignmentsEmpty"
            >

                <div class="large-icon">
                    📝
                </div>

                <h3>
                    No assignments yet
                </h3>

                <p>
                    Add your first assignment to start tracking your academic work.
                </p>

                <button
                    class="primary-button"
                    id="emptyAddAssignmentButton"
                    type="button"
                >
                    + Add Assignment
                </button>

            </div>

        `;

    }


    const assignmentsList =
        document.getElementById("assignmentsList");

    const assignmentsEmpty =
        document.getElementById("assignmentsEmpty");

    const assignmentCount =
        document.getElementById("assignmentCount");

    const addAssignmentButton =
        document.getElementById(
            "addAssignmentButton"
        );

    const emptyAddAssignmentButton =
        document.getElementById(
            "emptyAddAssignmentButton"
        );


    function renderAssignments() {

        if (!assignmentsList) {
            return;
        }


        const assignments =
            getAssignments();


        assignmentsList.innerHTML = "";


        if (assignmentCount) {

            assignmentCount.textContent =
                `${assignments.length} ${
                    assignments.length === 1
                        ? "Assignment"
                        : "Assignments"
                }`;

        }


        if (assignments.length === 0) {

            assignmentsList.style.display =
                "none";


            if (assignmentsEmpty) {

                assignmentsEmpty.style.display =
                    "flex";

            }

            return;

        }


        assignmentsList.style.display =
            "grid";


        if (assignmentsEmpty) {

            assignmentsEmpty.style.display =
                "none";

        }


        assignments.forEach(
            (assignment, index) => {

                const card =
                    document.createElement("div");


                card.className =
                    "assignment-card";


                const status =
                    assignment.completed
                        ? "Completed"
                        : "Pending";


                card.innerHTML = `

                    <div class="assignment-main">

                        <div class="assignment-icon">
                            📝
                        </div>


                        <div>

                            <span class="assignment-course">
                                ${escapeHTML(
                                    assignment.course ||
                                    "General"
                                )}
                            </span>


                            <h3>
                                ${escapeHTML(
                                    assignment.title
                                )}
                            </h3>


                            <p>
                                ${escapeHTML(
                                    assignment.description ||
                                    "No description added."
                                )}
                            </p>


                            <small>
                                Due:
                                ${escapeHTML(
                                    assignment.dueDate ||
                                    "No date"
                                )}
                            </small>

                        </div>

                    </div>


                    <div class="assignment-actions">

                        <span
                            class="assignment-status ${
                                assignment.completed
                                    ? "completed"
                                    : "pending"
                            }"
                        >
                            ${status}
                        </span>


                        <button
                            class="complete-assignment"
                            data-index="${index}"
                            type="button"
                        >
                            ${
                                assignment.completed
                                    ? "Mark Pending"
                                    : "Mark Complete"
                            }
                        </button>


                        <button
                            class="delete-assignment"
                            data-index="${index}"
                            type="button"
                            title="Delete assignment"
                        >
                            ×
                        </button>

                    </div>

                `;


                assignmentsList.appendChild(card);

            }
        );


        document
            .querySelectorAll(
                ".complete-assignment"
            )
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        toggleAssignment(
                            index
                        );

                    }
                );

            });


        document
            .querySelectorAll(
                ".delete-assignment"
            )
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        deleteAssignment(
                            index
                        );

                    }
                );

            });

    }


    function addAssignment() {

        const title =
            prompt(
                "Enter the assignment title:"
            );


        if (!title || !title.trim()) {
            return;
        }


        const course =
            prompt(
                "Enter the course or subject:"
            );


        const dueDate =
            prompt(
                "Enter the due date (example: 30 Sep 2026):"
            );


        const description =
            prompt(
                "Add a short description (optional):"
            );


        const assignments =
            getAssignments();


        assignments.push({

            title:
                title.trim(),

            course:
                course && course.trim()
                    ? course.trim()
                    : "General",

            dueDate:
                dueDate && dueDate.trim()
                    ? dueDate.trim()
                    : "No date",

            description:
                description
                    ? description.trim()
                    : "",

            completed:
                false

        });


        saveAssignments(
            assignments
        );


        renderAssignments();

        updateDashboardStats();

    }


    function toggleAssignment(index) {

        const assignments =
            getAssignments();


        if (!assignments[index]) {
            return;
        }


        assignments[index].completed =
            !assignments[index].completed;


        saveAssignments(
            assignments
        );


        renderAssignments();

        updateDashboardStats();

    }


    function deleteAssignment(index) {

        const assignments =
            getAssignments();


        if (!assignments[index]) {
            return;
        }


        const confirmed =
            confirm(
                `Delete "${assignments[index].title}"?`
            );


        if (!confirmed) {
            return;
        }


        assignments.splice(
            index,
            1
        );


        saveAssignments(
            assignments
        );


        renderAssignments();

        updateDashboardStats();

    }


    if (addAssignmentButton) {

        addAssignmentButton.addEventListener(
            "click",
            addAssignment
        );

    }


    if (emptyAddAssignmentButton) {

        emptyAddAssignmentButton.addEventListener(
            "click",
            addAssignment
        );

    }


    /* =========================================
       Dashboard Statistics
    ========================================= */

    function updateDashboardStats() {

        const courses =
            getCourses();


        const assignments =
            getAssignments();


        const statCards =
            document.querySelectorAll(
                ".stat-card strong"
            );


        if (statCards.length >= 1) {

            statCards[0].textContent =
                courses.length;

        }


        if (statCards.length >= 2) {

            statCards[1].textContent =
                assignments.filter(
                    (assignment) =>
                        !assignment.completed
                ).length;

        }

    }


    /* =========================================
       Escape HTML
    ========================================= */

    function escapeHTML(value) {

        return String(value)

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );

    }


    /* =========================================
       Start Courses
    ========================================= */

    renderCourses();


    /* =========================================
       Start Assignments
    ========================================= */

    renderAssignments();


    /* =========================================
       Update Dashboard
    ========================================= */

    updateDashboardStats();


    /* =========================================
       Initial Page
    ========================================= */

    openPage("dashboard");

});
