export class Bond {
    firstElementType;
    secondElementType;
    bondLength;
    firstElementId;
    secondElementId;

    constructor(
        firstElementType,
        secondElementType,
        bondLength,
        firstElementId,
        secondElementId
    ) {
        this.firstElementType = firstElementType;
        this.secondElementType = secondElementType;
        this.bondLength = bondLength;
        this.firstElementId = firstElementId;
        this.secondElementId = secondElementId;
    }

    draw() {
        throw new Error('Bonds Must Provide Their Own Draw Method');
    }
}

// Represents a single bond between two atoms
export class Sigma extends Bond {

    draw(particleOne, particleTwo, context) {
        //Set line stroke and width
        context.lineWidth = 5;

        //Draw a line
        context.beginPath();
        context.moveTo(particleOne.position[0] + particleOne.radius, particleOne.position[1] + particleOne.radius);
        context.lineTo(particleTwo.position[0] + particleTwo.radius, particleTwo.position[1] + particleTwo.radius);
        context.stroke();
    }

}

export class Pi extends Bond {}

