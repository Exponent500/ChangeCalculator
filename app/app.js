/* array of arrays storing common coin values */
var coins = [
["#change-dollars", 1],
["#change-quarters", 0.25],
["#change-dimes", 0.1],
["#change-nickels", 0.05],
["#change-pennies", 0.01]
];

//sets the settings for all toaster alerts used
toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "100",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

var decimalPortionOfTotalChange;

//Wraps entire jQuery to make sure no DOM manipulation is done until the DOM is rendered
$(document).ready(function(){

	/* This blur event occurs when an input element loses focus. It ensures the values inputted are limited to two decimal places */ 
	$("input").blur(function(){ 
	    var number = $(this).val();
	    $(this).val(Math.round(number *100)/100);
	});

  /* Click event handler function that calculates change */
  $("#calculate-button").click(function() {
  	
  	$("#coin-results").hide(); //hides previous results before displaying new results
  	
  	var salePrice = $("#sale-price").val();	//grab value entered into "Total Due" input field
  	var userCashGiven =$("#cash-given").val(); //grab value entered into "Cash Given" input field
  	
  	if (!salePrice.length || !userCashGiven.length){ //checks to see that both input fields have a value entered
  		toastr["warning"]("Please try again.", "One of the fields wasn't filled in");
  		return;
  	}
  	
  	var totalChange = (userCashGiven - salePrice); //calculate change to be given

  	if (totalChange < 0) { // if the user hasn't given enough money
  		toastr["warning"]("Please try again.", "Not enough cash given!");
  	} else if (totalChange === 0) { //if the user pays exact amount
  		toastr["info"]("No change needed!");
  		$("#change-dollars, #change-quarters, #change-dimes, #change-nickels, #change-pennies").text("0");
  	} else { //if the user needs change
  		/* populates the dollars, quarters, dimes, nickels and pennies to the HTML page */
  		$.each(coins, function(i) {
      		if (i === 0){
      			decimalPortionOfTotalChange = totalChange % 1; //gets the decimal portion of the total change to be given
				totalChange -= decimalPortionOfTotalChange;	// gets the dollar value of the total change
      		} else {
      			totalChange = Math.floor(decimalPortionOfTotalChange / coins[i][1]); //  gets the integer value of quarters, dimes, nickels and pennies
      			decimalPortionOfTotalChange = (decimalPortionOfTotalChange % coins[i][1]).toFixed(2); //gets the remaining decimal portion of change to be used for each iteration of the loop
			}
      		$(coins[i][0]).text(totalChange); // displays the dollar, quarter, dime, nickel and pennies to the appropriate space on the HTML page
      		$("#coin-results").show("slow").addClass("animated fadeInRight"); //shows the results with a fadeInRight Animate.CSS effect
  		}); 
  	}
  });
});
