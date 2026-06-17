import Blog from "../model/blogmodel.js";
export async function getmyblog(req, resp) {
    try {
        const id = req.user.id;
        const data = await Blog.find({ writer: id }).populate("writer");
        if (!data) {
            return resp.status(400).json({
                message: "No Blog Found"
            })
        }

        resp.status(200).json({
            message: "Blog found succesfully",
            data: data
        })

    } catch (error) {
        resp.status(400).json({
            message: "error is " + error
        })
    }
}
export async function getallblog(req, resp) {
    try {
        const data = await Blog.find();
        if (!data) {
            return resp.status(400).json({
                message: "No blog Found",
            })
        }
        resp.status(200).json({
            message: "blog Found",
            Blog: data
        })
    } catch (error) {
        resp.status(400).json({
            message: "No blog Found",
            error: error
        })
    }
}
export async function getbyid(req, resp) {
    const id = req.params.id;
    const data = await Blog.findById(id);
    if (!data) {
        return resp.status(400).json({
            message: "No Blog Found of this id"
        })
    }
    resp.status(200).json({
        message: "Blog found succesfully",
        Blog: data

    })

}

export async function addBlog(req, resp) {
    try {
        const id = req.user.id;
        const { title, Subtitle, content } = req.body;
        const add = await Blog.create({
            writer: id,
            title: title,
            Subtitle: Subtitle,
            content: content,
        })
        resp.status(200).json({
            message: "Blog create succesfully",
            add: add
        })
    } catch (error) {
        resp.status(400).json({
            message: "error is " + error
        })
    }
}
export async function editBlog(req, resp) {
    try {
        const id = req.params.id;
        const { title, Subtitle, content } = req.body;
        const edit = await Blog.findByIdAndUpdate(id, {
            title: title,
            Subtitle: Subtitle,
            content: content
        }, { returnDocument: 'after' });
        resp.status(200).json({
            message: "edites succesfully",
            data: edit
        })
    } catch (error) {
        resp.status(400).json({
            message: "edites not succesfully" + error
        })
    }
}

export async function removeBlog(req, resp) {
    try {
        const id = req.params.id;
        const data = await Blog.findByIdAndDelete(id);
        if (!data) {
            return resp.status(400).json({
                message: "No Blog Found"
            })
        }
        resp.status(200).json({
            message: "Blog delete Succesfully",
            data: data
        })
    } catch (error) {

        resp.status(400).json({
            message: "message is " + error
        })
    }
}