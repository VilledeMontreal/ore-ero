/// <reference types="Cypress" />
/* global cy, context, it */
describe('Open Source Code', () => {
  context('English part', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4000/ore-ero/en/open-source-codes.html');
    });

    it('Loads the English page', () => {
      cy.get('#wb-cont').contains('Open Source Code');
    });

    it('Dynamically filters on the English page', () => {
      cy.get('.sorting_1')
        .first()
        .then(c => {
          // debugger;
          const firstWord = c.text().split(' ')[0];
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
    beforeEach(function() {
      cy.visit('http://localhost:4000/ore-ero/fr/codes-source-ouverts.html');
      cy.get('.sorting_1')
        .first()
        .invoke('text')
        .as('firstCode');
    });

    it('Loads the French page', function() {
      cy.get('#wb-cont').contains('Code Source Ouvert');
    });

    it('Dynamically filters on the French page', function() {
      cy.get('#dataset-filter_filter')
        .find('input')
        .type(this.firstCode);

      cy.get('.sorting_1').contains(this.firstCode);
    });
  });
  context('Common parts', () => {
    let selectTags = [
      '#dt_govLevel',
      '#dt_department',
      '#dt_team',
      '#dt_govLevel',
      '#dt_category',
      '#dt_licence',
      '#dt_tag'
    ];
    beforeEach(() => {
      cy.visit('http://localhost:4000/ore-ero/en/open-source-codes.html');
    });
    it.only('should reset inputs', function() {
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
  });
});
