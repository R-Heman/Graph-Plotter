function Graph(options){
    this.canvas      = options.canvas;
    this.unitSquare  = options.unitSquare ?? 20;
    this.unitX       = options.unitX ?? 1;
    this.unitY       = options.unitY ?? 1;
    this.originX     = options.originX ?? 0.5;
    this.originY     = options.originY ?? 0.5;
    this.theme       = options.theme ?? {background:'white', foreground:'green', label:'black'};
    this.plots       = options.plots ?? [];
    this.letterHeight= options.letterHeight ?? 17;
    this.axisStrength= options.axisStrength ?? 2.2;
    this.mainStrength= options.mainStrength ?? 1;
    this.sideStrength= options.sideStrength ?? 0.4;
    this.plotStrength= options.plotStrength ?? 2;
    this.x           = function(coord) { //give coord get pixels
        return (this.unitSquare/this.unitX*coord) + (this.originX*this.canvas.width);
    }
    this.y           = function(coord) { //give coord get pixels
        return -(this.unitSquare/this.unitY*coord) + ((1-this.originY)*this.canvas.height);
    }
    this.X           = function(pixel) { //give pixel get coord
        return (pixel-this.originX*this.canvas.width) * (this.unitX/this.unitSquare);
    }
    this.Y           = function(pixel) { //give pixel get coord
        return -(pixel-(1 - this.originY)*this.canvas.height) * (this.unitY/this.unitSquare);
    }
    this.draw        = function(){
        let c          = this.canvas.getContext('2d');
        c.fillStyle=this.theme.background;
        c.fillRect(0,0,this.canvas.width, this.canvas.height);
        let letterWidth = 5/8*this.letterHeight;   // Empirically derived width to height ratio of monospace letters = 5/8
        c.font         = this.letterHeight + "px monospace";
        let pos, neg;
        for(i=1, j=1; ;i++,j++){
            let pos = this.y(0)+this.unitSquare/5*i;
            let neg = this.y(0)-this.unitSquare/5*j;
            c.beginPath();
            c.strokeStyle=this.theme.foreground;
            c.fillStyle=this.theme.label;
            if(i%5==0) {
                c.lineWidth     = this.mainStrength;
                let posLabel    = this.Y(pos).toFixed(2);
                let negLabel    = this.Y(neg).toFixed(2);
                let posOffset   = letterWidth*posLabel.length;
                let negOffset   = letterWidth*negLabel.length;

                c.fillText(posLabel, this.x(0)-posOffset, pos-1);
                c.fillText(negLabel, this.x(0)-negOffset, neg-1);
            } else {
                c.lineWidth = this.sideStrength;
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
            c.strokeStyle=this.theme.foreground;
            c.fillStyle=this.theme.label;
            if(i%5==0) {
                c.lineWidth     = this.mainStrength;
                let posLabel    = this.X(pos).toFixed(2);
                let negLabel    = this.X(neg).toFixed(2);
                c.fillText(posLabel, pos+1, this.y(0)+this.letterHeight);
                c.fillText(negLabel, neg+1, this.y(0)+this.letterHeight);
            } else {
                c.lineWidth = this.sideStrength;
            }
            c.moveTo(pos, 0);
            c.lineTo(pos, this.canvas.height);
            c.moveTo(neg, 0);
            c.lineTo(neg, this.canvas.height);
            c.stroke();
            if((neg < 0) && (pos > this.canvas.width)) break;
        }

        this.plot();
        c.beginPath();
        c.moveTo(0, this.y(0));
        c.lineTo(this.canvas.width,this.y(0));
        c.moveTo(this.x(0), 0);
        c.lineTo(this.x(0), this.canvas.height);
        c.lineWidth=this.axisStrength;
        c.strokeStyle=this.theme.label;
        c.stroke();
    }
    this.plot       = function(){
        for (item of this.plots){
            c = this.canvas.getContext('2d');
            c.beginPath();
            c.moveTo(0, this.y(math.evaluate(item.equation, { x: this.X(0)})) );
                for (i=1; i<=this.canvas.width; i++){
                    c.lineTo(i, this.y(math.evaluate(item.equation, { x: this.X(i)})) );
            }
            c.lineWidth=this.plotStrength;
            c.strokeStyle=item.color;
            c.stroke();
        }
    }
    this.draw();
}


//let graph = new Graph(document.getElementById("canvas"), 75, math.pi, 1, 0.5, 0.5, 'green');
let options = {
    canvas      : document.getElementById("canvas"),
    unitSquare  : 60,
    unitX       : math.pi,
    letterHeight: 15,
    plots   :[
        { equation: 'sin(x)', color:'blue'},
    ],

    theme       : {
                    background  : 'white',
                    foreground  : 'green',
                    label       : 'black'
    },

}
let graph = new Graph(options);
addEventListener('mousemove', (event) => { console.log(event.x + ' ' + event.y + '    ' + graph.X(event.x) + ' ' + graph.Y(event.y)) } );
console.log(graph.x(1)+' '+graph.y(1));
