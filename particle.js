export class Particle {
    image;
    position;
    velocity;
    radius;
    mass;
    electronGap;
    electronegativity;
    charge;
    bonds;

    constructor(
        id,
        image, // The image for this element: file path
        position, // The particle's position in space: Vector
        velocity, // The particle's velocity: Vector
        radius, // The particle's radius in pixels: Integer
        mass, // The particle's mass: Integer
        electronGap, // The number of electrons missing from the element's outermost valence shell: Integer
        electronegativity, // The element's electronegativity: Float
        charge, // The charge the element exerts on nearby particles - a function of electron state: Float
        bonds, // A list of bonds currently connected to the element
        ) {
        this.id = id;
        this.image = image;
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.mass = mass;
        this.electronGap = electronGap;
        this.electronegativity = electronegativity;
        this.charge = charge;
        this.bonds = bonds;
    }

    updatePosition() {
        this.position = this.position.add(this.velocity);
    }

    findRelativeOrientation(otherParticle) {
        let delta = this.position.subtract(otherParticle.position);
        let depth = this.radius + otherParticle.radius - delta.magnitude();
        let direction = Math.abs(Math.atan(delta[0]/delta[1]));
        return [depth, direction, otherParticle.id]
    }
}