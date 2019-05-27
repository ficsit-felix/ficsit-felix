import { CurvePath, Vector3, Matrix4, Math as _Math } from 'three';

// Custom extension of the CurvePath only used to display Conveyor Belt splines
function ConveyorCurvePath() {
	CurvePath.call(this);
}

ConveyorCurvePath.prototype = Object.create(CurvePath.prototype);
ConveyorCurvePath.prototype.constructor = ConveyorCurvePath;


/*
	Code from https://github.com/mrdoob/three.js/blob/dev/src/extras/curves/CubicBezierCurve3.js
	Changed to fix conveyor belt roll (see https://github.com/bitowl/ficsit-felix/issues/36) by always setting the normal to point up in z direction
*/
ConveyorCurvePath.prototype.computeFrenetFrames = function (segments, closed) {
	console.log("COMPUTE FRENET FRAMES.");
	// see http://www.cs.indiana.edu/pub/techreports/TR425.pdf

	var normal = new Vector3();

	var tangents = [];
	var normals = [];
	var binormals = [];

	var vec = new Vector3();
	var mat = new Matrix4();

	var i, u, theta;

	// compute the tangent vectors for each segment on the curve

	for (i = 0; i <= segments; i++) {

		u = i / segments;

		tangents[i] = this.getTangentAt(u);
		tangents[i].normalize();

	}

	// select an initial normal vector perpendicular to the first tangent vector,
	// and in the direction of the minimum tangent xyz component

	normals[0] = new Vector3();
	binormals[0] = new Vector3();

	// ONLY CHANGE TO ORIGINAL CODE: conveyor belts always face upwards
	normal.set(0, 0, 1);

	console.log(normal);

	vec.crossVectors(tangents[0], normal).normalize();

	normals[0].crossVectors(tangents[0], vec);
	binormals[0].crossVectors(tangents[0], normals[0]);


	// compute the slowly-varying normal and binormal vectors for each segment on the curve

	for (i = 1; i <= segments; i++) {

		normals[i] = normals[i - 1].clone();

		binormals[i] = binormals[i - 1].clone();

		vec.crossVectors(tangents[i - 1], tangents[i]);

		if (vec.length() > Number.EPSILON) {

			vec.normalize();

			theta = Math.acos(_Math.clamp(tangents[i - 1].dot(tangents[i]), - 1, 1)); // clamp for floating pt errors

			normals[i].applyMatrix4(mat.makeRotationAxis(vec, theta));

		}

		binormals[i].crossVectors(tangents[i], normals[i]);

	}

	// if the curve is closed, postprocess the vectors so the first and last normal vectors are the same

	if (closed === true) {

		theta = Math.acos(_Math.clamp(normals[0].dot(normals[segments]), - 1, 1));
		theta /= segments;

		if (tangents[0].dot(vec.crossVectors(normals[0], normals[segments])) > 0) {

			theta = - theta;

		}

		for (i = 1; i <= segments; i++) {

			// twist a little...
			normals[i].applyMatrix4(mat.makeRotationAxis(tangents[i], theta * i));
			binormals[i].crossVectors(tangents[i], normals[i]);

		}

	}

	return {
		tangents: tangents,
		normals: normals,
		binormals: binormals
	};

};

export { ConveyorCurvePath };