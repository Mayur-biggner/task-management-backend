import mongoose from "mongoose";

const roleHasPermissionsSchema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles',
        required: true,
    },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permissions',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
roleHasPermissionsSchema.index({ role: 1, permission: 1 });
const RoleHasPermissions = mongoose.model("RoleHasPermissions", roleHasPermissionsSchema);
export default RoleHasPermissions;