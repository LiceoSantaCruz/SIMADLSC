
export const EventList = () => {
    // Este es un ejemplo básico, puedes reemplazarlo con datos dinámicos
    const events = [
        { id: 1, title: "Evento de Bienvenida", date: "2024-09-15" },
        { id: 2, title: "Conferencia sobre Educación", date: "2024-10-20" },
        { id: 3, title: "Día del Deporte", date: "2024-11-05" }
    ];

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Próximos Eventos</h2>
            <ul>
                {events.map(event => (
                    <li key={event.id} className="mb-2 p-4 border rounded shadow-sm">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-500">{event.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
