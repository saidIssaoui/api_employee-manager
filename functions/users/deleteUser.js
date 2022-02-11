const admin = require("firebase-admin");
const router = require("express").Router();


// var serviceAccount = require("../permissions.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
const dbauth = admin.auth();
const db = admin.firestore();


// Delete multiple users
router.delete("/deleteUsers", async (req, res) => {
  try {
    await dbauth
        .deleteUsers([uid1, uid2, uid3])
        .then((deleteUsersResult) => {
          console.log(`Successfully deleted ${deleteUsersResult.successCount} users`);
          console.log(`Failed to delete ${deleteUsersResult.failureCount} users`);
          deleteUsersResult.errors.forEach((err) => {
            console.log(err.error.toJSON());
          });
        })
        .catch((error) => {
          console.log("Error deleting users:", error);
        });
  } catch (error) {
    error.status(500).json(error);
  }
});


router.delete("/deleteOneUser", async (req, res) => {
  try {
    await dbauth
        .deleteUser(req.body.uid)
        .then(async (userRecord) => {
          
            return res.status(200).send("Successfully deleted user");
         
        })
        .catch((error) => {
          console.log("Error deleting user:", error);
        });
  } catch (error) {
    error.status(500).json(error);
  }
});


module.exports = router;
