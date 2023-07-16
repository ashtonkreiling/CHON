import { Particle } from "./particle.js";
import { Vector } from "./vector.js";

const CANVAS_WIDTH = 600;

const MAX_ELECTRONEGATIVITY = 3.98;

let carbon_image = new Image();
carbon_image.src = './resources/carbon.png'

export const carbon = new Particle(
    carbon_image, 
    new Vector(
        200,
        200
        //Math.random() * (CANVAS_WIDTH - 85),
        //Math.random() * (CANVAS_WIDTH - 85)
    ),
    new Vector(
        4,
        -4
        //Math.floor(Math.random() * 10),
        //Math.floor(Math.random() * 10)
    ),
    42,
    12,
    4,
    2.55,
    4 + (2.55/MAX_ELECTRONEGATIVITY),
    []
)