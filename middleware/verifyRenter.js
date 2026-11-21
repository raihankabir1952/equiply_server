const verifyRenter = (req, res, next) => {
    if (req.user.role !== "customer") {
        return res.status(403).json({
            message: "Access denied! Only customers can access favorites.",
        });
    }

    next();
};

export default verifyRenter;