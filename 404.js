function drawFilledCircle(ctx, x, y, radius, color){
	ctx.beginPath();
	ctx.arc( x, y, radius, 0, 2*Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

function drawEmptyCircle( ctx, x, y, radius, color ){
	ctx.beginPath();
	ctx.arc( x, y, radius, 0, 2*Math.PI);
	ctx.strokeStyle = color;
	ctx.stroke();
}

function drawLine( ctx, x1, y1, x2, y2, color ){
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function getXPoint( origin, distance, radians ){
	return origin + ( distance * Math.cos( radians ) );	
}

function getYPoint( origin, distance, radians ){
	return origin - ( distance * Math.sin( radians ) );
}

function drawRadar( ctx, x1, y1, radius, degrees, color ){
	var x2, y2;
	var radians = ( 2 * Math.PI / 360 ) * degrees;
	
	x2 = getXPoint( x1, radius, radians );
	y2 = getYPoint( y1, radius, radians );
	
	drawLine( ctx, x1, y1, x2, y2, color );
}

function initializePoints(centerx, centery, radius){
	var arry = [];
	for( var i = 0; i < 5; i++ ){
		var x = centerx + (( Math.random() * 2 * radius ) - radius);
		var y = centery - (( Math.random() * 2 * radius ) - radius);
		
		arry.push( [x,y] );
	}
	return arry;
}

function lineintersect( linex1, liney1, degrees, pointx, pointy ){
	// Have to reverse y calculation because 0 is near the top of canvas, 
	// therefore numbers are reversed.
	var ydelta = liney1 - pointy; 
	var xdelta = pointx - linex1;
		
	angle = Math.atan( ydelta / xdelta );
	angle = angle * 360 / ( 2 * Math.PI );
	
	//angle = angle + 90;
	
	if( xdelta < 0){
		if (ydelta < 0){
			angle = angle + 180;
		} else {
			angle = angle - 180;
		}
	}
	
	if( angle < 0 ){
		angle = angle + 360;
	}
	if( angle >= 360 ){
		angle = angle - 360;
	}
	
	if( Math.round( angle ) == Math.round( degrees ) ){
		return true;
	} else {
		return false;
	}
}

function drawPoints__Maybe(ctx, x1, y1, degrees, points){
	var point, x, y, pointIterator, radians;
	
	for( pointIterator = 0; pointIterator < points.length; pointIterator++ ){
		point = points[pointIterator];
		x = point[0];
		y = point[1];
		
		// Add 5 to degrees so that the dot shows up after the bar passes.
		if( lineintersect( x1, y1, degrees + 5, x, y) ){
			drawFilledCircle( ctx, x, y, 2, 'red');
		}
	}
	
}

function rotateRadar( ctx, x1, y1, radius, color, backgroundColor, degrees, points ){
	var newDegrees = degrees - 1;
	if( newDegrees == 0 ){
		newDegrees = 360;
	}
	
	drawRadarBackground( ctx, x1, y1, radius + 5, backgroundColor, color );
	drawRadar( ctx, x1, y1, radius - 10, newDegrees, color );
	drawPoints__Maybe( ctx, x1, y1, newDegrees, points );
	
	return newDegrees;	
}

function drawRadarBackground( ctx, x, y, radius, darkColor, lightColor ){
	drawFilledCircle( ctx, x, y, radius - 5, darkColor );
	
	drawLine( ctx, x, y, x+radius, y, lightColor );
	drawLine( ctx, x, y, x-radius, y, lightColor );
	drawLine( ctx, x, y, x, y+radius, lightColor );
	drawLine( ctx, x, y, x, y-radius, lightColor );
	
	drawEmptyCircle( ctx, x, y, radius - 10, lightColor );
	drawEmptyCircle( ctx, x, y, ( radius / 2 ) - 10, lightColor );
	drawEmptyCircle( ctx, x, y, 2 * radius / 3, lightColor );
}

window.onload = function() {
	var c = document.getElementById('radar');
	var ctx = c.getContext('2d');
	var width = c.width;
	var height = c.height;
	
	var centerx = width / 2;
	var centery = height / 2;
	
	var originalBackgroundColor = 'rgb( 0, 34, 0 )';
	var backgroundColor = 'rgba( 0, 34, 0, 0.05)';
	var lineColor = 'rgba( 155, 232, 24, 1)';
	
	var degrees = 135;
	
	var points = initializePoints(centerx, centery, centery - 30);
	
	drawRadarBackground( ctx, centerx, centery, centery, originalBackgroundColor, lineColor );
		
	var code = function() {
		degrees = rotateRadar( ctx, centerx, centery, centery - 5, lineColor, backgroundColor, degrees, points );
	};
	
	setInterval( code, 10 );
};
