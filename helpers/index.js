const isSeller = (userId, realEstateUserId) => {
    return userId === realEstateUserId;
};

export {
    isSeller
}