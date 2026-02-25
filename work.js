// load paper stack

let work = document.querySelector("#work");
let stack = document.querySelector(".stack");
var page = document.querySelector("#page");
let workCount = 167;
let gap = 70;
let isGrid = false;
let readyForScroll = false;
let hoverpage = document.querySelector("#the-page");
let currPage = 0;
// stack.style.height = workCount * gap + 200 + "px";

page.style.zIndex = workCount; // to be replaced by total number of works dynamically
// page.style.top = document.querySelector(".statement").offsetHeight;


for (let i = 1; i < workCount; i++) {
    let clone = page.cloneNode(true);
    clone.style.zIndex = workCount - i;
    stack.appendChild(clone);
    clone.classList.add("page");
    clone.style.marginTop = "-" + gap + "px";
    clone.id = i;
}
let scrollFraction = 0;

function handleScroll() {
    if (isGrid) return;
    if (!readyForScroll) return;
    if (isAnimating) return;
    let scrollY = window.scrollY;
    let docHeight = document.body.scrollHeight - window.innerHeight;
    scrollFraction = scrollY / docHeight;

    if (scrollFraction < 0.05) {
        pages.forEach(page => page.classList.remove('page-selected'));
        hoverpage.classList.add('hide-page');
        return;
    }

    let adjustedFraction = (scrollFraction - 0.05) / 0.95;
    let selectedIndex = Math.floor(adjustedFraction * pages.length);
    

    pages.forEach((page, index) => {
        if (index === selectedIndex) {
           
            page.classList.add('page-selected');
            hoverpage.classList.remove('hide-page');
            currPage = index;
           init();  
        } else {
            page.classList.remove('page-selected');
        }
    });
}

window.addEventListener('scroll', handleScroll);

let pages = document.querySelectorAll(".page");
let selectedIndex = Math.floor(scrollFraction * pages.length);
pages.forEach((page, index) => {
    page.addEventListener('click', () => {
        let docHeight = document.body.scrollHeight - window.innerHeight;
     let targetScroll = (0.05 + ((index + 0.5) / pages.length) * 0.95) * docHeight;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
});

let gridToggle = document.querySelector("#grid-toggle");
let grid = document.querySelector("#grid-container");

let isAnimating = false;

gridToggle.addEventListener("click", () => {
    if (isAnimating) return;
    if (gridToggle.innerHTML === "View as Grid") {
        gridToggle.innerHTML = "View as Stack";
        isGrid = true;
        hoverpage.classList.add("hide-page");
        animateToGrid();
    } else {
        gridToggle.innerHTML = "View as Grid";
        isGrid = false;
        animateToStack();
    }
});

function animateToGrid() {
    isAnimating = true;
    stack.style.overflow = "hidden";

    const allPages = Array.from(stack.querySelectorAll(".page"));
    const vw = window.innerWidth;

    // Pages fly off in random directions with varied timing
    const delays = allPages.map(() => Math.random() * 350);

    allPages.forEach((p, i) => {
        const dir = Math.random() < 0.5 ? -1 : 1;
        const delay = delays[i];

        p.style.transition = "none";
        p.style.transform = "";
        p.style.opacity = "1";

        requestAnimationFrame(() => {
            p.style.transition = `transform 0.3s cubic-bezier(0.4,0,0.2,1) ${delay}ms, opacity 0.2s ease ${delay + 100}ms`;
            p.style.transform = `translateX(${dir * vw}px)`;
            p.style.opacity = "0";
        });
    });

    // After pages leave, hide stack and fade grid in
    setTimeout(() => {
        stack.classList.add("stack-hide");
        stack.style.overflow = "";
        allPages.forEach(p => {
            p.style.transition = "";
            p.style.transform = "";
            p.style.opacity = "";
        });

        grid.classList.remove("grid-hide");
        grid.style.opacity = "0";
        requestAnimationFrame(() => {
            grid.style.transition = "opacity 0.2s ease";
            grid.style.opacity = "1";
            setTimeout(() => {
                grid.style.transition = "";
                isAnimating = false;
            }, 200);
        });
    }, 750);
}

function animateToStack() {
    isAnimating = true;

    // Fade out grid
    grid.style.transition = "opacity 0.3s ease";
    grid.style.opacity = "0";

    setTimeout(() => {
        grid.classList.add("grid-hide");
        grid.style.transition = "";
        grid.style.opacity = "";

        // Show stack with pages starting off-screen from alternating sides
        stack.classList.remove("stack-hide");
        stack.style.overflow = "hidden";
        const allPages = Array.from(stack.querySelectorAll(".page"));
        const vw = window.innerWidth;

        const delays = allPages.map(() => Math.random() * 350);

        allPages.forEach((p, i) => {
            const dir = Math.random() < 0.5 ? -1 : 1;
            p.style.transition = "none";
            p.style.transform = `translateX(${dir * vw}px)`;
            p.style.opacity = "0";
        });

        requestAnimationFrame(() => {
            // Shuffle in: pages fly in from random sides with varied timing
            allPages.forEach((p, i) => {
                const delay = delays[i];
                p.style.transition = `transform 0.3s cubic-bezier(0.4,0,0.2,1) ${delay}ms, opacity 0.2s ease ${delay}ms`;
                p.style.transform = "";
                p.style.opacity = "1";
            });

            setTimeout(() => {
                stack.style.overflow = "";
                allPages.forEach(p => {
                    p.style.transition = "";
                    p.style.transform = "";
                    p.style.opacity = "";
                });
                isAnimating = false;
            }, 750);
        });
    }, 300);
}

function shuffleIn() {
    const allPages = Array.from(stack.querySelectorAll(".page"));
    const vw = window.innerWidth;
    stack.style.overflow = "hidden";

    const delays = allPages.map(() => Math.random() * 350);

    allPages.forEach((p, i) => {
        const dir = Math.random() < 0.5 ? -1 : 1;
        p.style.transition = "none";
        p.style.transform = `translateX(${dir * vw}px)`;
        p.style.opacity = "0";
    });

    requestAnimationFrame(() => {
        allPages.forEach((p, i) => {
            const delay = delays[i];
            p.style.transition = `transform 0.3s cubic-bezier(0.4,0,0.2,1) ${delay}ms, opacity 0.2s ease ${delay}ms`;
            p.style.transform = "";
            p.style.opacity = "1";
        });

        setTimeout(() => {
            stack.style.overflow = "";
            allPages.forEach(p => {
                p.style.transition = "";
                p.style.transform = "";
                p.style.opacity = "";
            });
            readyForScroll = true;
        }, 750);
    });
}

function buildGrid() {
  const numCols = window.innerWidth <= 600 ? 1 : 3;
  grid.innerHTML = '';

  const cols = [];
  for (let i = 0; i < numCols; i++) {
    const col = document.createElement('div');
    col.className = `grid-col grid-col-${i + 1}`;
    grid.appendChild(col);
    cols.push(col);
  }

  const chunkSize = Math.ceil(projectInfoSorted.length / numCols);

  projectInfoSorted.forEach((project, idx) => {
    const src = encodeURI(project.files && project.files[0] ? project.files[0] : '');
    const isVideo = /\.(mp4|webm|ogg)$/i.test(src);
    const imgSrc = isVideo ? src.replace(/\.(mp4|webm|ogg)$/i, '.webp') : src;
    const link = project.website || project.instagram || '#';

    const card = document.createElement('div');
    card.className = 'grid-page-container';
    card.innerHTML = `
      <div class="grid-content">
        <img src="${imgSrc}" alt="" width="100%" onerror="this.src='web/placeholder_image.png'"/>
        <h2 class="name text">
          <a href="${link}" target="_blank" class="link">${project.name} &nbsp; ↗</a>
        </h2>
        <h2 class="work-title text">
          ${project.title}<span class="year"> , ${project.year}</span>
        </h2>
        <p class="work-details text">${project.medium}, ${project.dimensions}</p>
        <p class="work-description text">${project.description}</p>
      </div>
    `;
    const colIdx = numCols === 1 ? 0 : idx % numCols;
    cols[colIdx].appendChild(card);
  });
}

let lastColCount = window.innerWidth <= 600 ? 1 : 3;
window.addEventListener('resize', () => {
  if (!projectInfoSorted) return;
  const newColCount = window.innerWidth <= 600 ? 1 : 3;
  if (newColCount !== lastColCount) {
    lastColCount = newColCount;
    buildGrid();
  }
});




let designerName = document.querySelector(".namelink");
let title = document.querySelector(".work-title");
let year = document.querySelector(".year");
let medium = document.querySelector(".work-details");
let description = document.querySelector(".work-description");
let image = document.querySelector(".work-image")
let video = document.querySelector(".work-video");
let link;


let projectInfo = null;
let projectInfoSorted = null;

fetch('project_info.json')
  .then(response => response.json())
  .then(data => {
    projectInfoSorted = [...data];
    // Fisher-Yates shuffle
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }
    projectInfo = data;
    buildGrid();
    init();

    // Hide pages off-screen immediately before paint
    const allPages = Array.from(stack.querySelectorAll(".page"));
    const vw = window.innerWidth;
    stack.style.overflow = "hidden";
    allPages.forEach((p) => {
        const dir = Math.random() < 0.5 ? -1 : 1;
        p.style.transform = `translateX(${dir * vw}px)`;
        p.style.opacity = "0";
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        shuffleIn();
      });
    });
  });

const preloadCache = new Set();

function preloadImages(idx) {
  for (let i = idx - 3; i <= idx + 3; i++) {
    if (i < 0 || i >= projectInfo.length) continue;
    const files = projectInfo[i].files;
    if (files && files.length > 0) {
      const src = encodeURI(files[0]);
      if (!preloadCache.has(src)) {
        const img = new Image();
        img.src = src;
        preloadCache.add(src);
      }
    }
  }
}

function init() {
  // all code that needs projectInfo goes here
  if(isGrid){
        
  }else{
    let link = projectInfo[currPage].website || projectInfo[currPage].instagram;
    designerName.innerHTML = projectInfo[currPage].name + " &nbsp; ↗";
    designerName.href = link;
    title.childNodes[0].textContent = projectInfo[currPage].title;
    year.innerHTML = ", " + projectInfo[currPage].year;
    medium.innerHTML = projectInfo[currPage].medium + ", " + projectInfo[currPage].dimensions;
    description.innerHTML = projectInfo[currPage].description;
    const src = encodeURI(projectInfo[currPage].files[0] || '');
  const isVideo = /\.(mp4|webm|ogg)$/i.test(src);

  if (isVideo) {
    const posterSrc = src.replace(/\.(mp4|webm|ogg)$/i, '.webp');
    image.style.display = 'block';
    image.src = posterSrc;
    video.style.display = 'none';
    video.src = src;
    video.load();
    video.oncanplay = () => {
      image.style.display = 'none';
      video.style.display = 'block';
    };
  } else {
    video.style.display = 'none';
    image.style.display = 'block';
    image.src = src;
    image.onerror = () => { image.src = 'web/placeholder_image.png'; };
  }
    preloadImages(currPage);
  }
    
}