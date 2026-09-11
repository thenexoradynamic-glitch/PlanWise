import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";

export function protectPage() {

    onAuthStateChanged(auth, async user => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }

        const nameElements =
            document.querySelectorAll(".user-name");

        const emailElements =
            document.querySelectorAll(".user-email");

        let name =
            user.displayName ||
            "Student";

        try {

            const ref =
                doc(
                    db,
                    "users",
                    user.uid
                );

            const snap =
                await getDoc(ref);

            if (snap.exists()) {

                const data =
                    snap.data();

                if (data.name)
                    name = data.name;
            }

        } catch(error) {

            console.error(error);

        }

        nameElements.forEach(
            element =>
                element.textContent =
                    name
        );

        emailElements.forEach(
            element =>
                element.textContent =
                    user.email || ""
        );

    });

}

export function setupLogout() {

    document
        .querySelectorAll(".logout-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    await signOut(auth);

                    window.location.href =
                        "login.html";

                }
            );

        });

}
