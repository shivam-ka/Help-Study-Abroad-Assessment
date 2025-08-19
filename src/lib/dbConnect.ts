import { env } from "@/env";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect() {
    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(
            `${env.MONGODB_URI}/Help-Study-Abroad-Assessment`
        );
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.error("Mongodb Connection Error", error);
        process.exit(1);
    }
}

export default dbConnect;
