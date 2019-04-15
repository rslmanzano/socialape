const functions = require("firebase-functions")

const express = require("express")
const app = express()

const { getAllScreams, postOneScream, getScream, commentOnScream } = require("./handlers/screams")
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require("./handlers/users")

const fbAuth = require("./util/fbAuth")


// Scream Routes
app.get("/screams", fbAuth, getAllScreams)
app.post("/scream", fbAuth, postOneScream)
app.get('/scream/:screamId', fbAuth, getScream)

// TODO: delete scream
// TODO: like a scream
// TODO: unline a scream
app.post("/scream/:screamId/comment", fbAuth, commentOnScream)

// Users route
app.post("/signup", signup)
app.post("/login", login)
app.post("/user/image", fbAuth, uploadImage)
app.post("/user", fbAuth, addUserDetails)
app.get("/user", fbAuth, getAuthenticatedUser)

exports.api = functions.region("asia-northeast1").https.onRequest(app)
