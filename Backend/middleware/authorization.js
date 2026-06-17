export default function authorization(...roles) {
    return (req, res, next) => {
        const user = req.user?.role; // Example: "writer"
        
        // FIX: Check if the array 'roles' includes the string 'user'
        if (user && roles.includes(user)) { 
            next();
        } else {
            res.status(403).json({
                message: "you are not allowed to visit that"
            });
        }
    };
}