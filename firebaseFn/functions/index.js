const functions = require("firebase-functions")

const express = require("express")
const app = express()

const { getAllScreams, postOneScream } = require("./handlers/screams")
const { signUp, login } = require("./handlers/users")

const fbAuth = require("./util/fbAuth")


// Scream Routes
app.get("/screams", fbAuth, getAllScreams)
app.post("/scream", fbAuth, postOneScream)

// Users route
app.post("/signup", signUp)
app.post("/login", login)

exports.api = functions.region("asia-northeast1").https.onRequest(app)
