const verifyOwner = (req, res, next) => {
    if (req.user.role !== "owner") {
        return res.status(403).json({
            message: "Access denied! Only owners can add equipment.",
        });
    }

    next();
};

export default verifyOwner;