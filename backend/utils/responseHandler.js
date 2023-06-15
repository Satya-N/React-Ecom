const successResponse = ( message, data=null ) => {
    return data ?  { success: true, message, ...data } : { success: true, message };
}
const errorResponse = ( message, data=null ) => {
    return data ?  { success: false, message, ...data } : { success: false, message };
}

module.exports = {
    successResponse,
    errorResponse
}