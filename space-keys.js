var stage;
var rocket;
var fire;
var commands;
var read_command = 1;
var died = 0;
var rocket_x = 400;
var counter;
var timer_seconds = 0;

var current = {
    x_speed: 0,
    y_speed: 0,
    nose_angle: 0,
    command:null,
    args:null,
    frames_to_go:null,
    command_count:0,
};

function init() {
    stage = new createjs.Stage("spacekeys");
    rocket = get_rocket(rocket_x,495);
    fire = get_fire(rocket);
    stage.addChild(rocket);
    stage.addChild(fire);
    setup_level(stage);
    stage.update();
    createjs.Ticker.setFPS(60);

}
function launch() {
    console.log("launching!");
    commands = document.getElementById("commands").value.split(";");
    createjs.Ticker.addEventListener("tick", launch_frame);
    counter = setInterval(timer, 1000); //launch timer
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
            fire.rotation++;
            break;
        case 'turn_left':
            rocket.rotation--;
            fire.rotation--;
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
                if(current.command == 'fire') {
                	draw_fire();
                } else {
                	clear_fire();
                }
                if(current.command == 'turn') {
                	//convert degrees to number of seconds
                	var time_to_spin = current.args[0] / 180 * 3 * 60;
                	current.frames_to_go = Math.abs(time_to_spin);
                	//determine if we turn right or left
                	if(time_to_spin > 0) {
                		current.command = 'turn_right';
                	} else {
                		current.command = 'turn_left';
                	}
                } else {
                	current.frames_to_go = current.args[0]*60;
                }
                current.command_count++;
       			document.getElementById("command").innerHTML = current.command_count+". "+current.command+"("+current.args+")";
            } else {
            	document.getElementById("command").innerHTML = "No further commands.";
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
    //gravity hack
	current.y_speed -= .005;
    rocket.y -= current.y_speed;
    rocket.x += current.x_speed;
    fire.y -= current.y_speed;
    fire.x += current.x_speed;
    if(rocket.y < 0 || rocket.x < 0 || rocket.x > 600 || rocket.y > 500) {
        alert("sorry you died! out of bounds!");
        died = 1;
        reset();
    }
    if(detect_collision()) {
        alert("sorry you died! too close to the moon!");
        died = 1;
        reset();
    } 
    if(rocket.rotation == 0 && rocket.y >= 495 && Math.abs(current.y_speed) < .6 && Math.abs(current.x_speed) < .6 && !died) {
        alert("nice landing!");
        reset();
    }
	
	document.getElementById("speed").innerHTML = get_speed();
	document.getElementById("angle").innerHTML = rocket.rotation;

    stage.update();
}
function get_speed() {
	var speed = Math.sqrt(current.x_speed*current.x_speed+current.y_speed*current.y_speed);
	return Math.round(speed*10);
}

function timer()
{
	timer_seconds=timer_seconds+1;
	document.getElementById("timer").innerHTML=timer_seconds + " s"; 
}
function reset() {
        createjs.Ticker.removeEventListener("tick", launch_frame);
        read_command = 1;
        rocket.y = 495;
        rocket.x = rocket_x;
        rocket.rotation = 0;
        current.x_speed = 0;
        current.y_speed = 0;
        clearInterval(counter);
        timer_seconds=0;
        document.getElementById("timer").innerHTML=timer_seconds + " s";
        document.getElementById("command").innerHTML = "rocket not in motion.";
        stage.update();
}
