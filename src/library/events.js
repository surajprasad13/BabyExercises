export default class Events {

	/**
	 * Increment used for unique callback ids.
	 * 
	 * @type {Number}
	 */
	increment = 1;

	/**
	 * Object/Array of listeners, which are called on trigger.
	 * 
	 * @type {Object}
	 */
	listeners = {};

	/**
	 * Add an event listener to the listeners object.
	 * 
	 * @param  {String}   slug 
	 * @param  {Function} callback
	 * @return {Number}
	 */
	addListener(slug, callback) {
		// add the slug if it doesn't exist
		if (typeof this.listeners[slug] == 'undefined') {
			this.listeners[slug] = {};
		}

		// return if the callback is not a function
		if (typeof callback !== 'function') {
			return;
		}

		let index = this.increment;

		// add the listener to listeners
		this.listeners[slug][index] = callback;

		// increment the index for the next listener
		this.increment++;

		// return the index of the callback, for future use
		return index;
	}

	/**
	 * Remove an event listener from the listeners object.
	 * 
	 * @param  {String} slug
	 * @param  {Number} index
	 * @return {Void}
	 */
	removeListener(slug, index) {
		if (typeof this.listeners[slug] == 'object' && typeof this.listeners[slug][index] == 'function') {
			delete this.listeners[slug][index];
		}
	}

	/**
	 * Trigger a specific slug from the listeners object.
	 * 
	 * @param  {String} slug
	 * @return {Number}
	 */
	trigger(slug, params = {}) {
		if (typeof this.listeners[slug] !== 'object') {
			return 0;
		}

		let keys = Object.keys(this.listeners[slug]);
		let fired = 0;
		for (var i = 0; i < keys.length; i++) {
			this.listeners[slug][keys[i]](params);

			fired++;
		}
		return fired;
	}

};