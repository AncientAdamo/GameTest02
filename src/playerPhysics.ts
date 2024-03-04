import { Ray, Mesh, Scene, Vector3, PhysicsImpostor, ArcRotateCamera, Quaternion, Scalar } from "@babylonjs/core";

export class PlayerPhysics {
    private mesh: Mesh;
    private scene: Scene;
    private camera: ArcRotateCamera;
    private lastInputVector: Vector3 | null = null;
    private mass: number; // Cache the mass here
    private isJumping: boolean = false; // Flag to indicate jumping state
    private rotationLock: boolean = false; // Flag to lock rotation
    private rotationLockFrames: number = 0; // Frames to keep rotation locked

    constructor(mesh: Mesh, scene: Scene, camera: ArcRotateCamera) {
        this.mesh = mesh;
        this.scene = scene;
        this.camera = camera;
        this.mass = mesh.physicsImpostor.mass; // Cache the mass of the mesh for later use
        
    }

    public update() {
        const additionalGravity = new Vector3(0, -9.81, 0);
        this.mesh.physicsImpostor.applyForce(additionalGravity.scale(this.mass), this.mesh.getAbsolutePosition());
    
        // Consider reducing or nullifying angular velocity if airborne or nearly stationary
        if (this.isAirborne() || this.isNearlyStationary()) {
            this.mesh.physicsImpostor.setAngularVelocity(Vector3.Zero());
        }
    
        // Apply a uniform approach to aligning rotation with camera
        this.alignAndLockRotationWithCamera();
    }

    public move(inputVector: Vector3) {
        if (!this.camera) {
            console.warn("Camera not set for PlayerPhysics instance.");
            return;
        }
    
        let forward = this.camera.getForwardRay().direction;
        forward.y = 0; // Maintain horizontal movement
        forward.normalize();
    
        const right = Vector3.Cross(Vector3.Up(), forward).normalize();
        let moveDirection = forward.scale(inputVector.z).add(right.scale(inputVector.x)).normalize();
    
        let currentVelocity = this.mesh.physicsImpostor.getLinearVelocity();
        let verticalVelocity = currentVelocity ? currentVelocity.y : 0;
        
        let horizontalVelocity = new Vector3(moveDirection.x * 15, 0, moveDirection.z * 15); // Adjust speed as needed
        let newVelocity = new Vector3(horizontalVelocity.x, verticalVelocity, horizontalVelocity.z);
        this.mesh.physicsImpostor.setLinearVelocity(newVelocity);
    
        this.lastInputVector = inputVector.clone();
    }

   
    public jump() {
        if (this.isOnGround()) {
            // Capture the current rotation quaternion before the jump
            const currentRotation = this.mesh.rotationQuaternion.clone();
    
            // Apply the jump force
            const jumpForce = new Vector3(0, 20 * this.mass, 0);
            this.mesh.physicsImpostor.applyImpulse(jumpForce, this.mesh.getAbsolutePosition());
    
            // Reapply the captured rotation immediately after the jump
            this.mesh.rotationQuaternion = currentRotation;
    
            // Optionally, you could also enforce this rotation after a very short delay, ensuring that any immediate physics responses don't override it
            setTimeout(() => {
                this.mesh.rotationQuaternion = currentRotation;
            }, 10); // Adjust the delay as necessary, though it should be very short
        }
    }
   
    public isOnGround(): boolean {
        const rayStart = this.mesh.position;
        const rayEnd = new Vector3(rayStart.x, rayStart.y - 1.1, rayStart.z);
        const ray = new Ray(rayStart, rayEnd.subtract(rayStart), 1.1);
        const pickInfo = this.scene.pickWithRay(ray, (mesh) => {
            return mesh !== this.mesh && mesh.isPickable && mesh.isVisible;
        });
        return !!pickInfo.hit;
    }

    public isAirborne(): boolean {
        // The player is considered airborne if not on the ground
        return !this.isOnGround();
    }
    public alignAndLockRotationWithCamera() {
        const cameraDirection = this.camera.getTarget().subtract(this.camera.position);
        cameraDirection.y = 0; // Ignore vertical component to focus on horizontal direction
        cameraDirection.normalize();
    
        // Check if the direction is too vertical or undefined
        if (!cameraDirection.lengthSquared() || isNaN(cameraDirection.x) || isNaN(cameraDirection.z)) {
            // Optionally handle the case where direction cannot be determined
            return;
        }
    
        const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
        this.mesh.rotationQuaternion = Quaternion.FromEulerAngles(0, angle, 0); // Locks vertical rotation and aligns horizontally
    }

 

    private isNearlyStationary(): boolean {
        const velocity = this.mesh.physicsImpostor.getLinearVelocity();
        const threshold = 0.1; // Define a low threshold for "nearly stationary"
        return velocity && velocity.lengthSquared() < threshold * threshold;
    }
    
    

}


