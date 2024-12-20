import { PrismaClient } from '@prisma/client';
import { Coach } from '../model/coach';
import { Ploeg } from '../model/ploeg';
import { Speler } from '../model/speler';

const prisma = new PrismaClient();

// Functie om een coach op naam op te halen
const getCoachByNaam = async (coachnaam: string): Promise<Coach | null> => {
    try {
        const coachPrisma = await prisma.coach.findFirst({
            where: {
                naam: coachnaam,
            },
        });
        return coachPrisma ? Coach.from(coachPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

// Functie om alle coaches op te halen
const getAllCoaches = async (): Promise<Coach[]> => {
    try {
        const coachPrisma = await prisma.coach.findMany();
        return coachPrisma.map((coachPrisma) => Coach.from(coachPrisma));
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server log for details.');
    }
};



// Functie om een ploeg toe te voegen
const addPloeg = async (ploeg: { ploegnaam: string; niveau: string; coachLicentie?: string | null }): Promise<Ploeg> => {
    try {
        const newPloegPrisma = await prisma.ploeg.create({
            data: {
                ploegnaam: ploeg.ploegnaam,
                niveau: ploeg.niveau,
                coachLicentie: ploeg.coachLicentie || null,
            },
        });
        return Ploeg.from(newPloegPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};





// Functie om een ploeg op naam op te halen
const getPloegByNaam = async (ploegnaam: string): Promise<Ploeg | null> => {
    const ploeg = await prisma.ploeg.findUnique({
            where: {ploegnaam}
        });
        return ploeg ? Ploeg.from(ploeg) : null;
 
};

// Functie om alle ploegen op te halen
const getAllPloegen = async (): Promise<Ploeg[]> => {
    try {
        const ploegPrisma = await prisma.ploeg.findMany();
        return ploegPrisma.map((ploegPrisma) => Ploeg.from(ploegPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const verwijderPloeg = async (ploegnaam: string): Promise<Ploeg | null> => {
    try {
        // Verwijder de ploeg
        const ploeg = await prisma.ploeg.delete({
            where: { ploegnaam: ploegnaam },
        });
        console.log(`Ploeg ${ploegnaam} verwijderd.`);
        return ploeg? new Ploeg(ploeg): null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. Zie serverlog voor details.');
    }
};

// Functie om een ploeg bij te werken
const updatePloeg = async (ploegnaam: string, ploegData: Partial<Ploeg>): Promise<Ploeg> => {
    try {

        if(ploegData.coachLicentie) {
            const coachExists = await prisma.coach.findUnique({
                where: { coachLicentie: ploegData.coachLicentie },
            });
            if (!coachExists) {
                throw new Error(`Coach with licentie ${ploegData.coachLicentie} does not exist`);
            }
        }


        const updatedPloegPrisma = await prisma.ploeg.update({
            where: { ploegnaam: ploegnaam },
            data: {
                niveau: ploegData.niveau,
                coachLicentie: ploegData.coachLicentie || null,
            },
        });
        return Ploeg.from(updatedPloegPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getPloegByCoachLicentie = async (coachLicentie: string): Promise<Ploeg | null> => {
   try {
     const ploeg = await prisma.ploeg.findFirst({
         where: { coachLicentie },
     });
     return ploeg ? Ploeg.from(ploeg) : null;
   } catch (error) {
        throw new Error('Database error. See server log for details.');

    
   }
}


export default {
    getCoachByNaam,
    getAllCoaches,
    addPloeg,
    updatePloeg,
    getPloegByNaam,
    getAllPloegen,
    verwijderPloeg,
    getPloegByCoachLicentie
};