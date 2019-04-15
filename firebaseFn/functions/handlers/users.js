const { db, admin } = require("../util/admin")
const config = require("../util/config")

const { validateSignupData, validateLoginData, reduceUserDetails } = require("../util/validators")

const firebase = require("firebase")
firebase.initializeApp(config)

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }

    // TODO: validate data
    const { valid, errors } = validateSignupData(newUser)
    if (!valid) return res.status(400).json(errors)
    //

    const noImg = "no-img.png"

    let token, userId
    db.doc(`/users/${newUser.handle}`)
        .get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({ handle: "this handle is already taken." })
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid
            return data.user.getIdToken()
        })
        .then(idToken => {
            token = idToken
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`, // alt=media: to show in browser, otherwise it'll download the file`
                userId,
            }

            return db.doc(`/users/${newUser.handle}`).set(userCredentials)
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch(err => {
            console.error(err)
            if (err.code === "auth/email-already-in-use") {
                return res.status(400).json({ email: "Email is already in use" })
            } else {
                return res.status(500).json({ error: err.code })
            }
        })
}

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    }

    // Validation
    const { valid, errors } = validateLoginData(user)
    if (!valid) return res.status(400).json(errors)

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken()
        })
        .then(token => {
            return res.json({ token })
        })
        .catch(err => {
            console.error(err)
            if (err.code === "auth/wrong-password") {
                return res.status(403).json({ error: "Wrong credentials, please try again" })
            }
            return res.status(400).json({ error: err.code })
        })
}

// Add user details
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body)
    db.doc(`/users/${req.user.handle}`)
        .update(userDetails)
        .then(() => {
            return res.status(200).json({ message: "User details added successfuly" })
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
}
// Get details of authenticated user
exports.getAuthenticatedUser = (req, res) => {
    let userData = {}
    db.doc(`/users/${req.user.handle}`)
        .get()
        .then(doc => {
            if (doc.exists) {
                userData.credentials = doc.data()
                return db
                    .collection("likes")
                    .where("userHandle", "==", req.user.handle)
                    .get()
            }
        })
        .then(data => {
            userData.likes = []
            data.forEach(doc => {
                userData.likes.push(doc.data())
            })
            return res.json(userData)
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
}

// Upload profile image
exports.uploadImage = (req, res) => {
    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")

    const busboy = new BusBoy({ headers: req.headers })

    let imageFilename
    let imageToBeUploaded = {}

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        // image.png
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).json({ error: "Wrong file type submitted" })
        }

        const imageExtension = filename.split(".")[filename.split(".").length - 1]
        imageFilename = `${Math.round(Math.random() * 1000000000)}.${imageExtension}`
        const filepath = path.join(os.tmpdir(), imageFilename)
        imageToBeUploaded = { filepath, mimetype }
        file.pipe(fs.createWriteStream(filepath))
    })
    busboy.on("finish", () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    contentType: imageToBeUploaded.mimetype,
                },
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
                    config.storageBucket
                }/o/${imageFilename}?alt=media` // alt=media: to show in browser, otherwise it'll download the file

                return db.doc(`/users/${req.user.handle}`).update({ imageUrl })
            })
            .then(() => {
                return res.json({ message: "Image uploaded successfuly" })
            })
            .catch(err => {
                console.error(err)
                return res.status(500).json({ error: err.code })
            })
    })
    busboy.end(req.rawBody)
}
