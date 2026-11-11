// Constructor
function Model(name) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.count = 0;
    this.n = 40; // num vertices per polyline
    this.vertices = CreateSurfaceData(-1, 1, this.n);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STREAM_DRAW);

    this.count = this.vertices.length/3;

    this.Draw = function() {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
        
        for (let i=0; i<this.n*2; i++) {
            gl.drawArrays(gl.LINE_STRIP, i*this.n, this.n);
        }
        // gl.drawArrays(gl.LINE_STRIP, 0, this.count);
        //gl.drawArrays(gl.LINES, 0, this.count);
    }
}

function deg2rad(angle) {
    return angle * Math.PI / 180;
}
const sin = a => Math.sin(a);
const cos = a => Math.cos(a);
const tg  = a => Math.tan(a);
const pi = Math.PI

function CreateSurfaceData(start = -1, end = 1, n = 8)
{
    function linspace(start, stop, num, endpoint = true) {
        const div = endpoint ? (num - 1) : num;
        const step = (stop - start) / div;
        return Array.from({length: num}, (_, i) => start + step * i);
    }

    u = linspace(start, end, n);
    v = linspace(start, end, n);
    vertexList = [];
    
    // ==== Twice Oblique Trochoid Cylindroid ====
    const H = 1, c = 5, alpha = 0.033*pi, phi = 0;
    const p = 8*pi, theta0 = 0.5;
    const theta = u => p*u + theta0
    const x = (u, v) => c*u + v*(sin(phi) + tg(alpha)*cos(phi)*cos(theta(u)))
    const y = (u, v) => v*tg(alpha)*sin(theta(u))
    const z = (u, v) => H + v*(tg(alpha)*sin(phi)*cos(theta(u))-cos(phi))
    // U lines 
    for (let i=0; i<n; i++){
        for (let j=0; j<n; j++)
        {
            vertexList.push(x(u[i], v[j]), y(u[i], v[j]), z(u[i], v[j]))
        }
    }

    // V lines 
    for (let j=0; j<n; j++){
        for (let i=0; i<n; i++)
        {
            vertexList.push(x(u[i], v[j]), y(u[i], v[j]), z(u[i], v[j]))
        }
    }

    // // ==== Parabola ====
    // // U lines
    // // let arr = [];
    // for (let i=0; i<n; i++){
    //     for (let j=0; j<n; j++)
    //         vertexList.push( u[i], v[j], u[i]*u[i] + v[j]*v[j] );
    // }
    // // V lines
    // for (let j=0; j<n; j++){
    //     for (let i=0; i<n; i++)
    //         vertexList.push( u[i], v[j], u[i]*u[i] + v[j]*v[j] );
    // }

    // ===================

    // // V lines
    // for (let v=start; v<=end; v+=step) {
    //     vertexList.push( u, v, u*u + v*v );
    // }

    // cylinder
    // for (let i=0; i<360; i+=2) {
    //     vertexList.push( Math.sin(deg2rad(i)), 1, Math.cos(deg2rad(i)) );
    //     vertexList.push( Math.sin(deg2rad(i)), 0, Math.cos(deg2rad(i)) );
    // }

    return vertexList;
}