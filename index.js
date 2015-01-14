function ArcHelper(arc, color) {
	color = color === undefined ? 0x0000ff : color;
	if(!(color instanceof THREE.Color)) color = new THREE.Color(color);
	THREE.Object3D.call(this);
	var arcVertices = [
		arc.p1,
		arc.p2,
		arc.p3
	];
	var sphereGeometry = new THREE.SphereGeometry(1);
	var colors = [
		color.clone().offsetHSL(0, 0, -.2),
		color.clone().offsetHSL(0, 0, 0),
		color.clone().offsetHSL(0, 0, .2)
	]
	var handles = [];
	for (var i = 0; i < 3; i++) {
		var handle = new THREE.Mesh(
			sphereGeometry, 
			new THREE.MeshBasicMaterial({
				color: colors[i]
			})
		);
		handle.position.copy(arcVertices[i]);
		handle.scale.set(.1, .1, .1);
		this.add(handle);
		handles.push(handle);
		this['handle'+(i+1)] = handle;
	};

	var centerMaterial = new THREE.MeshBasicMaterial({
		color: color,
	});

	var centerBall = new THREE.Mesh(sphereGeometry, centerMaterial);
	centerBall.position.copy(arc.center);
	centerBall.scale.set(.05, .05, .05);
	this.add(centerBall);

	var arrow = new THREE.ArrowHelper(arc.normal, arc.center);
	this.add(arrow);

	var arrowU = new THREE.ArrowHelper(arc.planeDirU, arc.center, 1, 0xff0000);
	this.add(arrowU);
	var arrowV = new THREE.ArrowHelper(arc.planeDirV, arc.center, 1, 0x00ff00);
	this.add(arrowV);

	var sampleMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff
	});

	var lineBalls = [];
	for (var i = 0; i < 100; i++) {
		var ball = new THREE.Mesh(
			sphereGeometry, 
			sampleMaterial
		);
		ball.position.copy(arc.sample(i/100));
		ball.scale.set(.015, .015, .015);
		this.add(ball);
		lineBalls.push(ball);
	};

	function update() {
		for (var i = 0; i < lineBalls.length; i++) {
			lineBalls[i].position.copy(arc.sample(i/100));
		};

		for (var i = 0; i < handles.length; i++) {
			handles[i].position.copy(arcVertices[i]);
		};
		centerBall.position.copy(arc.center);
		arrowU.setDirection(arc.planeDirU);
		arrowU.position.copy(arc.center);
		arrowV.setDirection(arc.planeDirV);
		arrowV.position.copy(arc.center);
		arrow.setDirection(arc.normal);
		arrow.position.copy(arc.center);
	}
	this.update = update;

	function updateArc() {
		for (var i = handles.length - 1; i >= 0; i--) {
			arcVertices[i].copy(handles[i].position);
		};
		arc.update();
		update();
	}
	this.updateArc = updateArc;

}

ArcHelper.prototype = Object.create(THREE.Object3D.prototype);

module.exports = ArcHelper;