$(document).ready(function () {

  /**
   * Set Isolation Button
   */
  $('#set-isolation-type').click(() => {
    let option = $('#isolation-type :selected').val();
    
    window.location = `/isolation/${option}`
  })

  /**
   * Search Movie Button
   */
  $('#search-btn').click((e) => {
    e.preventDefault();
    console.log('here');
    const query = $('#search-input');

    const id = $('#id-table');
    const name = $('#name-table');
    const year = $('#year-table');

    const edit_id = $('#update-id');
    const edit_name = $('#update-name');
    const edit_year = $('#update-year');
    
    $.get('/search', {
      name: query.val()
    }, (result) => {
      console.log(result);

      id.text(`${result[0].id}`);
      name.text(`${result[0].name}`);
      year.text(`${result[0].year}`);

      edit_id.val(`${result[0].id}`);
      edit_name.val(`${result[0].name}`);
      edit_year.val(`${result[0].year}`);
    })
  })

  /**
   * Add Movie Button
   */
  $('#add-movie-save').click((e) => {
    e.preventDefault();
    const name = $('#insert-name').val();
    const year = $('#insert-year').val();

    $.post('/add', {
      name: name,
      year: year
    }, (result) => {
      console.log(result);
    })
  })

  /**
   * Update Movie Button
   */
  $('#update-movie-save').click((e) => {
    e.preventDefault();
    const id = $('#update-id').val();
    const name = $('#update-name').val();
    const year = $('#update-year').val();

    $.post('/update', {
      id: id,
      name: name,
      year: year
    }, (result) => {
      console.log(result);
    })
  })

  /**
   * Delete Movie Button
   */
   $('#delete-movie').click((e) => {
    e.preventDefault();
    const name = $('#update-name').val();
    const year = $('#update-year').val();

    $.post('/delete', {
      name: name,
      year: year
    }, (result) => {
      console.log(result);
    })
  })
})

