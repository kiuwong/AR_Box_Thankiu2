const Scene = require('Scene');
const Reactive = require('Reactive');
const TouchGestures = require('TouchGestures')
const NativeUI = require('NativeUI');
const Time = require('Time');
const Diagnostics = require('Diagnostics');


const kiuModel = Scene.root.find('scene');
const planeTracker = Scene.root.find('planeTracker0');
const editButton = Scene.root.find('editButton');
const lightButton = Scene.root.find('lightButton')
const lights = Scene.root.find('ambientLight1')
const textbox = Scene.root.find('text1');
const launchScreen = Scene.root.find('launchScreen')
const displayScreen = Scene.root.find('displayScreen')
const logoScreen = Scene.root.find('logoScreen')

Scene.root.find('ambientLight0').intensity = require('LightingEstimation').frameBrightness;

//Hide Initial Objects
launchScreen.hidden = false;
displayScreen.hidden = true;
kiuModel.hidden = true;
logoScreen.hidden = true;
lights.hidden = true;

TouchGestures.onTap().subscribe(function(gesture) {
	planeTracker.trackPoint(gesture.location);
});

TouchGestures.onTap().subscribe(hideLaunchScreen);


function hideLaunchScreen() { 
	launchScreen.hidden = true;
	displayScreen.hidden = false;
	kiuModel.hidden = false;
	logoScreen.hidden = false;
	stopTimer();
};

const intervalTimer = Time.setInterval(hideLaunchScreen, 7000)

function stopTimer() {
	Time.clearInterval(intervalTimer);
}

const timeoutTimer = Time.setTimeout(stopTimer, 8000);

TouchGestures.onTap(lightButton).subscribe(turnOnLights);

let lightState = 1

function turnOnLights() { 
	if(lightState == 1) {
		lights.hidden = false;
		lightState = 0;
	} else {
		lights.hidden = true;
		lightState = 1;
	}	
};

//User Functionalities

TouchGestures.onPan(planeTracker).subscribe(function(gesture) {
	planeTracker.trackPoint(gesture.location, gesture.state);
});

TouchGestures.onPinch().subscribe(function(gesture) {
	var lastScaleX = kiuModel.transform.scaleX.pinLastValue();
	kiuModel.transform.scaleX = Reactive.mul(lastScaleX, gesture.scale);

	var lastScaleY = kiuModel.transform.scaleY.pinLastValue();
	kiuModel.transform.scaleY = Reactive.mul(lastScaleY, gesture.scale);

	var lastScaleZ = kiuModel.transform.scaleZ.pinLastValue();
	kiuModel.transform.scaleZ = Reactive.mul(lastScaleZ, gesture.scale);
});

TouchGestures.onRotate(kiuModel).subscribe(function(gesture) {
  var lastRotationY = kiuModel.transform.rotationY.pinLastValue();
  kiuModel.transform.rotationY = Reactive.add(lastRotationY, Reactive.mul(-1, gesture.rotation));
});

//Texting Capabilities

TouchGestures.onTap(editButton).subscribe(function() {
	NativeUI.enterTextEditMode('Name');
});

NativeUI.getText('Name').monitor().subscribe(function(event) {
	if (event.newValue !== event.oldValue) {
		textbox.text = event.newValue.toUpperCase();		
	}
	
})