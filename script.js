var data;

const $request = $.ajax({url: "http://www.json-generator.com/api/json/get/bPZDYpeDiq?indent=2", success: function(result){
    data = result; // assign results to variable
  }});

$('button').on('click', function () {
  var search = $('#search').val();
  var searchType = $('select').val().toLowerCase();
  // empty table for each search
  $('#results').empty(); 
	for (let i=0; i<data.length; i++) {
    var person = data[i];
    if (person[searchType].toLowerCase().includes(search)) { // searches for partial match
      // append row to table
      $('#results').append(`
        <tr>
          <td>${person.name}</td>
          <td>${person.company}</td>
          <td>${person.email}</td>
          <td>${person.phone}</td>
          <td>${person.balance}</td>
          <td class="copy">Copy to clipboard</td>
        </tr>`) 
    }   
  }
}) 

// Copy command

$('#results').on('click', '.copy', function (event) { // need to select parent container, then use target class as parameter, since you are working with dynamic content

  // var result = getElementsByTagName('tr')[event.target];
  $query = $(event.target).parent()[0]
  $query.select();
  document.execCommand('copy')
  
}) 



