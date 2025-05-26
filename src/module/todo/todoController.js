

const todoModel = require("./todoModel");

const createTodo = async (req, res) => {
    const id = req.headers.id;
    try {
        const { title, description } = req.body;
        if (!title || !description) return res.status(400).json({
            status: "fail",
            msg: "Please enter your todo title and description"
        });

        const payload = {
            userId: id,
            title: title,
            description: description
        };

        const data = await todoModel.create(payload);
        return res.status(201).json({
            status: "success",
            msg: "Todo create successfully",
            data: data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "fail",
            msg: "Something went wrong"
        });
    }
};


module.exports = {
    createTodo
}