const admin = require("firebase-admin");
const router = require("express").Router();
const schedule = require("node-schedule");
var CronJob = require("cron").CronJob;
const nodeCron = require("node-cron");

// var serviceAccount = require("../permissions.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
const dbauth = admin.auth();
const db = admin.firestore();

// Update user

router.put("/updateUser", async (req, res) => {
  try {
    await dbauth
      .updateUser(req.body.uid, {
        email: req.body.email,
        emailVerified: req.body.emailVerified,
        password: req.body.password,
        disabled: req.body.disabled,
      })
      .then(async (userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        try {
          await db
            .collection("items")
            .doc("/" + userRecord.uid + "/")
            .set({
              displayName: req.body.displayName,
              photoURL: req.body.photoURL,
            });
          return res.status(200).send("Successfully updated user");
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })
      .catch((error) => {
        console.log("Error updating user:", error);
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
//Disable User
router.put("/disableUser", async (req, res) => {
  try {
    await dbauth
      .updateUser(req.body.uid, {
        disabled: req.body.disabled,
      })
      .then(async (userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.

        return res.status(200).send("Successfully updated user");
      })
      .catch((error) => {
        console.log("Error updating user:", error);
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Disable User
router.put("/enableUser", async (req, res) => {
  try {
    await dbauth
      .updateUser(req.body.uid, {
        disabled: req.body.disabled,
      })
      .then(async (userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.

        return res.status(200).send("Successfully updated user");
      })
      .catch((error) => {
        console.log("Error updating user:", error);
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//Update Progress
router.put("/updatetaskprogress", async (req, res) => {
  try {
    const date = new Date(
      req.body.year,
      req.body.month,
      req.body.day,
      req.body.hour,
      req.body.minute,
      req.body.sec
    );
    console.log(date);
    const job = new CronJob(date, () => {
      const uidd = req.body.uid;
      var progresses = req.body.progress;
      async function getData() {
        const data = await db
          .collection("tasks")
          .doc("/" + req.body.uid + "/")
          .get();
        // console.log(data.data().progress);
        if (data.data().progress == 0) {
          const intervalObj = setInterval(() => {
            // console.log(uidd + " : " + progresses);
            if (progresses < 100) {
              db.collection("tasks")
                .doc("/" + uidd + "/")
                .update({ progress: (progresses += 0.025) });
              if (progresses >= 100) {
                clearInterval(intervalObj);
              }
            } else {
              clearInterval(intervalObj);
            }
          }, req.body.timer/20);
          intervalObj;
        }
      }
      getData();
    },null, true, 'Africa/Tunis');
    job.start();

    return res.status(200).send("success");
  } catch (error) {
    return res.status(400).send("fail");
  }
});
//Update Progress By Location
router.put("/updatetaskprogressbylocation", async (req, res) => {
  try {
    async function getData() {
      const data = await db
        .collection("tasks")
        .doc("/" + req.body.uid + "/")
        .get();
      // console.log(data.data().progress == 0);
      if (data.data().progress == 0) {
        const intervalObj = setInterval(() => {
          // console.log(
          //   req.body.uid + " : " + req.body.progress + " : " + req.body.timer
          // );
          if (req.body.progress < 100) {
            db.collection("tasks")
              .doc("/" + req.body.uid + "/")
              .update({ progress: (req.body.progress += 0.5) });
            if (req.body.progress >= 100) {
              clearInterval(intervalObj);
            }
          } else {
            clearInterval(intervalObj);
          }
        }, req.body.timer);
        intervalObj;
      }
    }
    getData();

    return res.status(200).send("success");
  } catch (error) {
    return res.status(400).send("fail");
  }
});

module.exports = router;
