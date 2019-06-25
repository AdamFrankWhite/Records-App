// ==== Variables =====

var data;
var tableHeaders = document.getElementsByTagName("th");
var rows = []

// sort controls
let sortCtrl = {
	id: false,
	name: false,
	company: false,
	address: false,
	email: false,
	phone: false,
	balance: false,	
}; 

// ==== AJAX call ====

const $request = $.ajax({
	url: "https://www.json-generator.com/api/json/get/coSwXiWUky?indent=2", 
	success: function(result){data = result;} // assign results to variable
});

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
		rows = [] // reset search results store
    // SHOW ALL RESULTS
    if (search=="all") {
      // empty table for each search (moved inside if statements to ensure only empty on successful search"
      $('#results').empty();
      match=true;
      for (let i=0; i<data.length; i++) {
        var person = data[i];
        appendResults(person);
				rows.push(person) // clears rows array and adds search result value
      }
			// SHOW SEARCH RESULTS
    } else {
      $('#results').empty();

      for (let i=0; i<data.length; i++) {
        var person = data[i];
        if (person[searchType].toLowerCase().includes(search)) { // searches for partial match
          // append row to table
          appendResults(person);
					rows.push(person) // clears rows array and adds search result value
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
	$(this).stop();
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


// sort function
$('th > img').on('click', function(e){
	let heading = e.target.parentNode.textContent.toLowerCase() // selects th text
	if (sortCtrl[heading] == false) {
		ascSort(heading)
		// controls asc/des settings
		sortCtrl[heading] = true; 
	} else {
		descSort(heading)
		sortCtrl[heading] = false;
	}		
});

function ascSort(heading){
	rows.sort((a,b) => a[heading] < b[heading] ? -1 : +1)
	$('#results').empty();
	for (let i=0; i<rows.length; i++){
		appendResults(rows[i]);
	}
	
}

function descSort(heading){
	console.log("bah")
	rows.sort((a,b) => a[heading] > b[heading] ? -1 : +1)
	$('#results').empty();
	for (let i=0; i<rows.length; i++){
		appendResults(rows[i]);
	}
	
}

// Copy command

$(document).on("click", ".copy", function () {
	let tempElement = $('<textarea style="opacity:0;"></textarea>');
  let parent = $(this).closest('td').siblings().each(function(){
    tempElement.text(tempElement.text() + $(this).text() + '\t'); // adds each cell with a tab to textarea
  });

  tempElement.appendTo($('body')).select(); // selects textarea text??
  document.execCommand("copy");
  tempElement.remove();

  //highlight row on click
  $(this).parent().effect("highlight", {"color": "black"}, 500) // highlight row
	$(this).parent().css("background", "");

	// modified from Stackoverflow - creates temporary textarea, adds text of all siblings, copies text, then removes textarea
})


// copy cell event
$(document).on("click", "td", function(e) {
	let tempElement = $('<textarea style="opacity:0;"></textarea>');
  let copyText = e.target.textContent
	tempElement.text(copyText);
  tempElement.appendTo($('body')).select(); 
  document.execCommand("copy");
  tempElement.remove();
	if (!$(e.target).hasClass("copy")) { // ensures copy icon doesn't animate twice
		$(this).effect("highlight", {"color": "black"}, 300) // highlight row
		$(this).css("background", "");
	}
	
	
})


