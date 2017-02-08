var pieces = document.querySelectorAll(".piece");
for (var i = pieces.length - 1; i >= 0; i--) {
	pieces[i].style.transform = "rotate(" + (Math.floor(Math.random() *4) *90) + "deg)";
}
