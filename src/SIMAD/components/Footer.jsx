
export const Footer = () => {
  return (
    <div>
              {/* Footer */}
      <footer className="bg-blue-900 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <p>© 2024 Liceo Santa Cruz. Todos los derechos reservados.</p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="hover:text-red-600">Facebook</a> {/* Rojo para enlaces hover */}
            <a href="https://twitter.com" className="hover:text-red-600">Twitter</a>
            <a href="https://instagram.com" className="hover:text-red-600">Instagram</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
