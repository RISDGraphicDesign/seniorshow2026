// load paper stack

let work = document.querySelector("#work");
let stack = document.querySelector("#stack");
var page = document.querySelector("#page");
let workCount = 167;
let gap = 70;

let hoverpage = document.querySelector(".page-container");
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

window.addEventListener('scroll', () => {
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
});

let pages = document.querySelectorAll(".page");
let selectedIndex = Math.floor(scrollFraction * pages.length);
pages.forEach((page, index) => {
    page.addEventListener('click', () => {
        let docHeight = document.body.scrollHeight - window.innerHeight;
     let targetScroll = (0.05 + ((index + 0.5) / pages.length) * 0.95) * docHeight;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
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
 
fetch('project_info.json')
  .then(response => response.json())
  .then(data => {
    // Fisher-Yates shuffle
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }
    projectInfo = data;
    init();
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