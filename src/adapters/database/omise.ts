import Omise from "omise";
import dotenv from "dotenv";
dotenv.config();

const secretKey: string = process.env.OMISE_SECRET_KEY as string;
const publicKey: string = process.env.OMISE_PUBLIC_KEY as string;


const omise = Omise({
    secretKey: secretKey,
    publicKey: publicKey
});

export default omise;