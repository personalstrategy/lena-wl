// Features data array
        const featuresData = [
            {
                title: 'I want to learn the basics.',
                description: 'You want to learn the basics of 3D design, but you’re on a train with just twenty minutes to spare. Ask LENA to generate a quick essay that distills the the core terms, the basic tools, the first steps you’d take. By the time you reach your stop, you’ll have the 101 in your pocket, ready to guide your next move.',
                image: 'i/essay.png',
                alt: 'Article feature'
            },
            {
                title: 'I want to deep-dive.',
                description: 'You’ve been curious about sewing for months, and tonight you finally have a quiet evening to yourself. Ask LENA for a deep-dive e-book that walks you through the history, techniques, and tips of the craft. You’ll learn about fabrics, stitches, and patterns in a way that feels like having a mentor sitting beside you — all at your own pace.',
                image: 'i/ebook.png',
                alt: 'Deep Dive feature'
            },
            {
                title: 'Looks like I need a course.',
                description: 'You’ve decided to learn the drums and want something more structured than random YouTube videos. Ask LENA to create a self-paced course, complete with interactive exercises, practice routines, and quizzes to track your progress. From basic rhythms to your first full song, you’ll build skills in a logical, engaging flow.',
                image: 'i/course.png',
                alt: 'Course feature'
            },
            {
                title: 'I want to master it.',
                description: 'You’ve been practicing yoga for a while, but now you want to go deeper. You want to refine your poses, understand the philosophy, and challenge yourself. Ask LENA to design a masterclass with advanced lessons, hands-on practices, quizzes to test your understanding, and a final assessment to see how far you’ve come. It’s like having a personal teacher, but fully on your schedule.',
                image: 'i/masterclass.png',
                alt: 'Masterclass feature'
            }
        ];

        // Generate desktop feature images
        const desktopImagesContainer = document.getElementById('desktop-images');
        featuresData.forEach((feature, index) => {
            const featureImage = document.createElement('div');
            featureImage.className = 'feature-image';
            featureImage.setAttribute('data-feature', index);
            featureImage.innerHTML = `<img src="${feature.image}" alt="${feature.alt}">`;
            desktopImagesContainer.appendChild(featureImage);
        });

        // Generate desktop feature texts
        const desktopTextsContainer = document.getElementById('desktop-texts');
        featuresData.forEach((feature, index) => {
            const featureText = document.createElement('div');
            featureText.className = index === 0 ? 'feature-text active' : 'feature-text';
            featureText.setAttribute('data-feature', index);
            featureText.innerHTML = `
                <h2>${feature.title}</h2>
                <p>${feature.description}</p>
            `;
            desktopTextsContainer.appendChild(featureText);
        });

        // Generate mobile features
        const mobileFeaturesContainer = document.getElementById('mobile-features');
        featuresData.forEach(feature => {
            const mobileBlock = document.createElement('div');
            mobileBlock.className = 'mobile-feature-block';
            mobileBlock.innerHTML = `
                <div class="feature-image">
                    <img src="${feature.image}" alt="${feature.alt}">
                </div>
                <div class="feature-text">
                    <h2>${feature.title}</h2>
                    <p>${feature.description}</p>
                </div>
            `;
            mobileFeaturesContainer.appendChild(mobileBlock);
        });

        // Animation logic
        const featuresContainer = document.querySelector('.features-container');
        const featureImages = document.querySelectorAll('.feature-image-container .feature-image');
        const featureTexts = document.querySelectorAll('.feature-text-container .feature-text');
        
        function updateFeatures() {
            // Skip animation on mobile
            if (window.innerWidth <= 768) {
                return;
            }
            
            const containerTop = featuresContainer.offsetTop;
            const scrollPosition = window.scrollY;
            
            // Only activate when fully reaching the features section
            if (scrollPosition >= containerTop) {
                const relativeScroll = scrollPosition - containerTop;
                const sectionHeight = featuresContainer.offsetHeight - window.innerHeight;
                const scrollProgress = Math.min(Math.max(relativeScroll / sectionHeight, 0), 1);
                
                // Divide scroll into 3 sections (cards 2, 3, 4)
                const segmentProgress = scrollProgress * 3;
                const currentSegment = Math.floor(segmentProgress);
                const segmentFraction = segmentProgress - currentSegment;
                
                const vh = window.innerHeight;
                
                // Update all feature images
                featureImages.forEach((img, index) => {
                    if (index === 0) {
                        // First card always visible
                        img.style.transform = 'translateY(0)';
                        img.style.zIndex = index;
                    } else if (index <= currentSegment) {
                        // Cards that have fully arrived - stacked at top
                        img.style.transform = 'translateY(0)';
                        img.style.zIndex = index;
                    } else if (index === currentSegment + 1 && currentSegment < 3) {
                        // Currently sliding card - directly tied to scroll
                        const translateY = vh * (1 - segmentFraction);
                        img.style.transform = `translateY(${translateY}px)`;
                        img.style.zIndex = index;
                    } else {
                        // Cards below viewport
                        img.style.transform = `translateY(${vh}px)`;
                        img.style.zIndex = index;
                    }
                });
                
                // Update text - crossfade at midpoint
                featureTexts.forEach(text => text.classList.remove('active'));
                
                if (currentSegment >= 3) {
                    // All cards visible, show last text
                    featureTexts[3].classList.add('active');
                } else if (segmentFraction < 0.5) {
                    // Show current text
                    featureTexts[currentSegment].classList.add('active');
                } else {
                    // Show next text (crossfade point)
                    featureTexts[currentSegment + 1].classList.add('active');
                }
            } else {
                // Before features section - only first card visible
                const vh = window.innerHeight;
                featureImages.forEach((img, index) => {
                    if (index === 0) {
                        img.style.transform = 'translateY(0)';
                    } else {
                        img.style.transform = `translateY(${vh}px)`;
                    }
                    img.style.zIndex = index;
                });
                featureTexts.forEach(text => text.classList.remove('active'));
                featureTexts[0].classList.add('active');
            }
        }

        // Initialize on load
        window.addEventListener('load', () => {
            // Skip animation on mobile
            if (window.innerWidth <= 768) {
                return;
            }
            
            const vh = window.innerHeight;
            const images = document.querySelectorAll('.feature-image-container .feature-image');
            const texts = document.querySelectorAll('.feature-text-container .feature-text');
            
            // First card starts visible
            if (images[0]) {
                images[0].style.transform = 'translateY(0)';
                images[0].style.zIndex = 0;
            }
            // Rest start below
            for (let i = 1; i < images.length; i++) {
                images[i].style.transform = `translateY(${vh}px)`;
                images[i].style.zIndex = i;
            }
            if (texts[0]) {
                texts[0].classList.add('active');
            }
        });

        // Update on scroll
        window.addEventListener('scroll', updateFeatures);

        // Update on resize (for responsive behavior)
        window.addEventListener('resize', updateFeatures);