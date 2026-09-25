// =========================================
// STUDENTHUB GH — MAIN APP
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // STORAGE KEYS
    // =========================================

    const COURSE_KEY = "studenthub_courses";
    const ASSIGNMENT_KEY = "studenthub_assignments";
    const TIMETABLE_KEY = "studenthub_timetable";
    const GPA_KEY = "studenthub_gpa";

    // =========================================
    // BASIC HELPERS
    // =========================================

    function getData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function escapeHTML(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // =========================================
    // NAVIGATION
    // =========================================

    const navItems = document.querySelectorAll("[data-page]");
    const pages = document.querySelectorAll(".page");

    navItems.forEach(item => {
        item.addEventListener("click", () => {

            const pageName = item.dataset.page;

            pages.forEach(page => {
                page.classList.remove("active");
            });

            navItems.forEach(nav => {
                nav.classList.remove("active");
            });

            const targetPage = document.getElementById(pageName);

            if (targetPage) {
                targetPage.classList.add("active");
            }

            item.classList.add("active");

            if (pageName === "courses") {
                renderCourses();
            }

            if (pageName === "assignments") {
                renderAssignments();
            }

            if (pageName === "timetable") {
                renderTimetable();
            }

            if (pageName === "gpa") {
                renderGPA();
            }
        });
    });

    // =========================================
    // DATE
    // =========================================

    const dateElement = document.getElementById("currentDate");

    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString(
            "en-GH",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
    }

    // =========================================
    // GREETING
    // =========================================

    const greetingElement = document.getElementById("greeting");

    if (greetingElement) {

        const hour = new Date().getHours();

        let greeting = "Good evening";

        if (hour < 12) {
            greeting = "Good morning";
        } else if (hour < 18) {
            greeting = "Good afternoon";
        }

        greetingElement.textContent =
            `${greeting}, Hacker Pro! 👋`;
    }

    // =========================================
    // NOTIFICATION
    // =========================================

    const notificationButton =
        document.querySelector(".notification-pulse");

    if (notificationButton) {
        notificationButton.addEventListener("click", () => {
            alert("You're all caught up! 🎉");
        });
    }

    // =========================================
    // COURSES
    // =========================================

    function renderCourses() {

        const container = document.getElementById("courses");

        if (!container) return;

        const courses = getData(COURSE_KEY);

        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h2>My Courses</h2>
                    <p>Manage your courses and subjects.</p>
                </div>

                <button class="primary-btn" id="addCourseBtn">
                    + Add Course
                </button>
            </div>

            <div class="content-grid">

                ${
                    courses.length === 0
                    ?
                    `
                    <div class="empty-state">
                        <h3>No courses yet</h3>
                        <p>Add your first course to get started.</p>
                    </div>
                    `
                    :
                    courses.map((course, index) => `
                        <div class="dashboard-card">
                            <h3>${escapeHTML(course.name)}</h3>

                            <p>
                                <strong>Code:</strong>
                                ${escapeHTML(course.code)}
                            </p>

                            <p>
                                ${escapeHTML(course.description)}
                            </p>

                            <button
                                class="delete-course"
                                data-index="${index}">
                                Delete
                            </button>
                        </div>
                    `).join("")
                }

            </div>
        `;

        const addButton =
            document.getElementById("addCourseBtn");

        if (addButton) {
            addButton.addEventListener("click", addCourse);
        }

        document.querySelectorAll(".delete-course")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const index =
                        Number(button.dataset.index);

                    const courses = getData(COURSE_KEY);

                    courses.splice(index, 1);

                    saveData(COURSE_KEY, courses);

                    renderCourses();
                    updateDashboardStats();
                });
            });
    }

    function addCourse() {

        const name = prompt("Course name:");

        if (!name) return;

        const code = prompt("Course code:");

        if (!code) return;

        const description =
            prompt("Short course description:") || "";

        const courses = getData(COURSE_KEY);

        courses.push({
            name,
            code,
            description
        });

        saveData(COURSE_KEY, courses);

        renderCourses();
        updateDashboardStats();
    }

    // =========================================
    // ASSIGNMENTS
    // =========================================

    function renderAssignments() {

        const container =
            document.getElementById("assignments");

        if (!container) return;

        const assignments =
            getData(ASSIGNMENT_KEY);

        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h2>Assignments</h2>
                    <p>Keep track of your academic work.</p>
                </div>

                <button class="primary-btn" id="addAssignmentBtn">
                    + Add Assignment
                </button>
            </div>

            <div class="content-grid">

                ${
                    assignments.length === 0
                    ?
                    `
                    <div class="empty-state">
                        <h3>No assignments yet</h3>
                        <p>Add an assignment to start tracking your work.</p>
                    </div>
                    `
                    :
                    assignments.map((assignment, index) => `
                        <div class="dashboard-card">

                            <h3>
                                ${escapeHTML(assignment.title)}
                            </h3>

                            <p>
                                <strong>Course:</strong>
                                ${escapeHTML(assignment.course)}
                            </p>

                            <p>
                                <strong>Due:</strong>
                                ${escapeHTML(assignment.dueDate)}
                            </p>

                            <p>
                                ${escapeHTML(assignment.description)}
                            </p>

                            <p>
                                <strong>Status:</strong>
                                ${assignment.completed
                                    ? "Completed ✅"
                                    : "Pending ⏳"
                                }
                            </p>

                            <button
                                class="complete-assignment"
                                data-index="${index}">
                                ${
                                    assignment.completed
                                    ? "Mark Pending"
                                    : "Mark Completed"
                                }
                            </button>

                            <button
                                class="delete-assignment"
                                data-index="${index}">
                                Delete
                            </button>

                        </div>
                    `).join("")
                }

            </div>
        `;

        const addButton =
            document.getElementById("addAssignmentBtn");

        if (addButton) {
            addButton.addEventListener(
                "click",
                addAssignment
            );
        }

        document.querySelectorAll(".complete-assignment")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const index =
                        Number(button.dataset.index);

                    const assignments =
                        getData(ASSIGNMENT_KEY);

                    assignments[index].completed =
                        !assignments[index].completed;

                    saveData(
                        ASSIGNMENT_KEY,
                        assignments
                    );

                    renderAssignments();
                    updateDashboardStats();
                });
            });

        document.querySelectorAll(".delete-assignment")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const index =
                        Number(button.dataset.index);

                    const assignments =
                        getData(ASSIGNMENT_KEY);

                    assignments.splice(index, 1);

                    saveData(
                        ASSIGNMENT_KEY,
                        assignments
                    );

                    renderAssignments();
                    updateDashboardStats();
                });
            });
    }

    function addAssignment() {

        const title =
            prompt("Assignment title:");

        if (!title) return;

        const course =
            prompt("Course:");

        if (!course) return;

        const dueDate =
            prompt("Due date:");

        if (!dueDate) return;

        const description =
            prompt("Description:") || "";

        const assignments =
            getData(ASSIGNMENT_KEY);

        assignments.push({
            title,
            course,
            dueDate,
            description,
            completed: false
        });

        saveData(
            ASSIGNMENT_KEY,
            assignments
        );

        renderAssignments();
        updateDashboardStats();
    }

    // =========================================
    // TIMETABLE
    // =========================================

    function renderTimetable() {

        const container =
            document.getElementById("timetable");

        if (!container) return;

        const timetable =
            getData(TIMETABLE_KEY);

        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];

        container.innerHTML = `
            <div class="page-header">

                <div>
                    <h2>My Timetable</h2>
                    <p>Organize your weekly classes.</p>
                </div>

                <button class="primary-btn" id="addClassBtn">
                    + Add Class
                </button>

            </div>

            <div class="timetable-list">

                ${
                    timetable.length === 0
                    ?
                    `
                    <div class="empty-state">
                        <h3>No classes yet</h3>
                        <p>Add your first class to build your timetable.</p>
                    </div>
                    `
                    :
                    days.map(day => {

                        const classes =
                            timetable
                            .map((item, index) => ({
                                ...item,
                                index
                            }))
                            .filter(item => item.day === day)
                            .sort((a, b) =>
                                a.startTime.localeCompare(
                                    b.startTime
                                )
                            );

                        if (classes.length === 0) {
                            return "";
                        }

                        return `
                            <div class="timetable-day">

                                <div class="timetable-day-header">
                                    <h3>${day}</h3>
                                    <span>
                                        ${classes.length}
                                        class
                                        ${classes.length === 1 ? "" : "es"}
                                    </span>
                                </div>

                                <div class="timetable-day-classes">

                                    ${classes.map(item => `
                                        <div class="timetable-entry">

                                            <div class="timetable-time">
                                                <strong>
                                                    ${escapeHTML(item.startTime)}
                                                </strong>

                                                <span>
                                                    to
                                                    ${escapeHTML(item.endTime)}
                                                </span>
                                            </div>

                                            <div class="timetable-details">

                                                <span class="timetable-course">
                                                    ${escapeHTML(item.course)}
                                                </span>

                                                <h4>
                                                    ${escapeHTML(item.course)}
                                                </h4>

                                                <p>
                                                    ${
                                                        item.room
                                                        ? `Room: ${escapeHTML(item.room)}`
                                                        : ""
                                                    }

                                                    ${
                                                        item.lecturer
                                                        ? ` • ${escapeHTML(item.lecturer)}`
                                                        : ""
                                                    }
                                                </p>

                                            </div>

                                            <button
                                                class="delete-timetable"
                                                data-index="${item.index}">
                                                ×
                                            </button>

                                        </div>
                                    `).join("")}

                                </div>
                            </div>
                        `;
                    }).join("")
                }

            </div>
        `;

        const addButton =
            document.getElementById("addClassBtn");

        if (addButton) {
            addButton.addEventListener(
                "click",
                addTimetableClass
            );
        }

        document.querySelectorAll(".delete-timetable")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const index =
                        Number(button.dataset.index);

                    const timetable =
                        getData(TIMETABLE_KEY);

                    timetable.splice(index, 1);

                    saveData(
                        TIMETABLE_KEY,
                        timetable
                    );

                    renderTimetable();
                });
            });
    }

    function addTimetableClass() {

        const course =
            prompt("Course name:");

        if (!course) return;

        const day =
            prompt(
                "Day (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday):"
            );

        if (!day) return;

        const validDays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];

        const formattedDay =
            validDays.find(
                d => d.toLowerCase() === day.toLowerCase()
            );

        if (!formattedDay) {
            alert("Please enter a valid day.");
            return;
        }

        const startTime =
            prompt("Start time (e.g. 08:00):");

        if (!startTime) return;

        const endTime =
            prompt("End time (e.g. 10:00):");

        if (!endTime) return;

        const room =
            prompt("Room:");

        const lecturer =
            prompt("Lecturer:");

        const timetable =
            getData(TIMETABLE_KEY);

        timetable.push({
            course,
            day: formattedDay,
            startTime,
            endTime,
            room: room || "",
            lecturer: lecturer || ""
        });

        saveData(
            TIMETABLE_KEY,
            timetable
        );

        renderTimetable();
    }

    // =========================================
    // GPA / CGPA
    // =========================================

    const gradePoints = {
        "A": 4.0,
        "B+": 3.5,
        "B": 3.0,
        "C+": 2.5,
        "C": 2.0,
        "D+": 1.5,
        "D": 1.0,
        "F": 0.0
    };

    function calculateGPA(courses) {

        if (!courses.length) {
            return 0;
        }

        let totalQualityPoints = 0;
        let totalCredits = 0;

        courses.forEach(course => {

            const credit =
                Number(course.credit);

            const point =
                gradePoints[course.grade] ?? 0;

            totalQualityPoints +=
                credit * point;

            totalCredits += credit;
        });

        if (totalCredits === 0) {
            return 0;
        }

        return totalQualityPoints / totalCredits;
    }

    function renderGPA() {

        const container =
            document.getElementById("gpa");

        if (!container) return;

        const courses =
            getData(GPA_KEY);

        const gpa =
            calculateGPA(courses);

        container.innerHTML = `
            <div class="page-header">

                <div>
                    <h2>GPA & CGPA Calculator</h2>
                    <p>
                        Calculate your academic performance
                        using your courses, credits and grades.
                    </p>
                </div>

                <button
                    class="primary-btn"
                    id="addGPACourseBtn">
                    + Add Course
                </button>

            </div>

            <div class="stats-grid">

                <div class="stat-card">
                    <span>Courses</span>
                    <strong>${courses.length}</strong>
                    <small>Courses entered</small>
                </div>

                <div class="stat-card">
                    <span>Current GPA</span>
                    <strong>${gpa.toFixed(2)}</strong>
                    <small>4.00 scale</small>
                </div>

                <div class="stat-card">
                    <span>Total Credits</span>
                    <strong>
                        ${courses.reduce(
                            (total, course) =>
                                total + Number(course.credit),
                            0
                        )}
                    </strong>
                    <small>Credit hours</small>
                </div>

            </div>

            <div class="dashboard-card">

                <h3>Your Courses</h3>

                ${
                    courses.length === 0
                    ?
                    `
                    <div class="empty-state">
                        <h3>No GPA courses yet</h3>
                        <p>
                            Add your courses, credit hours and grades
                            to calculate your GPA.
                        </p>
                    </div>
                    `
                    :
                    `
                    <div class="gpa-table-wrapper">

                        <table class="gpa-table">

                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Credit</th>
                                    <th>Grade</th>
                                    <th>Points</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                ${courses.map((course, index) => `
                                    <tr>

                                        <td>
                                            ${escapeHTML(course.name)}
                                        </td>

                                        <td>
                                            ${escapeHTML(course.credit)}
                                        </td>

                                        <td>
                                            ${escapeHTML(course.grade)}
                                        </td>

                                        <td>
                                            ${gradePoints[course.grade].toFixed(1)}
                                        </td>

                                        <td>
                                            <button
                                                class="delete-gpa-course"
                                                data-index="${index}">
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                `).join("")}

                            </tbody>

                        </table>

                    </div>
                    `
                }

            </div>

            <div class="dashboard-card">

                <h3>Grade Scale</h3>

                <div class="grade-scale">

                    <span>A = 4.0</span>
                    <span>B+ = 3.5</span>
                    <span>B = 3.0</span>
                    <span>C+ = 2.5</span>
                    <span>C = 2.0</span>
                    <span>D+ = 1.5</span>
                    <span>D = 1.0</span>
                    <span>F = 0.0</span>

                </div>

            </div>
        `;

        const addButton =
            document.getElementById("addGPACourseBtn");

        if (addButton) {
            addButton.addEventListener(
                "click",
                addGPACourse
            );
        }

        document.querySelectorAll(".delete-gpa-course")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const index =
                        Number(button.dataset.index);

                    const courses =
                        getData(GPA_KEY);

                    courses.splice(index, 1);

                    saveData(GPA_KEY, courses);

                    renderGPA();
                    updateDashboardStats();
                });
            });
    }

    function addGPACourse() {

        const name =
            prompt("Course name:");

        if (!name) return;

        const credit =
            prompt("Credit hours:");

        if (!credit) return;

        if (Number(credit) <= 0) {
            alert("Credit hours must be greater than 0.");
            return;
        }

        const grade =
            prompt(
                "Grade (A, B+, B, C+, C, D+, D, F):"
            );

        if (!grade) return;

        const formattedGrade =
            grade.trim().toUpperCase();

        if (!(formattedGrade in gradePoints)) {
            alert(
                "Invalid grade. Please use A, B+, B, C+, C, D+, D or F."
            );
            return;
        }

        const courses =
            getData(GPA_KEY);

        courses.push({
            name,
            credit: Number(credit),
            grade: formattedGrade
        });

        saveData(GPA_KEY, courses);

        renderGPA();
    }

    // =========================================
    // DASHBOARD STATS
    // =========================================

    function updateDashboardStats() {

        const courses =
            getData(COURSE_KEY);

        const assignments =
            getData(ASSIGNMENT_KEY);

        const pendingAssignments =
            assignments.filter(
                assignment => !assignment.completed
            );

        const statCards =
            document.querySelectorAll(".stat-card");

        if (statCards.length >= 2) {

            const firstValue =
                statCards[0].querySelector("strong");

            const secondValue =
                statCards[1].querySelector("strong");

            if (firstValue) {
                firstValue.textContent =
                    courses.length;
            }

            if (secondValue) {
                secondValue.textContent =
                    pendingAssignments.length;
            }
        }
    }

    // =========================================
    // INITIAL RENDER
    // =========================================

    renderCourses();
    renderAssignments();
    renderTimetable();
    updateDashboardStats();

});
