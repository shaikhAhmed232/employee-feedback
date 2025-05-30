exports.DB_CRED = {
    database: process.env.DATABASE || "employee_feedback_portal",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "27017",
    username: process.env.username,
    password: process.env.password,
    type: process.env.DB_TYPE || "mongodb"
}
