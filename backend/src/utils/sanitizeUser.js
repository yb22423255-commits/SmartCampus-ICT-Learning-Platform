const sanitizeUser = (user) => {
    const data = user.toJSON ? user.toJSON() : { ...user };
    delete data.password;
    return data;
};

module.exports = sanitizeUser;
