function Graph(canvas, unitSquare, unitX, unitY, originX, originY, theme){
    this.canvas     = canvas;
    this.unitSquare = unitSquare ?? 20;
    this.unitX      = unitX ?? 1;
    this.unitY      = unitY ?? 1;
    this.originX    = originX ?? 0.5;
    this.originY    = originY ?? 0.5;
    this.theme      = theme ?? 'green';
    this.plots      = [];
    this.x          = function(coord) { //give coord get pixels
        return (this.unitSquare/this.unitX*coord) + (this.originX*this.canvas.width);
    }
    this.y          = function(coord) { //give coord get pixels
        return -(this.unitSquare/this.unitY*coord) + ((1-this.originY)*this.canvas.height);
    }
    this.X          = function(pixel) { //give pixel get coord
        return (pixel-this.originX*this.canvas.width) * (this.unitX/this.unitSquare);
    }
    this.Y          = function(pixel) { //give pixel get coord
        return -(pixel-(1 - this.originY)*this.canvas.height) * (this.unitY/this.unitSquare);
    }
    this.draw       = function(){
        let c=this.canvas.getContext('2d');
        let pos, neg;
        for(i=1, j=1; ;i++,j++){
            let pos=this.y(0)+this.unitSquare/5*i;
            let neg=this.y(0)-this.unitSquare/5*j;
            c.beginPath();
            c.strokeStyle="green";
            if(i%5==0) {
                c.lineWidth=1;
            } else {
                c.lineWidth=0.4;
            }
            c.moveTo(0,                 pos);
            c.lineTo(this.canvas.width, pos);
            c.moveTo(0,                 neg);
            c.lineTo(this.canvas.width, neg);
            c.stroke();
            if((neg < 0) && (pos > this.canvas.height)) break;
        }

        for(i=1, j=1; ;i++,j++){
            let pos=this.x(0)+this.unitSquare/5*i;
            let neg=this.x(0)-this.unitSquare/5*j;
            c.beginPath();
            c.strokeStyle="green";
            if(i%5==0) {
                c.lineWidth=1;
            } else {
                c.lineWidth=0.4;
            }
            c.moveTo(pos, 0);
            c.lineTo(pos, this.canvas.height);
            c.moveTo(neg, 0);
            c.lineTo(neg, this.canvas.height);
            c.stroke();
            if((neg < 0) && (pos > this.canvas.width)) break;
        }

        c.beginPath();
        c.moveTo(0, this.y(0));
        c.lineTo(this.canvas.width,this.y(0));
        c.moveTo(this.x(0), 0);
        c.lineTo(this.x(0), this.canvas.height);
        c.lineWidth=2.2;
        c.strokeStyle='black';
        c.stroke();
    }
    this.plot       = function(equation, width, color){
        c = this.canvas.getContext('2d');
        c.beginPath();
        c.moveTo(0, this.y(math.evaluate(equation, { x: this.X(0)})) );
        for (i=1; i<=this.canvas.width; i++){
            c.lineTo(i, this.y(math.evaluate(equation, { x: this.X(i)})) );
        }
        c.lineWidth=width;
        c.strokeStyle=color;
        c.stroke();

    }
}

let graph = new Graph(document.getElementById("canvas"), 25, 1, 1, 0.5, 0.5, 'green');
graph.draw();
graph.plot('x', 2.1, 'red');
graph.plot('sin(x)', 2.1, 'blue');
addEventListener('mousemove', (event) => { console.log(event.x + ' ' + event.y + '    ' + graph.X(event.x) + ' ' + graph.Y(event.y)) } );
console.log(graph.x(1)+' '+graph.y(1));
