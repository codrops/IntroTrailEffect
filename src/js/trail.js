/**
 * Class representing a Trail element, 
 * an element that has [trailElems] children/clones (of type image or text) 
 * and that we can use to stagger it's translation so it looks like a trail or dragging effect 
 */
class Trail {
	// DOM elements
	DOM = {
		// Main element (.trail)
		el: null,
		// Trail child elements (.trail__img or .trail__text)
		trailElems: null,
	};
	// option defaults
	defaults = {
		// 3d
		perspective: false,
		// Total number of inner image elements
		totalTrailElements: 4,
	};

	/**
	 * Constructor.
	 * @param {Element} DOM_el - the .trail element
	 */
	constructor(DOM_el, options) {
		this.DOM.el = DOM_el;
		this.options = Object.assign(this.defaults, options);

		// 3d
		if ( this.options.perspective ) {
			this.DOM.el.style.perspective = `${this.options.perspective}px`
		}
	}
}

/**
 * Class representing an image trail element
 */
export class TrailImage extends Trail {
	// the image path
	bgImage;

	/**
	 * Constructor.
	 * @param {Element} DOM_el - the .trail element
	 */
	constructor(DOM_el, options) {
		super(DOM_el, options);
		// Get the main element's background image url 
		this.bgImage = /(?:\(['"]?)(.*?)(?:['"]?\))/.exec(this.DOM.el.style.backgroundImage)[1];
		// Create the HTML markup for the trail elements
		this.layout();
	}
	/**
	 * Creates the HTML markup for the trail elements
	 */
	layout() {
		// Remove the background image from the main element
		this.DOM.el.style.backgroundImage = 'none';

		let innerHTML = '';
		for (let i = 0; i <= this.options.totalTrailElements - 1; ++i) {
			const opacityVal = i === this.options.totalTrailElements - 1 ? 1 : 0.8;//1/this.options.totalTrailElements * i + 1/this.options.totalTrailElements
			innerHTML += `<img class="trail__img" src="${this.bgImage}" style="opacity: ${opacityVal}"/>`;
		}
		// Append to the main element
		this.DOM.el.innerHTML = innerHTML;

		// Get inner .trail__img elements
		this.DOM.trailElems = this.DOM.el.querySelectorAll('.trail__img');

		this.DOM.el.classList.add('trail');
	}
	reset() {
		this.DOM.el.classList.remove('trail');
		this.DOM.el.style.backgroundImage = `url(${this.bgImage})`;
		this.DOM.el.innerHTML = '';
		if ( this.options.perspective ) {
			this.DOM.el.style.perspective = 'none';
		}
	}
}

/**
 * Class representing a text trail element
 */
export class TrailText extends Trail {
	/**
	 * Constructor.
	 * @param {Element} DOM_el - the .trail element
	 */
	constructor(DOM_el, options) {
		super(DOM_el, options);
		// Create the HTML markup for the trail elements
		this.layout();
	}
	/**
	 * Creates the HTML markup for the trail elements
	 */
	layout() {
		// Get the main element's innerHTML
		this.content = this.DOM.el.innerHTML;

		let innerHTML = '';
		for (let i = 0; i <= this.options.totalTrailElements - 1; ++i) {
			const opacityVal = i === this.options.totalTrailElements - 1 ? 1 : 1/this.options.totalTrailElements * i + 1/this.options.totalTrailElements
			innerHTML += `<span class="trail__text" style="opacity: ${opacityVal}">${this.content}</span>`;
		}
		// Append to the main element
		this.DOM.el.innerHTML = innerHTML;

		// Get inner .trail__text elements
		this.DOM.trailElems = this.DOM.el.querySelectorAll('.trail__text');

		this.DOM.el.classList.add('trail');
	}
	reset() {
		this.DOM.el.classList.remove('trail');
		this.DOM.el.innerHTML = this.content;
		if ( this.options.perspective ) {
			this.DOM.el.style.perspective = 'none';
		}
	}
}
