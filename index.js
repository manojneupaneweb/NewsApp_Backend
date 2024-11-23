import { app } from './app.js'; 
import dotenv from 'dotenv';
import { connectDB } from './DataBase/db.js'; 

dotenv.config({
    path: './env' 
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server listening on port: ", process.env.PORT || 3000);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1); // Exit process on failure
    });
