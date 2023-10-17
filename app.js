const { config } = require("dotenv");
const app = require("./server");
const userRoutes = require("./routes/UserRoutes");
const { ErrorMiddleware } = require("./middleware/Error");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
config();


app.use('/api/v1', userRoutes);


app.listen(process.env.PORT , ()=>{
    console.log("server is working on ",process.env.PORT  )
})


app.use(ErrorMiddleware)