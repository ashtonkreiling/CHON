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

    updateVelocity() {
        /*Need to add the following elements
         1. Particle Speeds Up Based On Surrounding Electric Charges
         2. Particle Slows Down From Bond Formation
         3. Particle Speeds Up From Bond Breakage
         5. Particle Bounces Off Other Particles*/
    }

    updateBonds() {
        /*Need to add the following elements
        1. If another particle exists within CHECK_RADIUS pixels and both particles have
        an electron gap, create a new bond, update 
        */
    }

}