import React from 'react';
import _ from 'lodash';
import $ from 'jQuery';

import Surface from './heat';
import Inferno from './inferno.json';
import Magma from './magma.json';

export default class Canvas extends React.Component {
    constructor() {
        super();

        this._fac = 5;
        this._counter = 0;
        this._mousePressed = false;
        
        _.bindAll(this, ['_evolve', 'handleMouseMove', 'handleMouseDown', 'handleMouseUp']);   
    }

    render() {
        return (
            <div>
                <canvas id="canvas"
                        onMouseDown={ this.handleMouseDown }
                        onMouseMove={ this.handleMouseMove }
                        onMouseUp={ this.handleMouseUp } />
                <div class="toolbar">
                    <button>
                        Pen
                    </button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._setupCanvas();
        this._setupSurface();
        window.requestAnimationFrame(this._evolve);
    }

    handleMouseDown(e) {
        this._mousePressed = true;
        console.log(this._mousePressed);
    }
    
    handleMouseMove(e) {        
        if (this._mousePressed) {
            const x = e.clientX / this._fac;
            const y = e.clientY / this._fac;
            this._surface.temperatureCircle(x, y, 20 / this._fac, 1);
        }
    }

    handleMouseUp(e) {
        this._mousePressed = false;
    }
    
    _evolve() {
        this._counter++;
        if (this._counter % 2 == 0) {
            this._surface.evolve();
            this._paintSurface();
        }
        window.requestAnimationFrame(this._evolve);
    }
    
    _setupCanvas() {
        const width = Math.ceil(window.innerWidth/this._fac);
        const height = Math.ceil(window.innerHeight/this._fac);
        
        this._canvas = document.getElementById("canvas");
        this._canvas.width = this._fac*width;
        this._canvas.height = this._fac*height;
        this._ctx = this._canvas.getContext('2d');
        this._ctx.scale(this._fac, this._fac);
        
        this._halfCanvas = $("<canvas>").attr("width", width).attr("height", height)[0];
        this._halfCtx = this._halfCanvas.getContext("2d");
        this._imageData = this._halfCtx.createImageData(width, height);

        this._width = width;
        this._height = height;
    }

    _setupSurface() {
        this._surface = new Surface(this._width, this._height);
        this._paintSurface();
    }
    
    _paintSurface() {
        const T = this._surface.T;
        const width = this._surface.width;
        const height = this._surface.height;
        const Palette = Magma;
        const paletteLength = Palette.R.length;
        
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let idx = Math.round(Math.pow(T[j * width + i], 2) * paletteLength);
                idx = Math.min(Math.max(idx, 0), paletteLength-1);
                
                this._imageData.data[(j * width * 4) + i * 4] = Palette.R[idx] * 255;
                this._imageData.data[(j * width * 4) + i * 4 + 1] = Palette.G[idx] * 255;
                this._imageData.data[(j * width * 4) + i * 4 + 2] = Palette.B[idx] * 255;
                this._imageData.data[(j * width * 4) + i * 4 + 3] = 255;
            }
        }

        this._halfCtx.putImageData(this._imageData, 0, 0);
        this._ctx.drawImage(this._halfCanvas, 0, 0);
    }
    
}
