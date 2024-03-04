// Declare Ammo.js physics engine global variable for TypeScript understanding
declare var Ammo: any;

// Import necessary Babylon.js modules and debug tools
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Engine,
    Scene,
    Vector3,
} from "@babylonjs/core";
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";
import { Environment } from "./environment"; // Import the environment setup
import { Player } from "./player"; // Import the player setup
import { SoccerBall } from './soccerBall'; // Import the soccer ball setup
import { SceneOptimizer, SceneOptimizerOptions } from "@babylonjs/core/Misc/sceneOptimizer";

class App {
    private scene: Scene;
    private engine: Engine;
    
    constructor() {
        // Create and append the canvas element to the DOM
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // Initialize the Babylon.js engine and scene with the created canvas
        this.engine = new Engine(canvas, true);
        this.scene = new Scene(this.engine);

        // Asynchronous initialization to ensure physics engine is loaded
        (async () => {
            await this.initPhysics(this.scene);
            
            // Create player instance once physics is initialized
            const playerInstance = new Player(this.scene, canvas);

            // Setup the environment (like ground, walls, etc.)
            new Environment(this.scene);

            // Add a soccer ball to the scene
            const soccerBall = new SoccerBall(this.scene);

              
              // Start Scene Optimizer
                SceneOptimizer.OptimizeAsync(this.scene, SceneOptimizerOptions.ModerateDegradationAllowed(), 
() => console.log("Optimization successful!"), 
                () => console.log("Could not reach the target FPS!"));
            // Start the render loop to continuously render the scene
            this.engine.runRenderLoop(() => {
                playerInstance.update(); // Update player each frame for movements and actions
                this.scene.render(); // Render the scene each frame
            });

            
        })();
    }

    // Method to initialize the physics engine with Ammo.js
    async initPhysics(scene: Scene) {
        await Ammo(); // Ensure Ammo.js is loaded and ready
        const gravityVector = new Vector3(0, -9.81, 0); // Define gravity direction and magnitude
        const physicsPlugin = new AmmoJSPlugin(true, Ammo); // Initialize the Ammo.js plugin for Babylon.js
        scene.enablePhysics(gravityVector, physicsPlugin); // Enable physics in the scene with the defined gravity
        // Optional: show the debug layer embedded into the canvas for development and debugging
        scene.debugLayer.show({
            embedMode: true,
        });
    }
}

// Instantiate the App class to kick off the application
new App();
