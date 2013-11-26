;(function () {

	var settings = {}

	var methods = {

		init: function (options) {

			return this.each( function( v ) {

				var def = {
					target: $(this),
					part_class: 'part',
					option_class: 'option',
					option_selected_class: 'selected',
					onInit: null,
					onSetPartOption: null
				}

				settings = $.extend( true, v, def, options );
				$(this).data( 'Configurable', settings );
				data = $(this).data( 'Configurable');

				if ( data.onInit ) data.onInit( {
					target: this,
					parts: $( this ).find( '.' + data.part_class )
				} );

			} );

		},

		//set part option
		setPartOption: function (args) {

			//apply to each instance
			return this.each( function() {

				node = ( !args || !args.node ? this : args.node ); //node = target
				data = $(node).data('Configurable'); // get current configuration saved on this node

				if (args.part_id != undefined && typeof args.part_id == 'number') { //check if the args bring the proper data

					$parts = $( node ).find('.' + data.part_class); //get all parts of this node
					$part = $parts.eq(args.part_id); //get the specific part set

					switch( typeof args.option_id ) {

						case 'number': //if you're passing a number then selection the specific option

							$options = $part.find('.' + data.option_class);

							if (args.option_id > -1) {

								$option = $options.eq(args.option_id);

								//if the option exists
								if ($option.length > 0) {
									$option.siblings().removeClass(data.option_selected_class);
									$option.addClass(data.option_selected_class);
								} else {
									console.log('option does not exist');
								}

							}

						break;

						case 'string': //if it's a string then run one of the following sub methods

							$options = $part.find('.' + data.option_class); //get all options of the part

							switch (args.option_id) {

								case 'next': //set part to next option
									var conf = $(node).Configurable('getCurrentConfiguration');
									var current = conf[data.part_class + args.part_id];

									if (current < $options.length - 1) {
										$(node).Configurable('setPartOption', {
											part_id: args.part_id,
											option_id: current + 1
										});
									}
								break;

								case 'prev': //set part to prev option
									var conf = $(node).Configurable('getCurrentConfiguration');
									var current = conf[data.part_class + args.part_id];

									if (current > 0) {
										$(node).Configurable('setPartOption', {
											part_id: args.part_id,
											option_id: current - 1
										});
									}
								break;

								case 'clear': //clear of options of the specified part
									$( $options ).removeClass(data.option_selected_class);
								break;

							}

						break;

						default:
							console.log('invalid parameters');
						break;

					}

				}

				if( data.onSetPartOption ) data.onSetPartOption( {target: this, configuration: $(node).Configurable( 'getCurrentConfiguration' ) } );

			});

		},

		getCurrentConfiguration: function ( args ) { //get current configuration of the 

			node = ( !args || !args.node ? this : args.node );
			data = $(node).data('Configurable');

			var r = {}

			if( args && args.part_id > -1 ) { //if a part id specified, then only retrieve the configuration of the part

				var o = $( node ).find('.' + data.part_class).eq( args.part_id ).find('.' + data.option_class + '.' + data.option_selected_class).eq(0).index();
				r[data.part_class + args.part_id] = ( o < 0 ? null : o ); // if a part configuration is < 0 then show as null (parts with unselected option would show as -1)

			} else { //if no part id specified, then bring all the parts configuration

				$( node ).find( '.' + data.part_class ).each( function (k, v) {
					$v = $(v);
					var o = $v.find('.' + data.option_class + '.' + data.option_selected_class).eq(0).index();
					r[data.part_class + k] = ( o < 0 ? null : o ); // if a part configuration is < 0 then show as null (parts with unselected option would show as -1)
				} );

			}

			return (r);

		},

		clearConfiguration: function ( rule_out ) { //clear all configuration of the Configurable. You can rule out some parts of the Configurable passing a Array with the id of the parts you don't want to clear

			node = ( !args || !args.node ? this : args.node );

			$parts = $(node).find('.' + data.part_class);

			$parts.each(function (v) {
				
				if( rule_out.valueOf( $(v).index() ) < 0 ) {

					$(node).Configurable('setPartOption', {
						part_id: v,
						option_id: 'clear'
					});
					
				}

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
