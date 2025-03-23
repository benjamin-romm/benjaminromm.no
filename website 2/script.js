// Configuration constants at the top of the file
const TRANSITION_DURATION = 300; // Duration of the slide animation
const COOLDOWN_DURATION = 400; // Duration of cooldown between transitions
const FIXED_BORDERS_DELAY = 390; // Delay before fixed borders reappear (slightly after transition)

document.addEventListener('DOMContentLoaded', function() {
    const projects = document.querySelectorAll('.project');
    let activeIndex = 0;
    
    const sliderContainer = document.querySelector('.projects-slider');
    sliderContainer.insertAdjacentHTML('beforeend', `
        <button class="nav-arrow left">←</button>
        <button class="nav-arrow right">→</button>
    `);
    
    const leftArrow = document.querySelector('.nav-arrow.left');
    const rightArrow = document.querySelector('.nav-arrow.right');

    let isTransitioning = false;

    function updateProjects() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        const totalProjects = projects.length;
        const mainBorders = document.querySelector('.fixed-borders.main');
        const prevBorders = document.querySelector('.fixed-borders.prev');
        const nextBorders = document.querySelector('.fixed-borders.next');

        // Instantly hide borders
        mainBorders.style.opacity = '0';
        prevBorders.style.opacity = '0';
        nextBorders.style.opacity = '0';

        projects.forEach((project, index) => {
            project.classList.remove('active', 'hidden');
            let position;
            
            let distance = index - activeIndex;
            if (Math.abs(distance) > totalProjects / 2) {
                distance = distance > 0 ? distance - totalProjects : distance + totalProjects;
            }

            // Show 5 cards (2 on each side)
            if (Math.abs(distance) > 2) {
                project.style.visibility = 'hidden';
            } else {
                project.style.visibility = 'visible';
            }

            if (distance === 0) {
                position = 0;
                project.classList.add('active');
            } else if (distance === 1) {
                position = 145; // Next card
            } else if (distance === -1) {
                position = -145; // Previous card
            } else if (distance === 2) {
                position = 290; // Card after next
            } else if (distance === -2) {
                position = -290; // Card before previous
            } else {
                project.classList.add('hidden');
                position = distance > 0 ? 435 : -435;
            }
            
            project.style.transform = `translateX(${position}%)`;
        });

        // Show borders after card transition, with no fade
        setTimeout(() => {
            // Set borders instantly after delay
            mainBorders.style.opacity = '1';
            if (activeIndex > 0) {
                prevBorders.style.opacity = '1';
            }
            if (activeIndex < totalProjects - 1) {
                nextBorders.style.opacity = '1';
            }
        }, TRANSITION_DURATION + 50); // Slightly after card transition completes

        setTimeout(() => {
            isTransitioning = false;
        }, COOLDOWN_DURATION);
    }

    function getPreviousIndex() {
        return activeIndex === 0 ? projects.length - 1 : activeIndex - 1;
    }

    function getNextIndex() {
        return activeIndex === projects.length - 1 ? 0 : activeIndex + 1;
    }

    function goToPrevious() {
        activeIndex = getPreviousIndex();
        updateProjects();
    }

    function goToNext() {
        activeIndex = getNextIndex();
        updateProjects();
    }

    // Set initial state
    updateProjects();

    // Add click handlers for projects
    projects.forEach((project, index) => {
        project.addEventListener('click', () => {
            if (index !== activeIndex) {
                activeIndex = index;
                updateProjects();
            }
        });
    });

    // Arrow button click handlers
    leftArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        goToPrevious();
    });

    rightArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        goToNext();
    });

    // Keyboard arrow handlers
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName.toLowerCase() !== 'input' && 
            e.target.tagName.toLowerCase() !== 'textarea') {
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (!isTransitioning) {
                        activeIndex = getPreviousIndex();
                        updateProjects();
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (!isTransitioning) {
                        activeIndex = getNextIndex();
                        updateProjects();
                    }
                    break;
            }
        }
    });

    // Update positions on window resize
    window.addEventListener('resize', updateProjects);
});

function enlargeImage(event) {
    const modal = document.getElementById('imageModal');
    const enlargedImg = document.getElementById('enlargedImage');
    
    // Set image source and show modal
    enlargedImg.src = event.target.src;
    modal.style.display = 'block';
    
    // Prevent carousel movement
    event.stopPropagation();
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

function transitionToProjects() {
    document.body.classList.remove('transition-to-home');
    document.body.classList.add('transition-to-projects');
}

function transitionToHome() {
    document.body.classList.remove('transition-to-projects');
    document.body.classList.add('transition-to-home');
}
