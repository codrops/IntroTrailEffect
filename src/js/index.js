import { preloadImages } from './utils'
import { TrailImage, TrailText } from './trail';
import { FakeProgress } from './fakeProgress';
import { TextLinesReveal } from './textLinesReveal';
import { animationDefaults } from './gsapAnimation';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

// trail elements (Image and the two intro title elements (up and down)
const trailImage = new TrailImage(document.querySelector('.intro-image'), {perspective: 1000, totalTrailElements: 8});
const trailTextTop = new TrailText(document.querySelector('.intro-content__title--up'), {perspective: 1000, totalTrailElements: 2});
const trailTextBottom = new TrailText(document.querySelector('.intro-content__title--down'), {totalTrailElements: 3});

// DOM elements
const frame = {
	menu: document.querySelector('.button-menu'),
	logo: document.querySelector('.logo'),
	progress: document.querySelector('.intro-progress')
};
const intro = {
	image: document.querySelector('.intro-content__image'),
	enterButton: document.querySelector('.button-enter'),
};
const content = {
	titleTop: document.querySelector('.content__title--up'),
	titleBottom: document.querySelector('.content__title--down'),
	about: document.querySelector('.content__about'),
	aboutText: document.querySelector('.content__about-text'),
	finalImagePlacement: document.querySelector('.content__image--2'),
	otherImages: document.querySelectorAll('.content__image--1 > .content__image-inner, .content__image--3 > .content__image-inner')
}

// the TextLinesReveal instance (animate each text line of the about text using the SplitText library)
const aboutLines = new TextLinesReveal(content.aboutText);

// state
let state = {
	isAnimating: false,
	iscontentOpen: false
};

// First step: fake progress and move the image to the center of the screen. Also animate the top/bottom texts in and show the enter button
const showIntro = () => {
	
	if ( state.isAnimating ) {
		return false;
	}
	state.isAnimating = true;

	gsap.timeline({
		defaults: animationDefaults,
		onComplete: () => {
			// Reset the trails structure on the texts and image
			trailTextTop.reset();
			trailTextBottom.reset();
			trailImage.reset();

			state.isAnimating = false;
		}
	})
	.addLabel('start', 0)
	.add(() => {
		// Let's use the gsap Flip plugin to animate the image into a new element (.intro-content__image)
		// Get state
		const state = Flip.getState(trailImage.DOM.trailElems);
		// Change place
		intro.image.appendChild(trailImage.DOM.el);
		// Flip
		Flip.from(state, {
			duration: animationDefaults.duration,
			ease: animationDefaults.ease,
			stagger: -0.03,
			scale: true
			//rotateY: 360,
		})
	}, 'start') 
	// Hide the intro title trail elements initially and show its parents which are hidden by default (CSS)
	.set([trailTextTop.DOM.trailElems, trailTextBottom.DOM.trailElems], {
		opacity: 0
	}, 'start')
	.set([trailTextTop.DOM.el, trailTextBottom.DOM.el], {
		opacity: 1
	}, 'start')
	// Now translate the title elements
	.to(trailTextTop.DOM.trailElems, {
		y: 0,
		startAt: {rotateY: 160, opacity: 0},
		rotateY: 0,
		opacity: 1,
		stagger: -0.1
	}, 'start')
	.to(trailTextBottom.DOM.trailElems, {
		y: 0,
		opacity: 1,
		stagger: -0.08,
	}, 'start')
	// And show the intro enter button
	.to(intro.enterButton, {
		startAt: {opacity: 0, scale: 0.8},
		opacity: 1,
		scale: 1
	}, 'start+=0.3')
	.add(() => {
		// Show the logo and menu button 
		frame.menu.classList.add('show');
		frame.logo.classList.add('show');
	}, 'start+=0.3');
	
};

// Second step: show the other images and scale down the texts
const showContent = () => {
	
	if ( state.isAnimating || state.iscontentOpen ) {
		return false;
	}
	state.isAnimating = true;
	state.iscontentOpen = true;

	gsap.timeline({
		defaults: animationDefaults,
		onComplete: () => {
			state.isAnimating = false;
		}
	})
	.addLabel('start', 0)
	.to(intro.enterButton, {
		duration: 0.6,
		opacity: 0, 
		scale: 0.8,
	}, 'start')
	.add(() => {

		const topTitleState = Flip.getState(trailTextTop.DOM.el);
		const bottomTitleState = Flip.getState(trailTextBottom.DOM.el);
		
		content.titleTop.appendChild(trailTextTop.DOM.el);
		content.titleBottom.appendChild(trailTextBottom.DOM.el);
		
		Flip.from(topTitleState, {
			duration: animationDefaults.duration,
			ease: animationDefaults.ease,
			scale: true
		});
		
		Flip.from(bottomTitleState, {
			duration: animationDefaults.duration,
			ease: animationDefaults.ease,
			scale: true
		});
		
		const imageState = Flip.getState(trailImage.DOM.el, {props: 'border-radius'});
		// Change place
		content.finalImagePlacement.appendChild(trailImage.DOM.el);
		gsap.set(trailImage.DOM.el, {opacity: 1});
		// Flip
		Flip.from(imageState, {
			duration: animationDefaults.duration,
			ease: animationDefaults.ease
		});
		
	}, 'start')
	
	// animate the other images in
	.to(content.otherImages, {
		startAt: {yPercent: 100},
		yPercent: 0,
		opacity: 1
	}, 'start+=0.1')
	// about section
	.to(content.about, {
		startAt: {yPercent: 10},
		yPercent: 0,
		opacity: 1
	}, 'start+=0.2')
	// about text lines
	.add( () => {
		aboutLines.in();
	}, 'start+=0.2')

};

// Enter button click event
intro.enterButton.addEventListener('click', showContent);

// Simulate the initial progress
const fakeProgress = new FakeProgress(frame.progress);
fakeProgress.onComplete(showIntro);

// Preload images
preloadImages('.intro-image').then( _ => document.body.classList.remove('loading'));



