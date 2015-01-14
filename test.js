var onReady = function() {
	var View = require('threejs-managed-view').View;
	var ArcSolver = require('threejs-arc-solver');
	var ArcHelper = require('./');
	var view = new View({
		useRafPolyfill: false
	});
	var scene = view.scene;

	var spin = new THREE.Object3D();
	view.scene.add(spin);
	var arcSettings = [
		{
			pos: [-2, 0, 0],
			color: 0xff0000
		},
		{
			pos: [2, 0, 0],
			color: 0x0000ff
		}
	];

	var helpers = [];
	var arcs = [];

	arcSettings.forEach(function(arcParams) {
		var arcVertices = [];
		var pos = arcParams.pos;
		for (var i = 0; i < 3; i++) {
			arcVertices[i] = new THREE.Vector3(
				(Math.random() - .5) * 2 + pos[0],
				(Math.random() - .5) * 2 + pos[1], 
				(Math.random() - .5) * 2 + pos[2]	
			);
		};

		var arc = new ArcSolver(arcVertices[0], arcVertices[1], arcVertices[2]);
		var helper = new ArcHelper(arc, arcParams.color);

		arcs.push(arc);
		helpers.push(helper);

		spin.add(helper);
	})

	var boxGeometry = new THREE.BoxGeometry(5, 1, 1, 1, 1, 1);

	var pos, arc, helper;
	view.renderManager.onEnterFrame.add(function() {
		spin.rotation.y += .01;
		var time = (new Date()).getTime() * .001;

		//update helper via arc
		pos = arcSettings[0].pos;
		arc = arcs[0];
		helper = helpers[0];
		arc.p2.x = Math.sin(time) * 2 + pos[0];
		arc.p2.y = Math.cos(time) * 2 + pos[1];
		arc.p2.z = Math.sin(time * 1.3) * 2 + pos[2];
		arc.update();
		helper.update();

		//update arc via helper
		arc = arcs[1];
		helper = helpers[1];
		pos = arcSettings[1].pos;
		helper.handle2.position.x = Math.sin(time) * 2 + pos[0];
		helper.handle2.position.y = Math.cos(time) * 2 + pos[1];
		helper.handle2.position.z = Math.sin(time * 1.3) * 2 + pos[2];
		helper.updateArc();
	})

	var planeMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(8, 8, 8, 8),
		new THREE.MeshBasicMaterial({
			wireframe: true,
			color: 0x7f7f7f
		})
	)
	planeMesh.rotation.x += Math.PI * .5;
	spin.add(planeMesh);

}

var loadAndRunScripts = require('loadandrunscripts');
loadAndRunScripts(
	[
		'bower_components/three.js/three.js'
	],
	onReady
);