import { ArcRotateCamera, Scene, Vector3, Mesh, Tools } from "@babylonjs/core";
import { ArcRotateCameraPointersInput } from "@babylonjs/core/Cameras/Inputs/index";

export function createCamera(scene: Scene, canvas: HTMLCanvasElement, playerMesh: Mesh): ArcRotateCamera {
    const camera = new ArcRotateCamera(
        "camera0",
        -Math.PI / 2 - 0.2, // Alpha - Horizontal rotation
        Tools.ToRadians(60), // Beta - Vertical angle, adjust for better height
        10, // Radius - Distance from the player, adjust for better view
        playerMesh.position.add(new Vector3(1, 3, 1)), // Adjust Y for height above player
        scene
    );

    camera.attachControl(canvas, true);

    // Remove default camera controls that may interfere
    camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
    camera.inputs.removeByType("ArcRotateCameraMouseWheelInput");

    // Adjust camera's inertia for smoother transitions
    camera.inertia = 0.85; // Increase for smoother movement, decrease for more direct control

    camera.lowerBetaLimit = 0.8; // Prevent the camera from looking directly up
    camera.upperBetaLimit = Math.PI / 2 - 0.01; // Prevent the camera from looking directly down

    // Set camera limits and sensitivities
    const pointersInput = camera.inputs.attached.pointers as ArcRotateCameraPointersInput;
    if (pointersInput) {
        pointersInput.angularSensibilityX = 1500; // Adjust as needed
        pointersInput.angularSensibilityY = 1500; // Adjust as needed
    }

    // Lock the camera's target to the player mesh
    camera.lockedTarget = playerMesh;

    // Enable pointer lock on canvas click for immersive experience
    scene.onPointerDown = () => {
        scene.getEngine().enterPointerlock();
    };

    // Smoothly update the camera target position
    const updateRate = 10; // How often to update the camera target position in milliseconds
    setInterval(() => {
        // Optionally, interpolate towards the target for even smoother following
        const targetPosition = playerMesh.position.add(new Vector3(1, 3, 1));
        camera.setTarget(Vector3.Lerp(camera.getTarget(), targetPosition, 0.1));
    }, updateRate);

    return camera;

    
}
