const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { jwtVerify , SignJWT} = require('jose');

const RegisterUser = require('./model');
const middleware = require('./middleware');
const Books = require('./booksmodel');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// ======== MongoDB Connection ========//
mongoose.connect("mongodb+srv://sivaprasad111222333_db_user:Venky%40123@cluster0.hdszncj.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log("MongoDB Is Not connected" + err));

app.get("/", (req, res) => {
    res.send("OM")
})

// ======== Register Function ========//
app.post('/register', async (req, res) => {
    const { username, email, password, confirmpassword } = req.body;

    try {
        const newUser = new RegisterUser({ username, email, password, confirmpassword });
        const userexists = await RegisterUser.findOne({ email: email });
        const usernameexists = await RegisterUser.findOne({ username: username });
        if (usernameexists) {
            return res.status(400).send('Username already taken');
        };
        if (userexists) {
            return res.status(400).send('User already exists with this email');
        };
        if (password !== confirmpassword) {
            return res.status(400).send('Passwords do not match');
        };
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
}
);

// ======== Login Function ========//
// app.post("/login", async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await RegisterUser.findOne({ username: username });
//         if (!user) {
//             return res.status(400).send('User not found');
//         }
//         if (user.password !== password) {
//             return res.status(400).send('Invalid password');
//         }
//         const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '10h' });
//         res.json({ token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error logging in user');
//     }
// });
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await RegisterUser.findOne({ username });
    if (!user) return res.status(400).send('User not found');
    if (user.password !== password) return res.status(400).send('Invalid password');

    const secret = new TextEncoder().encode('your_jwt_secret'); // convert string to Uint8Array

    const token = await new SignJWT({ id: user._id.toString() }) // payload
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })         // algorithm
      .setExpirationTime('10h')                                 // expiration
      .sign(secret);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in user');
  }
});

// ======== User  Details Function ========//
app.get("/userDetails", middleware, async (req, res) => {
    try {
        let existingUser = await RegisterUser.findById(req.user.id);
        if (!existingUser) {
            return res.status(404).send('User not found');
        }
        res.json(existingUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user details');
    }
});

// ======== Add Books Data ========//
// app.post("/addbook", async (req, res) => {
//     const token = req.headers['x-token'];
//     if (!token) {
//         return res.status(401).send('Access denied. No token provided.');
//     }
//     try {
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         const { id, title, subtitle, price, image, url } = req.body;
//         const userId = decoded.id;

//         const bookExists = await Books.findOne({ id: id, userId: userId });
//         if (bookExists) {
//             return res.status(400).send('Book already added to cart');
//         }

//         const newBook = new Books({ userId, id, title, subtitle, price, image, url });
//         await newBook.save();

//         res.status(201).send('Book added to cart');

//     } catch (error) {
//         console.error(error);
//         res.status(500).send(error.message || 'Error adding book to cart');
//     }
// });

app.post("/addbook", async (req, res) => {
    const token = req.headers['x-token'];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        // Verify JWT and get payload
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode('your_jwt_secret') // convert string secret to Uint8Array
        );

        const userId = payload.id; // decoded user ID from JWT
        const { id, title, subtitle, price, image, url } = req.body;

        // Check if book already exists for this user
        const bookExists = await Books.findOne({ id, userId });
        if (bookExists) return res.status(400).send('Book already added to cart');

        // Add new book
        const newBook = new Books({ userId, id, title, subtitle, price, image, url });
        await newBook.save();

        res.status(201).send('Book added to cart');
    } catch (error) {
        console.error('Error in /addbook:', error);
        res.status(500).send(error.message || 'Error adding book to cart');
    }
});


// ======== Get Books Data ========//

// app.get('/getbooks', async (req, res) => {
//     const token = req.headers['x-token'];
//     if (!token) {
//         return res.status(401).send('Access denied. No token provided.');
//     }
//     try {
//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         const userId = decoded.id;

//         const cartdata = await Books.find({ userId })
//             .sort({ createdAt: -1 });

//         res.json({ success: true, cartdata });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error fetching cart books");
//     }
// });
app.get('/getbooks', async (req, res) => {
    const token = req.headers['x-token'];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        // Verify JWT
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode('your_jwt_secret')
        );

        const userId = payload.id;

        const cartdata = await Books.find({ userId }).sort({ createdAt: -1 });

        res.json({ success: true, cartdata });
    } catch (error) {
        console.error('Error in /getbooks:', error);
        res.status(500).send("Error fetching cart books");
    }
});

// ======== Delete Book From Cart ========//
// app.delete('/deletebook/:id', async (req, res) => {
//     const bookId = req.params.id;

//     try {
//         const token = req.headers['x-token'];
//         if (!token) return res.status(401).send("Unauthorized");

//         // Verify JWT
//         const decoded = jwt.verify(token, 'your_jwt_secret'); // replace with your secret
//         const userId = decoded.id; // match your JWT payload

//         // Delete the book for this user
//         const deletedBook = await Books.findOneAndDelete({ _id: bookId, userId: userId });
//         if (!deletedBook) return res.status(404).send("Book not found");

//         res.status(200).send({ message: "Book removed from cart" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error deleting book");
//     }
// });
app.delete('/deletebook/:id', async (req, res) => {
    const bookId = req.params.id;
    const token = req.headers['x-token'];

    if (!token) return res.status(401).send("Unauthorized");

    try {
        // Verify JWT
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode('your_jwt_secret') // your string secret must be encoded
        );

        const userId = payload.id;

        // Delete the book for this user
        const deletedBook = await Books.findOneAndDelete({ _id: bookId, userId });
        if (!deletedBook) return res.status(404).send("Book not found");

        res.status(200).send({ message: "Book removed from cart" });
    } catch (error) {
        console.error('Error in /deletebook:', error);
        res.status(500).send("Error deleting book");
    }
});

// ======== Book Increase Count ========//
// app.put('/addcount/:id', async (req, res) => {
//     const bookId = req.params.id;
//     try {
//         const token = req.headers['x-token'];
//         if (!token) return res.status(401).send("Unauthorized");

//         const decoded = jwt.verify(token, 'your_jwt_secret');
//         const userId = decoded.id; // ⚠ was decoded.userId, now fixed

//         const book = await Books.findOne({ _id: bookId, userId: userId });
//         if (!book) return res.status(404).send('Book not found');

//         book.count = (book.count || 1) + 1;
//         await book.save();

//         res.status(200).send({ message: 'Book count increased', count: book.count });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error updating book count');
//     }
// });
app.put('/addcount/:id', async (req, res) => {
    const bookId = req.params.id;
    const token = req.headers['x-token'];

    if (!token) return res.status(401).send("Unauthorized");

    try {
        // Verify JWT
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode('your_jwt_secret')
        );

        const userId = payload.id;

        // Find the book for this user
        const book = await Books.findOne({ _id: bookId, userId });
        if (!book) return res.status(404).send('Book not found');

        // Increase count
        book.count = (book.count || 1) + 1;
        await book.save();

        res.status(200).send({ message: 'Book count increased', count: book.count });
    } catch (error) {
        console.error('Error in /addcount:', error);
        res.status(500).send('Error updating book count');
    }
});

// ======== Book Decrease Count ========//
// app.put('/subtractcount/:id', async (req, res) => {
//     const bookId = req.params.id;

//     try {
//         const token = req.headers['x-token'];
//         if (!token) return res.status(401).send("Unauthorized");

//         // Verify JWT
//         const decoded = jwt.verify(token, 'your_jwt_secret'); // replace with your secret
//         const userId = decoded.id; // match your JWT payload

//         // Find the book by _id and userId
//         const book = await Books.findOne({ _id: bookId, userId: userId });
//         if (!book) return res.status(404).send('Book not found');

//         // Decrease count safely (minimum 1)
//         book.count = book.count > 1 ? book.count - 1 : 1;
//         await book.save();

//         res.status(200).send({ message: 'Book count decreased', count: book.count });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error updating book count');
//     }
// });
app.put('/subtractcount/:id', async (req, res) => {
    const bookId = req.params.id;
    const token = req.headers['x-token'];

    if (!token) return res.status(401).send("Unauthorized");

    try {
        // Verify JWT and get payload
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode('your_jwt_secret')
        );

        const userId = payload.id;

        // Find the book for this user
        const book = await Books.findOne({ _id: bookId, userId });
        if (!book) return res.status(404).send('Book not found');

        // Decrease count safely (minimum 1)
        book.count = book.count > 1 ? book.count - 1 : 1;
        await book.save();

        res.status(200).send({ message: 'Book count decreased', count: book.count });
    } catch (error) {
        console.error('Error in /subtractcount:', error);
        res.status(500).send('Error updating book count');
    }
});

// ===============This function change Button like Add btn oy Adedd btn=================//
// app.put('/addbook/:id', async (req, res) => {
//     const bookId = req.params.id;
//     try {
//         const token = req.headers['x-token'];
//         if (!token) return res.status(401).send("Unauthorized");

//         const decoded = jwt.verify(token, 'your_jwt_secret'); // replace with your secret
//         const userId = decoded.userId;

//         // Find the book for this user
//         const book = await Books.findOne({ id: bookId, userId });
//         if (!book) return res.status(404).send("Book not found");

//         // Set addbutton to false
//         book.addbutton = false;
//         await book.save();

//         res.status(200).send({ message: "Book added to cart", book });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error adding book");
//     }
// });
app.put('/addbook/:id', async (req, res) => {
    const bookId = req.params.id;
    const token = req.headers['x-token'];

    if (!token) return res.status(401).send("Unauthorized");

    try {
        // Verify JWT and get payload
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode('your_jwt_secret')
        );

        const userId = payload.id;

        // Find the book for this user
        const book = await Books.findOne({ id: bookId, userId });
        if (!book) return res.status(404).send("Book not found");

        // Set addbutton to false
        book.addbutton = false;
        await book.save();

        res.status(200).send({ message: "Book added to cart", book });
    } catch (error) {
        console.error('Error in /addbook/:id:', error);
        res.status(500).send("Error adding book");
    }
});

// ======== Start Server ========//
app.listen(3030, () => {
    console.log('Server is running on http://localhost:3030');
});

