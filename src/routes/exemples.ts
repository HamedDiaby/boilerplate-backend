import {
    Router, 
    Request, 
    Response, 
    NextFunction,
} from 'express';
import { v4 as UUID } from 'uuid';

import { DB } from '../configs/dbConfigs/config';
import { 
    returnError,
    uploadFile,
    deleteFile,
} from '../utils';

const router = Router();

const types = {
    COLLECTION_NAME: 'items',
    ROUTE_NAME: '/api-exemple-route',
    ROUTE_NAME_WITH_ID_PARAM: '/api-exemple-route/:_id',
    ROUTE_NAME_STATUS: '/api-exemple-route-filter-by-status',
    ROUTE_NAME_UPLOAD_FILE: '/api-exemple-upload-file-route',
    ROUTE_NAME_DELETE_FILE: '/api-exemple-delete-file-route',
};

/* GET exemple listing. */
router.get('/', (req: Request, res: Response, next: NextFunction)=> {
    res.status(200).json('exemple');
});

// Pour créer un nouveau document dans une collection
/**
 * @swagger
 * /exemples/api-exemple-route:
 *   post:
 *     summary: Crée un nouvel élément
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: L'élément a été créé avec succès
 *       500:
 *         description: Erreur de création de l'élément
 */
router.post(`${types.ROUTE_NAME}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const id = UUID(); 
    
        data._id = id;
        
        await DB.collection(types.COLLECTION_NAME).doc(id).set(data);
    
        res.status(201).json(`Created a new item with ID: ${id}`);
    } catch (error: any) {
        returnError(res, error.message);
    }
});  

// Pour lire un document spécifique par ID
/**
 * @swagger
 * /exemples/api-exemple-route/{_id}:
 *   get:
 *     summary: Récupère un élément par son ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'élément
 *     responses:
 *       200:
 *         description: Les détails de l'élément
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Élément non trouvé
 */
router.get(`${types.ROUTE_NAME_WITH_ID_PARAM}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const docId = req.params._id;

      const doc = await DB.collection(types.COLLECTION_NAME).doc(docId).get();
      if (!doc.exists) {
        returnError(res, 'Item not found');
      } else {
        res.status(200).json(doc.data());
      }
    } catch (error: any) {
        returnError(res, error.message);
    }
});

// Pour lister tous les documents d'une collection
/**
 * @swagger
 * /exemples/api-exemple-route:
 *   get:
 *     summary: Liste tous les éléments
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: La liste de tous les éléments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get(`${types.ROUTE_NAME}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const querySnapshot = await DB.collection(types.COLLECTION_NAME).get();
        const items:any[] = [];
        
        querySnapshot.forEach(doc => {
            items.push({ ...doc.data() });
        });

        res.status(200).json(items);
    } catch (error: any) {
        returnError(res, error.message);
    }
});  

// Pour lister tous les documents d'une collection Firestore en utilisant une condition
/**
 * @swagger
 * /exemples/api-exemple-route-filter-by-status:
 *   get:
 *     summary: Liste tous les éléments filtrés par statut
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Statut de l'élément pour filtrer
 *     responses:
 *       200:
 *         description: La liste des éléments filtrés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       404:
 *         description: Aucun élément correspondant trouvé
 */
router.get(`${types.ROUTE_NAME_STATUS}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const status = req.query.status;

        const itemsRef = DB.collection(types.COLLECTION_NAME);
        const snapshot = await itemsRef.where('status', '==', status).get();
        
        if (snapshot.empty) {
            returnError(res, 'No matching documents.');
            return;
        }
    
        const items:any[] = [];
        snapshot.forEach(doc => {
            items.push({ ...doc.data() });
        });
    
        res.status(200).json(items);
    } catch (error: any) {
        returnError(res, error.message);
    }
});  

// Pour mettre à jour un document existant
/**
 * @swagger
 * /exemples/api-exemple-route:
 *   put:
 *     summary: Met à jour un élément par son ID
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: L'élément a été mis à jour
 *       500:
 *         description: Erreur de mise à jour de l'élément
 */
router.put(`${types.ROUTE_NAME}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      await DB.collection(types.COLLECTION_NAME).doc(data._id).update(data);

      res.status(200).json(`Updated item: ${data._id}`);
    } catch (error: any) {
      returnError(res, error.message);
    }
});  

// Pour supprimer un document 
/**
 * @swagger
 * /exemples/api-exemple-route:
 *   delete:
 *     summary: Supprime un élément par son ID
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: L'ID de l'élément à supprimer
 *     responses:
 *       200:
 *         description: L'élément a été supprimé
 *       500:
 *         description: Erreur de suppression de l'élément
 */
router.delete(`${types.ROUTE_NAME}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const docId = req.body._id;

      await DB.collection(types.COLLECTION_NAME).doc(docId).delete();

      res.status(200).json(`Deleted item: ${docId}`);
    } catch (error: any) {
      returnError(res, error.message);
    }
});  

// Pour ajouter un fichier
/**
 * @swagger
 * /exemples/api-exemple-upload-file-route:
 *   post:
 *     summary: Ajoute un fichier
 *     tags: [Fichiers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               myFile:
 *                 type: string
 *                 format: binary
 *                 description: Fichier à uploader.
 *     responses:
 *       200:
 *         description: Le fichier a été ajouté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploadedFileUrl:
 *                   type: string
 *                   description: URL du fichier uploadé sur Cloudinary.
 *                 uploadedFile_public_id:
 *                   type: string
 *                   description: ID public du fichier sur Cloudinary.
 *       500:
 *         description: Erreur lors de l'ajout du fichier.
 */
router.post(`${types.ROUTE_NAME_UPLOAD_FILE}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const myFile = req.files?.myFile;
        const dirName = 'dossier-de-stockage-sur-cloudinary';
        const response = await uploadFile(myFile, dirName);
        
        if(response.code === 500){
            returnError(res, response.error);
        }

        res.status(200).json(response.result);

    } catch (error: any) {
        returnError(res, error.message);
    }
});

// Pour supprimer un fichier
/**
 * @swagger
 * /exemples/api-exemple-delete-file-route:
 *   delete:
 *     summary: Supprime un fichier
 *     tags: [Fichiers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               public_id:
 *                 type: string
 *                 description: ID public du fichier à supprimer sur Cloudinary.
 *     responses:
 *       200:
 *         description: Fichier supprimé avec succès.
 *       500:
 *         description: Erreur lors de la suppression du fichier.
 */
router.delete(`${types.ROUTE_NAME_DELETE_FILE}`, async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const response = await deleteFile(req.body.public_id);

        if(response.code === 500){
            returnError(res, response.message);
        }

        res.status(response.code).json("fichier supprimer !");

    } catch (error: any) {
        returnError(res, error.message);
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID de l'élément
 *         name:
 *           type: string
 *           description: Le nom de l'élément
 *         status:
 *           type: string
 *           description: Le statut de l'élément
 *       example:
 *         _id: uuid
 *         name: Nom de l'élément
 *         status: actif
 */

export default router;
