import { oxygen } from "./oxygen.js";
import { carbon } from "./carbon.js";
import { Vector } from "./vector.js";

const CANVAS_WIDTH = 600;
const CHECK_RADIUS = 200;

const levelOne = [oxygen, carbon];

export function updateScene(context) {
    for (let i = 0; i < levelOne.length; i++) {
        let particle = levelOne[i];
        let collision = detectCollisions(i);
        if (collision[0] > 0) {
            resolveCollision(particle, collision);
        }
        formBonds(i, context);
        forceBalance(i);
        particle.updateVelocity();
        particle.updatePosition();
    }
}

function detectCollisions(i) {
    let particle = levelOne[i];
    let collision = [0, 0, 0]; // depth, angle
    let depth = 0;
    let direction = 0;
    let particleXPosition = particle.position[0];
    let particleYPosition = particle.position[1];
    if (particleXPosition > CANVAS_WIDTH - (2 * particle.radius)) {
        depth = particleXPosition - (CANVAS_WIDTH - (2 * particle.radius));
        direction = 0;
        if (depth > collision[0]) {
            collision = [depth, direction, -1];
        }
    } else if (particleXPosition < 0) {
        depth = 0 - particleXPosition;
        direction = Math.PI;
        if (depth > collision[0]) {
            collision = [depth, direction, -1];
        }
    }
    
    if (particleYPosition > CANVAS_WIDTH - (2 * particle.radius)) {
        depth = particleYPosition - (CANVAS_WIDTH - (2 * particle.radius));
        direction = Math.PI/2;
        if (depth > collision[0]) {
            collision = [depth, direction, -1];
        }
    } else if (particleYPosition < 0) {
        depth = 0 - particleYPosition;
        direction = 3 * Math.PI/2;
        if (depth > collision[0]) {
            collision = [depth, direction, -1];
        }
    }

    for (let j = i + 1; j < levelOne.length; j++) {
        let particleTwo = levelOne[j];
        let delta = particle.position.subtract(particleTwo.position);
        if (delta.magnitude() < (particle.radius + particleTwo.radius)) {
            depth = particle.radius + particleTwo.radius - delta.magnitude();
            direction = Math.abs(Math.atan(delta[0]/delta[1]));
            if (depth > collision[0]) {
                collision = [depth, direction, j];
            }
        }
    }
    return collision;
}

function resolveCollision(particle, collision) {
    //Update Position To Prevent Sinking
    let rotatedPosition = rotateCoordinates(particle.position, collision[1]);
    let depthVector = new Vector(
        collision[0]*Math.cos(collision[1]), 
        collision[0]*Math.sin(collision[1])
        );
    let rotatedDepth = rotateCoordinates(depthVector, collision[1]);
    rotatedPosition = rotatedPosition.subtract(rotatedDepth);
    particle.position = rotateCoordinates(rotatedPosition, -collision[1]);

    //Update Velocity
    solveElasticCollision(particle, collision);
}

// Takes a vector and an angle in radians and rotates it into the collision direction
function rotateCoordinates(vector, angle) {
    const rotationMatrix = [
        new Vector(Math.cos(angle), -Math.sin(angle)),
        new Vector(Math.sin(angle), Math.cos(angle))
    ];
    let rotatedVector = new Vector(
        vector.dot(rotationMatrix[0]),
        vector.dot(rotationMatrix[1])
    )
    return rotatedVector;
}

function solveElasticCollision(particle, collision) {
    let rotatedVelocityParticleOne = rotateCoordinates(particle.velocity, collision[1]);
    let otherBodyIndex = collision[2]
    if (otherBodyIndex == -1) {
        rotatedVelocityParticleOne[0] *= -1;
        particle.velocity = rotateCoordinates(rotatedVelocityParticleOne, -collision[1]);
    } else {
        let otherBody = levelOne[otherBodyIndex];
        let Mb = otherBody.mass;
        let Ma = particle.mass;
        let velocityParticleOne = particle.velocity;
        let velocityOtherBody = otherBody.velocity;
        let positionParticleOne = particle.position;
        let positionOtherBody = otherBody.position;

        let particleOneMassPrefix = (2*Mb)/(Mb + Ma);
        let otherBodyMassPrefix = (2*Ma)/(Mb + Ma);

        let particleOnePositionDelta = positionParticleOne.subtract(positionOtherBody);
        let otherBodyPositionDelta = positionOtherBody.subtract(positionParticleOne);

        let particleOneDotProduct = velocityParticleOne.subtract(velocityOtherBody).dot(particleOnePositionDelta);
        let otherBodyDotProduct = velocityOtherBody.subtract(velocityParticleOne).dot(otherBodyPositionDelta);

        let particleOneDotComponent = particleOneDotProduct/(particleOnePositionDelta.magnitude()**2);
        let otherBodyDotComponent = otherBodyDotProduct/(otherBodyPositionDelta.magnitude()**2);

        let particleOneSuffix = particleOnePositionDelta.multByNum(particleOneDotComponent).multByNum(particleOneMassPrefix);
        let otherBodySuffix = otherBodyPositionDelta.multByNum(otherBodyDotComponent).multByNum(otherBodyMassPrefix);

        particle.velocity = particle.velocity.subtract(particleOneSuffix);
        otherBody.velocity = otherBody.velocity.subtract(otherBodySuffix); 
    }
}

function formBonds(i, context) {
    let particleOne = levelOne[i];
    let particleOneGaps = particleOne.electronGap;
    let particleOneBonds = particleOne.bonds;
    for (let j = i + 1; j < levelOne.length; j++) {
        let particleTwo = levelOne[j];
        let particleTwoGaps = particleTwo.electronGap;
        let particleTwoBonds = particleTwo.bonds;
        let distance = particleOne.position.subtract(particleTwo.position).magnitude();
        if (distance <= CHECK_RADIUS) {
            if (!particleOneBonds.includes(j)) {
                particleOneBonds.push(j);
                particleTwoBonds.push(i);
                particleOneGaps -= 1;
                particleTwoGaps -= 1;
                particleOne.charge -= 1;
                particleTwo.charge -= 1;
            }
            drawBonds(i, j, context);
        }
        if (
            distance > CHECK_RADIUS &&
            particleOneBonds.includes(j)
        ) {
            particleOneBonds = particleOneBonds.splice(particleOneBonds.indexOf(j));
            particleTwoBonds = particleTwoBonds.splice(particleTwoBonds.indexOf(i));
            particleOneGaps += 1;
            particleTwoGaps += 1;
            particleOne.charge += 1;
            particleTwo.charge += 1;
        }
    }
}

function drawBonds(i, j, context) {

    let particleOne = levelOne[i];
    let particleTwo = levelOne[j];

    //Set line stroke and width
    context.lineWidth = 5;

    //Draw a line
    context.beginPath();
    context.moveTo(particleOne.position[0] + particleOne.radius, particleOne.position[1] + particleOne.radius);
    context.lineTo(particleTwo.position[0] + particleTwo.radius, particleTwo.position[1] + particleTwo.radius);
    context.stroke();
}

function forceBalance(i) {
    let particle = levelOne[i];
    let particleCharge = particle.charge
    let particlePosition = particle.position
    for (let j=i+1; j < levelOne.length; j++) {
        let otherBody = levelOne[j];
        let otherBodyCharge = otherBody.charge;
        let otherBodyPosition = otherBody.position;
        let delta = particlePosition.subtract(otherBodyPosition);
        let distance = delta.magnitude();
        let force = 50 * (particleCharge * otherBodyCharge) / (distance ** 2);
        let acceleration = delta.multByNum(force);
        let particleAcceleration = delta.multByNum(force).divByNum(particle.mass);
        let otherBodyAcceleration = delta.multByNum(force).divByNum(otherBody.mass);
        if (distance > 50) {
            particle.velocity = particle.velocity.subtract(particleAcceleration);
            otherBody.velocity = otherBody.velocity.add(otherBodyAcceleration);
        }
    }
}