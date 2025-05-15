import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
});
const Permissions = mongoose.model("Permissions", permissionSchema);
export default Permissions;