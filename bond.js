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
                context.moveTo(...startLine.addNum(10));
                context.lineTo(...endLine.addNum(10));
                context.stroke();

                //Bond Two
                context.beginPath();
                context.moveTo(...startLine.subNum(10));
                context.lineTo(...endLine.subNum(10));
                context.stroke();
                break;
            case 3:
                //Bond One
                context.beginPath();
                context.moveTo(...startLine.addNum(15));
                context.lineTo(...endLine.addNum(15));
                context.stroke();

                //Bond Two
                context.beginPath();
                context.moveTo(...startLine);
                context.lineTo(...endLine);
                context.stroke();

                //Bond Three
                context.beginPath();
                context.moveTo(...startLine.subNum(15));
                context.lineTo(...endLine.subNum(15));
                break;
            default:
                console.log("MORE THAN 3");
        }
    }
}