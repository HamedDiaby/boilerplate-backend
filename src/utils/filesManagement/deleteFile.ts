import fs from 'fs';

export const deleteFile = async (fileUri: string) => {
  try {

    fs.unlinkSync(`${process.env.SOME_PATH}/${fileUri}`);

    return {
      code: 200,
      message: "Suppression effectuée avec succès !",
    };
  } catch (error) {
      
    console.error('Delete file error:', error);
    return {
      code: 500,
      message: 'Failed to delete file.',
    };
  }
};
  
