import { Particle } from "./particle.js";
import { Vector } from "./vector.js";

const CANVAS_WIDTH = 600;

const MAX_ELECTRONEGATIVITY = 3.98;

let nitrogen_image = new Image();
nitrogen_image.src = './resources/nitrogen.png'

export class Nitrogen extends Particle {
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
            nitrogen_image,
            position,
            velocity,
            39,
            14,
            3,
            3.04,
            3 + (3.04/MAX_ELECTRONEGATIVITY),
            []
        )
    }
}