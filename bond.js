import { Vector } from "./vector.js";

export class Bond {
    id;
    firstElementType;
    secondElementType;
    bondLength;
    firstElementId;
    secondElementId;

    constructor(
        id,
        firstElement,
        secondElement,
        bondLength,
        bondEnergy,
        bondOrder
    ) {
        this.id = id;
        this.firstElement = firstElement;
        this.secondElement = secondElement;
        this.bondLength = bondLength;
        this.bondEnergy = bondEnergy;
        this.bondOrder = bondOrder;
    }

    draw(context) {
        context.lineWidth = 5;
        let startLine = this.firstElement.position.addNum(this.firstElement.radius);
        let endLine = this.secondElement.position.addNum(this.secondElement.radius);
        let positiveOffsetStartSmall = new Vector(
            startLine[0],
            startLine[1] + 10,
        )
        let positiveOffsetEndSmall = new Vector(
            endLine[0],
            endLine[1] + 10,
        )
        let negativeOffsetStartSmall = new Vector(
            startLine[0],
            startLine[1] - 10,
        )
        let negativeOffsetEndSmall = new Vector(
            endLine[0],
            endLine[1] - 10
        )
        let positiveOffsetStartLarge = new Vector(
            startLine[0],
            startLine[1] + 15,
        )
        let positiveOffsetEndLarge = new Vector(
            endLine[0],
            endLine[1] + 15,
        )
        let negativeOffsetStartLarge = new Vector(
            startLine[0],
            startLine[1] - 15,
        )
        let negativeOffsetEndLarge = new Vector(
            endLine[0],
            endLine[1] - 15
        )
        switch(this.bondOrder) {
            case 1:
                context.beginPath();
                context.moveTo(...startLine);
                context.lineTo(...endLine);
                context.stroke();
                break;
            case 2:
                //Bond One
                context.beginPath();
                context.moveTo(...positiveOffsetStartSmall);
                context.lineTo(...positiveOffsetEndSmall);
                context.stroke();

                //Bond Two
                context.beginPath();
                context.moveTo(...negativeOffsetStartSmall);
                context.lineTo(...negativeOffsetEndSmall);
                context.stroke();
                break;
            case 3:
                //Bond One
                context.beginPath();
                context.moveTo(...positiveOffsetStartLarge);
                context.lineTo(...positiveOffsetEndLarge);
                context.stroke();

                //Bond Two
                context.beginPath();
                context.moveTo(...startLine);
                context.lineTo(...endLine);
                context.stroke();

                //Bond Three
                context.beginPath();
                context.moveTo(...negativeOffsetStartLarge);
                context.lineTo(...negativeOffsetEndLarge);
                context.stroke();
                break;
            default:
                console.log("MORE THAN 3");
        }
    }
}