const app = require('./app')

const connectDatabase = require('./config/database')

//setiing up config file
if(process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({path: 'backend/config/config.env' })

//Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log(('Shutting down server due to uncaught exceptions'));
    process.exit(1);
})

//connecting to database
connectDatabase();

app.listen(process.env.PORT || 5000, ()  =>{
        console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
    }
)

// Handle unhandled promise rejections
process.on('unhandledRejection', err =>{
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down server due to unhandled promise rejections');
    server.close(()=>{
        process.exit(1);
    })
})