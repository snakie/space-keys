var stage;
var rocket;
var moon;
var commands;
var read_command = 1;
var died = 0;

var current = {
    x_speed: 0,
    y_speed: 0,
    nose_angle: 0,
    command:null,
    args:null,
    frames_to_go:null,
};
function get_rocket() {
    var r = new createjs.Shape();
    //r.graphics.beginStroke("#000").moveTo(145,500).lineTo(150,480).lineTo(155,500).lineTo(150,495).lineTo(145,500);
    r.graphics.beginStroke("#000").moveTo(5,5).lineTo(0,-10).lineTo(-5,5).lineTo(0,0).lineTo(5,5);
    r.x = 150;
    r.y = 495;
    return r;
}
function init() {
    stage = new createjs.Stage("spacekeys");
    rocket = get_rocket();
    moon = new createjs.Shape();
    var moon_spot = new createjs.Shape();
    var moon_spot_2 = new createjs.Shape();
    moon_spot.graphics.beginStroke("#000").drawCircle(0,0,5);
    moon_spot_2.graphics.beginStroke("#000").drawCircle(0,0,3);
    moon.graphics.beginStroke("#000").drawCircle(0,0,20);
    moon.x = 170;
    moon_spot.x = 175;
    moon_spot_2.x = 165;
    moon.y = 200;
    moon_spot.y = 195;
    moon_spot_2.y = 190;
    stage.addChild(moon_spot);
    stage.addChild(moon_spot_2);
    stage.addChild(moon);
    stage.addChild(rocket);
    stage.update();
    createjs.Ticker.setFPS(60);

}
function launch() {
    console.log("launching!");
    commands = document.getElementById("commands").value.split(";");
    createjs.Ticker.addEventListener("tick", launch_frame);
    died = 0;
}
function to_radians(angle) {
    return angle * (Math.PI / 180);
}
function execute_command(command,args) {
    switch(current.command) {
        case 'fire':
            current.y_speed += .01 * Math.cos(to_radians(rocket.rotation));
            current.x_speed += .01 * Math.sin(to_radians(rocket.rotation));
            break;
        case 'turn_right':
            rocket.rotation++;
            break;
        case 'turn_left':
            rocket.rotation--;
            break;
        case 'sleep':
            //end sleep
    }
    
}
function launch_frame() {
    //read new command
    if(read_command) {
        var cmd = commands.shift();
        if(cmd !== undefined) {
            cmd = cmd.replace(/\n|\r\n|\r/gm,"");
            cmd = cmd.replace(/\)/gm,"");
            cmd = cmd.trim();
            var split_command = cmd.split("(",2);
            if(split_command[1] !== undefined) {
                current.args = split_command[1].split(","); 
                current.command = split_command[0];
                current.frames_to_go = current.args[0]*60;
            }
        }
        console.log("tick: frames to go:"+current.frames_to_go+" command: "+current.command+"("+current.args+")");
        console.log("rocket("+rocket.x+","+rocket.y+","+rocket.rotation+") @ ("+current.x_speed+","+current.y_speed+")");
        read_command = 0;
    }
    //do the stuff to the shape in here
    if(commands[0] !== undefined) {
        execute_command();
        current.frames_to_go--;
    }
    if(current.frames_to_go <= 0 && commands[0] !== undefined) {
        //reset read command for next interation if we've waited long enough
        read_command = 1;
    }

    rocket.y -= current.y_speed;
    rocket.x += current.x_speed;
    if(rocket.y < 0 || rocket.x < 0 || rocket.x > 300 || rocket.y > 500) {
        alert("sorry you died! out of bounds!");
        died = 1;
        reset();
    }
    //detect collision with moon
    var xDist = rocket.x - moon.x;
    var yDist = rocket.y - moon.y;
    var distance = Math.sqrt(xDist*xDist+yDist*yDist);
    if(distance < 25) {
        alert("sorry you died! too close to the moon!");
        died = 1;
        reset();
    } 
    if(rocket.y >= 495 && Math.abs(current.y_speed) < .6 && Math.abs(current.x_speed) < .6 && !died) {
        alert("nice landing!");
        reset();
    }
    stage.update();
}
function reset() {
        createjs.Ticker.removeEventListener("tick", launch_frame);
        read_command = 1;
        rocket.y = 495;
        rocket.x = 150;
        rocket.rotation = 0;
        current.x_speed = 0;
        current.y_speed = 0;
        stage.update();
}
