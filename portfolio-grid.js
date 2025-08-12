const gridContainer = document.getElementById("portfolio-grid");

portfolioProjects.forEach(project => {
  const card = document.createElement("a");
  card.href = project.page;
  card.classList.add("project-card");
  card.innerHTML = `
    <img src="${project.thumbnail}" alt="${project.title}">
    <h3>${project.title}</h3>
  `;
  gridContainer.appendChild(card);
});
