const verifyAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied! Only admins can access this resource.",
        });
    }

    next();
};

export default verifyAdmin;