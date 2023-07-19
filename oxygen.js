import { Particle } from "./particle.js";
import { Vector } from "./vector.js";

const CANVAS_WIDTH = 600;

const MAX_ELECTRONEGATIVITY = 3.98;

let oxygen_image = new Image();
oxygen_image.src = './resources/oxygen.png'

export class Oxygen extends Particle {
    constructor(
        id, 
        position = new Vector(
            Math.random() * (CANVAS_WIDTH - 76),
            Math.random() * (CANVAS_WIDTH - 76)
        ),
        velocity = new Vector(
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ),
    ) {
        super(
            id,
            oxygen_image,
            position,
            velocity,
            38,
            16,
            2,
            3.44,
            2 + (3.44/MAX_ELECTRONEGATIVITY),
            []
        );
    }

}