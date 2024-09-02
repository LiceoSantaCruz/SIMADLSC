
export const Estadisticas = () => {
  return (
    <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Estadísticas del Colegio</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded shadow-sm">
                    <h3 className="text-xl font-semibold">Total Estudiantes</h3>
                    <p className="text-4xl">1000</p>
                </div>
                <div className="p-4 border rounded shadow-sm">
                    <h3 className="text-xl font-semibold">Hombres</h3>
                    <p className="text-4xl">480</p>
                    <p className="text-sm text-gray-500">48.0% del total</p>
                </div>
                <div className="p-4 border rounded shadow-sm">
                    <h3 className="text-xl font-semibold">Mujeres</h3>
                    <p className="text-4xl">520</p>
                    <p className="text-sm text-gray-500">52.0% del total</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Estadísticas Adicionales</h2>
            <div className="p-4 border rounded shadow-sm">
                <table className="min-w-full text-left">
                    <thead className="border-b">
                        <tr>
                            <th className="px-4 py-2">Categoría</th>
                            <th className="px-4 py-2">Hombres</th>
                            <th className="px-4 py-2">Mujeres</th>
                            <th className="px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="px-4 py-2">Becados</td>
                            <td className="px-4 py-2">45</td>
                            <td className="px-4 py-2">55</td>
                            <td className="px-4 py-2">100</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">Actividades Extracurriculares</td>
                            <td className="px-4 py-2">200</td>
                            <td className="px-4 py-2">250</td>
                            <td className="px-4 py-2">450</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Transporte Escolar</td>
                            <td className="px-4 py-2">150</td>
                            <td className="px-4 py-2">180</td>
                            <td className="px-4 py-2">330</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded shadow-sm">
                    <h3 className="text-xl font-semibold">Promedio de Notas</h3>
                    <p className="text-3xl">8.5 / 10</p>
                    <p className="text-sm text-gray-500">Hombres: 8.3 | Mujeres: 8.7</p>
                </div>
                <div className="p-4 border rounded shadow-sm">
                    <h3 className="text-xl font-semibold">Tasa de Asistencia</h3>
                    <p className="text-3xl">95%</p>
                    <p className="text-sm text-gray-500">Hombres: 94% | Mujeres: 96%</p>
                </div>
            </div>
        </div>
  )
}
