(function($){
	$.fn.arc = function(options){
		 
		var opts = $.extend({
			width: 100,
			height: 100,
			outRadius: 0,
			inRadius: 0,
			percents: 0,
			color: 'transparent',
			fontSize: 14,
			time: 1000,
			easing: 'linear'
		}, options);
		return this.each(function(){
			
			var ra = Raphael(this, opts.width, opts.height);
			opts.percents = $(this).data('percents');
			opts.outRadius -= 1;
			
			// Custom Arc Attribute, position x&y, value portion of total, total value, Radius
			ra.customAttributes.arc = function (xloc, yloc, value, total, R) {
					var alpha = 360 / total * value,
							a = (90 - alpha) * Math.PI / 180,
							x = xloc + R * Math.cos(a),
							y = yloc - R * Math.sin(a),
							path;
					if (total == value) {
							path = [
									["M", xloc, yloc - R],
									["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
							];
					} else {
							path = [
									["M", xloc, yloc - R],
									["A", R, R, 0, +(alpha > 180), 1, x, y]
							];
					}
					return {
							path: path
					};
			};
			var text = ra.text(opts.width/2, opts.height/2, 0+'%'),
					outCircle = ra.circle(0, 0, opts.outRadius),
					inCircle = ra.circle(0, 0, opts.inRadius),
					circles = ra.set(),
					arcRadius = opts.outRadius-((opts.outRadius-opts.inRadius)/2),
					countTimer,
					count = 0;
			
			circles.push(outCircle, inCircle);
			
			circles.attr({
				cx: opts.width/2,
				cy: opts.height/2,
				stroke: opts.color
			});
			
			text.attr({
				fill: opts.color,
				'font-size': opts.fontSize
			});
			
			//make an arc at 50,50 with a radius of 30 that grows from 0 to 40 of 100 with a bounce
			var arc = ra.path().attr({
					"stroke": opts.color,
					"stroke-width": opts.outRadius-opts.inRadius,
					arc: [opts.width/2, opts.height/2, 0, 100, arcRadius]
			});
			countTimer = setInterval(function(){
				count++;
				text.attr({
					text: count+'%'
				});
				if(count == opts.percents){
					clearInterval(countTimer);
				}
			}, opts.time/opts.percents);
			arc.animate({
					arc: [opts.width/2, opts.height/2, opts.percents, 100, arcRadius]
			}, opts.time, opts.easing);
			
			
		});
	}
})(jQuery);