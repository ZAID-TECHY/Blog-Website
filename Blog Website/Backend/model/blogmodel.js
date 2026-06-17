import mongoose from "mongoose";
const BlogSchema = new mongoose.Schema({
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title:{
        type : String,
        required : true
    },
    Subtitle:{
        type : String,
        required : true
    },
    content:{
        type : String,
        required : true
    },
} ,{ timestamps: true })
const Blog = mongoose.model("Blogs",BlogSchema)
export default Blog;