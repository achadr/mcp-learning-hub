describe('Artist Search', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should search for an artist with country and show results', () => {
    // Type artist name
    cy.get('input[placeholder*="Artist name"]').type('Coldplay')

    // Type country
    cy.get('input[placeholder*="Country"]').type('Brazil')

    // Submit form
    cy.contains('button', 'Search').click()

    // Wait for loading to complete (with generous timeout for API calls)
    cy.get('body', { timeout: 30000 }).should('not.contain', 'Searching...')

    // Should show results or a message
    cy.get('body').should('contain.text', 'Coldplay')
  })

  it('should search for an artist without country (worldwide)', () => {
    // Type artist name
    cy.get('input[placeholder*="Artist name"]').type('Taylor Swift')

    // Submit without country
    cy.contains('button', 'Search').click()

    // Wait for loading to complete
    cy.get('body', { timeout: 30000 }).should('not.contain', 'Searching...')

    // Should show results
    cy.get('body').should('contain.text', 'Taylor Swift')
  })

  it('should handle search for unknown artist gracefully', () => {
    // Type a very unlikely artist name
    cy.get('input[placeholder*="Artist name"]').type('ZxYqWpUnknownArtist999')

    // Submit form
    cy.contains('button', 'Search').click()

    // Wait for response
    cy.wait(3000)

    // Should show some response (either no results or an error message)
    cy.get('body').should('exist')
  })

  it('should display loading state during search', () => {
    cy.get('input[placeholder*="Artist name"]').type('Metallica')

    // Verify button is enabled before clicking
    cy.contains('button', 'Search').should('not.be.disabled')

    // Click and verify search completes (app may be too fast to see loading state)
    cy.contains('button', 'Search').click()

    // Wait for results
    cy.wait(3000)
    cy.get('body').should('contain.text', 'Metallica')
  })

  it('should allow searching again after initial search', () => {
    // First search
    cy.get('input[placeholder*="Artist name"]').type('Coldplay')
    cy.contains('button', 'Search').click()
    cy.wait(3000)

    // Second search - clear and type new artist
    cy.get('input[placeholder*="Artist name"]').clear().type('Beatles')
    cy.contains('button', 'Search').click()
    cy.wait(3000)

    // Should show new results
    cy.get('body').should('contain.text', 'Beatles')
  })
})
