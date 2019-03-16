import { MOUSE, Raycaster } from "three";

var SelectControls = function (scene, camera, domElement) {
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

    this.onMouseMove = event => {
        event.preventDefault();
        var rect = domElement.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    this.onMouseDown = (callback, event) => {
        event.preventDefault();

        if (event.button == MOUSE.LEFT) {
            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                var object = intersects[0].object;
                object.material.emissive.setHex(0xff00ff);
                callback.select(object.userData.id);
            } else {
                callback.select(-1);
            }
        }
    };

    /*domElement.addEventListener("mousedown", onMouseDown, false);
      domElement.addEventListener("mousemove", onMouseMove, false);*/
};

export { SelectControls };
