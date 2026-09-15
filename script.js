import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/* =========================================================
   FIREBASE
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyBXSxr2J7q0B3co7TfLc9jDmTAILWqKbWw",
    authDomain: "eduvix-study4free.firebaseapp.com",
    projectId: "eduvix-study4free",
    storageBucket: "eduvix-study4free.firebasestorage.app",
    messagingSenderId: "77688636279",
    appId: "1:77688636279:web:6cc68c737ff1e6ecf5d772",
    measurementId: "G-GWSSZH08RE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://gzcghxhjklmjnhltjjqi.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_v8HfwKGCebjoR-uYvgA83g_U91nuoZ6";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

const PDF_BUCKET = "eduvix-pdfs";


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let notes = [];
let currentUser = null;

let activeFilters = {
    board: "",
    class: "",
    subject: "",
    exam: "",
    category: "",
    materialType: ""
};


/* =========================================================
   SUBJECTS
========================================================= */

const SCHOOL_SUBJECTS = [
    "Mathematics",
    "Applied Mathematics",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Hindi",
    "Punjabi",
    "Sanskrit",
    "Urdu",
    "French",
    "History",
    "Geography",
    "Political Science",
    "Civics",
    "Economics",
    "Social Science",
    "Computer Science",
    "Information Technology",
    "Artificial Intelligence",
    "Data Science",
    "Accountancy",
    "Business Studies",
    "Entrepreneurship",
    "Psychology",
    "Sociology",
    "Legal Studies",
    "Physical Education",
    "Fine Arts"
];

const COMPETITIVE_SUBJECTS = [
    "Physics",
    "Chemistry",
    "Biology",
    "Mathematics",
    "Reasoning",
    "General Knowledge",
    "Current Affairs",
    "Quantitative Aptitude",
    "General Science",
    "Legal Reasoning",
    "Verbal Ability",
    "Logical Reasoning",
    "English"
];


/* =========================================================
   MODALS
========================================================= */

window.openModal = function (id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.add("active");
    }
};

window.closeModal = function (id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("active");
    }
};

window.openLogin = function () {
    window.openModal("loginModal");
};

window.openPublish = function () {
    window.openModal("publishModal");

    updatePublishSubjects();

    const category =
        document.getElementById("publishCategory");

    if (category) {
        updatePublishFields(category.value);
    }
};


/* =========================================================
   AUTHENTICATION
========================================================= */

onAuthStateChanged(auth, (user) => {
    currentUser = user;

    const loginButton =
        document.querySelector(".login-btn");

    if (!loginButton) return;

    if (user) {
        loginButton.textContent = "Logout";

        loginButton.onclick = async function () {
            try {
                await signOut(auth);
            } catch (error) {
                console.error("LOGOUT ERROR:", error);

                alert(
                    "Logout failed:\n\n" +
                    error.message
                );
            }
        };
    } else {
        loginButton.textContent = "Login";

        loginButton.onclick = function () {
            window.openLogin();
        };
    }
});


/* =========================================================
   LOGIN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const emailInput =
            loginForm.querySelector(
                'input[type="email"]'
            );

        const passwordInput =
            loginForm.querySelector(
                'input[type="password"]'
            );

        if (!emailInput || !passwordInput) {
            alert(
                "Login form fields could not be found."
            );
            return;
        }

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        if (!email || !password) {
            alert(
                "Please enter your email and password."
            );
            return;
        }

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            window.closeModal("loginModal");

            loginForm.reset();

            alert("Login successful!");

        } catch (error) {

            console.error(
                "FIREBASE LOGIN ERROR:",
                error
            );

            alert(
                "Login failed.\n\n" +
                "Error code: " +
                (error.code || "unknown") +
                "\n\n" +
                (error.message ||
                    "Please check your email and password.")
            );
        }
    });
});


/* =========================================================
   PUBLISH SUBJECT DROPDOWN
========================================================= */

function updatePublishSubjects() {

    const category =
        document.getElementById(
            "publishCategory"
        );

    const subject =
        document.getElementById(
            "publishSubject"
        );

    if (!category || !subject) return;

    subject.innerHTML =
        '<option value="">Select subject</option>';

    let subjects = [];

    if (category.value === "School") {
        subjects = SCHOOL_SUBJECTS;
    }

    if (category.value === "Competitive") {
        subjects = COMPETITIVE_SUBJECTS;
    }

    subjects.forEach((name) => {

        const option =
            document.createElement("option");

        option.value = name;
        option.textContent = name;

        subject.appendChild(option);
    });
}


/* =========================================================
   SCHOOL / COMPETITIVE FIELDS
========================================================= */

function updatePublishFields(category) {

    const schoolFields =
        document.getElementById(
            "schoolPublishFields"
        );

    const competitiveFields =
        document.getElementById(
            "competitivePublishFields"
        );

    if (!schoolFields || !competitiveFields) {
        return;
    }

    if (category === "School") {

        schoolFields.style.display = "block";
        competitiveFields.style.display = "none";

    } else if (category === "Competitive") {

        schoolFields.style.display = "none";
        competitiveFields.style.display = "block";

    } else {

        schoolFields.style.display = "none";
        competitiveFields.style.display = "none";
    }
}


/* =========================================================
   PUBLISH SETUP
========================================================= */

function setupPublishSubjectDropdown() {

    const category =
        document.getElementById(
            "publishCategory"
        );

    if (!category) return;

    category.addEventListener("change", () => {

        updatePublishSubjects();

        updatePublishFields(
            category.value
        );
    });

    updatePublishSubjects();

    updatePublishFields(
        category.value
    );
}


/* =========================================================
   PDF UPLOAD
========================================================= */

async function uploadPDF(file) {

    if (!file) {
        throw new Error(
            "Please select a PDF."
        );
    }

    if (file.type !== "application/pdf") {
        throw new Error(
            "Only PDF files are allowed."
        );
    }

    const MAX_SIZE =
        49 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
        throw new Error(
            "PDF must be smaller than 49 MB."
        );
    }

    const safeName =
        file.name.replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        );

    const uniqueName =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}-${safeName}`;

    const filePath =
        `notes/${uniqueName}`;

    const { error } =
        await supabaseClient
            .storage
            .from(PDF_BUCKET)
            .upload(
                filePath,
                file,
                {
                    contentType: "application/pdf",
                    upsert: false
                }
            );

    if (error) {

        console.error(
            "SUPABASE UPLOAD ERROR:",
            error
        );

        throw new Error(
            "PDF upload failed: " +
            error.message
        );
    }

    const { data } =
        supabaseClient
            .storage
            .from(PDF_BUCKET)
            .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
        throw new Error(
            "Could not create PDF URL."
        );
    }

    return {
        url: data.publicUrl,
        path: filePath
    };
}


/* =========================================================
   PUBLISH FORM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupPublishSubjectDropdown();

    const publishForm =
        document.getElementById(
            "publishForm"
        );

    if (!publishForm) return;

    publishForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            let submitButton = null;
            let originalText =
                "Submit for Review →";

            try {

                if (!currentUser) {

                    alert(
                        "Please log in before publishing a PDF."
                    );

                    window.closeModal(
                        "publishModal"
                    );

                    window.openLogin();

                    return;
                }

                const title =
                    document
                        .getElementById(
                            "publishTitle"
                        )
                        .value
                        .trim();

                const description =
                    document
                        .getElementById(
                            "publishDescription"
                        )
                        .value
                        .trim();

                const category =
                    document
                        .getElementById(
                            "publishCategory"
                        )
                        .value;

                const subject =
                    document
                        .getElementById(
                            "publishSubject"
                        )
                        .value;

                const typeElement =
                    document.getElementById(
                        "publishType"
                    );

                const materialType =
                    typeElement
                        ? typeElement.value
                        : "";

                const boardElement =
                    document.getElementById(
                        "publishBoard"
                    );

                const classElement =
                    document.getElementById(
                        "publishClass"
                    );

                const examElement =
                    document.getElementById(
                        "publishExam"
                    );

                const topicElement =
                    document.getElementById(
                        "publishTopic"
                    );

                const board =
                    boardElement
                        ? boardElement.value
                        : "";

                const classValue =
                    classElement
                        ? classElement.value
                        : "";

                const exam =
                    examElement
                        ? examElement.value
                        : "";

                const topic =
                    topicElement
                        ? topicElement.value.trim()
                        : "";

                const pdfInput =
                    document.getElementById(
                        "publishPDF"
                    );

                const pdfFile =
                    pdfInput &&
                    pdfInput.files
                        ? pdfInput.files[0]
                        : null;

                if (!title) {
                    alert(
                        "Please enter a title."
                    );
                    return;
                }

                if (!category) {
                    alert(
                        "Please select a category."
                    );
                    return;
                }

                if (!subject) {
                    alert(
                        "Please select a subject."
                    );
                    return;
                }

                if (!materialType) {
                    alert(
                        "Please select a material type."
                    );
                    return;
                }

                if (!topic) {
                    alert(
                        "Please enter the chapter/topic."
                    );
                    return;
                }

                if (!pdfFile) {
                    alert(
                        "Please select a PDF."
                    );
                    return;
                }

                submitButton =
                    publishForm.querySelector(
                        'button[type="submit"]'
                    );

                if (submitButton) {

                    originalText =
                        submitButton.textContent;

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "Uploading PDF...";
                }

                const uploaded =
                    await uploadPDF(
                        pdfFile
                    );

                if (submitButton) {
                    submitButton.textContent =
                        "Saving resource...";
                }

                await addDoc(
                    collection(
                        db,
                        "notes"
                    ),
                    {
                        title: title,

                        description:
                            description,

                        category:
                            category,

                        subject:
                            subject,

                        materialType:
                            materialType,

                        board:
                            category === "School"
                                ? board
                                : "",

                        class:
                            category === "School"
                                ? classValue
                                : "",

                        chapter:
                            topic,

                        exam:
                            category === "Competitive"
                                ? exam
                                : "",

                        topic:
                            topic,

                        pdfUrl:
                            uploaded.url,

                        storagePath:
                            uploaded.path,

                        fileName:
                            pdfFile.name,

                        fileSize:
                            pdfFile.size,

                        fileType:
                            pdfFile.type,

                        approved:
                            false,

                        status:
                            "pending",

                        authorName:
                            currentUser.email ||
                            "EDUVIX User",

                        createdAt:
                            serverTimestamp()
                    }
                );

                alert(
                    "Your note has been submitted!\n\nIt is now waiting for admin approval."
                );

                publishForm.reset();

                updatePublishSubjects();

                updatePublishFields("");

                window.closeModal(
                    "publishModal"
                );

            } catch (error) {

                console.error(
                    "PUBLISH ERROR:",
                    error
                );

                alert(
                    error.message ||
                    "Something went wrong while publishing."
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalText;
                }
            }
        }
    );
});


/* =========================================================
   LOAD APPROVED NOTES
========================================================= */

async function loadFirebaseNotes() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "notes"
                )
            );

        notes = [];

        snapshot.forEach(
            (docSnap) => {

                const data =
                    docSnap.data();

                if (
                    data.approved === true &&
                    data.status === "approved"
                ) {

                    notes.push({
                        id: docSnap.id,
                        ...data
                    });
                }
            }
        );

        renderNotes();

    } catch (error) {

        console.error(
            "ERROR LOADING NOTES:",
            error
        );
    }
}


/* =========================================================
   RENDER NOTES
========================================================= */

function renderNotes() {

    const grid =
        document.getElementById(
            "notesGrid"
        );

    const noResults =
        document.getElementById(
            "noResults"
        );

    const resultCount =
        document.getElementById(
            "resultCount"
        );

    if (!grid) return;

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const filtered =
        notes.filter((note) => {

            const searchableText = [
                note.title,
                note.description,
                note.subject,
                note.chapter,
                note.topic,
                note.exam,
                note.category
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !search ||
                searchableText.includes(search);

            const matchesBoard =
                !activeFilters.board ||
                note.board ===
                    activeFilters.board;

            const matchesClass =
                !activeFilters.class ||
                note.class ===
                    activeFilters.class;

            const matchesSubject =
                !activeFilters.subject ||
                note.subject ===
                    activeFilters.subject;

            const matchesExam =
                !activeFilters.exam ||
                note.exam ===
                    activeFilters.exam;

            const matchesCategory =
                !activeFilters.category ||
                note.category ===
                    activeFilters.category;

            const matchesMaterial =
                !activeFilters.materialType ||
                note.materialType ===
                    activeFilters.materialType;

            return (
                matchesSearch &&
                matchesBoard &&
                matchesClass &&
                matchesSubject &&
                matchesExam &&
                matchesCategory &&
                matchesMaterial
            );
        });

    grid.innerHTML = "";

    filtered.forEach((note) => {

        const card =
            document.createElement("div");

        card.className =
            "note-card";

        card.innerHTML = `
            <div class="note-card-top">
                <span class="note-tag">
                    ${escapeHTML(
                        note.category ||
                        "Resource"
                    )}
                </span>
            </div>

            <h3>
                ${escapeHTML(
                    note.title ||
                    "Untitled"
                )}
            </h3>

            <p>
                ${escapeHTML(
                    note.description ||
                    "Study resource"
                )}
            </p>

            <div class="note-meta">
                ${
                    note.subject
                        ? `<span>${escapeHTML(
                            note.subject
                        )}</span>`
                        : ""
                }

                ${
                    note.materialType
                        ? `<span>${escapeHTML(
                            note.materialType
                        )}</span>`
                        : ""
                }
            </div>

            <button
                class="primary-btn"
                onclick="viewNote('${note.id}')">
                View PDF →
            </button>
        `;

        grid.appendChild(card);
    });

    if (resultCount) {
        resultCount.textContent =
            filtered.length;
    }

    if (noResults) {
        noResults.style.display =
            filtered.length === 0
                ? "block"
                : "none";
    }
}


/* =========================================================
   VIEW PDF
========================================================= */

window.viewNote = function (id) {

    const note =
        notes.find(
            (item) =>
                item.id === id
        );

    if (!note) {
        alert(
            "Resource not found."
        );
        return;
    }

    if (note.pdfUrl) {

        window.open(
            note.pdfUrl,
            "_blank"
        );

        return;
    }

    alert(
        "PDF is not available for this resource."
    );
};


/* =========================================================
   FILTER FUNCTIONS
========================================================= */

window.selectBoard = function (board) {

    activeFilters.board =
        board;

    renderNotes();

    document
        .getElementById("library")
        ?.scrollIntoView({
            behavior: "smooth"
        });
};


window.chooseClass = function (className) {

    activeFilters.class =
        className;

    const filter =
        document.getElementById(
            "classFilter"
        );

    if (filter) {
        filter.value =
            className;
    }

    renderNotes();

    document
        .getElementById("library")
        ?.scrollIntoView({
            behavior: "smooth"
        });
};


window.chooseSubject = function (subject) {

    activeFilters.subject =
        subject;

    const filter =
        document.getElementById(
            "subjectFilter"
        );

    if (filter) {
        filter.value =
            subject;
    }

    renderNotes();

    document
        .getElementById("library")
        ?.scrollIntoView({
            behavior: "smooth"
        });
};


window.chooseExam = function (exam) {

    activeFilters.exam =
        exam;

    const filter =
        document.getElementById(
            "examFilter"
        );

    if (filter) {
        filter.value =
            exam;
    }

    renderNotes();

    document
        .getElementById("library")
        ?.scrollIntoView({
            behavior: "smooth"
        });
};


window.chooseCategory = function (category) {

    activeFilters.category =
        category;

    const filter =
        document.getElementById(
            "categoryFilter"
        );

    if (filter) {
        filter.value =
            category;
    }

    renderNotes();
};


window.chooseMaterialType = function (type) {

    activeFilters.materialType =
        type;

    const filter =
        document.getElementById(
            "typeFilter"
        );

    if (filter) {
        filter.value =
            type;
    }

    renderNotes();
};


window.clearFilters = function () {

    activeFilters = {
        board: "",
        class: "",
        subject: "",
        exam: "",
        category: "",
        materialType: ""
    };

    const ids = [
        "categoryFilter",
        "classFilter",
        "examFilter",
        "subjectFilter",
        "typeFilter"
    ];

    ids.forEach((id) => {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if (searchInput) {
        searchInput.value = "";
    }

    renderNotes();
};


/* =========================================================
   FILTER LISTENERS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            renderNotes
        );
    }


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            () => {

                activeFilters.category =
                    categoryFilter.value;

                renderNotes();
            }
        );
    }


    const classFilter =
        document.getElementById(
            "classFilter"
        );

    if (classFilter) {

        classFilter.addEventListener(
            "change",
            () => {

                activeFilters.class =
                    classFilter.value;

                renderNotes();
            }
        );
    }


    const examFilter =
        document.getElementById(
            "examFilter"
        );

    if (examFilter) {

        examFilter.addEventListener(
            "change",
            () => {

                activeFilters.exam =
                    examFilter.value;

                renderNotes();
            }
        );
    }


    const subjectFilter =
        document.getElementById(
            "subjectFilter"
        );

    if (subjectFilter) {

        subjectFilter.addEventListener(
            "change",
            () => {

                activeFilters.subject =
                    subjectFilter.value;

                renderNotes();
            }
        );
    }


    const typeFilter =
        document.getElementById(
            "typeFilter"
        );

    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            () => {

                activeFilters.materialType =
                    typeFilter.value;

                renderNotes();
            }
        );
    }
});


/* =========================================================
   STUDY TIPS
========================================================= */

const studyTips = [
    "Consistency beats last-minute preparation.",
    "Practice questions are more valuable when you analyse your mistakes.",
    "Revise difficult topics more frequently than easy ones.",
    "Use PYQs to understand what your exam actually asks.",
    "Short revision sessions every day are better than one huge session.",
    "After finishing a chapter, test yourself without looking at your notes.",
    "Make your study sessions focused and distraction-free."
];

window.newStudyTip = function () {

    const element =
        document.getElementById(
            "studyTip"
        );

    if (!element) return;

    const current =
        element.textContent;

    let tip =
        studyTips[
            Math.floor(
                Math.random() *
                studyTips.length
            )
        ];

    while (
        studyTips.length > 1 &&
        tip === current
    ) {

        tip =
            studyTips[
                Math.floor(
                    Math.random() *
                    studyTips.length
                )
            ];
    }

    element.textContent =
        tip;
};


/* =========================================================
   DARK MODE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const darkModeBtn =
        document.getElementById(
            "darkModeBtn"
        );

    if (!darkModeBtn) return;

    const saved =
        localStorage.getItem(
            "eduvix-dark-mode"
        );

    if (saved === "true") {

        document.body.classList.add(
            "dark-mode"
        );

        darkModeBtn.textContent =
            "☀️";
    }

    darkModeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );

            const enabled =
                document.body.classList.contains(
                    "dark-mode"
                );

            localStorage.setItem(
                "eduvix-dark-mode",
                enabled
            );

            darkModeBtn.textContent =
                enabled
                    ? "☀️"
                    : "🌙";
        }
    );
});


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupPublishSubjectDropdown();

        loadFirebaseNotes();
    }
);