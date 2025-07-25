

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

const findAllTodo = async (req, res) => {
    try {
        const todos = await todoModel
            .find()
            .sort({ createdAt: -1 }) // Sort by latest
            .populate("userId", "name"); // Join with user name

        res.status(200).json({
            status: "success",
            mes: "All todo fetch successfully",
            data: todos
        });
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


const todoByUser = async (req, res) => {
    try {
        const id = req.headers.id;
        const search = req.query.search?.toLowerCase() || "";


        const filter = {
            userId: id,
            $or: [
                { title: { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } },
            ],
        };

        const data = await todoModel
            .find(filter)
            .sort({ createdAt: -1 })
            .populate("userId", "name");
        return res.status(200).json({
            status: "success",
            data,
            msg: "User task find by successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            msg: "Something went wrong",
        });
    }
};


const todoStatusUpdate = async (req, res) => {
    try {
        const userId = req.headers.id;        // from headers
        const status = req.body.status;       // new status
        const todoId = req.params.id;         // from URL

        const filter = {
            userId: userId,
            _id: todoId,
        };

        const updateTodo = await todoModel.findOneAndUpdate(
            filter,
            { status },
            { new: true } // return updated document
        );

        if (!updateTodo) {
            return res.status(404).json({
                status: "fail",
                msg: "Todo not found or unauthorized",
            });
        }

        return res.status(200).json({
            status: "success",
            msg: "Todo status updated successfully",
            data: updateTodo,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "fail",
            msg: "Something went wrong",
        });
    }
};


module.exports = {
    createTodo,
    findAllTodo,
    todoByUser,
    todoStatusUpdate
}