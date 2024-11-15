import metallica_query_response from '../fixtures/metallica_query_response.json'
const met_lyrics = metallica_query_response.message.body.lyrics.lyrics_body

describe('Typewriter functionality', () => {
  it('Tests whether user can search for lyrics and whether lyrics get displayed correctly', () => {
    cy.visit('http://localhost:3002/')

    cy.get('[data-cy="artist"]').type('metallica')
    cy.get('[data-cy="track"]').type('welcome home (sanitarium)')
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="typing"]').click()

    cy.url().should('eq', 'http://localhost:3002/search')
    cy.get('[data-cy="lyrics"]').should('have.text', met_lyrics)

  })
})