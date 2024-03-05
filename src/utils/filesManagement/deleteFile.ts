import { cloudinary } from '@configs';

export const deleteFile = async (public_id: string) => {
    try {
      const result = await cloudinary.uploader.destroy(public_id);
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
  
