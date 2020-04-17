/*
  global
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  addTypes resetTypes fillTypeFields
  submitInit submitConclusion
  getAdminObject getAdminCode hideNewAdminForm slugify
  resetMoreGroup 
  getToday
*/

const learningSelect = $('.page-learningForm #nameselect');

$(document).ready(function () {
  $('#prbotSubmitlearningForm').click(function () {
    submitFormLearning();
  });

  $('#formReset').click(function () {
    $('#validation').trigger('reset');
    resetTypes();
  });
});

function getLearningObject() {
  // Mandatory fields
  let learningObject = {
    schemaVersion: '1.0',
    description: {
      whatItDoes: {
        en: $('#endescriptionwhatItDoes').val(),
        fr: $('#frdescriptionwhatItDoes').val()
      }
    },
    learningTypes: [],
    homepageURL: {
      en: $('#enhomepageURL').val(),
      fr: $('#frhomepageURL').val()
    },
    licences: [],
    name: {
      en: $('#enname').val(),
      fr: $('#frname').val()
    },
  };

  if (
    $('#enabstractwhatWillYouLearn').val() ||
    $('#frabstractwhatWillYouLearn').val()
  ) {
    learningObject.description.howItWorks = {};
  }
  if ($('#enabstractwhatWillYouLearn').val()) {
    learningObject.description.howItWorks.en = $(
      '#enabstractwhatWillYouLearn'
    ).val();
  }
  if ($('#frabstractwhatWillYouLearn').val()) {
    learningObject.description.howItWorks.fr = $(
      '#frabstractwhatWillYouLearn'
    ).val();
  }
  if ($('#learningStatus').val()) {
    learningObject.learningStatus.en = $('#learningStatus').val();
    learningObject.learningStatus.fr = $('#learningStatus').data('fr');
  }

  if ($('#contactname').val()) {
    learningObject.administrations[0].uses[0].contact.name = $(
      '#contactname'
    ).val();
  }

  if ($('#enteam').val() || $('#frteam').val()) {
    learningObject.administrations[0].uses[0].team = {};
    if ($('#enteam').val())
      learningObject.administrations[0].uses[0].team.en = $('#enteam').val();
    if ($('#frteam').val())
      learningObject.administrations[0].uses[0].team.fr = $('#frteam').val();
  }

  return learningObject;
}

function getSelectedOrgType() {
  if ($('#adminCode').val() != '')
    return $('#adminCode :selected')
      .parent()
      .attr('label')
      .toLowerCase();
  else return $('#orgLevel').val();
}

function submitLearningFormNewAdmin() {
  let submitButton = document.getElementById('prbotSubmitlearningForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let learningObject = getLearningObject();
  let adminObject = getAdminObject();
  let learningName = $('#enname').val();
  let adminName = slugify(
    $('#ennewAdminName').val() + '-' + $('#provinceSelect').val()
  );

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let learningFile = `_data/learning/${slugify(learningName)}.yml`;

  fileWriter
    .merge(learningFile, learningObject, 'administrations', 'adminCode')
    .then(learningResult => {
      return fetch(
        PRBOT_URL,
        getConfigUpdateLearningNewAdmin(
          learningName,
          learningFile,
          learningResult,
        )
      );
    })
    .catch(err => {
      if (err.status == 404) {
        return fetch(
          PRBOT_URL,
          getConfigNewLearningNewAdmin(
            learningName,
            learningFile,
            learningObject,
          )
        );
      } else throw err;
    })
    .then(response => {
      let url =
        $('html').attr('lang') == 'en'
          ? './open-learning.html'
          : './learning-libre.html';
      submitConclusion(response, submitButton, resetButton, url);
    });
}

function getConfigUpdateLearningNewAdmin(
  learningName,
  adminName,
  learningFile,
  adminFile,
  learningResult,
  adminObject
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Updated learning file for ' +
        learningName +
        ' and created ' +
        adminName +
        ' in administration file',
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: learningFile,
          content: '---\n' + jsyaml.dump(learningResult)
        },
        {
          path: adminFile,
          content: '---\n' + jsyaml.dump(adminObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function getConfigNewLearningNewAdmin(
  learningName,
  adminName,
  learningFile,
  adminFile,
  learningObject,
  adminObject
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Created learning file for ' +
        learningName +
        ' and created ' +
        adminName +
        ' in administration file',
      description: 'Authored by: ' + $('#submitteremail').val() + '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: learningFile,
          content: '---\n' + jsyaml.dump(learningObject)
        },
        {
          path: adminFile,
          content: '---\n' + jsyaml.dump(adminObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function submitFormLearning() {
  let submitButton = document.getElementById('prbotSubmitlearningForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let learningObject = getLearningObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let ProjectName = $('#enname').val();
  let file = `_data/learning/${slugify(ProjectName)}.yml`;

  fileWriter
    .merge(file, learningObject, 'administrations', 'adminCode')
    .then(result => {
      return fetch(PRBOT_URL, getConfigUpdate(result, file, ProjectName));
    })
    .catch(err => {
      if (err.status == 404) {
        return fetch(PRBOT_URL, getConfigNew(learningObject, file, ProjectName));
      } else throw err;
    })
    .then(response => {
      let url =
        $('html').attr('lang') == 'en'
          ? './open-learning.html'
          : './learning-libre.html';
      submitConclusion(response, submitButton, resetButton, url);
    });
}

function getConfigUpdate(result, file, ProjectName) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated the ${ProjectName} learning file`,
      description:
        'Authored by: ' +
        $('#submitteremail').val() +
        '\n' +
        'Project: ***' +
        $('#enname').val() +
        '***\n' +
        $('#enabstractwhatWillYouLearn').val() +
        '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(result)
        }
      ]
    }),
    method: 'POST'
  };
}

function getConfigNew(learningObject, file, ProjectName) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created the learning file for ' + ProjectName,
      description:
        'Authored by: ' +
        $('#submitteremail').val() +
        '\n' +
        'Project: ***' +
        $('#enname').val() +
        '***\n' +
        $('#enabstractwhatWillYouLearn').val() +
        '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(learningObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function selectLearning() {
  let value = learningSelect.val();
  $.getJSON('https://canada-ca.github.io/ore-ero/learning.json', function (
    result
  ) {
    if (result[value]) {
      addValueToFieldsLearning(result[value]);
      $('#adminCode').focus();
    } else if (value == '') {
      resetFieldsLearning();
    } else {
      alert('Error retrieving the data');
    }
  });
}

function addValueToFieldsLearning(obj) {
  resetFieldsLearning();

  $('#enname')
    .val(obj.name.en)
    .prop('disabled', true);

  $('#frname')
    .val(obj.name.fr)
    .prop('disabled', true);

  if (obj.description.howItWorks) {
    if (obj.description.howItWorks.en)
      $('#enabstractwhatWillYouLearn').val(obj.description.howItWorks.en);
    if (obj.description.howItWorks.fr)
      $('#frabstractwhatWillYouLearn').val(obj.description.howItWorks.fr);
  }
  $('#enhomepageURL').val(obj.homepageURL.en);
  $('#frhomepageURL').val(obj.homepageURL.fr);
  if (obj.learningStatus) {
    $('#learningStatus').val(obj.learningStatus);
  }
  fillTypeFields(obj.learningTypes);
  fillLicenceField(obj.licences);
}

function resetFieldsLearning() {
  $('#enname')
    .val('')
    .prop('disabled', false);
  $('#frname')
    .val('')
    .prop('disabled', false);
  $('#enabstractwhatWillYouLearn').val('');
  $('#frabstractwhatWillYouLearn').val('');
  $('#enhomepageURL').val('');
  $('#frhomepageURL').val('');
  resetMoreGroup($('#addMorelicences'));
  resetTypes();
  $('#learningStatus').prop('selectedIndex', 0);
}

function selectAdmin() {
  let learning = learningSelect.val();
  let administration = adminSelect.val();
  $.getJSON('https://canada-ca.github.io/ore-ero/learning.json', function (
    result
  ) {
    if (result[learning]) {
      for (let i = 0; i < result[learning].administrations.length; i++) {
        if (result[learning].administrations[i].adminCode == administration) {
          addValueToFieldsAdmin(result[learning].administrations[i]);
          break;
        } else {
          resetFieldsAdmin();
        }
      }
    }
  });
}

function addValueToFieldsAdmin(obj) {
  resetFieldsAdmin();

  $('#contactemail').val(obj.uses[0].contact.email);
  if (obj.uses[0].contact.name) $('#contactname').val(obj.uses[0].contact.name);

  $('#date').val(obj.uses[0].date.started);
  if (obj.team) {
    if (obj.team.en) $('#enteam').val(obj.team.en);
    if (obj.team.fr) $('#frteam').val(obj.team.fr);
  }
}

function resetFieldsAdmin() {
  $('#contactemail').val('');
  $('#contactname').val('');
  $('#date').val('');
  $('#enteam').val('');
  $('#frteam').val('');
}
