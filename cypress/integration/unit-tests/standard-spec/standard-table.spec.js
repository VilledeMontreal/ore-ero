/// <reference types="Cypress" />
/* global cy, context, it */

// eslint-disable-next-line no-undef
describe('Open Standard Table', () => {
  context('English part', () => {
    // eslint-disable-next-line no-undef
    beforeEach(() => {
      cy.visit('http://localhost:4000/ore-ero/en/open-standards.html');
    });

    it('Loads the English page', () => {
      cy.get('#wb-cont').contains('Open Standards');
    });

    it('Dynamically filters on the English page', () => {
      cy.get('.sorting_1')
        .first()
        .then(value => {
          // debugger;
          const firstWord = value.text().split(' ')[0];
          cy.get('#dataset-filter_filter')
            .find('input')
            .type(firstWord);
          cy.get('#dataset-filter')
            .find('tbody>tr')
            .first()
            .find('td>a')
            .first()
            .contains(firstWord);
        });
    });
  });

  context('French part', function() {
    // eslint-disable-next-line no-undef
    beforeEach(function() {
      cy.visit('http://127.0.0.1:4000/ore-ero/fr/normes-ouvertes.html');
      cy.get('.sorting_1')
        .first()
        .invoke('text')
        .as('firstCode');
    });

    it('Loads the French page', function() {
      cy.get('#wb-cont').contains('Normes ouvertes');
    });

    it('Dynamically filters on the French page', function() {
      cy.get('#dataset-filter_filter')
        .find('input')
        .type(this.firstCode);

      cy.get('.sorting_1').contains(this.firstCode);
    });
  });
  context.only('Common parts', () => {
    const selectTags = ['#dt_govLevel', '#dt_tag'];

    // eslint-disable-next-line no-undef
    beforeEach(() => {
      cy.visit('http://localhost:4000/ore-ero/en/open-standards.html');
    });

    it('should reset inputs', function() {
      //select first element of the select
      //should test if it's null
      selectTags.forEach(selectTag => {
        cy.get(`${selectTag} > option`)
          .eq(1)
          .then(element => {
            cy.get(selectTag).select(element.val());
          });
      });

      cy.get('.wb-tables-filter > .row > :nth-child(2) > .btn').click();

      selectTags.forEach(selectTag => {
        cy.get(`${selectTag} > option`)
          .eq(0)
          .should('be.selected');
      });
    });

    it('should open the correct modal', () => {
      cy.get(':nth-child(1) > .sorting_1').click();
      cy.get(':nth-child(1) > .sorting_1').then(name => {
        cy.get('.wb-overlay.open').contains(name.text());
      });

      // click on the close button
      cy.get('.wb-overlay.open .btn').click();
      cy.get('.wb-overlay').should('not.be.visible');
    });
  });
});
