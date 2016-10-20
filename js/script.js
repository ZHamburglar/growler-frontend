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
  localStorage.setItem('id_token', authResult.idToken)
  showGrowlDirectory()
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
    showProfile();
    showGrowlDirectory();
  }
});

function showProfile(){
  $('#btn-login').hide()
  $('#user-info').show()
  lock.getProfile(localStorage.getItem('id_token'), function(error, profile){
    if(error){
      logout()
    } else {
      $('#avatar').text(profile.name)
      $('#profilepicture').attr('src', profile.picture)
  //    $('#avatar').
    }
  })
}



function isLoggedIn() {
  if (localStorage.getItem('id_token')) {
    return true;
  } else {
    return false;
  }
}

function logout() {
  localStorage.removeItem('id_token')
  window.location.href = '/';
}


function showGrowlDirectory() {
  $('#profile').show()
  $.ajax({
    url:'https://afternoon-river-32575.herokuapp.com/growls',
    headers:{
      "Authorization":"Bearer " + localStorage.getItem('id_token')
    }
  }).done(function (data) {
    console.log(data);
      data.forEach(loadGrowl)
    })
}

function loadGrowl(growl) {
  var li= $("<li />")
  console.log(growl);
  li.text("content", growl.content)
  $("ul#growls").append(li)
}
