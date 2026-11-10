const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");
const cap_texto = document.querySelector(".cap_texto")

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        // Remove "active" de todas as abas
        tabs.forEach(t => t.classList.remove("active"));

        // Esconde todos os conteúdos
        contents.forEach(content => content.classList.remove("active"));

        // Ativa a aba clicada
        tab.classList.add("active");

        // Pega qual conteúdo deve aparecer
        const tabId = tab.dataset.tab;

        // Mostra o conteúdo correspondente
        document.getElementById(tabId).classList.add("active");
    });
});

