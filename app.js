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
const QUIZ_HISTORY_KEY = "studenthub_quiz_history";

/* =========================================
   MASTER QUESTION BANK SUBJECTS
   Add future subjects here.
========================================= */

const QUESTION_BANK_SUBJECTS = [

    {
        name: "Anatomy & Physiology",
        icon: "🫀",
        description: "Human body structure and function"
    },

    {
        name: "Microbiology",
        icon: "🦠",
        description: "Microorganisms and infection"
    },

    {
        name: "Basic Nursing",
        icon: "👩‍⚕️",
        description: "Core nursing knowledge and skills"
    },

    {
        name: "Fundamentals of Nursing",
        icon: "🩺",
        description: "Foundations of patient care"
    },

    {
        name: "Nursing Process",
        icon: "📋",
        description: "Assessment, planning, implementation and evaluation"
    },

    {
        name: "Advanced Nursing I",
        icon: "📘",
        description: "Advanced nursing practice I"
    },

    {
        name: "Advanced Nursing II",
        icon: "📗",
        description: "Advanced nursing practice II"
    },

    {
        name: "Advanced Nursing III",
        icon: "📕",
        description: "Advanced nursing practice III"
    },

    {
        name: "Professionalism",
        icon: "🎓",
        description: "Professional nursing practice"
    },

    {
        name: "Professional Adjustment",
        icon: "🤝",
        description: "Adjustment to professional nursing"
    },

    {
        name: "Therapeutic Communication",
        icon: "💬",
        description: "Communication in patient care"
    },

    {
        name: "Nursing Informatics",
        icon: "💻",
        description: "Technology and nursing information"
    },

    {
        name: "Health Assessment",
        icon: "🩺",
        description: "Patient assessment and examination"
    },

    {
        name: "Pathophysiology",
        icon: "🔬",
        description: "Disease processes and body changes"
    },

    {
        name: "Medical Nursing I",
        icon: "🏥",
        description: "Medical nursing practice I"
    },

    {
        name: "Medical Nursing II",
        icon: "🏥",
        description: "Medical nursing practice II"
    },

    {
        name: "Medical Nursing III",
        icon: "🏥",
        description: "Medical nursing practice III"
    },

    {
        name: "Pharmacology I",
        icon: "💊",
        description: "Medicines and pharmacology I"
    },

    {
        name: "Pharmacology II",
        icon: "💊",
        description: "Medicines and pharmacology II"
    },

    {
        name: "Pharmacology III",
        icon: "💊",
        description: "Medicines and pharmacology III"
    },

    {
        name: "Surgery I",
        icon: "🏥",
        description: "Surgical nursing practice I"
    },

    {
        name: "Surgery II",
        icon: "🩹",
        description: "Surgical nursing practice II"
    },

    {
        name: "Surgery III",
        icon: "🩺",
        description: "Surgical nursing practice III"
    },

    {
        name: "Medicine I",
        icon: "🩺",
        description: "Medicine and clinical care I"
    },

    {
        name: "Medicine II",
        icon: "🩺",
        description: "Medicine and clinical care II"
    },

    {
        name: "Medicine III",
        icon: "🏥",
        description: "Medicine and clinical care III"
    },

    {
        name: "Maternal & Child Health",
        icon: "🤰",
        description: "Maternal and child healthcare"
    },

    {
        name: "Midwifery",
        icon: "👶",
        description: "Pregnancy, birth and newborn care"
    },

    {
        name: "Paediatric Nursing",
        icon: "🧸",
        description: "Nursing care of children"
    },

    {
        name: "Community Health Nursing",
        icon: "🌍",
        description: "Community-based nursing care"
    },

    {
        name: "Public Health",
        icon: "🏥",
        description: "Population and public health"
    },

    {
        name: "Health Promotion",
        icon: "❤️",
        description: "Healthy living and disease prevention"
    },

    {
        name: "Mental Health / Psychiatric Nursing",
        icon: "🧠",
        description: "Mental health and psychiatric care"
    },

    {
        name: "Nutrition & Dietetics",
        icon: "🥗",
        description: "Nutrition and therapeutic diets"
    },

    {
        name: "First Aid & Emergency Care",
        icon: "🚑",
        description: "Emergency response and first aid"
    },

    {
        name: "Infection Prevention & Control",
        icon: "🧼",
        description: "Infection prevention and control"
    },

    {
        name: "Nursing Ethics",
        icon: "⚖️",
        description: "Ethics and professional responsibilities"
    },

    {
        name: "Research Methods",
        icon: "📚",
        description: "Nursing research and methodology"
    },

    {
        name: "Statistics / Biostatistics",
        icon: "📊",
        description: "Statistics for health sciences"
    }

];
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

if (pageName === "quiz") {
    renderQuiz();

    setTimeout(() => {
        const quizPage = document.getElementById("quiz");

        if (quizPage) {
            quizPage.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }, 50);
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

    // =========================================
// QUIZ ENGINE
// =========================================

const QUIZ_KEY = "studenthub_quiz_questions";
/* =========================================
   QUESTION BANK HELPERS
========================================= */

function createQuestion(
    id,
    subject,
    topic,
    question,
    options,
    answer,
    explanation
) {

    return {

        id: id,

        subject: subject,

        course: subject,

        topic: topic,

        question: question,

        options: options,

        answer: answer,

        explanation: explanation

    };

}
const defaultQuestions = [createQuestion(
    101,
    "Anatomy & Physiology",
    "Skeletal System",
    "How many bones are normally found in an adult human skeleton?",
    [
        "106",
        "206",
        "306",
        "406"
    ],
    "206",
    "A typical adult human skeleton contains approximately 206 bones."
),

createQuestion(
    102,
    "Anatomy & Physiology",
    "Respiratory System",
    "Where does gas exchange mainly occur in the lungs?",
    [
        "Trachea",
        "Bronchi",
        "Alveoli",
        "Larynx"
    ],
    "Alveoli",
    "Gas exchange between oxygen and carbon dioxide mainly occurs across the walls of the alveoli."
),

createQuestion(
    103,
    "Anatomy & Physiology",
    "Cardiovascular System",
    "Which chamber of the heart pumps oxygenated blood into the systemic circulation?",
    [
        "Right atrium",
        "Right ventricle",
        "Left atrium",
        "Left ventricle"
    ],
    "Left ventricle",
    "The left ventricle pumps oxygenated blood through the aorta to the systemic circulation."
),

createQuestion(
    104,
    "Anatomy & Physiology",
    "Nervous System",
    "Which organ is the main control center of the nervous system?",
    [
        "Heart",
        "Brain",
        "Kidney",
        "Stomach"
    ],
    "Brain",
    "The brain is the main control center of the nervous system and coordinates many body functions."
),

createQuestion(
    105,
    "Anatomy & Physiology",
    "Digestive System",
    "Which organ is primarily responsible for absorbing most nutrients from digested food?",
    [
        "Stomach",
        "Small intestine",
        "Large intestine",
        "Esophagus"
    ],
    "Small intestine",
    "Most nutrient absorption occurs in the small intestine, which has specialized structures that increase its absorptive surface area."
),

    {
        id: 1,
        subject: "Anatomy",
        course: "Anatomy",
        topic: "Basic Anatomy",
        question: "Which organ pumps blood around the body?",
        options: [
            "Lungs",
            "Heart",
            "Kidney",
            "Liver"
        ],
        answer: "Heart",
        explanation:
            "The heart is a muscular organ that pumps blood throughout the body."
    },

    {
        id: 2,
        subject: "Anatomy",
        course: "Anatomy",
        topic: "Basic Anatomy",
        question: "What is the largest organ of the human body?",
        options: [
            "Heart",
            "Liver",
            "Skin",
            "Brain"
        ],
        answer: "Skin",
        explanation:
            "The skin is the largest organ of the human body."
    },

    {
        id: 3,
        subject: "Nursing",
        course: "Nursing",
        topic: "Vital Signs",
        question: "Which vital sign measures the force of blood against artery walls?",
        options: [
            "Temperature",
            "Pulse",
            "Blood pressure",
            "Respiratory rate"
        ],
        answer: "Blood pressure",
        explanation:
            "Blood pressure measures the force of circulating blood against the walls of the arteries."
    },

    {
        id: 4,
        subject: "Microbiology",
        course: "Microbiology",
        topic: "Microorganisms",
        question: "Which microorganism is responsible for malaria?",
        options: [
            "Plasmodium",
            "Staphylococcus",
            "Candida",
            "Influenza virus"
        ],
        answer: "Plasmodium",
        explanation:
            "Malaria is caused by parasites of the genus Plasmodium."
    },

    {
        id: 5,
        subject: "Pharmacology",
        course: "Pharmacology",
        topic: "Medication Safety",
        question: "Which route of administration involves giving medicine directly into a vein?",
        options: [
            "Oral",
            "Intramuscular",
            "Intravenous",
            "Subcutaneous"
        ],
        answer: "Intravenous",
        explanation:
            "Intravenous administration delivers medication directly into a vein."
    },

    {
        id: 6,
        subject: "Anatomy",
        course: "Anatomy",
        topic: "Skeletal System",
        question: "How many bones are normally found in an adult human body?",
        options: [
            "106",
            "206",
            "306",
            "406"
        ],
        answer: "206",
        explanation:
            "A typical adult human skeleton contains approximately 206 bones."
    },

    {
        id: 7,
        subject: "Anatomy",
        course: "Anatomy",
        topic: "Respiratory System",
        question: "Where does gas exchange mainly occur in the lungs?",
        options: [
            "Trachea",
            "Bronchi",
            "Alveoli",
            "Larynx"
        ],
        answer: "Alveoli",
        explanation:
            "The alveoli are tiny air sacs where oxygen and carbon dioxide are exchanged."
    },

    {
        id: 8,
        subject: "Nursing",
        course: "Nursing",
        topic: "Vital Signs",
        question: "Which device is commonly used to measure oxygen saturation?",
        options: [
            "Thermometer",
            "Pulse oximeter",
            "Stethoscope",
            "Sphygmomanometer"
        ],
        answer: "Pulse oximeter",
        explanation:
            "A pulse oximeter estimates the oxygen saturation of blood using a sensor placed on a finger or other suitable site."
    },

    {
        id: 9,
        subject: "Nursing",
        course: "Nursing",
        topic: "Infection Prevention",
        question: "What is one of the most important ways to prevent the spread of infection in healthcare settings?",
        options: [
            "Hand hygiene",
            "Skipping documentation",
            "Sharing needles",
            "Avoiding patient assessment"
        ],
        answer: "Hand hygiene",
        explanation:
            "Proper hand hygiene is one of the most important measures for reducing the transmission of microorganisms."
    },

    {
        id: 10,
        subject: "Microbiology",
        course: "Microbiology",
        topic: "Bacteria",
        question: "Which of the following is a bacterium?",
        options: [
            "Staphylococcus",
            "Plasmodium",
            "Influenza virus",
            "Candida"
        ],
        answer: "Staphylococcus",
        explanation:
            "Staphylococcus is a genus of bacteria."
    },

    {
        id: 11,
        subject: "Microbiology",
        course: "Microbiology",
        topic: "Fungi",
        question: "Which microorganism is a fungus?",
        options: [
            "Candida",
            "Plasmodium",
            "Escherichia coli",
            "Influenza virus"
        ],
        answer: "Candida",
        explanation:
            "Candida is a genus of yeast-like fungi."
    },

    {
        id: 12,
        subject: "Pharmacology",
        course: "Pharmacology",
        topic: "Medication Routes",
        question: "Which route involves administering medication by mouth?",
        options: [
            "Intravenous",
            "Oral",
            "Intramuscular",
            "Subcutaneous"
        ],
        answer: "Oral",
        explanation:
            "The oral route involves taking medication through the mouth."
    },

    {
        id: 13,
        subject: "Pharmacology",
        course: "Pharmacology",
        topic: "Medication Safety",
        question: "Which of the following is an important medication safety practice?",
        options: [
            "Giving medication without checking the patient",
            "Checking the medication order carefully",
            "Guessing the dose",
            "Ignoring allergies"
        ],
        answer: "Checking the medication order carefully",
        explanation:
            "Healthcare professionals should carefully verify medication orders and relevant patient information before administration."
    },

    {
        id: 14,
        subject: "Anatomy",
        course: "Anatomy",
        topic: "Nervous System",
        question: "Which organ is the main control center of the nervous system?",
        options: [
            "Heart",
            "Brain",
            "Kidney",
            "Stomach"
        ],
        answer: "Brain",
        explanation:
            "The brain is the main control center of the nervous system."
    },

    {
        id: 15,
        subject: "Nursing",
        course: "Nursing",
        topic: "Patient Care",
        question: "What is the purpose of taking a patient's vital signs?",
        options: [
            "To monitor important body functions",
            "To replace all physical examinations",
            "To determine the patient's name",
            "To prescribe every medication"
        ],
        answer: "To monitor important body functions",
        explanation:
            "Vital signs provide important information about a patient's physiological condition."
    }

];


function getQuizQuestions() {

    const saved =
        JSON.parse(
            localStorage.getItem(QUIZ_KEY)
        );

    if (
        saved &&
        saved.length >= defaultQuestions.length
    ) {
        return saved;
    }

    localStorage.setItem(
        QUIZ_KEY,
        JSON.stringify(defaultQuestions)
    );

    return defaultQuestions;
}

let currentQuizQuestions = [];
let currentQuizIndex = 0;
let currentQuizScore = 0;
let quizAnswered = false;
    let currentQuizSubject = "All Subjects";
// =========================================
// RENDER QUIZ PAGE
// =========================================
    function renderQuiz() {

    const container =
        document.getElementById("quiz");

    if (!container) return;

    const questions =
        getQuizQuestions();

    const subjectGrid =
        container.querySelector(
            ".quiz-subject-grid"
        );

    if (!subjectGrid) return;


    /* =========================================
       ALL SUBJECTS
    ========================================= */

    const allSubjectsButton = `

        <button
            class="quiz-subject quiz-all-subjects"
            data-subject="All Subjects">

            <span>🎯</span>

            <strong>
                All Subjects
            </strong>

            <small>
                Mixed practice from the entire question bank
            </small>

            <small class="quiz-subject-count">
                ${questions.length}
                question${questions.length === 1 ? "" : "s"}
                available
            </small>

        </button>

    `;


    /* =========================================
       MASTER SUBJECT LIST
    ========================================= */

    const subjectButtons =
        QUESTION_BANK_SUBJECTS
            .map(subject => {

                const questionCount =
                    questions.filter(
                        question =>
                            (
                                question.subject ||
                                question.course
                            ) === subject.name
                    ).length;

                return `

                    <button
                        class="quiz-subject"
                        data-subject="${subject.name}">

                        <span>
                            ${subject.icon}
                        </span>

                        <strong>
                            ${subject.name}
                        </strong>

                        <small>
                            ${subject.description}
                        </small>

                        <small
                            class="quiz-subject-count">

                            ${questionCount}
                            question${
                                questionCount === 1
                                    ? ""
                                    : "s"
                            }
                            available

                        </small>

                    </button>

                `;

            })
            .join("");


    subjectGrid.innerHTML =
        allSubjectsButton +
        subjectButtons;


    /* =========================================
       SUBJECT BUTTON EVENTS
    ========================================= */

    subjectGrid
        .querySelectorAll(
            ".quiz-subject"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const subject =
                        button.dataset.subject;

                    startQuiz(subject);

                }
            );

        });

}
// =========================================
// START QUIZ
// =========================================
function startQuiz(subject = "All Subjects") {

    currentQuizSubject = subject;

    let questions = getQuizQuestions();

    // Filter by selected subject
    if (subject !== "All Subjects") {
        questions = questions.filter(question => {
            const questionSubject =
                question.subject ||
                question.course ||
                "";

            return questionSubject === subject;
        });
    }

    // No questions available
    if (questions.length === 0) {
        alert(
            `No questions are available for ${subject} yet.`
        );
        return;
    }

    // Randomize and limit quiz
    currentQuizQuestions = [...questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(10, questions.length));

    // Reset quiz
    currentQuizIndex = 0;
    currentQuizScore = 0;
    quizAnswered = false;

    // Hide subject selection
    const subjectGrid =
        document.querySelector(".quiz-subject-grid");

    if (subjectGrid) {
        subjectGrid.style.display = "none";
    }

    // Show a back button
    const quizArea =
        document.getElementById("quizArea");

    if (quizArea) {

        quizArea.innerHTML = `
            <button
                type="button"
                class="quiz-back-subjects"
                id="quizBackToSubjects">

                ← Back to Subjects

            </button>
        `;

        const backButton =
            document.getElementById(
                "quizBackToSubjects"
            );

        if (backButton) {
            backButton.addEventListener(
                "click",
                () => {

                    subjectGrid.style.display = "";

                    quizArea.innerHTML = "";

                    subjectGrid.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );
        }
    }

    // Show the first question
    showQuizQuestion();

    // Bring the question directly into view
    setTimeout(() => {

        const questionCard =
            document.querySelector(
                "#quizArea .quiz-card"
            );

        if (questionCard) {
            questionCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    }, 100);
}
// =========================================
// SHOW QUESTION
// =========================================

function showQuizQuestion() {

    const area =
        document.getElementById("quizArea");

    if (!area) return;

    const question =
        currentQuizQuestions[currentQuizIndex];

    if (!question) {
        showQuizResult();
        return;
    }

    quizAnswered = false;

    const progress =
        currentQuizIndex + 1;

    const total =
        currentQuizQuestions.length;

    area.innerHTML = `

        <div class="quiz-card">

            <div class="quiz-progress">

                <span>
                    Question ${progress} of ${total}
                </span>

                <div class="quiz-progress-bar">
                    <div
                        style="
                            width:${(progress / total) * 100}%;
                        ">
                    </div>
                </div>

            </div>

            <div class="quiz-question-meta">

                <span>
                    ${escapeHTML(question.course)}
                </span>

                <span>
                    ${escapeHTML(question.topic)}
                </span>

            </div>

            <h3 class="quiz-question">
                ${escapeHTML(question.question)}
            </h3>

            <div class="quiz-options">

                ${question.options.map(
                    (option, index) => `
                        <button
                            class="quiz-option"
                            data-option="${escapeHTML(option)}">

                            <span class="option-letter">
                                ${String.fromCharCode(65 + index)}
                            </span>

                            <span>
                                ${escapeHTML(option)}
                            </span>

                        </button>
                    `
                ).join("")}

            </div>

            <div
                id="quizFeedback"
                class="quiz-feedback">
            </div>

        </div>
    `;

    document
        .querySelectorAll(".quiz-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    checkQuizAnswer(
                        button.dataset.option
                    );

                }
            );

        });
}


// =========================================
// CHECK ANSWER
// =========================================

function checkQuizAnswer(selectedAnswer) {

    if (quizAnswered) return;

    quizAnswered = true;

    const question =
        currentQuizQuestions[currentQuizIndex];

    const feedback =
        document.getElementById(
            "quizFeedback"
        );

    const optionButtons =
        document.querySelectorAll(
            ".quiz-option"
        );

    optionButtons.forEach(button => {

        button.disabled = true;

        if (
            button.dataset.option ===
            question.answer
        ) {
            button.classList.add(
                "correct"
            );
        }

        if (
            button.dataset.option ===
            selectedAnswer &&
            selectedAnswer !== question.answer
        ) {
            button.classList.add(
                "incorrect"
            );
        }

    });

    if (
        selectedAnswer ===
        question.answer
    ) {

        currentQuizScore++;

        feedback.innerHTML = `
            <div class="quiz-feedback-success">

                <strong>Correct! 🎉</strong>

                <p>
                    ${escapeHTML(question.explanation)}
                </p>

            </div>

            <button
                class="primary-btn quiz-next-btn">
                ${
                    currentQuizIndex + 1 <
                    currentQuizQuestions.length
                    ? "Next Question"
                    : "See Results"
                }
            </button>
        `;

    } else {

        feedback.innerHTML = `
            <div class="quiz-feedback-error">

                <strong>Not quite.</strong>

                <p>
                    <strong>
                        Correct answer:
                    </strong>
                    ${escapeHTML(question.answer)}
                </p>

                <p>
                    ${escapeHTML(question.explanation)}
                </p>

            </div>

            <button
                class="primary-btn quiz-next-btn">
                ${
                    currentQuizIndex + 1 <
                    currentQuizQuestions.length
                    ? "Next Question"
                    : "See Results"
                }
            </button>
        `;

    }

    document
        .querySelector(".quiz-next-btn")
        .addEventListener(
            "click",
            () => {

                currentQuizIndex++;

                showQuizQuestion();

            }
        );
}


// =========================================
// QUIZ RESULT
// =========================================
function showQuizResult() {

    const area =
        document.getElementById(
            "quizArea"
        );

    if (!area) return;

    const total =
        currentQuizQuestions.length;

    const percentage =
        total === 0
        ? 0
        : Math.round(
            (currentQuizScore / total) * 100
        );


    let message =
        "Keep practicing! 💪";

    if (percentage >= 80) {

        message =
            "Excellent work! 🎉";

    } else if (percentage >= 60) {

        message =
            "Good job! Keep improving. 👍";
    }


    /* =========================================
       SAVE QUIZ RESULT
    ========================================== */

    const historyKey =
        "studenthub_quiz_history";

    const history =
        JSON.parse(
            localStorage.getItem(historyKey)
        ) || [];


    history.push({

    subject:
        currentQuizSubject,

    score:
        currentQuizScore,

    total:
        total,

    percentage:
        percentage,

    date:
        new Date().toISOString()

});


    localStorage.setItem(
        historyKey,
        JSON.stringify(history)
    );


    area.innerHTML = `

        <div class="quiz-result">

            <div class="quiz-result-icon">
                🏆
            </div>

            <h2>
                ${message}
            </h2>

            <p>
                You scored
                <strong>
                    ${currentQuizScore}
                </strong>
                out of
                <strong>
                    ${total}
                </strong>
            </p>

            <div class="quiz-score">
                ${percentage}%
            </div>

            <button
                class="primary-btn"
                id="restartQuizBtn">
                Try Again
            </button>

        </div>
    `;


    document
    .getElementById(
        "restartQuizBtn"
    )
    .addEventListener(
        "click",
        startQuiz
    );

updateQuizPerformance();

}
/* =========================================
   QUIZ PERFORMANCE STATISTICS
========================================= */

function getQuizPerformanceStats() {

    const historyKey =
        "studenthub_quiz_history";

    const history =
        JSON.parse(
            localStorage.getItem(historyKey)
        ) || [];


    if (history.length === 0) {

        return {
            totalQuizzes: 0,
            averageScore: 0,
            highestScore: 0,
            totalQuestions: 0
        };

    }


    const totalQuizzes =
        history.length;


    const totalPercentage =
        history.reduce(
            (sum, result) =>
                sum + Number(result.percentage || 0),
            0
        );


    const averageScore =
        Math.round(
            totalPercentage / totalQuizzes
        );


    const highestScore =
        Math.max(
            ...history.map(
                result =>
                    Number(result.percentage || 0)
            )
        );


    const totalQuestions =
        history.reduce(
            (sum, result) =>
                sum + Number(result.total || 0),
            0
        );


    return {

        totalQuizzes,

        averageScore,

        highestScore,

        totalQuestions

    };

}
/* =========================================
   UPDATE QUIZ PERFORMANCE ON DASHBOARD
========================================= */

function updateQuizPerformance() {

    const stats =
        getQuizPerformanceStats();


    const totalAttempts =
        document.getElementById(
            "quizTotalAttempts"
        );


    const averageScore =
        document.getElementById(
            "quizAverageScore"
        );


    const highestScore =
        document.getElementById(
            "quizHighestScore"
        );


    const totalQuestions =
        document.getElementById(
            "quizTotalQuestions"
        );


    if (totalAttempts) {

        totalAttempts.textContent =
            stats.totalQuizzes;

    }


    if (averageScore) {

        averageScore.textContent =
            `${stats.averageScore}%`;

    }


    if (highestScore) {

        highestScore.textContent =
            `${stats.highestScore}%`;

    }


    if (totalQuestions) {

        totalQuestions.textContent =
            stats.totalQuestions;

    }

}
        /* =========================================
       RECENT QUIZ ATTEMPTS
    ========================================== */

    const recentContainer =
        document.getElementById(
            "recentQuizAttempts"
        );

    if (recentContainer) {

        const history =
            JSON.parse(
                localStorage.getItem(
                    QUIZ_HISTORY_KEY
                )
            ) || [];

        if (history.length === 0) {

            recentContainer.innerHTML = `
                <p class="quiz-history-empty">
                    No quiz attempts yet.
                </p>
            `;

        } else {

            const recent =
                history
                    .slice()
                    .reverse()
                    .slice(0, 5);

            recentContainer.innerHTML =
                recent.map((attempt) => `

                    <div class="recent-quiz-item">

                        <div class="recent-quiz-info">

                            <strong>
                                ${attempt.subject || "All Subjects"}
                            </strong>

                            <small>
                                ${attempt.score}/${attempt.total}
                                questions correct
                            </small>

                        </div>

                        <div class="recent-quiz-score">

                            ${attempt.percentage}%

                        </div>

                    </div>

                `).join("");

        }

    }
    /* =========================================================
   STUDENTHUB GH — ADMIN QUESTION GENERATOR
========================================================= */

function setupAdminQuestionGenerator() {

    const generateButton =
        document.getElementById(
            "generateAdminQuestions"
        );

    if (!generateButton) {
        return;
    }

    generateButton.addEventListener(
        "click",
        function () {

            const subject =
                document.getElementById(
                    "adminQuestionSubject"
                )?.value.trim();

            const topic =
                document.getElementById(
                    "adminQuestionTopic"
                )?.value.trim();

            const difficulty =
                document.getElementById(
                    "adminQuestionDifficulty"
                )?.value;

            const count =
                document.getElementById(
                    "adminQuestionCount"
                )?.value;

            const output =
                document.getElementById(
                    "adminGeneratedQuestions"
                );


            if (!subject) {

                alert(
                    "Please select a subject first."
                );

                return;
            }


            if (!topic) {

                alert(
                    "Please enter a topic first."
                );

                return;
            }


            if (!output) {
                return;
            }


            output.innerHTML = `

                <div class="admin-empty-state">

                    <div>
                        🤖
                    </div>

                    <h3>
                        Question request prepared
                    </h3>

                    <p>
                        ${subject} —
                        ${topic} —
                        ${difficulty} —
                        ${count} questions
                    </p>

                    <p>
                        AI generation will be connected
                        in the next step.
                    </p>

                </div>

            `;

        }
    );

}


/* =========================================================
   START ADMIN FEATURES
========================================================= */

setupAdminQuestionGenerator();
// =========================================
// INITIAL RENDER
// =========================================

renderCourses();
renderAssignments();
renderTimetable();
updateDashboardStats();
renderQuiz();
updateQuizPerformance();
});
