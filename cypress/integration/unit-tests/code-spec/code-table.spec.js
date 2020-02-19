/// <reference types="Cypress" />
/* global cy, context, it */

// eslint-disable-next-line no-undef
describe('Open Source Code', () => {
  context('English part', () => {
    // eslint-disable-next-line no-undef
    beforeEach(() => {
      cy.visit('http://localhost:4000/ore-ero/en/open-source-codes.html');
    });

    it('Loads the English page', () => {
      cy.get('#wb-cont').contains('Open Source Code');
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
    const selectTags = [
      '#dt_govLevel',
      '#dt_department',
      '#dt_team',
      '#dt_govLevel',
      '#dt_category',
      '#dt_licence',
      '#dt_tag'
    ];
    // eslint-disable-next-line no-undef
    beforeEach(() => {
      cy.visit('http://localhost:4000/ore-ero/en/open-source-codes.html');
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

    it('should filter the first element with the right values', () => {
      cy.get('.sorting_1')
        .first()
        .then(projectName => {
          cy.get('tbody > :nth-child(1) > :nth-child(2)').then(departement => {
            cy.get(`#dt_category`).select(departement.text().trim());
          });
          cy.get('tbody > :nth-child(1) > :nth-child(4)').then(licence => {
            cy.get(`#dt_licence`).select(licence.text().trim());
          });
          cy.get('.wb-tables-filter > .row > :nth-child(1) > .btn').click();
          cy.get(':nth-child(1) > .sorting_1').contains(projectName.text());
        });
    });

    it.only('should contain correct links', () => {});

    it.only('should open the correct modal', () => {
      cy.get(':nth-child(1) > .sorting_1').click();
      cy.get(':nth-child(1) > .sorting_1').then(name => {
        cy.get('.wb-overlay.open').contains(name.text());
      });
      cy.get(':nth-child(1) > .sorting_1').click();
    });

    it('should contain correct links');
  });
});
