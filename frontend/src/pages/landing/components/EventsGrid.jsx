import "./EventsGrid.css";

const EVENTS = [
  {
    id: "bodas",
    title: "Bodas y Aniversarios",
    description:
      "Espacios íntimos y elegantes para celebrar el amor con iluminación ambiental y un servicio pensado para cada detalle especial.",
    image: "bodas"
  },
  {
    id: "quince",
    title: "Fiestas de 15 Años",
    description:
      "Una fiesta inolvidable para tu gran día, con pista de baile, shows de luces neón y una ambientación mágica y moderna.",
    image: "quince"
  },
  {
    id: "cumpleanos",
    title: "Cumpleaños +40",
    description:
      "Viví tus mejores años en un salón con música, gastronomía y un clima festivo preparado para reunir a todos tus afectos.",
    image: "cumpleanos"
  }
];

function EventsGrid() {
  return (
    <section id="eventos" className="events-section">
      <div className="events-grid">
        {EVENTS.map((event) => (
          <article key={event.id} className="event-card">
            <div className={`event-thumb thumb-${event.image}`} aria-hidden="true" />
            <div className="event-body">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <a href="#reservas" className="event-link">
                Ver Detalles
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default EventsGrid;
