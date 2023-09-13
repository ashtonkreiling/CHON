import { bonds, updateScene } from "./engine.js";
import { levelOne } from "./levels.js";
import { Vector } from "./vector.js";
import { Carbon } from "./carbon.js";
import { Hydrogen } from "/hydrogen.js";
import { Nitrogen } from "./nitrogen.js";
import { Oxygen } from "./oxygen.js";

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

  function handleButtonClick(button) {
    // Get the buttonIndex from the data attribute
    const buttonIndex = button.getAttribute("data-button-index");

    // Find the associated <h6> element within the clicked button
    const buttonCount = button.querySelector("h6");
    // Check if the <h6> element exists

    let validCounter = false;

    if (buttonCount) {

      let oldCount = parseInt(buttonCount.textContent);
      let newCount = String(oldCount - 1);
      validCounter = newCount >= 0;

      // Change the text of the <h6> element
      if (validCounter) {
        buttonCount.textContent = newCount;
      }
    }

    if (validCounter) {
      const buttonName = button.querySelector("h1").textContent;
      let newParticleOne;
      let newParticleTwo;
      let origin = new Vector(0, 0);
      switch (buttonName) {
        case "C2":
          newParticleOne = new Carbon(levelOne.length, origin);
          newParticleTwo = new Carbon(
            levelOne.length + 1, 
            origin.addNum(newParticleOne.radius * 2), 
            newParticleOne.velocity
            )
          levelOne.push(newParticleOne);
          levelOne.push(newParticleTwo);
          break;
        case "O2":
          newParticleOne = new Oxygen(levelOne.length, origin);
          newParticleTwo = new Oxygen(
            levelOne.length + 1, 
            origin.addNum(newParticleOne.radius * 2), 
            newParticleOne.velocity
            )
          levelOne.push(newParticleOne);
          levelOne.push(newParticleTwo);
          break;
        case "N2":
          newParticleOne = new Nitrogen(levelOne.length, origin);
          newParticleTwo = new Nitrogen(
            levelOne.length + 1, 
            origin.addNum(newParticleOne.radius * 2), 
            newParticleOne.velocity
            )
          levelOne.push(newParticleOne);
          levelOne.push(newParticleTwo);
          break;
        case "H2":
          newParticleOne = new Hydrogen(levelOne.length, origin);
          newParticleTwo = new Hydrogen(
            levelOne.length + 1, 
            origin.addNum(newParticleOne.radius * 2), 
            newParticleOne.velocity
            )
          levelOne.push(newParticleOne);
          levelOne.push(newParticleTwo);
          break;
      }
    } else {

    }
    
}

// Add event listeners to all elements with the class 'menuButton'
const menuButtons = document.querySelectorAll('.menuButton');

menuButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleButtonClick(button);
    });
});

animate();
