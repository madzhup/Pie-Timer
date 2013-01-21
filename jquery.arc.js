(function($){
	$.fn.arc = function(options){

		var opts = $.extend({
			width: 100,
			height: 100,
			outRadius: 35,
			inRadius: 30,
			percents: 0,
			color: '#fff',
			fontSize: 14,
			fontFamily: 'Arial, sans-serif',
			time: 2000,
			easing: 'linear'
		}, options);
		return this.each(function(){
			var self = this;
			self.opts = $.extend({}, opts);

			var ra = Raphael(self, self.opts.width, self.opts.height);
			if ($(self).data('percents'))
				self.opts.percents = $(self).data('percents');
			//self.opts.outRadius -= 1;

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
			var text = ra.text(self.opts.width/2, self.opts.height/2),
					outCircle = ra.circle(0, 0, self.opts.outRadius),
					inCircle = ra.circle(0, 0, self.opts.inRadius),
					circles = ra.set(),
					arcRadius = self.opts.outRadius-((self.opts.outRadius-self.opts.inRadius)/2),
					countTimer,
					count = 0;

			circles.push(outCircle, inCircle);

			circles.attr({
				cx: self.opts.width/2,
				cy: self.opts.height/2,
				stroke: self.opts.color
			});

			text.attr({
				fill: self.opts.color,
				'font-size': self.opts.fontSize,
				'font-family': self.opts.fontFamily
			});

			var arc = ra.path();
			arc.redraw = function(percents, time){
				if(percents > 100) percents = 100;
				if(time == 0 || time === undefined){
					text.attr({
						text: percents+'%'
					});
					arc.attr({
						"stroke": self.opts.color,
						"stroke-width": self.opts.outRadius-self.opts.inRadius,
						arc: [self.opts.width/2, self.opts.height/2, percents, 100, arcRadius]
					});
					count = percents;
				}
				else {
					var way = Math.abs(count-percents);
					countTimer = setInterval(function(){
						percents > count ? count++ : count--;

						text.attr({
							text: count+'%'
						});
						if(count == percents){
							clearInterval(countTimer);
						}
					}, time/way);
					arc.animate({
							arc: [self.opts.width/2, self.opts.height/2, percents, 100, arcRadius]
					}, time, self.opts.easing);
				}
				return arc;
			};
			arc.redraw(0, 0).redraw(self.opts.percents, self.opts.time);
			$(self).data('arc', arc);
		});
	}
})(jQuery);