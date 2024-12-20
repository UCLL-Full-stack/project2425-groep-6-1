import express, { NextFunction, Request, Response } from 'express';
import trainingSessionService from '../service/trainingSession.service';
import { Ploeg } from '../model/ploeg';
import { Zaal } from '../model/zaal';
import { TrainingSessionInput } from '../types';

const trainingSessionRouter = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     TrainingSession:
 *       type: object
 *       properties:
 *         ploeg:
 *           type: object
 *           properties:
 *             ploegnaam:
 *               type: string
 *               description: Naam van de ploeg.
 *         zaal:
 *           type: object
 *           properties:
 *             naam:
 *               type: string
 *               description: Naam van de zaal.
 *         datum:
 *           type: string
 *           format: date
 *           description: Datum van de trainingssessie.
 *         startTijd:
 *           type: string
 *           description: Starttijd van de trainingssessie.
 *         eindTijd:
 *           type: string
 *           description: Eindtijd van de trainingssessie.
 */

/**
 * @swagger
 * /training-sessions:
 *   get:
 *     summary: Retrieve all training sessions
 *     tags: [TrainingSession]
 *     responses:
 *       200:
 *         description: A list of training sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TrainingSession'
 *       500:
 *         description: Internal server error
 */
trainingSessionRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessions = await trainingSessionService.getAllTrainingSessions();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(400).json({ message: 'An unknown error occurred' });

    }
});

/**
 * @swagger
 * /training-sessions/{ploegnaam}:
 *   get:
 *     summary: Retrieve a training session by team name
 *     tags: [TrainingSession]
 *     parameters:
 *       - in: path
 *         name: ploegnaam
 *         required: true
 *         description: The name of the team to retrieve the training session
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A training session object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingSession'
 *       404:
 *         description: Training session not found
 *       500:
 *         description: Internal server error
 */
trainingSessionRouter.get('/:ploegnaam', async (req: Request, res: Response, next: NextFunction) => {
    const ploegnaam = req.params.ploegnaam; // Get the team name from the request parameters
    try {
        const session = await trainingSessionService.getTrainingSessionByPloegNaam(ploegnaam);
        if(session){
            res.status(200).json(session);
        }else{
            res.status(404).json({ message: 'Training session not found' });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /training-sessions:
 *   post:
 *     summary: Add a new training session
 *     tags: [TrainingSession]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrainingSession'
 *     responses:
 *       201:
 *         description: Training session successfully added
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
trainingSessionRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const { id, zaalNaam, datum, startTijd, eindTijd,ploegen } = req.body;

    // Log de ontvangen waarden om te controleren of ze correct zijn
    console.log('Ontvangen zaalnaam:', zaalNaam);
    console.log('Ontvangen datum:', datum);
    console.log('Ontvangen startTijd:', startTijd);
    console.log('Ontvangen eindTijd:', eindTijd);
    console.log('Ontvangen ploegen:', ploegen);

    try {
        const result = await trainingSessionService.addTrainingSession({
            id, 
            zaalNaam,
            datum: new Date(datum),
            startTijd,
            eindTijd,
            ploegen
        });
        if(result.trainingSession){
            res.status(201).json(result);
        }
        else{
            res.status(400).json( result.message);
        }
            
    } catch (error) {
        next(error);
        
    }
});

export { trainingSessionRouter };