$(document).ready(function () {

  $('#set-isolation-type').click(() => {
    let option = $('#isolation-type :selected').val();
    console.log(option);
    window.location = `/isolation/${option}`
  })
})

