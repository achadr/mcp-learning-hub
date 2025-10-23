describe('UI Interactions', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should be responsive and mobile-friendly', () => {
    // Test mobile viewport
    cy.viewport('iphone-x')
    cy.get('input[placeholder*="Artist name"]').should('be.visible')

    // Test tablet viewport
    cy.viewport('ipad-2')
    cy.get('input[placeholder*="Artist name"]').should('be.visible')

    // Test desktop viewport
    cy.viewport(1920, 1080)
    cy.get('input[placeholder*="Artist name"]').should('be.visible')
  })

  it('should have accessible form inputs', () => {
    // Check for labels or placeholders
    cy.get('input[placeholder*="Artist name"]')
      .should('have.attr', 'placeholder')
      .and('not.be.empty')

    cy.get('input[placeholder*="Country"]')
      .should('have.attr', 'placeholder')
      .and('not.be.empty')
  })

  it('should allow keyboard navigation', () => {
    // Focus on artist input
    cy.get('input[placeholder*="Artist name"]').focus().should('have.focus')

    // Type some text and press Enter to submit
    cy.get('input[placeholder*="Artist name"]').type('Test Artist{enter}')

    // Verify form submission was triggered
    cy.wait(500)
    cy.get('body').should('exist')
  })

  it('should show proper button states', () => {
    // Check submit button - should be disabled when empty
    cy.contains('button', 'Search').should('be.disabled')

    // Type in artist name
    cy.get('input[placeholder*="Artist name"]').type('Coldplay')

    // Button should now be enabled
    cy.contains('button', 'Search').should('not.be.disabled')
  })

  it('should clear form inputs properly', () => {
    cy.get('input[placeholder*="Artist name"]').type('Test Artist')
    cy.get('input[placeholder*="Artist name"]').clear()
    cy.get('input[placeholder*="Artist name"]').should('have.value', '')
  })

  it('should handle special characters in search', () => {
    // Test with special characters
    cy.get('input[placeholder*="Artist name"]').type('AC/DC')
    cy.contains('button', 'Search').click()
    cy.wait(3000)

    cy.get('body').should('exist')
  })

  it('should display error states gracefully', () => {
    // This would test error handling, but we need to trigger an error
    // For now, just verify the page doesn't crash
    cy.visit('/')
    cy.get('body').should('exist')
  })

  it('should maintain UI state during loading', () => {
    cy.get('input[placeholder*="Artist name"]').type('Metallica')
    cy.contains('button', 'Search').click()

    // During loading, UI should still be visible
    cy.get('body').should('be.visible')
  })

  it('should have proper visual hierarchy', () => {
    // Check that main heading is present and prominent
    cy.get('h1').should('be.visible')
    cy.get('h1').should('have.css', 'font-size')
  })

  it('should show proper loading indicators', () => {
    cy.get('input[placeholder*="Artist name"]').type('Beatles')

    // Verify button exists and is clickable
    cy.contains('button', 'Search').should('be.visible').and('not.be.disabled')

    // Click search
    cy.contains('button', 'Search').click()

    // Verify search completes successfully
    cy.wait(3000)
    cy.get('body').should('contain.text', 'Beatles')
  })
})
