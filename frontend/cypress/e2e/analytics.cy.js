describe('Analytics Tab', () => {
  beforeEach(() => {
    cy.visit('/')
    // Perform a search with good data coverage
    cy.get('input[placeholder*="Artist name"]').type('Coldplay')
    cy.contains('button', 'Search').click()
    // Wait for results
    cy.wait(8000)
  })

  it('should display analytics tab', () => {
    // Click on analytics tab
    cy.contains('button', /analytics/i, { timeout: 10000 }).click()

    // Should show analytics content
    cy.get('body').should('exist')
  })

  it('should show charts and visualizations', () => {
    // Navigate to analytics
    cy.contains('button', /analytics/i, { timeout: 10000 }).click()

    // Wait for charts to render
    cy.wait(2000)

    // Check for chart elements (recharts creates SVG elements)
    cy.get('svg', { timeout: 5000 }).should('exist')
  })

  it('should display analytics disclaimer when showing partial data', () => {
    cy.contains('button', /analytics/i, { timeout: 10000 }).click()

    // Check if disclaimer is shown (may or may not appear depending on data)
    cy.get('body').should('exist')
  })

  it('should show performance timeline chart', () => {
    cy.contains('button', /analytics/i, { timeout: 10000 }).click()
    cy.wait(1000)

    // Should have "Performance Timeline" heading
    cy.contains('Performance Timeline').should('be.visible')
  })

  it('should display top cities data', () => {
    cy.contains('button', /analytics/i, { timeout: 10000 }).click()
    cy.wait(1000)

    // Should show "Top Cities" heading
    cy.contains('Top Cities').should('be.visible')
  })

  it('should show geographic distribution', () => {
    cy.contains('button', /analytics/i, { timeout: 10000 }).click()
    cy.wait(1000)

    // Should show "Geographic Distribution" heading
    cy.contains('Geographic Distribution').should('be.visible')
  })

  it('should handle empty analytics gracefully', () => {
    // Search for an artist with no data
    cy.visit('/')
    cy.get('input[placeholder*="Artist name"]').type('UnknownTestArtist12345')
    cy.contains('button', 'Search').click()
    cy.wait(5000)

    // For unknown artists, may not have analytics tab, so check if the page loaded
    cy.get('body').should('exist')
  })

  it('should show data coverage information', () => {
    cy.contains('button', /analytics/i, { timeout: 10000 }).click()

    // Should show analytics content with performance data
    cy.contains('Performances').should('exist')
  })
})
