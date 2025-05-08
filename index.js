const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");

initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com", // Replace with your actual DB URL
});

const db = getDatabase();

// Listen for new messages (simulate Firebase Function manually)
const messagesRef = db.ref("/detailuser/user");

messagesRef.on("child_added", (snapshot) => {
  const data = snapshot.val();
  // extract token, uid, text etc. from data

  const payload = {
    notification: {
      title: "New Message",
      body: data.text || "You have a new message",
    },
    token: data.token, // You should look up the receiver's token
  };

  admin.messaging().send(payload)
    .then((response) => console.log("Notification sent:", response))
    .catch((error) => console.error("Error sending notification:", error));
});
