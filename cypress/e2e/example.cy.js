describe('Example Test', () => {
    it('Visita la página principal', () => {
      // Visita la URL base definida en cypress.config.js
      cy.visit('/');
      
      // Verifica que exista algún texto
      cy.contains('React');
    });
  });
  