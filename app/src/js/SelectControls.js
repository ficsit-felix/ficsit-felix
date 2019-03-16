import { MOUSE, Raycaster } from "three";

var SelectControls = function (scene, camera, domElement, callback) {
    this.callback = null;

    this.bindCallback = function (callback) {
        console.log("callback:" + callback);
        this.callback = callback;
    };

    // private
    var mouse = {
        x: 0,
        y: 0
    };

    var raycaster = new Raycaster();


    var scope = this;
    this.callback = callback;

    function onMouseMove (event) {
        event.preventDefault();
        var rect = domElement.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    function onMouseDown (event) {
        event.preventDefault();

        if (event.button == MOUSE.LEFT) {
            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                var object = intersects[0].object;
                // object.material.emissive.setHex(0xff00ff);
                scope.callback.select(object.userData.id);
            } else {
                scope.callback.select(-1);
            }
        }
    };

    domElement.addEventListener("mousedown", onMouseDown, false);
    domElement.addEventListener("mousemove", onMouseMove, false);

    this.destroy = () => {
        domElement.removeEventListener("mousedown", onMouseDown);
        domElement.removeEventListener("mousemove", onMouseMove);
    };
};

export { SelectControls };
