import { Particle } from "./particle.js";
import { Vector } from "./vector.js";

const CANVAS_WIDTH = 600;

const MAX_ELECTRONEGATIVITY = 3.98;

let hydrogen_image = new Image();
hydrogen_image.src = './resources/hydrogen.png'

export class Hydrogen extends Particle {
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
            hydrogen_image,
            position,
            velocity,
            30,
            1,
            1,
            2.2,
            1 + (2.2/MAX_ELECTRONEGATIVITY),
            []
        )
    }
}