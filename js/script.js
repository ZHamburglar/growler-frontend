var lock = new Auth0Lock(
  'ZFsRafVrvuCZHwxtFqmAhRuyBBXYNtOV',
  'thegoblinking.auth0.com',
  {
    auth: {
      params: {
        scope: 'openid email'
      }
    }
  }
);

lock.on('authenticated', function (authResult) {
  console.log('authResult', authResult);
  localStorage.setItem('idToken', authResult.idToken)
  showProfile()
  loadGrowls()
})

$(document).ready(function() {
  $('#btn-login').on('click', function (e) {
    e.preventDefault()
    lock.show()
  })

  $('#btn-logout').on('click', function (e) {
    e.preventDefault()
    logout()
  })

  $(document).on('click', '#students li', toggleStudent)
  $(document).on('click', 'a.delete-link', deleteStudent)

  if (isLoggedIn()) {
    loadGrowls();
  }
});
function showProfile(){
  console.log('hello');
  $('#btn-login').hide()
  $('#user-info').show()
  lock.getProfile(localStorage.getItem('idToken'), function(error, profile){
    if(error){
      logout()
    } else {
      console.log('Hello Profile', profile);
      $('#avatar').text(profile.name)
      $('#profilepicture').attr('src', profile.picture)
  //    $('#avatar').
    }
  })
}
function deleteGrowl(e) {
  e.preventDefault()
  e.stopPropagation()
  var link = $(this)
  $.ajax({
    url: link.attr('href'),
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function () {
    link.parent('li').remove()
  })
}


function isLoggedIn() {
  if (localStorage.getItem('idToken')) {
    return true;
  } else {
    return false;
  }
}

function logout() {
  localStorage.removeItem('idToken')
  window.location.href = '/';
}

function loadGrowls() {
  $('#btn-login').hide()
  $('#user-info').show()

  $.ajax({
    url: 'http://localhost:3000/Growls',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  }).done(function (data) {
    data.forEach(function (datum) {
      loadStudent(datum)
    })
  })
}

function loadStudent(student) {
  var li = $('<li />')
  console.log(student);
  li.text(student.firstName + ' '+student.lastName+" ")
  li.data('firstName', student.firstName)
  if (student.completed) li.addClass('done');

  var deleteLink = $('<a />');
  deleteLink.text('Delete')
  deleteLink.attr('href', 'http://localhost:3000/Grows/' + student._id)
  deleteLink.addClass('delete-link')

  li.append(deleteLink)

  $('#students').append(li)
}
