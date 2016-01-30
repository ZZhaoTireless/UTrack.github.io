'use strict';

/*
Put any interaction code here
 */




window.addEventListener('load', function() {
  // You should wire up all of your event handling code here, as well as any
  // code that initiates calls to manipulate the DOM (as opposed to responding
  // to events)
  // Instantiate a TabView and a TabModel, then bind them together.
  var activity_model = new ActivityCollectionModel();

  var tabView = new TabView(new TabModel());

  var activityCollectionView = new ActivityCollectionView(activity_model);
  
  var graphView = new GraphView(new GraphModel(), activity_model);

  input_method();

  var fake_dataBtn = document.getElementById('gen-fake-data');
	fake_dataBtn.addEventListener('click', function() {
        generateFakeData(activity_model, 6)
        var Warning = document.getElementById('Hide_Forever');

    	Warning.className = "hidden";

    	var enable_gr = document.getElementById('GRA_SHOW');

    	enable_gr.className = "col-md-6";
    });

  	var Lis_Of_Points = document.getElementById('GRA_SHOW');

  	Lis_Of_Points.className = "hidden";



});


function input_method(){
	var The_input = document.getElementsByClassName('input_mth');
	_.each(The_input, function(input){
		console.log(input);
		input.nextElementSibling.innerHTML = "Level: " + input.value;

		input.addEventListener('input', function() {
			input.nextElementSibling.innerHTML = "Level: " + input.value;
		});
	});
}
