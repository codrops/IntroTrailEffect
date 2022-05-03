import { gsap } from 'gsap';

/**
 * Class representing a fake progress loader
 */
export class FakeProgress {
	// DOM elements
	DOM = {
		// Main element
		el: null,
	};
	progressVal = {value: 0};

	/**
	 * Constructor.
	 * @param {Element} DOM_el
	 */
	constructor(DOM_el) {
		this.DOM.el = DOM_el;
	}
	/**
	 * Simulates a loading progress.
	 * @param {Function} onProgressComplete callback
	 * @return {GSAP Timeline}
	 */
	onComplete(onProgressComplete) {
		return gsap.timeline().to(this.progressVal, {
			duration: 1.5,
			ease: 'steps(14)',
			value: 100,
			onUpdate: () => this.DOM.el.innerHTML = Math.floor(this.progressVal.value) + '%',
			onComplete: onProgressComplete
		})
		// then hide it
		.to(this.DOM.el, {
			duration: 0.7,
			ease: 'power3.inOut',
			opacity: 0
		});
	}
}