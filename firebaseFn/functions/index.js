const functions = require("firebase-functions")

const express = require("express")
const app = express()

const { getAllScreams, postOneScream } = require("./handlers/screams")
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require("./handlers/users")

const fbAuth = require("./util/fbAuth")


// Scream Routes
app.get("/screams", fbAuth, getAllScreams)
app.post("/scream", fbAuth, postOneScream)


// Users route
app.post("/signup", signup)
app.post("/login", login)
app.post("/user/image", fbAuth, uploadImage)
app.post("/user", fbAuth, addUserDetails)
app.get("/user", fbAuth, getAuthenticatedUser)

exports.api = functions.region("asia-northeast1").https.onRequest(app)
