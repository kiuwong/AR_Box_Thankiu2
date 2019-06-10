const Scene = require('Scene');
const Reactive = require('Reactive');
const TouchGestures = require('TouchGestures')
const NativeUI = require('NativeUI');
const Patches = require('Patches');


const kiuModel = Scene.root.find('scene');
const planeTracker = Scene.root.find('planeTracker0');
const editButton = Scene.root.find('plane1');
const textbox = Scene.root.find('text1');


Scene.root.find('ambientLight0').intensity = require('LightingEstimation').frameBrightness;


TouchGestures.onTap().subscribe(function(gesture) {
	planeTracker.trackPoint(gesture.location);
});


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


TouchGestures.onTap(editButton).subscribe(function() {
	NativeUI.enterTextEditMode('Name');
});

NativeUI.getText('Name').monitor().subscribe(function(event) {
	if (event.newValue !== event.oldValue) {
		textbox.text = event.newValue.toUpperCase();		
	}
	
})