import { Response } from "express";

export const returnError = (res:Response, error: any)=> {
    // console.error(error);
    const errorMessage = error.message || error;
    res.status(500).json({ error: `Internal Server Error : ${errorMessage}` });
}
