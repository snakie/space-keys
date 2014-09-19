var moon;

function setup_level(stage) {
  	moon = get_circle(170,200,20);
    var moon_spot = get_circle(175,195,5);
    var moon_spot_2 = get_circle(165,190,3);
    stage.addChild(moon_spot);
    stage.addChild(moon_spot_2);
    stage.addChild(moon);
}

function detect_collision() {
    //detect collision with moon
    var xDist = rocket.x - moon.x;
    var yDist = rocket.y - moon.y;
    var distance = Math.sqrt(xDist*xDist+yDist*yDist);
    if(distance < 25) {
    	return true;
    }
    return false;
}