import { Particle } from "./particle.js";
import { Vector } from "./vector.js";

const CANVAS_WIDTH = 600;

const MAX_ELECTRONEGATIVITY = 3.98;

let carbon_image = new Image();
carbon_image.src = './resources/carbon.png'

export class Carbon extends Particle {
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
            carbon_image,
            position,
            velocity,
            42,
            12,
            4,
            2.55,
            4 + (2.55/MAX_ELECTRONEGATIVITY),
            []
        )
    }
}