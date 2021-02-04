/**
 * ==========================================================================
 * App Class
 * ==========================================================================
 */



// Gsap
import { gsap, TimelineMax, Power4, Circ } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);



class App {

    /**
     * Constructor
     */
    constructor() {
        
        /**
         * Vars
         */
        this.menuBtn = document.querySelectorAll(".menu-btn");
        this.menuHamburger = document.querySelector(".hamburger");
        this.menu = document.querySelector(".menu");

        /**
         * Init
         */
        this.menuToggle();
    }

    

    /**
     * Menu toggle
     */
    menuToggle() {
        
        this.menuBtn.forEach( (menuToggler) => {

            let target = menuToggler.dataset.target;
            let navBg = document.querySelector(target).querySelectorAll('.menu__bg');
            let navInner = document.querySelector(target).querySelectorAll('.menu__links');
            let navLinks = document.querySelector(target).querySelectorAll('.menu__links__item');
            let animationTime = 0.5;
            let easeIn = Circ.easeIn;
            let easeOut = Circ.easeOut;
            let easeInOut = Circ.easeInOut;
            let playState = true;
            let navTimeline = new TimelineMax({ paused: true });

            navTimeline
                .fromTo(
                    target,
                    {
                        top: '-100%',
                        ease: easeIn
                    }, {
                        top: '0%',
                        ease: easeOut,
                        onReverseComplete: () => {
                            menuToggler.classList.remove('is-loading');
                        }
                    },
                    animationTime
                )
                .staggerTo(
                    navBg,
                    animationTime, {
                        height: '100%',
                        ease: easeInOut
                    },
                    0.25
                )
                .fromTo(
                    navInner,
                    animationTime, {
                        top: '-100%',
                        ease: easeIn
                    }, {
                        top: '0%',
                        ease: easeOut
                    }
                )
                .staggerFromTo(
                    navLinks,
                    animationTime, {
                        y: '20%',
                        opacity: 0,
                        ease: Power4.easeOut
                    }, {
                        y: '0%',
                        opacity: 1,
                        ease: Power4.easeOut
                    },
                    0.1
            );

            menuToggler.addEventListener('click', () => {

                menuToggler.classList.add('is-loading');

                if (playState) {
                    playState = false;
                    navTimeline.play().then( () => {
                        this.menu.classList.add('is-loaded');
                        menuToggler.classList.remove('is-loading');
                    });
                    this.menuHamburger.classList.add('is-active');
                } else {
                    navTimeline.reverse();
                    playState = true;
                    this.menu.classList.remove('is-loaded');
                    this.menuHamburger.classList.remove('is-active');
                }
            });
        });
    }
}

export default App;
