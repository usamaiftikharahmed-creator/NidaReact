// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;

// const app = express();

// app.use(cors());
// app.use(express.json());

// /* ================= CLOUDINARY CONFIG ================= */
// cloudinary.config({
//     cloud_name: "dn6ckxa9f", 
//     api_key: "318416881282753",
//     api_secret: "clQDf6o7kihb6YFPJg1MsCTmvVk"
// });

// /* ================= DB ================= */
// mongoose
//     .connect("mongodb+srv://OnlineDBSetup:Mitochondria987@cluster0.lmwboau.mongodb.net/myapp")
//     .then(() => console.log("MongoDB Atlas connected"))
//     .catch((err) => console.log(err));

// /* ================= MEMORY STORAGE FOR MULTER ================= */
// // We store in memory so we can pass the buffer directly to Cloudinary
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// /* ================= USER ================= */
// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String
// });

// const User = mongoose.model("User", userSchema);

// /* REGISTER */
// app.post("/api/register", async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const existing = await User.findOne({ username });
//         if (existing) {
//             return res.json({ success: false, message: "User already exists" });
//         }
//         const user = new User({ username, password });
//         await user.save();
//         res.json({ success: true, message: "Registered successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /* LOGIN */
// app.post("/api/login", async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         if (username === "admin@gmail.com" && password === "admin123") {
//             return res.json({ success: true, role: "admin" });
//         }

//         const user = await User.findOne({ username, password });
//         if (user) return res.json({ success: true, role: "user" });

//         res.json({ success: false, message: "Invalid credentials" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /* ================= PRODUCTS ================= */
// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: String, default: "" },
//     imagePublicId: { type: String, default: "" } // Needed to delete from Cloudinary
// });

// const Product = mongoose.model("Product", productSchema);

// /* HELPER: Upload buffer to Cloudinary */
// const uploadToCloudinary = (fileBuffer) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//             { folder: "products" }, // Saves in a 'products' folder in Cloudinary
//             (error, result) => {
//                 if (error) reject(error);
//                 else resolve(result);
//             }
//         );
//         stream.end(fileBuffer);
//     });
// };

// /* GET ALL */
// app.get("/api/products", async (req, res) => {
//     try {
//         const data = await Product.find().sort({ _id: -1 });
//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /* ADD */
// app.post("/api/products", upload.single("image"), async (req, res) => {
//     try {
//         let imageUrl = "";
//         let imagePublicId = "";

//         if (req.file) {
//             const result = await uploadToCloudinary(req.file.buffer);
//             imageUrl = result.secure_url;
//             imagePublicId = result.public_id;
//         }

//         const product = new Product({
//             name: req.body.name,
//             price: req.body.price,
//             image: imageUrl,
//             imagePublicId: imagePublicId
//         });

//         const saved = await product.save();
//         res.json(saved);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /* UPDATE */
// app.put("/api/products/:id", upload.single("image"), async (req, res) => {
//     try {
//         const updateData = {
//             name: req.body.name,
//             price: req.body.price
//         };

//         if (req.file) {
//             // Find old product to delete its image from Cloudinary
//             const oldProduct = await Product.findById(req.params.id);
//             if (oldProduct && oldProduct.imagePublicId) {
//                 await cloudinary.uploader.destroy(oldProduct.imagePublicId);
//             }

//             // Upload new image
//             const result = await uploadToCloudinary(req.file.buffer);
//             updateData.image = result.secure_url;
//             updateData.imagePublicId = result.public_id;
//         }

//         const updated = await Product.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             { new: true }
//         );
//         res.json(updated);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /* DELETE */
// app.delete("/api/products/:id", async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
        
//         // Delete image from Cloudinary
//         if (product && product.imagePublicId) {
//             await cloudinary.uploader.destroy(product.imagePublicId);
//         }

//         await Product.findByIdAndDelete(req.params.id);
//         res.json({ message: "deleted" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// /* ================= SERVER ================= */
// app.listen(5000, () => {
//     console.log("Server running on 5000");
// });
















require("dotenv").config(); // MUST BE AT THE VERY TOP!
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();

app.use(cors({
    origin: "https://nida-react-9i72.vercel.app"
}));
app.use(express.json());

/* ================= CLOUDINARY CONFIG ================= */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

/* ================= DB ================= */
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas connected"))
    .catch((err) => console.log(err));

/* ================= MEMORY STORAGE FOR MULTER ================= */
// We store in memory so we can pass the buffer directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ================= USER ================= */
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", userSchema);

/* REGISTER */
app.post("/api/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existing = await User.findOne({ username });
        if (existing) {
            return res.json({ success: false, message: "User already exists" });
        }
        const user = new User({ username, password });
        await user.save();
        res.json({ success: true, message: "Registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* LOGIN */
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (username === "admin@gmail.com" && password === "admin123") {
            return res.json({ success: true, role: "admin" });
        }

        const user = await User.findOne({ username, password });
        if (user) return res.json({ success: true, role: "user" });

        res.json({ success: false, message: "Invalid credentials" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= PRODUCTS ================= */
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" } // Needed to delete from Cloudinary
});

const Product = mongoose.model("Product", productSchema);

/* HELPER: Upload buffer to Cloudinary */
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "products" }, // Saves in a 'products' folder in Cloudinary
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};

/* GET ALL */
app.get("/api/products", async (req, res) => {
    try {
        const data = await Product.find().sort({ _id: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ADD */
app.post("/api/products", upload.single("image"), async (req, res) => {
    try {
        let imageUrl = "";
        let imagePublicId = "";

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            image: imageUrl,
            imagePublicId: imagePublicId
        });

        const saved = await product.save();
        res.json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* UPDATE */
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            price: req.body.price
        };

        if (req.file) {
            // Find old product to delete its image from Cloudinary
            const oldProduct = await Product.findById(req.params.id);
            if (oldProduct && oldProduct.imagePublicId) {
                await cloudinary.uploader.destroy(oldProduct.imagePublicId);
            }

            // Upload new image
            const result = await uploadToCloudinary(req.file.buffer);
            updateData.image = result.secure_url;
            updateData.imagePublicId = result.public_id;
        }

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* DELETE */
app.delete("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        // Delete image from Cloudinary
        if (product && product.imagePublicId) {
            await cloudinary.uploader.destroy(product.imagePublicId);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
