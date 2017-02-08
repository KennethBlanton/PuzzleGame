console.log("Hello World from main.js!");
// Puzzle
//how it works
//dynamically generate images on page
	// grab each image from assets dynamically
	//set information for each image. 
//create event Listeners for dragging and dropping into place.
//lock images in place when in correct position
//timer
// display modal on winning. 
//reset game on button. 
//create function to check pieceBeingDragged is within 20px of its finalPosX and 20px of its finalPosY.
//if so, add class "locked" and snap it into position ( set x and y = to final x,y);
var time = 0;
var timer = setInterval(timing, 1000);
function timing() {
	time++;
	// console.log(time);
}

var createImgObject = function(imgData) {
	var imgObj = [];
	var posX = 100;
	var posY = 100;
	var columnCount = 1; 
	for (var i = 1; i <= imgData.numOfImgs; i++) {
		var currentImg = {
			src:imgData.path + i + imgData.ext, 
			finalPosX:posX,
			finalPosY:posY,
		};
		imgObj.push(currentImg);
		if(columnCount != imgData.numOfCols) {
			posX += imgData.width;
			columnCount++;
		} else {
			columnCount = 1;
			posX = 100;
			posY += imgData.width;
		}
	}
	//make a loop
	//calculate final positions
	//write out the src
	//push object to array
	console.log(imgObj);
	return imgObj;
}; 
var startGame = function() {
	var imgDefaultData = {
		path: "assets/img/cat_",
		ext: ".jpg",
		width:200,
		numOfImgs: 6,
		numOfCols: 3,
	};
	var imgArray = createImgObject(imgDefaultData);
	placesPieces(imgArray);
	var pieces = document.querySelectorAll(".piece");
	for (var i = pieces.length - 1; i >= 0; i--) {
		pieces[i].style.transform = "rotate(" + (Math.floor(Math.random() *4) *90) + "deg)";
	}

	time=0;

	window.addEventListener("mousemove", movePiece);
	window.addEventListener("mouseup", stopDrag);


};
var placesPieces = function(imgArray){
 	for (var i = imgArray.length - 1; i >= 0; i--) {
 		var piece = document.createElement("img");
 		piece.setAttribute("src", imgArray[i].src);
 		piece.classList.add("piece");
 		piece.setAttribute("data-final-x", imgArray[i].finalPosX);
  		piece.setAttribute("data-final-y", imgArray[i].finalPosY);		
 		piece.style.top = Math.random() * 430 + "px";
 		piece.style.left = Math.random() * 300 + 705 + "px";
 		document.body.appendChild(piece);

 		piece.addEventListener("mousedown", startDrag);
 	}
};
var startDrag = function(e) {
	// console.log(e);
	e.preventDefault();
	pieceBeingDragged = e.currentTarget; //this

	pieceBeginLeft = parseInt(pieceBeingDragged.style.left);
	pieceBeginTop = parseInt(pieceBeingDragged.style.top);
	mouseBeginLeft = e.clientX;
	mouseBeginTop = e.clientY;
	document.body.onkeyup = function(e) {
		if(e.keyCode == 37) {
			console.log("left");
			var currentRotation = parseAwesome(pieceBeingDragged.style.transform);
			if(currentRotation == -360){
				currentRotation = 0;
			}
			pieceBeingDragged.style.transform = "rotate(" + (currentRotation - 90) + "deg)";
			currentRotation = parseAwesome(pieceBeingDragged.style.transform);
			console.log(currentRotation);
		}
		if(e.keyCode == 39) {
			console.log("right");
			var currentRotation = parseAwesome(pieceBeingDragged.style.transform);
			if(currentRotation == 360){
				currentRotation = 0;
			}
			pieceBeingDragged.style.transform = "rotate(" + (currentRotation + 90) + "deg)";
			currentRotation = parseAwesome(pieceBeingDragged.style.transform);
			console.log(currentRotation);
		}
	}
}
var movePiece = function(e) {
	// console.log(e);
	var distanceLeft = e.clientX - mouseBeginLeft;
	var distanceTop = e.clientY - mouseBeginTop;
	if(pieceBeingDragged) {
		if(pieceBeingDragged.classList.contains("locked")){
			pieceBeingDragged=null;
		}
		pieceBeingDragged.style.left = pieceBeginLeft + distanceLeft + "px";
		pieceBeingDragged.style.top = pieceBeginTop + distanceTop + "px";
		checkForFit(pieceBeingDragged);
	}

}
var stopDrag = function(e) {
	// console.log(e);
	pieceBeingDragged = null;
}
var checkForFit = function(item){
	var posLeft = parseFloat(item.style.left);
	var posTop = parseFloat(item.style.top);
	var finalPosX = parseFloat(item.getAttribute("data-final-x"));
	var finalPosY = parseFloat(item.getAttribute("data-final-y"));
	var rotation = parseAwesome(item.style.transform);
	// console.log(posLeft + "," + finalPosX);
	if((posLeft > finalPosX) && (posLeft < finalPosX + 20)){
		if((posTop > finalPosY) && (posTop < finalPosY + 20)){
			if(rotation == 0 || rotation == 360 || rotation == -360){
				item.classList.add("locked");
				item.style.top = finalPosY +"px";
				item.style.left = finalPosX + "px";
				pieceBeingDragged = null;
				checkForEnd();
			}
		} else{
			// console.log(finalPosX + 20);
			// console.log(finalPosY);
		}
	}
}
var checkForEnd = function(){
	var matches = document.querySelectorAll(".locked");
	var pieces = document.querySelectorAll(".piece");
	if(matches.length == pieces.length){
		clearInterval(timer);
		setTimeout(function(){
			createModal();
		},500)
	}
}
function createModal() {
	$overlay = document.createElement("div");
	$overlay.classList.add("overlay");
	document.body.appendChild($overlay);
	var $modal = document.createElement("div");
	$modal.classList.add("modal");
	document.body.appendChild($modal);
	$modal.innerHTML = "<p>you have won! It took you " + time + " seconds</p>";
	var $restart = document.createElement("button"); 
	var $close = document.createElement("button"); 
	$restart.classList.add("restart");
	$close.classList.add("close");
	$restart.innerHTML = "Restart";
	$close.innerHTML = "close"; 
	$modal.appendChild($restart);
	$modal.appendChild($close);
	$restart.addEventListener("click", restartGame);
	$close.addEventListener("click", closeGame);

}
function closeGame() {
	console.log(" close clicked");
	var $modal = document.querySelector(".modal");
	var $overlay = document.querySelector(".overlay");
	$modal.parentNode.removeChild($modal);
	$overlay.parentNode.removeChild($overlay);
}
function restartGame() {
	console.log("reset");
	var $modal = document.querySelector(".modal");
	var $overlay = document.querySelector(".overlay");
	$modal.parentNode.removeChild($modal);
	$overlay.parentNode.removeChild($overlay);
	var $pieces = document.querySelectorAll(".piece");
	for (var i = $pieces.length - 1; i >= 0; i--) {
		$pieces[i].parentNode.removeChild($pieces[i]);
	}
	startGame();
	timer = setInterval(timing, 1000);
}
var parseAwesome = function(str) { 
	var array = str.split(""); 
	i=0;
	var num = ""; 
	while(i<array.length-1){
		if(array[i] === "0" || array[i] === "1" || array[i] === "2" || array[i] === "3" || array[i] === "4" || array[i] === "5" || array[i] === "6" || array[i] === "7" || array[i] === "8" || array[i] === "9" || array[i] === "-"){ 
			num = num +""+ array[i]; 
			i++;
		}else {
			i++;
		}
	} 
	return parseFloat(num); 
}  
var pieceBeingDragged;
var pieceBeginLeft;
var pieceBeginTop;
var mouseBeginLeft;
var mouseBeginTop;
startGame();

//path to the images
//extensiton for images 
//width and height of each
//number of pieces
//number of columns ( possible to do without probably)
// note to self: check;
