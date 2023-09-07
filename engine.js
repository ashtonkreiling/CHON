import { Vector } from "./vector.js";
import { Bond } from "./bond.js";
import { levelOne } from "./levels.js";

const CANVAS_WIDTH = 600;
const CHECK_RADIUS = 200;


export let bonds = [];
let bondId = 0;

export function updateScene(context) {
    for (let i = 0; i < levelOne.length; i++) {
        let particle = levelOne[i];
        let collision = detectCollisions(i);
        if (collision[0] > 0) {
            resolveCollision(particle, collision);
        }
        formBonds(i);
        forceBalance(i);
        particle.updateVelocity();
        particle.updatePosition();
    }
    drawBonds(context);
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

function formBonds(i) {
    let particleOne = levelOne[i];
    let particleOneBonds = particleOne.bonds;
    for (let j = i + 1; j < levelOne.length; j++) {
        let particleTwo = levelOne[j];
        let particleTwoBonds = particleTwo.bonds;
        let distance = particleOne.position.subtract(particleTwo.position).magnitude();

        let bondExists = bonds.find(
            x => x.firstElement.id === particleOne.id && x.secondElement.id === particleTwo.id
            )
        
        if (distance <= CHECK_RADIUS) {
            let bond = new Bond(bondId, particleOne, particleTwo, 100, 100, 1);
            if (!bondExists) {
                particleOneBonds.push(bond);
                particleTwoBonds.push(bond);
                bonds.push(bond);
                particleOne.electronGap -= 1;
                particleTwo.electronGap -= 1;
                particleOne.charge -= 1;
                particleTwo.charge -= 1;
            } else {
                let gapsAvailable = particleOne.electronGap >= 1 && particleTwo.electronGap >= 1;
                if (gapsAvailable && bondExists.bondOrder < 3) {
                    particleOne.electronGap -= 1;
                    particleTwo.electronGap -= 1;
                    particleOne.charge -= 1;
                    particleTwo.charge -= 1;
                    bondExists.bondOrder += 1;
                }
            }
            bondId += 1;
        }
        if (
            distance > CHECK_RADIUS &&
            bondExists
        ) {
            let bond = bondExists;
            particleOneBonds.splice(particleOneBonds.indexOf(bond), 1);
            particleTwoBonds.splice(particleTwoBonds.indexOf(bond), 1);
            bonds.splice(bonds.indexOf(bond), 1);
            particleOne.electronGap += bond.bondOrder;
            particleTwo.electronGap += bond.bondOrder;
            particleOne.charge += bond.bondOrder;
            particleTwo.charge += bond.bondOrder;
        }
    }
}

function drawBonds(context) {
    for (let i = 0; i < bonds.length; i++) {
        let bond = bonds[i];
        bond.draw(context);
    }
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
        let force =  100 * (particleCharge * otherBodyCharge) / (distance ** 2);
        let particleAcceleration = delta.multByNum(force).divByNum(particle.mass);
        let otherBodyAcceleration = delta.multByNum(force).divByNum(otherBody.mass);
        if (distance > 150) {
            particle.velocity = particle.velocity.subtract(particleAcceleration);
            otherBody.velocity = otherBody.velocity.add(otherBodyAcceleration);
        }
    }
    bondForceBalance(i);
}

function bondForceBalance(i) {
    let particleOne = levelOne[i];
    let particleBonds = bonds.filter(x => x.firstElement.id === particleOne.id);
    for (let j=0; j<particleBonds.length; j++) {
        let bond = particleBonds[j];
        let particleTwo = levelOne[bond.secondElement.id];
        let delta = particleOne.position.subtract(particleTwo.position);
        let distance = delta.magnitude();
        let bondLengthDifference = Math.abs(distance - bond.bondLength);
        let force = .01 / bondLengthDifference;
        let particleAcceleration = delta.multByNum(force).divByNum(particleOne.mass);

        if (distance > bond.bondLength) {
            particleOne.velocity = particleOne.velocity.subtract(particleAcceleration);
            particleTwo.velocity = particleTwo.velocity.add(particleAcceleration);
        } else if (distance < bond.bondLength) {
            particleOne.velocity = particleOne.velocity.add(particleAcceleration);
            particleTwo.velocity = particleTwo.velocity.subtract(particleAcceleration);
        }

        if (bondLengthDifference < 20) {
            particleOne.velocity = particleOne.velocity.multByNum(.5);
            particleTwo.velocity = particleTwo.velocity.multByNum(.5);
        }
    }
}