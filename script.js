$('button').on('click', function () {
	const patientName = $('#name').val()
	$('#results').append(`<p>${patientName}</p>`)
	
})