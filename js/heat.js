export default class Surface {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.borderTemperature = 0;

        this.time = 0;
        this.T0 = new Float64Array(this.width * this.height);
        this.T = new Float64Array(this.width * this.height);
        this.k = new Float64Array(this.width * this.height);
        
        this.T.fill(0.);
        this.T0.fill(0.);
        this.k.fill(0.1);
    }

    evolve(steps = 1) {
        const S = this.width;
        let avg = 0.;
        for (let s = 0; s < steps; s++) {
            this.T0.set(this.T);
            avg = 0;
            
            for (let i = 1; i < this.width - 1; i++) {
                for (let j = 1; j < this.height - 1; j++) {
                    let dTx = this.T0[j * S + i + 1] - 2 * this.T0[j * S + i] + this.T0[j * S + i - 1];
                    let dTy = this.T0[(j+1) * S + i] - 2 * this.T0[j * S + i] + this.T0[(j-1) * S + i];

                    this.T[j * S + i] = this.T0[j * S + i] + this.k[j * S + i] * (dTx + dTy);
                    avg += this.T[j * S + i];
                }
            }
        }


        this.time++;
    }

    temperatureCircle(left, top, radius, T) {
        for (let i = 1; i < this.width - 1; i++) {
            for (let j = 1; j < this.height - 1; j++) {
                const d2 = ((i-left)*(i-left) + (j-top) * (j-top))/(radius*radius);
                if (d2 < 1) {
                    const dT = T * Math.exp(-d2*d2);
                    this.T[j * this.width + i] = Math.min(this.T[j * this.width + i] + dT, 1);
                }
            }
        }
    }
}
