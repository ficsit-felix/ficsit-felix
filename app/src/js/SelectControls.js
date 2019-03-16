import {MOUSE,Raycaster} from "three";

var SelectControls = function (scene, camera, domElement) {
    var mouse = {
        x: 0,
        y: 0
    }

    var raycaster = new Raycaster();


    function onMouseMove(event) {
        event.preventDefault();
        var rect = domElement.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onMouseDown(event) {
        event.preventDefault();

        if (event.button == MOUSE.LEFT) {
            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(scene.children);
    
            if (intersects.length > 0) {
            var object = intersects[0].object;
            object.material.emissive.setHex(0xFF00FF);
            console.log(object);
            }
        }
    }


    domElement.addEventListener("mousedown", onMouseDown, false);
    domElement.addEventListener("mousemove", onMouseMove, false);
};

export { SelectControls };
