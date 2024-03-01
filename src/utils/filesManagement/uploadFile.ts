import { v4 as UUID } from 'uuid';
import fs from 'fs';
import path from 'path';
import cloudinary from '../../configs/cloudinaryConfig';

export const uploadFile = async (myFile: any, dirName: string) => {
  try {
    const myFilePath = path.join('./tmp', `${UUID()}.jpg`);
    
    // Assurer la création du dossier tmp s'il n'existe pas
    if (!fs.existsSync('./tmp')) {
      fs.mkdirSync('./tmp');
    }

    // Enregistrer le fichier temporairement
    await fs.promises.writeFile(myFilePath, myFile.buffer);

    const resultCloudinary = await cloudinary.uploader.upload(myFilePath, {
      folder: `${dirName}/`,
    });

    // Supprimer le fichier temporaire après l'upload
    await fs.promises.unlink(myFilePath);

    return {
      code: 200,
      result: {
        uploadedFileUrl: resultCloudinary.url,
        uploadedFile_public_id: resultCloudinary.public_id,
      },
    };
  } catch (error) {
    console.error('Upload file error:', error);
    
    return {
      code: 500,
      error: 'Failed to upload file.',
    };
  }
};
