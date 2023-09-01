import { bonds, updateScene } from "./engine.js";
import { levelOne } from "./levels.js";
import { Vector } from "./vector.js";

const canvas = document.getElementById('gameCanvas');
export const context = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const ATOM_HEIGHT = 200;
const ATOM_WIDTH = 200;

let i = 0;
let isPaused = false; // Flag to track if the animation is paused
let originalImageData; // To store the original canvas content


function animate(){
    if (!isPaused) {
        i++;
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        for (let i = 0; i < levelOne.length; i++) {
          let currentParticle = levelOne[i];
          context.drawImage(
            currentParticle.image, 
            0, 
            0, 
            ATOM_WIDTH, 
            ATOM_HEIGHT, 
            currentParticle.position[0],
            currentParticle.position[1],
            200,
            200
          );
        }
        if (i % 1 == 0) {
            updateScene(context);
        }
    
        requestAnimationFrame(animate);
    } else {
        if (!originalImageData) {
            originalImageData = context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            context.fillStyle = "rgba(0, 0, 0, 0.2)";
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
