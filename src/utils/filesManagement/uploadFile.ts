import { v4 as UUID } from 'uuid';
import path from 'path';

export const uploadFile = async (fileToUpload: any, fileDir: string) => {
  try {
    const absoluteFileDir = `${process.env.SOME_PATH!}/${fileDir}/`;
    const fileName = `origin_${UUID()}.jpg`;
    const myFilePath = path.join(absoluteFileDir, fileName);

    fileToUpload.mv(myFilePath, (err: any) => {
      if(err){
        return {
          code: 500,
          error: 'Failed to upload file.',
        };
      }
    });

    return {
      code: 200,
      fileName,
    };

  } catch (error) {
    console.error('Upload file error:', error);
    
    return {
      code: 500,
      error: 'Failed to upload file.',
    };
  }
};
