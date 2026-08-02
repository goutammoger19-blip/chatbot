const images = [
  {
    title: "Aurora Drift",
    category: "nature",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Ocean Pulse",
    category: "nature",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Metro Dusk",
    category: "city",
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Skyline Echo",
    category: "city",
    src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Prism Flow",
    category: "abstract",
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Signal Bloom",
    category: "abstract",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Velvet Portrait",
    category: "portrait",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Luminous Mood",
    category: "portrait",
    src: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Glass Horizon",
    category: "nature",
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"
  }
];

const galleryGrid = document.getElementById("galleryGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxTitle = document.getElementById("lightboxTitle");
const closeLightboxBtn = document.getElementById("closeLightbox");
const parallaxScenes = document.querySelectorAll(".parallax-scene");

let activeFilter = "all";

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal, .reveal-item");

  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function bindParallax() {
  parallaxScenes.forEach((scene) => {
    const cards = scene.querySelectorAll(".parallax-card");

    scene.addEventListener("pointermove", (event) => {
      const rect = scene.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

      cards.forEach((card) => {
        const depth = Number(card.dataset.depth || 15);
        const rotateY = offsetX * depth;
        const rotateX = -offsetY * depth;

        card.style.transform = `translate3d(${offsetX * depth * 0.8}px, ${offsetY * depth * 0.8}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });

    scene.addEventListener("pointerleave", () => {
      cards.forEach((card) => {
        card.style.transform = "translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)";
      });
    });
  });
}

function renderGallery() {
  const query = searchInput.value.trim().toLowerCase();

  const filteredItems = images.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const matchesQuery =
      item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  galleryGrid.innerHTML = filteredItems
    .map(
      (item, index) => `
        <figure class="gallery-item reveal-item" data-category="${item.category}" tabindex="0" role="button" aria-label="View ${item.title}" style="animation-delay: ${index * 60}ms;">
          <img src="${item.src}" alt="${item.title}" />
          <figcaption>
            <h4>${item.title}</h4>
            <span>${item.category}</span>
          </figcaption>
        </figure>
      `
    )
    .join("");

  const galleryItems = document.querySelectorAll(".gallery-item");
  setupRevealAnimations();
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const card = images.find((image) => image.title === item.querySelector("h4").textContent);
      openLightbox(card);
    });

    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const card = images.find((image) => image.title === item.querySelector("h4").textContent);
        openLightbox(card);
      }
    });
  });
}

function openLightbox(item) {
  if (!item) return;

  lightboxImage.src = item.src;
  lightboxImage.alt = item.title;
  lightboxCategory.textContent = item.category;
  lightboxTitle.textContent = item.title;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    renderGallery();
  });
});

searchInput.addEventListener("input", renderGallery);
closeLightboxBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});

bindParallax();
renderGallery();
