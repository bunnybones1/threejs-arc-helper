function ArcHelper(arc, color) {
	color = color === undefined ? 0x0000ff : color;
	if(!(color instanceof THREE.Color)) color = new THREE.Color(color);
	THREE.Object3D.call(this);
	var arcVertices = [
		arc.p1,
		arc.p2,
		arc.p3
	];
	var sphereGeometry = new THREE.SphereGeometry(.25);
	var colors = [
		color.clone().offsetHSL(0, 0, -.2),
		color.clone().offsetHSL(0, 0, 0),
		color.clone().offsetHSL(0, 0, .2)
	]
	var handles = this.handles = [];
	for (var i = 0; i < 3; i++) {
		var handle = new THREE.Mesh(
			sphereGeometry, 
			new THREE.MeshBasicMaterial({
				color: colors[i],
				depthTest: false,
				transparent: true,
				blending: THREE.AdditiveBlending
			})
		);
		handle.renderDepth = 1;
		handle.position.copy(arcVertices[i]);
		this.add(handle);
		handles.push(handle);
		this['handle'+(i+1)] = handle;
	};

	var centerMaterial = new THREE.MeshBasicMaterial({
		color: color,
	});

	var arrowU = new THREE.ArrowHelper(arc.planeDirU, arc.center, 1, 0xff0000);
	this.add(arrowU);
	var arrowV = new THREE.ArrowHelper(arc.planeDirV, arc.center, 1, 0x00ff00);
	this.add(arrowV);
	var arrowW = new THREE.ArrowHelper(arc.normal, arc.center);
	this.add(arrowW);

	var sampleMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff
	});

	var segments = 100;
	var lineGeometry = new THREE.Geometry();
	for (var i = 0; i <= segments; i++) {
		lineGeometry.vertices.push(arc.sample(i/segments));
	};

	var lineMaterial = new THREE.LineBasicMaterial({
	    color: 0x7f7f7f
	});

	var lineMesh = new THREE.Line(lineGeometry, lineMaterial);
	lineMesh.renderDepth = 1;
	this.add(lineMesh);

	function update() {
		for (var i = 0; i <= segments; i++) {
			lineGeometry.vertices[i].copy(arc.sample(i/segments));
		};
		lineGeometry.verticesNeedUpdate = true;
		lineGeometry.computeBoundingBox();
		lineGeometry.computeBoundingSphere();

		for (var i = 0; i < handles.length; i++) {
			handles[i].position.copy(arcVertices[i]);
		};
		arrowU.setDirection(arc.planeDirU);
		arrowU.position.copy(arc.center);
		arrowV.setDirection(arc.planeDirV);
		arrowV.position.copy(arc.center);
		arrowW.setDirection(arc.normal);
		arrowW.position.copy(arc.center);
		var size = arc.radius;
		arrowU.scale.set(size, size, size);
		arrowV.scale.set(size, size, size);
		arrowW.scale.set(size, size, size);
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
	this.updatePoints = updateArc;
}

ArcHelper.prototype = Object.create(THREE.Object3D.prototype);

module.exports = ArcHelper;