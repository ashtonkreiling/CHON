export class Vector extends Array {
    add(other) {
        return this.map((e,i) => e + other[i]);
    }
    subtract(other) {
        return this.map((e, i) => e - other[i]);
    }
    multiply(other) {
        return this.map((e, i) => e * other[i]);
    }
    divide(other) {
        return this.map((e, i) => e / other[i]);
    }
    dot(other) {
        return this.map((e,i) => e * other[i]).reduce((partialSum, a) => partialSum + a, 0);
    }
    magnitude() {
        return this.reduce((a, curr) => a + curr ** this.length, 0) ** (1/this.length);
    }
    multByNum(num) {
        return this.map(x => x * num);
    }
    divByNum(num) {
        return this.map(x => x / num);
    }
}