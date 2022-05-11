var createFatLineGeometry = function (opt) {
    opt = opt || {};
    opt.forPoint = opt.forPoint || function (i, per) {
        return {
            x: i * 5,
            y: 0,
            z: 0
        }
    };
    opt.ptCount = opt.ptCount === undefined ? 20 : opt.ptCount;
    opt.colorSolid = opt.colorSolid === undefined ? false : opt.colorSolid;
    opt.color = opt.color === undefined ? new THREE.Color(0xffffff) : opt.color;

    // Position and Color Data
    var positions = [],
    colors = [],
    i = 0,
    point,
    geo;

    // for each point
    while (i < opt.ptCount) {
        // push point
        point = opt.forPoint(i, i / opt.ptCount);
        positions.push(point.x, point.y, point.z);

        // push color
        if (!opt.colorSolid) {
            opt.color.setHSL(i / opt.ptCount, 1.0, 0.5);
        }
        colors.push(opt.color.r, opt.color.g, opt.color.b);

        i += 1;
    }

    // return geo
    geo = new THREE.LineGeometry();
    geo.setPositions(positions);
    geo.setColors(colors);
    return geo;

};


class FatLine {
    constructor(type) {
        this.x = 0;
        this.z = 0;
        this.type = type;
        this.line = this.create_line();
    }

    create_line() {
        var fatline = new THREE.Object3D();
        var line;
        
        if (this.type == 0) {
            line = createFatLine({ width: 1,
                geo: createFatLineGeometry({
                    ptCount: 80,
                    colorSolid: true,
                    color: new THREE.Color(0x00ff00),
                    forPoint: function (i, per) {
                        return {
                            x: Math.cos(Math.PI*3*(per)) * RADIUS,
                            y: 0,
                            z: Math.sin(Math.PI*3*(per)) * RADIUS
                        }
                    }
                })
            });
        }
        else if (this.type == 1){
            line = createFatLine({ width: 1,
                geo: createFatLineGeometry({
                    ptCount: 80,
                    colorSolid: true,
                    color: new THREE.Color(0x00ff00),
                    forPoint: function (i, per) {
                        return {
                            x: i * 0.5/4 - 5,
                            y: 0,
                            z: Math.sin(Math.PI * 2 * (per)) * 2.5
                        }
                    }
                })
            });
        }
        
        fatline.add(line);
        fatline.position.y = 5;

        return fatline
    }
}