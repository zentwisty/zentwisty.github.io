const roleChoiceContainer = document.getElementById("role-choice-container");
const projectsContainer = document.getElementById("projects-container");

const roleChoiceElements = Array.from(roleChoiceContainer.children);
const spotlightedRoles = []

const projects = []

function setNoneSelectedState(areNoneSelected) {
    roleChoiceElements.forEach(element => {
        if (areNoneSelected) {
            element.classList.add('none-selected')
        } else {
            element.classList.remove('none-selected')
        }
    })
}

class projectData {
    constructor(roles, title, techs, description) {
        this.roles = roles;
        this.title = title;
        this.techs = techs;
        this.description = description;

        this.projectCardElement = null;
        this.isVisible = true;
    }

    setVisibility(shouldBeVisible) {
        if (shouldBeVisible) {
            this.isVisible = true;
            this.projectCardElement.classList.remove('hidden');
        } else {
            this.isVisible = false;
            this.projectCardElement.classList.add('hidden');
        }
    }
}

function addProjectCard(projectDatapoint) {
    // Create the main parent container element with class "project-card"
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');

    // make it so that when you click on the project card, the user is directed to the appropriate page
    projectCard.addEventListener('click', function () {
        window.location.href = `projects/${projectDatapoint.title}`;
    });

    // Create the "role-icons" container and its child elements
    const roleIconsContainer = document.createElement('div');
    roleIconsContainer.classList.add('role-icons');

    // add appropriate role icons
    const roleIcons = [];
    if (projectDatapoint.roles["gamedesign"] > 0) { roleIcons.push('🏓'); }
    if (projectDatapoint.roles["programming"] > 0) { roleIcons.push('🔮'); }
    if (projectDatapoint.roles["composing"] > 0) { roleIcons.push('🎷'); }
    if (projectDatapoint.roles["art"] > 0) { roleIcons.push('🦚'); }
    roleIcons.forEach(icon => {
        const pElement = document.createElement('p');
        pElement.textContent = icon;
        roleIconsContainer.appendChild(pElement);
    });

    // Append "role-icons" container to the main parent container
    projectCard.appendChild(roleIconsContainer);

    // Create the "project-card-content" container
    const projectCardContent = document.createElement('div');
    projectCardContent.classList.add('project-card-content');

    // Create the "image-text-content" container and its child elements
    const imageTextContent = document.createElement('div');
    imageTextContent.classList.add('image-text-content');

    const imageContent = document.createElement('div');
    imageContent.classList.add('image-content');

    const image = document.createElement('img');
    image.src = 'projects/' + projectDatapoint.title + '/thumbnail.gif';
    image.alt = "image from " + projectDatapoint.title;

    imageContent.appendChild(image);

    const title = document.createElement('h2');
    title.textContent = projectDatapoint.title;

    const description = document.createElement('p');
    description.textContent = projectDatapoint.description;

    imageTextContent.appendChild(imageContent);
    imageTextContent.appendChild(title);
    imageTextContent.appendChild(description);

    // Append "image-text-content" container to "project-card-content" container
    projectCardContent.appendChild(imageTextContent);

    // Create the "skills-content" container and its child elements
    const skillsContent = document.createElement('div');
    skillsContent.classList.add('skills-content');

    const skills = projectDatapoint.techs;
    skills.forEach(skill => {
        const skillBubble = document.createElement('div');
        skillBubble.classList.add('skill-bubble');
        skillBubble.textContent = skill;
        skillsContent.appendChild(skillBubble);
    });

    // Append "skills-content" container to "project-card-content" container
    projectCardContent.appendChild(skillsContent);

    // Append "project-card-content" container to the main parent container
    projectCard.appendChild(projectCardContent);

    // Append the main parent container to the document body (or any other desired parent)
    projectsContainer.appendChild(projectCard);
    return projectCard;
}

async function fetchProjectsData() {
    try {
      const response = await fetch('projects/projects.json');
      const data = await response.json();
  
      const projectPromises = data.map(async (item) => {
        const [techsResponse, rolesResponse, descriptionResponse] = await Promise.all([
          fetch(`projects/${item}/techs.json`),
          fetch(`projects/${item}/roles.json`),
          fetch(`projects/${item}/description.txt`),
        ]);
  
        const [techsData, rolesData, descriptionText] = await Promise.all([
          techsResponse.json(),
          rolesResponse.json(),
          descriptionResponse.text(),
        ]);
  
        return new projectData(rolesData, item, techsData, descriptionText);
      });
  
      const projects = await Promise.all(projectPromises);
  
      return projects;
    } catch (error) {
      console.error('Error fetching projects data:', error);
      return [];
    }
  }

// fetch projects
(async () => {
    const projectsToLoad = await fetchProjectsData();
    projectsToLoad.forEach((project) => {
        project.projectCardElement = addProjectCard(project);
        projects.push(project);
    });
})();

// handle role choosing
roleChoiceElements.forEach((element) => {
    // initialize all roleChoiceElements with the none-selected qualities
    element.classList.add('none-selected');

    element.addEventListener('click', () => {
        // convert the emoji lol
        let toggledRole = ''
        switch (element.firstElementChild.textContent) {
            case '🏓game designer🏓':
                toggledRole = 'gamedesign'
                break;
            case '🔮programmer🔮':
                toggledRole = 'programming'
                break;
            case '🎷composer🎷':
                toggledRole = 'composing'
                break;
            case '🦚3D artist🦚':
                toggledRole = 'art'
                break;
            default:
                break;
        }

        // if we are adding our first spotlighted roleChoiceElement...
        if (spotlightedRoles.length === 0) {
            setNoneSelectedState(false);
        }

        // add or remove the clicked element
        if (element.classList.toggle('spotlighted')) {
            spotlightedRoles.push(toggledRole)

        } else {
            spotlightedRoles.splice(spotlightedRoles.indexOf(toggledRole), 1)
        }

        // if we have un-spotlighted the last spotlighted roleChoiceElement...
        if (spotlightedRoles.length === 0) {
            setNoneSelectedState(true);
        }

        // handle the hiding and showing of projects
        projects.forEach((project) => {
            project.setVisibility(true);

            spotlightedRoles.forEach((role) => {
                // console.log(`${role} rating for ${project.title} is ${project.roles[role]}`)
                if (project.roles[role] == 0) {
                    project.setVisibility(false);
                }
            });            
        });
    });
})