const admin = require("firebase-admin");
const router = require("express").Router();


const serviceAccount = require("../permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const dbauth = admin.auth();
const db = admin.firestore();

router.post("/createuser", async (req, res) => {
  try {
    await dbauth
        .createUser({
          email: req.body.email,
          emailVerified: req.body.emailVerified,
          password: req.body.password,
          disabled: req.body.disabled,
        })
        .then(async (userRecord) => {
          try {
            await db.collection("items").doc("/" + userRecord.uid + "/")
                .create({displayName: req.body.displayName,
                  photoURL: req.body.photoURL});
            return res.status(200).send("item have been created");
          } catch (error) {
            console.log(error);
            return res.status(500).send(error);
          }
        })
        .catch((error) => {
          console.log("Error creating new user:", error);
        });
  } catch (error) {
    error.status(500).json(error);
  }
});


module.exports = router;
