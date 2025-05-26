const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const todoSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Success", "Progress"]
        },
        title: {
            type: String,
            required: true,
            maxlength: 30
        },
        description: {
            type: String,
            required: true,
            maxlength: 200
        }
    },
    { timestamps: true, versionKey: false }
);
const todoModel = model("todo", todoSchema)
module.exports = todoModel
