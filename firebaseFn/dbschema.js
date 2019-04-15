let db = {
    users: [
        {
            userId: "mVzLJxbCN1VEXmwk3BECizQGdMW2",
            email: "liam@email.com",
            createdAt: "2019-04-15T01:50:16.560Z",
            imageUrl:
                "https://firebasestorage.googleapis.com/v0/b/socialape-c4bb8.appspot.com/o/797271740.jpeg?alt=media",
            handle: "liam",
            bio: "Hello, my name is Liam, nice to meet you",
            website: "https://liam.com",
            location: "Quezon, Philippines",
        },
    ],
    screams: [
        {
            userHandle: "user",
            body: "this is a scream body",
            createdAt: "2019-04-14T08:24:29.811Z",
            likeCount: 5,
            commentCount: 2,
        },
    ],
    comments: [
        {
            userHandle: "liam",
            screamId: "6jaYGUbIXVODhdax66T7",
            body: "This is a comment in a body",
            createdAt: "2019-04-14T08:24:29.811Z",
        },
    ],
}

const userDetails = {
    // Redux data
    credentials: {
        userId: "mVzLJxbCN1VEXmwk3BECizQGdMW2",
        email: "liam@email.com",
        handle: "liam",
        createdAt: "2019-04-14T08:24:29.811Z",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/socialape-c4bb8.appspot.com/o/797271740.jpeg?alt=media",
        bio: "Hello, my name is Liam, nice to meet you",
        website: "https://liam.com",
        location: "Manila, Philippines",
    },
    likes: [
        {
            userHandle: "user",
            screamId: "hh7O5oWfWucVzGbHH2pa",
        },
        {
            userHandle: "user",
            screamId: "3IOnFoQexRcofs5OhBXO",
        },
    ],
}
