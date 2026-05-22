export const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
};

export const useAuth = () => {
    const user = getUser();

    return {
        user,
        isStudent: user?.role === "student",
        isLecturer: user?.role === "lecturer",
        isAdmin: user?.role === "admin",
        isStaff: user?.role === "lecturer" || user?.role === "admin"
    };
};
