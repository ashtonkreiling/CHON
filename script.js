import { oxygen } from "./oxygen.js";
import { carbon } from "./carbon.js";
import { updateScene } from "./engine.js";

const canvas = document.getElementById('gameCanvas');
export const context = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const ATOM_HEIGHT = 200;
const ATOM_WIDTH = 200;

/*const oxygen = new Image();
oxygen.src = './resources/oxygen.png';

const nitrogen = new Image();
nitrogen.src = './resources/nitrogen.png';

const hydrogen = new Image();
hydrogen.src = './resoures/hydrogen.png';

const carbon = new Image();
carbon.src = './resources/carbon.png';*/

let i = 0;

function animate(){
    i++;
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.drawImage(oxygen.image, 0, 0, ATOM_WIDTH, ATOM_HEIGHT, oxygen.position[0], oxygen.position[1], 200, 200);
    context.drawImage(carbon.image, 0, 0, ATOM_WIDTH, ATOM_HEIGHT, carbon.position[0], carbon.position[1], 200, 200);
    updateScene(context);
    requestAnimationFrame(animate);
}
animate();