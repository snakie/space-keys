function get_circle(x,y,size) {
	var circle = new createjs.Shape();	
	circle.graphics.beginStroke("#000").drawCircle(0,0,size);
    circle.x = x;
    circle.y = y;
    return circle;
}
function get_rocket(x,y) {
    var r = new createjs.Shape();
    //r.graphics.beginStroke("#000").moveTo(145,500).lineTo(150,480).lineTo(155,500).lineTo(150,495).lineTo(145,500);
    r.graphics.beginStroke("#000").moveTo(5,5).lineTo(0,-10).lineTo(-5,5).lineTo(0,0).lineTo(5,5);
    r.x = x;
    r.y = y;
    return r;
}
function get_fire(rocket) {
	var f = new createjs.Shape();
	//f.graphics.beginStroke("#FFF").moveTo(0,5).lineTo(0,10).moveTo(1,5).lineTo(5,10).moveTo(-1,5).lineTo(-5,10);
	f.x = rocket.x;
	f.y = rocket.y;
	return f;
}
function clear_fire() {
	fire.graphics.clear();
}
function draw_fire() {
	fire.graphics.beginStroke("#000").moveTo(0,5).lineTo(0,10).moveTo(1,5).lineTo(5,10).moveTo(-1,5).lineTo(-5,10);
}