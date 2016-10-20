var lock = new Auth0Lock(
  'GOmlS3wgzIqSOoWkG4DevSE1jGer8krh',
  'bryonymc.auth0.com',
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
