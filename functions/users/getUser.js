const admin = require("firebase-admin");
const router = require("express").Router();


// var serviceAccount = require("../permissions.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
const dbauth = admin.auth();
const db = admin.firestore();

// Get user by info
router.get("/getInfoUser", async (req, res, next) => {
  try {
    await dbauth
        .getUsers([
          {uid: req.body.uid},
        ])
        .then((getUsersResult) => {
          getUsersResult.users.forEach(async (userRecord) => {
            const data = await db.collection("items").doc("/" + req.body.uid + "/")
                .get();
            return res.status(200).send({data: userRecord, data0: data.data()} );
          });


          getUsersResult.notFound.forEach((userIdentifier) => {
            return res.status(400).send("Unable to find users corresponding to these identifiers:"+userIdentifier);
          });
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
        });
  } catch (err) {
    return res.status(500).send(err);
  }
});
// Get user bu mail
router.get("/getUserbymail", async (req, res) => {
  try {
    await dbauth
        .getUserByEmail(email)
        .then(async (userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          try {
            await db.collection("items").doc("/" + req.body.uid + "/")
                .get();
            return res.status(200).send(`Successfully fetched user data: ${userRecord.toJSON()}`);
          } catch (error) {
            console.log(error);
            return res.status(500).send(error);
          }
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
        });
  } catch (err) {
    return res.status(500).send(err);
  }
});
// Get user by ID
router.get("/getUserbyId/:uid", async (req, res) => {
  try {
    await dbauth
        .getUser(req.params.uid)
        .then(async (userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          //console.log(userRecord);
          return res.status(200).send(userRecord );
          
          // try {
          //   const data = await db.collection("items").doc("/" + req.body.uid + "/")
          //       .get();
          //   return res.status(200).send({data: userRecord, data0: data.data()} );
          // } catch (error) {
          //   console.log(error);
          //   return res.status(500).send(error);
          // }
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
        });
  } catch (err) {
    return res.status(500).send('error');
  }
});

// List all users
router.get("/getAll", async (req, res, next) => {
  try {
    
            const data = await db.collection("users").get();
            data.forEach((doc) => {
              res.status(200).send(data["_materializedDocs"] );
             // console.log(doc.id, "=>", doc.data());
            });
    
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
