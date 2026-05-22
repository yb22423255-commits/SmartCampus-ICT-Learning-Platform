const User = require("../models/User");
const sanitizeUser = require("../utils/sanitizeUser");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "fullName", "email", "role"],
            order: [["id", "DESC"]]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const allowed = ["student", "lecturer", "admin"];

        if (!allowed.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        await user.save();

        res.json({
            message: "Role updated",
            user: sanitizeUser(user)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
