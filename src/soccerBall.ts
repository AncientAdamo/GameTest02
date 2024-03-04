import { Scene, MeshBuilder, Vector3, StandardMaterial, Color3, PhysicsImpostor, Mesh } from '@babylonjs/core';

export class SoccerBall {
    private scene: Scene;
    public ball: Mesh;

    constructor(scene: Scene) {
        this.scene = scene;
        this.ball = this.createBall();
    }

    private createBall(): Mesh {
        // Create a sphere that will act as the soccer ball
        const ball = MeshBuilder.CreateSphere("soccerBall", { diameter: 3 }, this.scene);
        ball.position = new Vector3(0, 10, 0); // Adjust initial position as needed

        // Set up the ball's material (optional)
        const ballMaterial = new StandardMaterial("ballMaterial", this.scene);
        ballMaterial.diffuseColor = new Color3(1, 1, 1); // Soccer ball color - white
        ball.material = ballMaterial;

        // Add a physics impostor to the ball for physics interactions
        ball.physicsImpostor = new PhysicsImpostor(ball, PhysicsImpostor.SphereImpostor, { mass: 0.5, restitution: 0.9 }, this.scene);

        return ball;
    }

    public getMesh(): Mesh {
        return this.ball;
    }
}
