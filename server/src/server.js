const express = require("express");
const cors = require("cors");
const {errorHandler} = require("./middlewares");
const { httpStatusCode } = require("./utils/constants");
const router = require("./routes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.use(errorHandler);
app.all("*", (req, res) => {
    res.status(httpStatusCode.NOT_FOUND)
        .json({
            message: `${req.url} invalid url`
        })
});




function startApp () {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = startApp;


