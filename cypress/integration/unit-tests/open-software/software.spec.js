/// <reference types="Cypress" />
/* global cy, context, it */
context('Open Source Software on the English page', () =>  {
  before(() => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-softwares.html');
  });

  it('Loads the English page', () => {
    cy.get('#wb-cont').contains('Open Source Software');
  });

  it('Dynamically filters on the English page', () => {
      cy.get('#dataset-filter_filter')
          .find('input')
          .type('jekyll');

      cy.get('#dataset-filter')
          .find('tbody>tr')
          .first()
          .find('td>a')
          .first()
          .contains('Jekyll');
  });

  it('Dynamically filters on the English page', () => {
      cy.get('#dataset-filter_filter')
          .find('input')
          .type('cypress');

      cy.get('#dataset-filter')
          .find('tbody>tr')
          .should('not.contain', 'cypress');
  });

  it('Can filter for an existing element on the English page', () => {
    cy.get('#dataset-filter')
        .find('tbody')
        .get('td')
        .eq(0)
        .invoke('text')
        .then((expected) => {
            cy.get('#dataset-filter_filter')
                .find('input')
                .type(expected);

            cy.get('#dataset-filter')
                .find('tbody>tr')
                .should('contain', expected);
        });
  });
});

context('Open Source Software on the French page', () =>  {
  before(() => {
    cy.visit('http://localhost:4000/ore-ero/fr/logiciels-libres.html');
  });

  it('Loads the French page', () => {
    cy.get('#wb-cont').contains('Logiciels libres');
  });

  it('Dynamically filters on the French page', () => {
      cy.get('#dataset-filter_filter')
          .find('input')
          .type('jekyll');

      cy.get('#dataset-filter')
          .find('tbody>tr')
          .first()
          .find('td>a')
          .first()
          .contains('Jekyll');
  });

  it('Dynamically filters on the English page', () => {
      cy.get('#dataset-filter_filter')
          .find('input')
          .type('cypress');

      cy.get('#dataset-filter')
          .find('tbody>tr')
          .should('not.contain', 'cypress');
  });

  it('Can filter for an existing element on the French page', () => {
    cy.get('#dataset-filter')
        .find('tbody')
        .get('td')
        .eq(0)
        .invoke('text')
        .then((expected) => {
            cy.get('#dataset-filter_filter')
                .find('input')
                .type(expected);

            cy.get('#dataset-filter')
                .find('tbody>tr')
                .should('contain', expected);
        });
  });
});

context('Open Source Software on the English Form page', () =>  {
  before(() => {
    cy.visit('http://localhost:4000/ore-ero/en/open-source-software-form.html');
  });

  it('Loads the English Form page', () => {
    cy.get('#wb-cont').contains('Open Source Software Form');
  });

  it('Should return dynamicall filled of existing data information on the English page', () => {
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .contains('.NET Core'); //Faudrait plutôt vérifier que l'information s'est ajoutée dans les champs concernés
  });

  it('Should not dynamicall filled of unexisting data information on the English page', () => {
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .should('not.contain', 'sourcetree'); //Test un peu redondant
  });

  it('Should submit form on the English page', () => {
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .contains('.NET Core');
    cy.get('select#adminCode')
      .as('option')
      .invoke('val', 'asc-csa')
      .first()
      .trigger('change')
      .contains('Canadian Space Agency');
    cy.get('input#contactemail')
      .type('jekyll@ymail.com')
      .should('have.value','jekyll@ymail.com');
    cy.get('input#date')
      .type("1959-09-13")
      .should('have.value','1959-09-13');
    cy.get('input#submitterusername')
      .type('test name')
      .should('have.value','test name');
    cy.get('input#submitteremail')
      .type('xyz@ymail.com')
      .should('have.value','xyz@ymail.com');
    cy.get('button#prbotSubmitsoftwareForm')
      .click();
    cy.get('#validation')
      .submit();
    cy.wait(2000);
    cy.get('#errors-validation')
      .should('not.contain','The form could not be submitted because 1 error was found.');
    cy.get('form').submit();
  }); // +++ Tu évite la soumission lors du test, - le test ne regarde pas le bon point
});

context('Open Source Software on the French Form page', () =>  {
  before(() => {
    cy.visit('http://localhost:4000/ore-ero/fr/logiciel-libre-formulaire.html');
  });

  it('Loads the French Form page', () => {
    cy.get('#wb-cont').contains('Formulaire du logiciel libre');
  });
  
  it('Should return dynamicall filled of existing data information on the French page', () => {
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')//Faudrait plutôt vérifier que l'information s'est ajoutée dans les champs concernés
      .first()
      .trigger('change')
      .contains('.NET Core');
  });
  
  it('Should not dynamicall filled of unexisting data information on the French page', () => {
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .should('not.contain', 'sourcetree'); //Test un peu redondant
  });
  
  it('Should submit form on the French page', () => {
    cy.get('select')
      .as('option')
      .invoke('val', 'net-core')
      .first()
      .trigger('change')
      .contains('.NET Core');
    cy.get('select#adminCode')
      .as('option')
      .invoke('val', 'asc-csa')
      .first()
      .trigger('change')
      .contains('Agence spatiale canadienne');
    cy.get('input#contactemail')
      .type('jekyll@ymail.com')
      .should('have.value','jekyll@ymail.com');
    cy.get('input#date')
      .type("1959-09-13")
      .should('have.value','1959-09-13');
    cy.get('input#submitterusername')
      .type('test name')
      .should('have.value','test name');
    cy.get('input#submitteremail')
      .type('xyz@ymail.com')
      .should('have.value','xyz@ymail.com');
    cy.get('button#prbotSubmitsoftwareForm')
      .click();
    cy.get('#validation')
      .submit();  
    cy.wait(2000);
    cy.get('#errors-validation')
      .should('not.contain','Le formulaire n\'a pu être soumis car 1 erreur a été trouvée.');
       // +++ Tu évite la soumission lors du test, - le test ne regarde pas le bon point
  });
});
