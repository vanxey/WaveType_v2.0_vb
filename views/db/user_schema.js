import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    score: { type: Number, required: true },
});

export const User = mongoose.model('User', userSchema);

