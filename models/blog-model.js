const {Schema, model} = require("mongoose");

const blogSchema = new Schema({
    title: { type: String, required: true},
    image: { type: String, required: true},
    thumbnail_image: {type: String,required: true},
    category: { type: String},
    shortDescription: { type: String, required: true},
    description: { type: String, required: true},
    status: { type: String, enum: ["Active", "Inactive", "Pending"], default: "active",},
    author: { type: String, default:"Admin" },
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false,},
})

// create a model or collection
const Blog = new model("Blog", blogSchema);

module.exports = Blog;