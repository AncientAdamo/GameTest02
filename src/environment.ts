// Add these imports at the top of your environment.ts file
import { PhysicsImpostor, StandardMaterial, Color3, Scene, MeshBuilder, Vector3, HemisphericLight, PBRMaterial, Texture, MirrorTexture, Plane } from "@babylonjs/core";

export class Environment {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createGround();
    this.createWalls();
    this.createLight();
    this.createSlope(); // Call the method to create the slope

  }

  private createGround() {
    const ground = MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, this.scene);
    ground.isPickable = true;
    // Use PBRMaterial for better lighting interaction
    const groundMaterial = new PBRMaterial("groundMaterial", this.scene);
    groundMaterial.albedoColor = new Color3(0.5, 0.5, 0.5);
    groundMaterial.metallic = 0.0;
    groundMaterial.roughness = 0.5;

    // Reflection
    const mirrorTexture = new MirrorTexture("mirror", 1024, this.scene, true);
    mirrorTexture.mirrorPlane = new Plane(0, -1, 0, -0.01);
    mirrorTexture.level = 1;
    groundMaterial.reflectionTexture = mirrorTexture;
    groundMaterial.reflectionTexture.level = 0.5;

    // Gradient texture
    groundMaterial.albedoTexture = new Texture("textures/gradientTexture.png", this.scene);
    groundMaterial.useAlphaFromAlbedoTexture = false;

    ground.material = groundMaterial;

    // Add a physics impostor to the ground
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, friction: 0 }, this.scene);
  }

  private createWalls() {
    const wallThickness = 0.5;
    const wallHeight = 9.5;
    const walls = [
      MeshBuilder.CreateBox("wall1", { width: 50 + wallThickness * 2, height: wallHeight, depth: wallThickness }, this.scene),
      MeshBuilder.CreateBox("wall2", { width: 50 + wallThickness * 2, height: wallHeight, depth: wallThickness }, this.scene),
      MeshBuilder.CreateBox("wall3", { width: wallThickness, height: wallHeight, depth: 50 }, this.scene),
      MeshBuilder.CreateBox("wall4", { width: wallThickness, height: wallHeight, depth: 50 }, this.scene),
    ];
    walls[0].position.z = -25 - wallThickness / 2;
    walls[1].position.z = 25 + wallThickness / 2;
    walls[2].position.x = -25 - wallThickness / 2;
    walls[3].position.x = 25 + wallThickness / 2;

    const wallMaterial = new StandardMaterial("wallMaterial", this.scene);
    wallMaterial.diffuseColor = new Color3(1, 1, 1);
    walls.forEach(wall => {
      wall.material = wallMaterial;
      // Add physics impostors to each wall
      wall.physicsImpostor = new PhysicsImpostor(wall, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this.scene);
    });
  }

  private createSlope() {
    const slopeLength = 8; // Shorter length of the slope
    const slopeHeight = 5; // Lower height of the slope
    const slopeWidth = 8; // Width of the slope remains the same
    
    // Create a box to use as a slope
    const slope = MeshBuilder.CreateBox("slope", { width: slopeWidth, height: slopeHeight, depth: slopeLength }, this.scene);
    slope.position = new Vector3(0, slopeHeight / 12, 8); // Moving it forward in the scene
    
    // Calculate the rotation to make the slope inclined
    // atan2 is used for a more precise angle calculation
    slope.rotation.z = -Math.atan2(slopeHeight, slopeLength); // Negative to slope upwards as it moves away

    // Material for the slope (optional)
    const slopeMaterial = new StandardMaterial("slopeMaterial", this.scene);
    slopeMaterial.diffuseColor = new Color3(0.8, 0.4, 0.2); // Example: Orange color for visibility
    slope.material = slopeMaterial;

    // Add a physics impostor to the slope
    slope.physicsImpostor = new PhysicsImpostor(slope, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this.scene);
}

  private createLight() {
    new HemisphericLight("light1", new Vector3(1, 10, 0), this.scene);
  }
}
