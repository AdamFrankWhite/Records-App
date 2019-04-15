// ==== Variables =====

var data;

// ==== AJAX call ====

const $request = $.ajax({url: "https://www.json-generator.com/api/json/get/coSwXiWUky?indent=2", success: function(result){
    data = result; // assign results to variable
    console.log(data)
  }});

// ==== Functions ====

function showError () {
  $('#error').css({'visibility':'visible'});
}

function hideError () {
  $('#error').css({'visibility':'hidden'});
}

function appendResults(person) {
  let personID = person.guid.substring(0,2);
  $('#results').append(`
          <tr class="output">
            <td>${personID}.</td>
            <td>${person.name}</td>
            <td>${person.company}</td>
            <td>${person.address}</td>
            <td>${person.email}</td>
            <td>${person.phone}</td>
            <td>${person.balance}</td>
						<td class="copy"><img src="images/copy.jpg" style="width:20px"></td>
          </tr>`) 
}

function searchRecords () {
  var search = $('#search').val().toLowerCase();
  if (search.length > 0) { // validate
    var searchType = $('select').val().toLowerCase();
    var match = false;
    hideError();
    
    // SHOW ALL RESULTS 
    if (search=="all") {
      // empty table for each search (moved inside if statements to ensure only empty on successful search"
      $('#results').empty(); 
      match=true;
      for (let i=0; i<data.length; i++) {
        var person = data[i];
        appendResults(person);
      }
			// SHOW SEARCH RESULTS
    } else {
      $('#results').empty();
      
      for (let i=0; i<data.length; i++) {
        var person = data[i];
        if (person[searchType].toLowerCase().includes(search)) { // searches for partial match
          // append row to table
          appendResults(person);
          match = true; //       
        }
      }
    }      
        
    if (match==false) {
      showError();
      $('#error').html('<p class="noResults">No results. Please try again</p>');
    }      
      
            
  } else {
    showError();
    $('#error').html('<p class="emptyField">Please enter a search term</p>'); // .html over append as you want to overwrite content, not add
  }
} 

// ==== Event Listeners ====

$('#search-btn').on('click', function () {
  searchRecords();  
}) 

// Cell hover

$(document).on("mouseenter", "td", function(e) { // need to use document as listening for dynamic element
	$(this).css("background","orange");
});

$(document).on("mouseleave", "td", function(e) {
	$(this).css("background","");
});

//Highlight row

$(document).on("mouseenter", ".copy", function(e) {
	$(this).parent().css("background", "orange");
	$(this).css("background","orange");
});

$(document).on("mouseleave", ".copy", function(e) {
	$(this).parent().css("background", "");
	$(this).css("background","");
	$(this).stop(); 
	$(this).parent().stop(); // ensures background reverts if mouseleave before copy animation finishes

});

// Copy command 

$(document).on("click", ".copy td", function () {
	let tempElement = $('<textarea style="opacity:0;"></textarea>');
  let parent = $(this).closest('td').siblings().each(function(){
    tempElement.text(tempElement.text() + $(this).text() + '\t'); // adds each cell with a tab to textarea
  });
  
  tempElement.appendTo($('body')).select(); // selects textarea text??
  document.execCommand("copy");
  tempElement.remove();
	
	// from Stackoverflow - creates temporary textarea, adds text of all siblings, copies text, then removes textarea
})

// "copied to clipboard" event

$(document).on("click", ".copy", function () {
	$(this).parent().effect("highlight", {"color": "black"}, 1000) // highlight row
	$(this).effect("highlight", {"color": "black"}, 1000) // highlight copy cell
	$(this).parent().css("background", "");
	
});

// on click mouse says copied, if copied row, will need to write template string

// sort column

// $(document).on("click", "th", function() {
	// let people = document.getElementsByClassName('output');
	// let results = people.sort(function(a,b){return a-b})
	// console.log(people);
// });

