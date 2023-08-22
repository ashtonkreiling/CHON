import { bonds, updateScene } from "./engine.js";
import { levelOne } from "./levels.js";
import { Vector } from "./vector.js";

const canvas = document.getElementById('gameCanvas');
export const context = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const ATOM_HEIGHT = 200;
const ATOM_WIDTH = 200;

const oxygen = levelOne[0];
const carbon = levelOne[1];

let i = 0;
let isPaused = false; // Flag to track if the animation is paused
let originalImageData; // To store the original canvas content


function animate(){
    if (!isPaused) {
        i++;
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.drawImage(oxygen.image, 0, 0, ATOM_WIDTH, ATOM_HEIGHT, oxygen.position[0], oxygen.position[1], 200, 200);
        context.drawImage(carbon.image, 0, 0, ATOM_WIDTH, ATOM_HEIGHT, carbon.position[0], carbon.position[1], 200, 200);
        if (i % 1 == 0) {
            updateScene(context);
        }
    
        requestAnimationFrame(animate);
    } else {
        if (!originalImageData) {
            originalImageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          }
    }
}

  function pause(event) {
    if (!isPaused) {
        isPaused = true;
        let mousePosition = new Vector(
            event.clientX,
            event.clientY
        )
        let lowestMagnitude = 999999;
        let nearestParticleIndex = -1;

        for (let i = 0; i < levelOne.length; i++) {
            let currentMagnitude = levelOne[i].position.subtract(mousePosition).magnitude();
            if (currentMagnitude < lowestMagnitude) {
                lowestMagnitude = currentMagnitude;
                nearestParticleIndex = i;
            }
        }

        console.log(levelOne[nearestParticleIndex]);
    }
  }

  function unpause() {
    if (isPaused) {
        isPaused = false;
        restoreCanvas();
        animate();
    }
    
  }
  
  function restoreCanvas() {
    // Restore the original canvas content
    if (originalImageData) {
      context.putImageData(originalImageData, 0, 0);
      originalImageData = null;
    }
  }
  
  canvas.addEventListener("mousedown", pause);
  document.addEventListener("mouseup", unpause);

animate();
