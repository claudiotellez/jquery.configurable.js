;(function () {

	var defaults = {
		target: this,
		part_class: 'part',
		option_class: 'option',
		option_selected_class: 'selected',
		onInit: null,
		onSetPartOption: null
	}

	var settings = {}

	var methods = {

		init: function (options) {

			settings = $.extend(true, defaults, options);
			settings.target = this;

			if (settings.onInit) settings.onInit({
				target: settings.target,
				parts: $(settings.target).find('.' + settings.part_class)
			});

		},

		setPartOption: function (args) {

			var fbmsg = 'success';


			if (args.part_id != undefined && typeof args.part_id == 'number') {

				$parts = $(settings.target).find('.' + settings.part_class);
				$part = $parts.eq(args.part_id);

				switch (typeof args.option_id) {

				case 'number':

					$options = $part.find('.' + settings.option_class);

					if (args.option_id > -1) {

						$option = $options.eq(args.option_id);

						//if the option exists
						if ($option.length > 0) {
							$option.siblings().removeClass(settings.option_selected_class);
							$option.addClass(settings.option_selected_class);
						} else {
							console.log('option does not exist');
						}

					}

				break;

				case 'string':

					$options = $part.find('.' + settings.option_class);

					switch (args.option_id) {

					case 'next':
						var conf = $(settings.target).Configurable('getCurrentConfiguration');
						var current = conf[settings.part_class + args.part_id];

						if (current < $options.length - 1) {
							$(settings.target).Configurable('setPartOption', {
								part_id: args.part_id,
								option_id: current + 1
							});
						}
					break;

					case 'prev':
						var conf = $(settings.target).Configurable('getCurrentConfiguration');
						var current = conf[settings.part_class + args.part_id];

						if (current > 0) {
							$(settings.target).Configurable('setPartOption', {
								part_id: args.part_id,
								option_id: current - 1
							});
						}
					break;

					case 'clear':
						$($options).removeClass(settings.option_selected_class);
						break

					}

					break;

					default:
						console.log('invalid parameters');
					break;

				break;

				}

			}

		},

		getCurrentConfiguration: function () {

			var r = {}

			$(this).find('.' + settings.part_class).each(function (k, v) {
				$v = $(v);
				r[settings.part_class + k] = $v.find('.' + settings.option_class + '.' + settings.option_selected_class).eq(0).index();
			});

			return (r);

		},

		clearConfiguration: function (rule_out) {

			$parts = $(settings.target).find('.' + settings.part_class);

			$parts.each(function (v) {

				$(settings.target).Configurable('setPartOption', {
					part_id: v,
					option_id: 'clear'
				});

			});

		}

	}

	$.fn.Configurable = function (method) {

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('invalid method call!');
		}

	};

})(jQuery);