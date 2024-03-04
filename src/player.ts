// Import necessary Babylon.js classes and custom modules for player setup
import { ArcRotateCamera, Scene, MeshBuilder, Vector3, PhysicsImpostor, Mesh, Color3, StandardMaterial, Texture, Quaternion } from "@babylonjs/core";
import { InputControls } from "./inputControls"; // Manages player input
import { createCamera } from "./cameraSetup"; // Configures the player's camera
import { PlayerPhysics } from "./playerPhysics"; // Handles physics interactions for the player

// Defines the Player class
export class Player {
    private scene: Scene; // Reference to the Babylon.js scene
    private inputControls: InputControls; // Input controller for managing player actions
    private mesh: Mesh; // The player's mesh in the scene
    private playerPhysics: PlayerPhysics; // Physics logic specific to the player
    public camera: ArcRotateCamera; // The camera attached to the player, made public for external access

    // Constructor initializes the player within the provided scene and attaches a camera
    constructor(scene: Scene, canvas: HTMLCanvasElement) {
        this.scene = scene; // Store reference to the scene
        this.mesh = this.createPlayerMesh(); // Create the player's mesh
        this.camera = createCamera(scene, canvas, this.mesh); // Initialize the camera and attach it to the player
        this.inputControls = new InputControls(scene); // Setup input controls for the player
        this.playerPhysics = new PlayerPhysics(this.mesh, this.scene, this.camera); // Initialize player-specific physics handling
    }

    // Creates the player's mesh, setting up its appearance and physics properties
    private createPlayerMesh(): Mesh {
    // Create a sphere to represent the player
    const sphere = MeshBuilder.CreateSphere("player", {diameter: 2, segments: 32}, this.scene);
    sphere.position = new Vector3(0, 1, 0); // Adjust position as needed

    const material = new StandardMaterial("playerMaterial", this.scene);
    material.diffuseColor = new Color3(1, 1, 1); // Set to white to not affect the texture's colors

    // Apply the striped texture
    const texture = new Texture("path/to/your/stripedTexture.png", this.scene);
    material.diffuseTexture = texture;

    sphere.material = material;

    // Add physics to the sphere
    sphere.physicsImpostor = new PhysicsImpostor(sphere, PhysicsImpostor.SphereImpostor, { mass: 2, restitution: 0.5 }, this.scene);

    return sphere;
}

    // Returns the player's mesh. Useful for external classes that need to interact with the player
    public getMesh(): Mesh {
        return this.mesh;
    }

    // The main update loop for the player, called every frame to handle input and physics updates
    public update() {
        const inputVector = this.inputControls.getInputVector();
        this.playerPhysics.move(inputVector);
        
        if (this.inputControls.isJumping()) {
            this.playerPhysics.jump();
        }
        
        // Update physics first
        this.playerPhysics.update();
       
    }

}
