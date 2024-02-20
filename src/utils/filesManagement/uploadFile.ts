import { v4 as UUID } from 'uuid';
import fs from 'fs';
import cloudinary from '../../configs/cloudinaryConfig';

export const uploadFile = async(
    myFile: any,
    dirName: string
)=> {
    try {
        
        let uploadedFileUrl:string = '';
        let uploadedFile_public_id:string = '';

        const myFilePath = './tmp/'+UUID()+'.jpg';
        let myFileExist:any;

        if (myFile) {
            if (!Array.isArray(myFile)) {
                myFileExist = await myFile.mv(myFilePath);
            } else {
                return {
                    code: 500,
                    error: "Plusieurs fichiers sont envoyés sous le même nom de champ 'myFile'.",
                };
            }
        } else {
            return {
                code: 500,
                error: 'Fichier introuvable !',
            };
        }      

        if(!myFileExist){
            cloudinary.uploader.upload(myFilePath, {folder: `${dirName}/`})
            .then(resultCloudinary => {
                fs.unlinkSync(myFilePath);//supprime l'image du backend;
            
                uploadedFileUrl = resultCloudinary.url;
                uploadedFile_public_id = resultCloudinary.public_id;
            })
            .catch((error: any)=> {
                return {
                    code: 500,
                    error: error.message,
                };
            });
        };

        return {
            code: 200,
            result: {
                uploadedFileUrl, 
                uploadedFile_public_id,
            }
        }

    } catch (error: any) {
        return {
            code: 500,
            error: error.message,
        };
    }
}
