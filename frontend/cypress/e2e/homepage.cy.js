describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the homepage with search form', () => {
    // Check main heading
    cy.contains('h1', 'Performance History').should('be.visible')

    // Check search form elements
    cy.get('input[placeholder*="Artist name"]').should('be.visible')
    cy.get('input[placeholder*="Country"]').should('be.visible')
    cy.contains('button', 'Search').should('be.visible')
  })

  it('should show validation message when submitting empty form', () => {
    // Search button should be disabled when artist field is empty
    cy.contains('button', 'Search').should('be.disabled')
  })

  it('should have proper page title and meta information', () => {
    cy.title().should('not.be.empty')
  })

  it('should display features or information about the app', () => {
    // Check that the page has content
    cy.get('body').should('contain.text', 'Track musicians across the globe')
  })
})
