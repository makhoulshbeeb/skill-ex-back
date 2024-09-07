import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import validator from "validator";

export const signup = async (req, res) => {
    try {
        const { displayName, username, email, password, confirmPassword, gender } = req.body;

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Email is not valid" });
        }

        if (!(/^[a-zA-Z0-9._]+$/.test(username))) {
            return res.status(400).json({ error: "Username should only contain letters, numbers or underscores" });
        }

        if (username.length < 4 || username.length > 24) {
            return res.status(400).json({ error: "Username should be between 4 and 24 characters" });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password should be at least 8 characters" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        var user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const picture = (gender === "male"
            ? `https://avatar.iran.liara.run/public/boy?username=${username}`
            : gender == "female"
                ? `https://avatar.iran.liara.run/public/girl?username=${username}`
                : `https://avatar.iran.liara.run/public/?username=${username}`
        );

        const newUser = new User({
            displayName,
            username,
            email,
            password: hashedPassword,
            gender,
            picture,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                displayName: newUser.displayName,
                username: newUser.username,
                email: newUser.email,
                picture: newUser.picture,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { credential, password } = req.body;
        const email = validator.isEmail(credential);

        const user = (email ? await User.findOne({ email: credential }) : await User.findOne({ username: credential }));

        if (!user) {
            return res.status(400).json({ error: `Invalid ${email ? 'Email' : 'Username'}` });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: `Invalid Password` });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            displayName: user.displayName,
            username: user.username,
            picture: user.picture,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
};