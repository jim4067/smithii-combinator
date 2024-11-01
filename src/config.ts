import "dotenv/config";
import { PinataSDK } from "pinata";

export const pinataJWT = process.env.PINATA_JWT;

export const pinataGateway = process.env.PINATA_GATEWAY;
