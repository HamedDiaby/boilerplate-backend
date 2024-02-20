import { v4 as UUID } from 'uuid';
import fs from 'fs';
import cloudinary from '../../configs/cloudinaryConfig';

export const deleteFile = async(
    public_id: string
)=> {

    return cloudinary.uploader.destroy(public_id)
        .then(result => {
            return {
                code: 200,
                message: "SUppression effectué avec succès !",
                // result,
            };
        })
        .catch(error => {
            return {
                code: 500,
                message: error,
            };
        });
    
}
