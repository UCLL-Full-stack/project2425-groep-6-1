import ploegDb from "../repository/ploeg.db"; 
import { Ploeg } from "../model/ploeg"; 
import { Speler } from "../model/speler";
import spelerDb from "../repository/speler.db";
import spelerService from "./speler.service";

// Functie om alle ploegen op te halen
const getAllPloegen = (): Ploeg[] => {
    return ploegDb.getAllPloegen();
}

// Functie om een ploeg op naam op te halen
const getPloegByNaam = (ploegnaam: string): Ploeg | null => {
    const ploeg = ploegDb.getPloegByNaam({ ploegnaam });

    if (ploeg == null) {
        throw new Error('Deze ploeg kan niet gevonden worden');
    } else {
        return ploeg;
    }
}

const getSpelersInPloeg = (ploegnaam: string):Speler[]=>{
    return ploegDb.getSpelersInPloeg({ploegnaam});
}

// Functie om een ploeg toe te voegen
const addPloeg = (ploeg: Ploeg): string => {
    ploegDb.addPloeg(ploeg);
    return "Ploeg succesvol toegevoegd";
}
//funtie om speler toe te voegen aan ploeg

const addSpelerToPloeg = (ploegnaam: string, spelerslicentie: string) => {
    console.log(`Zoeken naar ploeg: ${ploegnaam}`);
    const ploeg = ploegDb.getPloegByNaam({ ploegnaam });
    console.log(`Gevonden ploeg: ${ploeg}`);

    console.log(`Zoeken naar speler met licentie: ${spelerslicentie}`);
    const speler = spelerService.getSpelerByLicentie(spelerslicentie);
    console.log(`Gevonden speler: ${speler}`);

    if (!ploeg) {
        throw new Error('Ploeg niet gevonden');
    }
    if (!speler) {
        throw new Error('Speler niet gevonden');
    }

    // Controleer of de speler al in de ploeg zit
    const spelerAlInPloeg = ploeg.spelers.some(existingSpeler => existingSpeler.getSpelerlicentie() === spelerslicentie);
    if (spelerAlInPloeg) {
        throw new Error('Speler is al toegevoegd aan deze ploeg');
    }

    // Controleer of de speler al in een andere ploeg speelt
    const allePloegen = ploegDb.getAllPloegen(); // Veronderstel dat je een functie hebt om alle ploegen op te halen
    const anderePloeg = allePloegen.find(anderPloeg => 
        anderPloeg.spelers.some(existingSpeler => existingSpeler.getSpelerlicentie() === spelerslicentie)
    );

    if (anderePloeg && anderePloeg.getPloegnaam() !== ploegnaam) {
        throw new Error(`De speler ${speler.getNaam()} speelt al in de ploeg ${anderePloeg.getPloegnaam()}`);
    }

    ploeg.spelers.push(speler); 
    return ploeg; 
};


// Exporteer de functies
export default {
    getAllPloegen,
    getPloegByNaam,
    addPloeg,
    getSpelersInPloeg,
    addSpelerToPloeg
}