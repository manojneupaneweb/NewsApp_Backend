import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    bio: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "admin", "mainadmin"],
        default: "user"
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})


userSchema.methods.genereteAccessToken = async () => {
    const token = await jwt.sign({
        id: this._id,
        name: this.name,
        email: this.email,
        role: this.role
    }, process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });

    return token;
}
userSchema.methods.genereteRefreshToken = async () => {
    const token = await jwt.sign({
        id: this._id,
        name: this.name
    }, process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });

    return token;
}

export const User = mongoose.model('User', userSchema);