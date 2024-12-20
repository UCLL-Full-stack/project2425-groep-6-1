import React, { useEffect, useState } from "react";
import { Speler, Coach } from "@/types";
import Header from "@/components/header";
import SpelersOvervieuwTable from "@/components/spelers/SpelersOverviewTable";
import SpelerService from "@/services/SpelerService";
import AddSpeler from "@/components/spelers/AddSpeler";
import DeleteSpeler from "@/components/spelers/DeleteSpeler";
import UpdateSpeler from "@/components/spelers/UpdateSpeler";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Spelers: React.FC = () => {
    const [newSpeler, setNewSpeler] = useState<Speler>({ naam: "", spelerLicentie:"", leeftijd:0, ploegNaam:"" })
    const [spelers, setSpelers] = useState<Array<Speler>>([]);
    const [error, setError] = useState<string | null>(null);

    const getSpelers = async () => {
        const response = await SpelerService.getAllSpelers();
        const spelerss = await response.json();
        setSpelers(spelerss);
    };

    const handleSpelerAdded = (speler: Speler) => {
            setSpelers(prevSpelers => [...prevSpelers, speler]);
    };

    const handleSpelerDeleted = (spelerLicentie: string) => {
        setSpelers(prevSpelers => prevSpelers.filter(speler => speler.spelerLicentie !== spelerLicentie));
    };

    const handleSpelerUpdated = (updatedSpeler: Speler) => {
            setSpelers(prevSpelers => prevSpelers.map(speler => speler.spelerLicentie === updatedSpeler.spelerLicentie ? updatedSpeler : speler));
    };
    
    useEffect(() => {
        getSpelers();
        
    }, []);


    return (
        <>
            <Head>
                <title>Spelers en Coaches</title>
            </Head>
            <Header />
            
            {error && <p className={styles.error}>{error}</p>}

            <main className="d-flex flex-column justify-content-center align-items-center">
                <h1 className={styles.tabletitle}>Spelers</h1>
                <section className={styles.tables}>
                    {spelers && <SpelersOvervieuwTable spelers={spelers} />}
                </section>
                <section className={styles.formcontainer}>
                    <h3>Voeg een nieuwe speler toe</h3>
                    <AddSpeler onSpelerAdded={handleSpelerAdded} ploegen={[]} />
                </section>
                <section className={styles.formcontainer}>
                    <h3>Verwijder een speler</h3>
                    <DeleteSpeler onSpelerDeleted={handleSpelerDeleted} spelers={spelers} />
                </section>
                <section className={styles.formcontainer}>
                    <h3>Update een speler</h3>
                    <UpdateSpeler onSpelerUpdated={handleSpelerUpdated} spelers={spelers} ploegen={[]} />
                </section>
             
            </main>
        </>
    );
};

export const getServerSideProps = async (context: { locale: any; }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default Spelers;