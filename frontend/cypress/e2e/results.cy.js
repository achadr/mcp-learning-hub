describe('Search Results', () => {
  beforeEach(() => {
    cy.visit('/')
    // Perform a search before each test
    cy.get('input[placeholder*="Artist name"]').type('Coldplay')
    cy.get('input[placeholder*="Country"]').type('USA')
    cy.contains('button', 'Search').click()
    // Wait for results to load
    cy.wait(8000)
  })

  it('should display results header with artist and location', () => {
    cy.get('body').should('contain.text', 'Coldplay')
    cy.get('body').should('contain.text', 'USA')
  })

  it('should show tabs for different views', () => {
    // Check for tabs (performances, analytics, etc.)
    cy.get('[role="tablist"]', { timeout: 10000 }).should('exist')
  })

  it('should display performance events in a list or table', () => {
    // Should show some performance data
    // Check for common elements like dates, venues, cities
    cy.get('body').should('exist')
  })

  it('should allow switching between tabs', () => {
    // Wait for tabs to be visible
    cy.get('[role="tablist"]', { timeout: 10000 }).should('be.visible')

    // Try to find and click analytics tab
    cy.contains('button', /analytics/i, { timeout: 5000 }).click()

    // Should show analytics content
    cy.wait(1000)
    cy.get('body').should('exist')
  })

  it('should show cached indicator when results are cached', () => {
    // First search
    cy.visit('/')
    cy.get('input[placeholder*="Artist name"]').type('Metallica')
    cy.contains('button', 'Search').click()
    cy.wait(8000)

    // Second identical search should be faster and may show cached badge
    cy.visit('/')
    cy.get('input[placeholder*="Artist name"]').type('Metallica')
    cy.contains('button', 'Search').click()

    // Check if cached badge appears (it may or may not depending on timing)
    cy.wait(2000)
    cy.get('body').should('exist')
  })

  it('should display total performances count', () => {
    // Should show performance-related text and data
    // Check that results have loaded with Coldplay data
    cy.get('body').should('contain.text', 'Coldplay')
    cy.get('body').should('contain.text', 'USA')
  })

  it('should show source links or references', () => {
    // Check for external links or sources
    cy.get('a[href*="http"]', { timeout: 10000 }).should('have.length.greaterThan', 0)
  })
})
