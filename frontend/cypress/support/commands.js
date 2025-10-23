// Custom Cypress commands

/**
 * Custom command to search for an artist
 */
Cypress.Commands.add('searchArtist', (artistName, country = '') => {
  cy.get('input[placeholder*="Artist name"]').clear().type(artistName)
  if (country) {
    cy.get('input[placeholder*="Country"]').clear().type(country)
  }
  cy.contains('button', 'Search').click()
})

/**
 * Custom command to wait for results to load
 */
Cypress.Commands.add('waitForResults', () => {
  cy.get('body', { timeout: 30000 }).should('not.contain', 'Searching...')
})

/**
 * Custom command to check if performance results are shown
 */
Cypress.Commands.add('shouldShowPerformances', () => {
  cy.get('h2').should('contain', 'Yes!')
  cy.get('.bg-gradient-to-br').should('be.visible')
})

/**
 * Custom command to intercept API calls
 */
Cypress.Commands.add('mockAPIResponse', (artist, country, fixture) => {
  cy.intercept('GET', `**/api/performances*`, {
    fixture: fixture
  }).as('getPerformances')
})
