document.addEventListener("DOMContentLoaded", () => {
  // === ELEMENTOS DEL DOM ===
  const elements = {
    html: document.documentElement,
    themeToggle: document.getElementById("theme-toggle"),
    writeBtn: document.getElementById("write-btn"),
    viewBtn: document.getElementById("view-btn"),
    saveBtn: document.getElementById("save-btn"),
    loadBtn: document.getElementById("load-btn"),
    fileInput: document.getElementById("file-input"),
    synopsisContainer: document.getElementById("synopsis-container"),
    pillarsContainer: document.getElementById("pillars-container"),
  };

  // === ESTADO DE LA APP ===
  let currentMode = "write"; // 'write' o 'view'
  let storyData = {};

  const NARRATIVE_PILLARS = [
    {
      id: "setup",
      title: "Planteamiento",
      description:
        "El status quo inicial. Presentación del protagonista en su mundo normal.",
    },
    {
      id: "inciting_incident",
      title: "Incidente Incitador",
      description:
        "El evento que saca al protagonista de su zona de confort y da inicio a la trama.",
    },
    {
      id: "rising_action",
      title: "Nudo o Desarrollo",
      description:
        "Una serie de eventos donde el protagonista intenta resolver el conflicto, enfrentando obstáculos crecientes.",
    },
    {
      id: "midpoint",
      title: "Punto Medio",
      description:
        "Un giro argumental crucial que cambia la perspectiva del protagonista y eleva lo que está en juego.",
    },
    {
      id: "climax",
      title: "Clímax",
      description:
        "La confrontación final. El punto de máxima tensión donde el conflicto principal se resuelve.",
    },
    {
      id: "resolution",
      title: "Desenlace",
      description:
        "Las consecuencias de la historia. ¿Cómo ha cambiado el mundo y el protagonista?",
    },
  ];

  const defaultStoryData = {
    synopsis: '',
    setup:'',
    inciting_incident: '',
    rising_action: '',
    midpoint: '',
    climax: '',
    resolution:'',
  };

  // === FUNCIONES PRINCIPales ===
  const renderUI = () => {
    // Render Sinopsis
    renderSynopsis();
    // Render Pilares
    renderPillars();
    // Actualizar botones del sidebar
    updateSidebarButtons();
  };

  const renderSynopsis = () => {
    elements.synopsisContainer.innerHTML = "";
    if (currentMode === "write") {
      const textarea = document.createElement("textarea");
      textarea.id = "synopsis-input";
      textarea.className =
        "w-full h-32 p-3 bg-hover-color border border-border-color rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-accent-color";
      textarea.placeholder =
        "Describe la idea general o la trama principal de tu historia aquí...";
      textarea.value = storyData.synopsis || "";
      elements.synopsisContainer.appendChild(textarea);
    } else {
      const div = document.createElement("div");
      div.className =
        "p-3 bg-hover-color rounded-md min-h-[8rem] whitespace-pre-wrap";
      div.textContent = storyData.synopsis || "No hay sinopsis definida.";
      elements.synopsisContainer.appendChild(div);
    }
  };

  const renderPillars = () => {
    elements.pillarsContainer.innerHTML = "";
    NARRATIVE_PILLARS.forEach((pillar) => {
      const container = document.createElement("div");

      const title = document.createElement("h3");
      title.className = "text-xl font-semibold mb-1";
      title.textContent = pillar.title;

      const description = document.createElement("p");
      description.className = "text-sm text-text-secondary mb-2";
      description.textContent = pillar.description;

      container.appendChild(title);
      container.appendChild(description);

      if (currentMode === "write") {
        const textarea = document.createElement("textarea");
        textarea.id = `${pillar.id}-input`;
        textarea.className =
          "w-full h-40 p-3 bg-hover-color border border-border-color rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-accent-color";
        textarea.placeholder = `Escribe los eventos clave para '${pillar.title}'...`;
        textarea.value = storyData[pillar.id] || "";
        container.appendChild(textarea);
      } else {
        const div = document.createElement("div");
        div.className =
          "p-3 bg-hover-color rounded-md min-h-[10rem] whitespace-pre-wrap";
        div.textContent =
          storyData[pillar.id] || "No hay contenido para este pilar.";
        container.appendChild(div);
      }
      elements.pillarsContainer.appendChild(container);
    });
  };

  const updateSidebarButtons = () => {
    const buttons = [elements.writeBtn, elements.viewBtn];
    buttons.forEach((btn) => {
      btn.classList.remove("bg-accent-color", "text-white");
      btn.classList.add("bg-hover-color");
    });
    const activeButton =
      currentMode === "write" ? elements.writeBtn : elements.viewBtn;
    activeButton.classList.add("bg-accent-color", "text-white");
    activeButton.classList.remove("bg-hover-color");
  };

  const updateDataFromUI = () => {
    storyData.synopsis =
      document.getElementById("synopsis-input")?.value || storyData.synopsis;
    NARRATIVE_PILLARS.forEach((pillar) => {
      storyData[pillar.id] =
        document.getElementById(`${pillar.id}-input`)?.value ||
        storyData[pillar.id];
    });
  };

  const saveDataToFile = () => {
    if (currentMode === "write") updateDataFromUI();
    const dataStr = JSON.stringify(storyData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "story_pillars.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadDataFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedData = JSON.parse(e.target.result);
        storyData = loadedData;
        renderUI();
      } catch (error) {
        alert("Error al leer el archivo. Asegúrate de que es un JSON válido.");
        console.error("Error parsing JSON:", error);
      }
    };
    reader.readAsText(file);
  };

  const toggleTheme = () => {
    const isDark = elements.html.classList.toggle("dark");
    document
      .getElementById("theme-icon-sun")
      .classList.toggle("hidden", isDark);
    document
      .getElementById("theme-icon-moon")
      .classList.toggle("hidden", !isDark);
  };

  // === INICIALIZACIÓN Y EVENT LISTENERS ===
  const init = () => {
    storyData = { ...defaultStoryData }; // Cargar datos de ejemplo al iniciar
    elements.html.classList.add("dark"); // Iniciar en modo oscuro por defecto
    document.getElementById("theme-icon-moon").classList.remove("hidden");

    renderUI();

    elements.writeBtn.addEventListener("click", () => {
      if (currentMode !== "write") {
        currentMode = "write";
        renderUI();
      }
    });
    elements.viewBtn.addEventListener("click", () => {
      if (currentMode !== "view") {
        updateDataFromUI();
        currentMode = "view";
        renderUI();
      }
    });
    elements.saveBtn.addEventListener("click", saveDataToFile);
    elements.loadBtn.addEventListener("click", () =>
      elements.fileInput.click()
    );
    elements.fileInput.addEventListener("change", loadDataFromFile);
    elements.themeToggle.addEventListener("click", toggleTheme);
  };

  init();
});
