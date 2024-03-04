// inputControls.ts
import { Scene, Vector3, KeyboardEventTypes } from "@babylonjs/core";

export class InputControls {
    private scene: Scene;
    public inputMap: { [key: string]: boolean } = {}; // Tracks which keys are being pressed

    constructor(scene: Scene) {
        this.scene = scene;
        scene.onKeyboardObservable.add((info) => {
            const evt = info.event;
            if (info.type === KeyboardEventTypes.KEYDOWN) {
                this.inputMap[evt.key] = true;
            } else if (info.type === KeyboardEventTypes.KEYUP) {
                this.inputMap[evt.key] = false;
            }
        });
    }

    public getInputVector(): Vector3 {
        let inputVector = Vector3.Zero();

        if (this.inputMap["w"] || this.inputMap["ArrowUp"]) {
            inputVector.addInPlace(Vector3.Forward());
        }
        if (this.inputMap["s"] || this.inputMap["ArrowDown"]) {
            inputVector.addInPlace(Vector3.Backward());
        }
        if (this.inputMap["a"] || this.inputMap["ArrowLeft"]) {
            inputVector.addInPlace(Vector3.Left());
        }
        if (this.inputMap["d"] || this.inputMap["ArrowRight"]) {
            inputVector.addInPlace(Vector3.Right());
        }

        return inputVector;
    }

    public isJumping(): boolean {
    return this.inputMap[" "]; // Assuming spacebar is used for jumping
}
}
