export default function ProjetsE6() {
  return (
    <section className="missions_E5_section">
      <div className="missions_E5_container">
        <div className="section_title">
          <h2>
            <strong>Projets E6</strong>
          </h2>
          <p>
            Projets réalisés dans le cadre de l'épreuve E6 du BTS SIO, mettant en avant mes
            compétences en développement de solutions logicielles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="card-E5">
            <img className="card-E5-img" src="/img/photos/Portfolio.png" alt="Portfolio" />
            <div className="mission-badge school-badge">ÉCOLE</div>
            <div className="card-E5-body">
              <h5 className="card-E5-title">Portfolio</h5>
              <p className="card-E5-text">
                Création d'un portfolio personnel pour présenter mes compétences, projets et
                expériences professionnelles.
              </p>
              <div className="card-E5-icons">
                <div className="tech-icon">
                  <i className="devicon-html5-plain colored" />
                  <p>HTML5</p>
                </div>
                <div className="tech-icon">
                  <i className="devicon-css3-plain colored" />
                  <p>CSS3</p>
                </div>
                <div className="tech-icon">
                  <i className="devicon-javascript-plain colored" />
                  <p>JavaScript</p>
                </div>
                <div className="tech-icon">
                  <i className="devicon-bootstrap-plain colored" />
                  <p>Bootstrap</p>
                </div>
              </div>
              <div className="card-actions">
                <a href="#" className="btn-mission">
                  Documentation
                </a>
                <a href="#" className="btn-mission">
                  Github
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
