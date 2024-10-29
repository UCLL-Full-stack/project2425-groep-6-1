import { Speler } from './speler'; 

export class Ploeg {
    private niveau!: string;
    private ploegnaam!: string;
    private spelers: Speler[];

    constructor(niveau: string, ploegnaam: string, spelers: Speler[]) {
        this.setNiveau(niveau);
        this.setPloegnaam(ploegnaam);
        this.spelers = spelers; 
    }

    public getNiveau(): string {
        return this.niveau;
    }

    public getPloegnaam(): string {
        return this.ploegnaam;
    }

    public getSpelers(): Speler[] {
        return this.spelers;
    }

    public setNiveau(niveau: string) {
        if (!niveau || niveau.trim().length === 0) {
            throw new Error('Niveau is verplicht.');
        }
        this.niveau = niveau;
    }

    public setPloegnaam(ploegnaam: string) {
        if (!ploegnaam || ploegnaam.trim().length === 0) {
            throw new Error('Ploegnaam is verplicht.');
        }
        this.ploegnaam = ploegnaam;
    }

    public addSpeler(speler: Speler) {
        this.spelers.push(speler);
    }

    public removeSpeler(speler: Speler) {
        this.spelers = this.spelers.filter(s => s !== speler);
    }
}