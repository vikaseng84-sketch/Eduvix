import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
    apiKey: "AIzaSyBXSxr2J7q0B3co7TfLc9jDmTAILWqKbWw",
    authDomain: "eduvix-study4free.firebaseapp.com",
    projectId: "eduvix-study4free",
    storageBucket: "eduvix-study4free.firebasestorage.app",
    messagingSenderId: "77688636279",
    appId: "1:77688636279:web:6cc68c737ff1e6ecf5d772",
    measurementId: "G-GWSSZH08RE"
};


// Start Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ===============================
// HTML SAFETY
// ===============================

function escapeHTML(value) {

    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// LOAD NOTES
// ===============================

async function loadAdminNotes() {

    const container =
        document.getElementById("adminNotes");

    if (!container) return;


    container.innerHTML = `
        <p class="admin-loading">
            Loading submissions...
        </p>
    `;


    try {

        const snapshot =
            await getDocs(collection(db, "notes"));


        container.innerHTML = "";


        let pendingCount = 0;


        snapshot.forEach(noteDoc => {

            const note = noteDoc.data();

            const id = noteDoc.id;


            // Only show pending submissions

            if (
                note.status === "pending" ||
                note.approved === false
            ) {

                pendingCount++;


                const card =
                    document.createElement("div");


                card.className =
                    "admin-note-card";


                card.innerHTML = `

                    <div class="admin-note-info">

                        <span class="note-tag">
                            ${escapeHTML(
                                note.materialType ||
                                "Study Material"
                            )}
                        </span>


                        <h3>
                            ${escapeHTML(
                                note.title ||
                                "Untitled Note"
                            )}
                        </h3>


                        <p>
                            ${escapeHTML(
                                note.description ||
                                "No description provided."
                            )}
                        </p>


                        <div class="admin-details">

                            <strong>Category:</strong>
                            ${escapeHTML(
                                note.category || "-"
                            )}

                            <br>

                            <strong>Subject:</strong>
                            ${escapeHTML(
                                note.subject || "-"
                            )}

                            <br>

                            ${
                                note.class
                                ? `
                                <strong>Class:</strong>
                                ${escapeHTML(note.class)}
                                <br>
                                `
                                : ""
                            }

                            ${
                                note.board
                                ? `
                                <strong>Board:</strong>
                                ${escapeHTML(note.board)}
                                <br>
                                `
                                : ""
                            }

                            ${
                                note.exam
                                ? `
                                <strong>Exam:</strong>
                                ${escapeHTML(note.exam)}
                                <br>
                                `
                                : ""
                            }

                            ${
                                note.chapter
                                ? `
                                <strong>Chapter:</strong>
                                ${escapeHTML(note.chapter)}
                                <br>
                                `
                                : ""
                            }

                            ${
                                note.topic
                                ? `
                                <strong>Topic:</strong>
                                ${escapeHTML(note.topic)}
                                <br>
                                `
                                : ""
                            }

                        </div>

                    </div>


                    <div class="admin-actions">

                        <button
                            class="admin-approve-btn"
                            onclick="approveNote('${id}')">

                            ✅ Approve

                        </button>


                        <button
                            class="admin-reject-btn"
                            onclick="rejectNote('${id}')">

                            ❌ Reject

                        </button>

                    </div>

                `;


                container.appendChild(card);
            }
        });


        if (pendingCount === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <h3>
                        🎉 No pending submissions
                    </h3>

                    <p>
                        Everything has been reviewed.
                    </p>

                </div>

            `;
        }


    } catch (error) {

        console.error(
            "Admin loading error:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    ❌ Could not load submissions
                </h3>

                <p>
                    Check the browser console for the error.
                </p>

            </div>

        `;
    }
}


// ===============================
// APPROVE NOTE
// ===============================

window.approveNote = async function (id) {

    const confirmed =
        confirm(
            "Approve this note?\n\n" +
            "It will become available in the EDUVIX library."
        );


    if (!confirmed) return;


    try {

        await updateDoc(
            doc(db, "notes", id),
            {
                approved: true,
                status: "approved"
            }
        );


        alert(
            "✅ Note approved successfully!"
        );


        loadAdminNotes();


    } catch (error) {

        console.error(
            "Approval error:",
            error
        );


        alert(
            "❌ Could not approve this note."
        );
    }
};


// ===============================
// REJECT NOTE
// ===============================

window.rejectNote = async function (id) {

    const confirmed =
        confirm(
            "Reject this note?\n\n" +
            "The submission will be deleted."
        );


    if (!confirmed) return;


    try {

        await deleteDoc(
            doc(db, "notes", id)
        );


        alert(
            "❌ Note rejected."
        );


        loadAdminNotes();


    } catch (error) {

        console.error(
            "Rejection error:",
            error
        );


        alert(
            "❌ Could not reject this note."
        );
    }
};


// ===============================
// MAKE REFRESH BUTTON WORK
// ===============================

window.loadAdminNotes =
    loadAdminNotes;


// ===============================
// LOAD WHEN PAGE OPENS
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAdminNotes();

    }
);