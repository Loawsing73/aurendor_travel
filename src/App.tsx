import './App.css'

function App() {
  return (
    <main>
      <div className="dashboard">
        <header className="block header">
          <h1>Suivi des déplacements</h1>
          <p>Période : 26/09/2019 - 24/07/2023</p>
        </header>

        <section className="block filters">
          <h2>Filtres</h2>
        </section>

        <article className="block kpi">
          <h2>Dépenses totales</h2>
        </article>
        <article className="block kpi">
          <h2>Nombre de vols</h2>
        </article>
        <article className="block kpi">
          <h2>Prix moyen</h2>
        </article>
        <article className="block kpi">
          <h2>Distance totale</h2>
        </article>

        <section className="block trend">
          <h2>Evolution mensuelle</h2>
        </section>
        <section className="block chart">
          <h2>Répartition par type de vol</h2>
        </section>
        <section className="block chart">
          <h2>Dépenses par agence</h2>
        </section>
        <section className="block chart">
          <h2>Top trajets</h2>
        </section>

        <section className="block table">
          <h2>Détails des vols</h2>
        </section>
      </div>
    </main>
  )
}

export default App