// 
// 1. Unblock the Render
// 2. Wait for it...
// 3. Initiate Gravity
// 

const Engine = Matter.Engine,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

let antigravityStarted = false;

document.getElementById('do-not-click').addEventListener('click', (e) => {
    e.preventDefault();
    if(antigravityStarted) return;
    antigravityStarted = true;
    startAntigravity();
});

// For pure chaos, let it auto-trigger after 3.5 seconds if they don't click it
setTimeout(() => {
    if(!antigravityStarted) {
        antigravityStarted = true;
        startAntigravity();
    }
}, 3500);

function startAntigravity() {
    // Hide scrollbars to avoid weird behavior when elements fall outside normal flow
    document.body.style.overflow = 'hidden';
    
    const engine = Engine.create();
    const world = engine.world;
    const domBodies = [];

    // Find all the elements we want to fall down
    const elements = document.querySelectorAll('.physics-item');

    // Step 1: Record all dimensions and initial positions carefully
    const measurements = Array.from(elements).map(el => {
        const rect = el.getBoundingClientRect();
        return { el, rect };
    });

    // Step 2: Swap them to fixed positioning and map physical bodies to them
    measurements.forEach(({el, rect}) => {
        // Create Physics Body
        // Add a slight randomization to friction and restitution for organic bounces
        const body = Bodies.rectangle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            rect.width,
            rect.height,
            { 
                friction: 0.1, 
                restitution: 0.8, // Bouncy
                frictionAir: 0.01 
            }
        );

        // Give the body random slight initial angular velocity so they immediately feel "loose"
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
        
        // Sometimes give them a little bump
        Matter.Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05
        });

        // Convert the DOM element to physical item styling
        el.classList.add('gravity-active');
        el.style.position = 'fixed';
        el.style.left = '0px'; // We move relative to 0,0 for easier translation math
        el.style.top = '0px';
        el.style.width = rect.width + 'px';
        el.style.height = rect.height + 'px';
        el.style.margin = '0';
        el.style.zIndex = '9999';

        domBodies.push({ el, body, width: rect.width, height: rect.height });
        Composite.add(world, body);
    });

    // Step 3: Create Boundaries (Floor, Walls, Ceiling)
    const wallOptions = { isStatic: true, friction: 0.3, restitution: 0.6 };
    let ground, leftWall, rightWall, ceiling;

    function createWalls() {
        const cw = window.innerWidth;
        const ch = window.innerHeight;
        const thickness = 200;

        ground = Bodies.rectangle(cw / 2, ch + thickness / 2, cw * 2, thickness, wallOptions);
        leftWall = Bodies.rectangle(-thickness / 2, ch / 2, thickness, ch * 2, wallOptions);
        rightWall = Bodies.rectangle(cw + thickness / 2, ch / 2, thickness, ch * 2, wallOptions);
        ceiling = Bodies.rectangle(cw / 2, -thickness * 5, cw * 3, thickness, wallOptions); // Super high ceiling so they can be tossed up
        
        Composite.add(world, [ground, leftWall, rightWall, ceiling]);
    }

    createWalls();

    // Step 4: Add Mouse Interactivity
    const mouse = Mouse.create(document.body);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2, // Elastic feel when dragging
            render: {
                visible: false // We aren't rendering the matter canvas anyway
            }
        }
    });
    
    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with scrolling (if scroll was still allowed)
    // mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
    // mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);

    // Step 5: Start the Engine Engine Loop
    Runner.run(Runner.create(), engine);

    // Step 6: Sync physical positions back to DOM
    (function renderLoop() {
        domBodies.forEach(({el, body, width, height}) => {
            // Apply coordinates via transform translate to completely avoid reflows (= "ruthless efficiency")
            // The position needs to be offset by width/2 and height/2 because body.position is the center.
            const tx = body.position.x - width / 2;
            const ty = body.position.y - height / 2;
            
            // Only update if changed enough to save some parsing if static? 
            // Nah, RequestAnimationFrame is generally fine.
            el.style.transform = `translate(${tx}px, ${ty}px) rotate(${body.angle}rad)`;
        });
        requestAnimationFrame(renderLoop);
    })();

    // Step 7: Handle Resizing
    window.addEventListener('resize', () => {
        // Just move the boundaries instead of re-creating everything for better physics persistence
        const cw = window.innerWidth;
        const ch = window.innerHeight;
        const thickness = 200;
        
        Matter.Body.setPosition(ground, { x: cw / 2, y: ch + thickness / 2 });
        Matter.Body.setPosition(rightWall, { x: cw + thickness / 2, y: ch / 2 });
    });
}
