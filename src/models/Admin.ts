import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "@/env";

interface IAdmin extends Document {
    email: string;
    password: string;
    createdAt: Date;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
}

const adminSchema: Schema<IAdmin> = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/.+\@.+\..+/, "Please use a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
    },
    { timestamps: true }
);

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d",
        }
    );
};

const AdminModel: Model<IAdmin> =
    (mongoose.models.Admin as Model<IAdmin>) ||
    mongoose.model<IAdmin>("Admin", adminSchema);

export default AdminModel;
