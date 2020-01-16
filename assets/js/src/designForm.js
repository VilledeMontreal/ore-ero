/*
  global
  YamlWriter jsyaml
  USERNAME REPO_NAME PRBOT_URL
  getTagsEN getTagsFR resetTags addTags
  submitInit submitConclusion
  getAdminObject getAdminCode slugify
  addMoreLicences resetMoreGroup fillLicenceField
  getToday
*/

const designSelect = $('.page-designForm #nameselect');
const adminSelect = $('.page-designForm #adminCode');

$(document).ready(function() {
  $('#prbotSubmitdesignForm').click(function() {
    if (submitInit()) {
      if ($('#ennewAdminName').val() != '') submitDesignFormNewAdmin();
      else submitFormDesign();
    }
    
  });

  designSelect.change(function() {
    selectDesign();
    if (adminSelect.val() != '') selectAdmin();
  });

  adminSelect.change(function() {
    selectAdmin();
  });

  $('#formReset').click(function() {
    $('#validation').trigger('reset');
    resetTags();
  });
});

function getDesignObject() {
  // Mandatory fields
  let designObject = {
    schemaVersion: '1.0',
    description: {
      whatItDoes: {
        en: $('#endescriptionwhatItDoes').val(),
        fr: $('#frdescriptionwhatItDoes').val()
      }
    },
    category: $('#category :selected').val(),
    homepageURL: {
      en: $('#enhomepageURL').val(),
      fr: $('#frhomepageURL').val()
    },
    licences: [],
    name: {
      en: $('#enname').val(),
      fr: $('#frname').val()
    },
    tags: {
      en: getTagsEN(),
      fr: getTagsFR()
    },
    administrations: [
      {
        adminCode: getAdminCode(),
        uses: [
          {
            contact: {
              email: $('#contactemail').val()
            },
            date: {
              started: $('#date').val(),
              metadataLastUpdated: getToday()
            }
          }
        ]
      }
    ]
  };

  // More-groups
  addMoreLicences(designObject);

  // Optional fields
  if (
    $('#endescriptionhowItWorks').val() ||
    $('#frdescriptionhowItWorks').val()
  ) {
    designObject.description.howItWorks = {};
  }
  if ($('#endescriptionhowItWorks').val()) {
    designObject.description.howItWorks.en = $(
      '#endescriptionhowItWorks'
    ).val();
  }
  if ($('#frdescriptionhowItWorks').val()) {
    designObject.description.howItWorks.fr = $(
      '#frdescriptionhowItWorks'
    ).val();
  }

  if ($('#contactname').val()) {
    designObject.administrations[0].uses[0].contact.name = $(
      '#contactname'
    ).val();
  }

  if ($('#enteam').val() || $('#frteam').val()) {
    designObject.administrations[0].uses[0].team = {};
    if ($('#enteam').val())
      designObject.administrations[0].uses[0].team.en = $('#enteam').val();
    if ($('#frteam').val())
      designObject.administrations[0].uses[0].team.fr = $('#frteam').val();
  }

  return designObject;
}

function getSelectedOrgType() {
  if ($('#adminCode').val() != '')
    return $('#adminCode :selected')
      .parent()
      .attr('label')
      .toLowerCase();
  else return $('#orgLevel').val();
}

function submitDesignFormNewAdmin() {
  let submitButton = document.getElementById('prbotSubmitdesignForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let designObject = getDesignObject();
  let adminObject = getAdminObject();
  let designName = $('#enname').val();
  let adminName = slugify(
    $('#ennewAdminName').val() + '-' + $('#provinceSelect').val()
  );

  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let designFile = `_data/design/${slugify(designName)}.yml`;
  let adminFile = `_data/administrations/${getSelectedOrgType()}.yml`;

  fileWriter
    .mergeAdminFile(adminFile, adminObject, '', 'code')
    .then(adminResult => {
      fileWriter
        .merge(designFile, designObject, 'administrations', 'adminCode')
        .then(designResult => {
          return fetch(
            PRBOT_URL,
            getConfigUpdateDesignNewAdmin(
              designName,
              adminName,
              designFile,
              adminFile,
              designResult,
              adminResult
            )
          );
        })
        .catch(err => {
          if (err.status == 404) {
            return fetch(
              PRBOT_URL,
              getConfigNewDesignNewAdmin(
                designName,
                adminName,
                designFile,
                adminFile,
                designObject,
                adminResult
              )
            );
          } else throw err;
        })
        .then(response => {
          let url =
            $('html').attr('lang') == 'en'
              ? './open-source-designs.html'
              : './logiciels-libres.html';
          submitConclusion(response, submitButton, resetButton, url);
        });
    });
}

function getConfigUpdateDesignNewAdmin(
  designName,
  adminName,
  designFile,
  adminFile,
  designResult,
  adminObject
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Updated design file for ' +
        designName +
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
          path: designFile,
          content: '---\n' + jsyaml.dump(designResult)
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

function getConfigNewDesignNewAdmin(
  designName,
  adminName,
  designFile,
  adminFile,
  designObject,
  adminObject
) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title:
        'Creaded design file for ' +
        designName +
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
          path: designFile,
          content: '---\n' + jsyaml.dump(designObject)
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

function submitFormDesign() {
  let submitButton = document.getElementById('prbotSubmitdesignForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let designObject = getDesignObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let ProjectName = $('#enname').val();
  let file = `_data/design/${slugify(ProjectName)}.yml`;

  fileWriter
    .merge(file, designObject, 'administrations', 'adminCode')
    .then(result => {
      return fetch(PRBOT_URL, getConfigUpdate(result, file, ProjectName));
    })
    .catch(err => {
      if (err.status == 404) {
        return fetch(
          PRBOT_URL,
          getConfigNew(designObject, file, ProjectName)
        );
      } else throw err;
    })
    .then(response => {
      let url =
        $('html').attr('lang') == 'en'
          ? './open-source-designs.html'
          : './logiciels-libres.html';
      submitConclusion(response, submitButton, resetButton, url);
    });
}

function getConfigUpdate(result, file, ProjectName) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: `Updated the ${ProjectName} design file`,
      description:
        'Authored by: ' +
        $('#submitteremail').val() +
        '\n' +
        'Project: ***' +
        $('#enname').val() +
        '***\n' +
        $('#endescriptionwhatItDoes').val() +
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

function getConfigNew(designObject, file, ProjectName) {
  return {
    body: JSON.stringify({
      user: USERNAME,
      repo: REPO_NAME,
      title: 'Created the design file for ' + ProjectName,
      description:
        'Authored by: ' +
        $('#submitteremail').val() +
        '\n' +
        'Project: ***' +
        $('#enname').val() +
        '***\n' +
        $('#endescriptionwhatItDoes').val() +
        '\n',
      commit: 'Committed by ' + $('#submitteremail').val(),
      author: {
        name: $('#submitterusername').val(),
        email: $('#submitteremail').val()
      },
      files: [
        {
          path: file,
          content: '---\n' + jsyaml.dump(designObject)
        }
      ]
    }),
    method: 'POST'
  };
}

function selectDesign() {
  let value = designSelect.val();
  $.getJSON('http://localhost:4000/ore-ero/design.json', function(
    result
  ) {
    if (result[value]) {
      addValueToFieldsDesign(result[value]);
      $('#adminCode').focus();
    } else if (value == '') {
      resetFieldsDesign();
    } else {
      alert('Error retrieving the data');
    }
  });
}
function addValueToFieldsDesign(obj) {
  resetFieldsDesign();

  $('#enname')
    .val(obj.name.en)
    .prop('disabled', true);
    
  $('#frname')
    .val(obj.name.fr)
    .prop('disabled', true);
  $('#endescriptionwhatItDoes').val(obj.description.whatItDoes.en);
  $('#frdescriptionwhatItDoes').val(obj.description.whatItDoes.fr);

  if (obj.description.howItWorks) {
    if (obj.description.howItWorks.en)
      $('#endescriptionhowItWorks').val(obj.description.howItWorks.en);
    if (obj.description.howItWorks.fr)
      $('#frdescriptionhowItWorks').val(obj.description.howItWorks.fr);
  }

  $('#category').val(obj.category);
  $('#enhomepageURL').val(obj.homepageURL.en);
  $('#frhomepageURL').val(obj.homepageURL.fr);
  fillLicenceField(obj.licences);
  addTags(obj);
}

function resetFieldsDesign() {
  $('#enname')
    .val('')
    .prop('disabled', false);
  $('#frname')
    .val('')
    .prop('disabled', false);
  $('#endescriptionwhatItDoes').val('');
  $('#frdescriptionwhatItDoes').val('');
  $('#endescriptionhowItWorks').val('');
  $('#frdescriptionhowItWorks').val('');
  $('#category').val('');
  $('#enhomepageURL').val('');
  $('#frhomepageURL').val('');
  resetMoreGroup($('#addMorelicences'));
  resetTags();
}

function selectAdmin() {
  let design = designSelect.val();
  let administration = adminSelect.val();
  $.getJSON('http://localhost:4000/ore-ero/design.json', function(
    result
  ) {
    if (result[design]) {
      for (let i = 0; i < result[design].administrations.length; i++) {
        if (result[design].administrations[i].adminCode == administration) {
          addValueToFieldsAdmin(result[design].administrations[i]);
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
