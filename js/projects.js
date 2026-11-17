let projects = [];

async function loadProjects() {
    const container = document.getElementById("projects-grid");
    const counter = document.getElementById("projects-counter");

    if (!container) return;

    try {
        const response = await fetch("data/projects.json");
        if (!response.ok) throw new Error("Projects unavailable");

        const data = await response.json();
        projects = data.projects || [];
        updateProjectsFooter();

        if (counter) {
            counter.textContent = `${projects.length} ${getStoredLanguage() === "en" ? "documented projects" : "projets documentés"}`;
        }

        renderProjects();
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p class='text-sm text-zinc-400'>Impossible de charger les projets pour le moment.</p>";
    }
}

function openProjectDetails(projectId) {
    const project = projects.find((item) => item.id === projectId);

    if (!project) return;

    const language = getStoredLanguage();

    document.getElementById("project-detail-title").textContent = project.title[language];
    document.getElementById("project-detail-category").textContent = project.category[language];
    document.getElementById("project-detail-problem").textContent = project.problem[language];
    document.getElementById("project-detail-solution").textContent = project.solution[language];
    document.getElementById("project-detail-impact").textContent = project.impact[language];
    document.getElementById("project-detail-status").textContent = project.status[language];

    const image = document.getElementById("project-detail-image");
    image.src = project.image;
    image.alt = `Aperçu du projet ${project.title[language]}`;

    const stack = document.getElementById("project-detail-stack");
    stack.innerHTML = "";

    project.stack.forEach((technology) => {
        const badge = document.createElement("span");
        badge.className = "px-2 py-1 rounded bg-white/5 text-[11px] font-mono";
        badge.textContent = technology;
        stack.appendChild(badge);
    });

    const githubButton = document.getElementById("project-detail-github");
    const demoButton = document.getElementById("project-detail-demo");

    if (project.github) {
        githubButton.href = project.github;
        githubButton.classList.remove("hidden");
    } else {
        githubButton.classList.add("hidden");
    }

    if (project.demo) {
        demoButton.href = project.demo;
        demoButton.classList.remove("hidden");
    } else {
        demoButton.classList.add("hidden");
    }

    wm.openWindow("project-detail-win");
}

function closeProjectDetails() {
    wm.closeWindow("project-detail-win");
}

document.addEventListener("DOMContentLoaded", loadProjects);

document.addEventListener("portfolio:languagechange", () => {
    if (projects.length > 0) {
        renderProjects();
        updateProjectsFooter();
    }
});

function updateProjectsFooter() {
    const footer = document.getElementById("projects-footer-count");
    const language = getStoredLanguage();

    if (!footer) return;

    const count = projects.length;

    if (language === "en") {
        footer.textContent = count === 1 ? "1 item" : `${count} items`;
    } else {
        footer.textContent = count === 1 ? "1 élément" : `${count} éléments`;
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && wm.activeWindowId === "project-detail-win") {
        closeProjectDetails();
    }
});

function renderProjects() {
    const container = document.getElementById("projects-grid");
    const counter = document.getElementById("projects-counter");

    if (!container) return;

    const language = getStoredLanguage();

    if (counter) {
        counter.textContent = `${projects.length} ${translations[language]["projects.counter"]}`;
    }

    container.innerHTML = "";

    projects.forEach((project) => {
        const card = document.createElement("article");
        card.className = "p-4 rounded-xl bg-[#242424] border border-white/10 hover:border-amber-400/50 transition-colors";

        const imageWrapper = document.createElement("button");
        imageWrapper.type = "button";
        imageWrapper.className = "block w-full mb-3 rounded-lg overflow-hidden border border-white/10 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";
        imageWrapper.setAttribute("aria-label", `Open project details: ${project.title[language]}`);

        const image = document.createElement("img");
        image.src = project.image;
        image.alt = `Preview of the ${project.title[language]} project`;
        image.loading = "lazy";
        image.className = "block w-full h-36 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105";

        imageWrapper.appendChild(image);
        imageWrapper.addEventListener("click", () => openProjectDetails(project.id));

        const title = document.createElement("h4");
        title.className = "font-bold text-white text-sm";
        title.textContent = project.title[language];

        const category = document.createElement("p");
        category.className = "text-[10px] font-mono text-amber-400 mt-1";
        category.textContent = project.category[language];

        const description = document.createElement("p");
        description.className = "text-xs text-zinc-400 mt-2 leading-relaxed";
        description.textContent = project.shortDescription[language];

        const stack = document.createElement("div");
        stack.className = "mt-3 flex flex-wrap gap-1 text-[10px] font-mono text-zinc-300";

        project.stack.forEach((technology) => {
            const badge = document.createElement("span");
            badge.className = "px-1.5 py-0.5 rounded bg-white/5";
            badge.textContent = technology;
            stack.appendChild(badge);
        });

        const actions = document.createElement("div");
        actions.className = "mt-3 flex flex-wrap gap-2";

        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.className = "px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-mono hover:bg-amber-500/30";
        detailsButton.textContent = translations[language]["projects.view"];
        detailsButton.addEventListener("click", () => openProjectDetails(project.id));

        actions.appendChild(detailsButton);

        if (project.github) {
            const githubLink = document.createElement("a");
            githubLink.href = project.github;
            githubLink.target = "_blank";
            githubLink.rel = "noopener noreferrer";
            githubLink.className = "px-2.5 py-1 rounded bg-white/5 text-zinc-300 border border-white/10 text-[11px] font-mono hover:bg-white/10";
            githubLink.textContent = translations[language]["projects.github"];
            actions.appendChild(githubLink);
        }

        if (project.demo) {
            const demoLink = document.createElement("a");
            demoLink.href = project.demo;
            demoLink.target = "_blank";
            demoLink.rel = "noopener noreferrer";
            demoLink.className = "px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 text-[11px] font-mono hover:bg-emerald-500/25";
            demoLink.textContent = translations[language]["projects.demo"];
            actions.appendChild(demoLink);
        }

        card.append(imageWrapper, title, category, description, stack, actions);
        container.appendChild(card);
    });
}