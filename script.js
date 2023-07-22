const roleChoiceContainer = document.getElementById("role-choice-container");
const projectsContainer = document.getElementById("projects-container");

const roleChoiceElements = Array.from(roleChoiceContainer.children);
const spotlightedRoles = []

function setNoneSelectedState(areNoneSelected) {
    roleChoiceElements.forEach(element => {
        if (areNoneSelected) {
            element.classList.add('none-selected')
        } else {
            element.classList.remove('none-selected')
        }
    })
}

const visibleProjects = [];
const hiddenProjects = [];

class projectData {
    constructor(roles, imgfilename, title, description, techs) {
        this.roles = roles;
        this.imgfilename = imgfilename;
        this.title = title;
        this.description = description;
        this.techs = techs;
        this.projectCardElement = null;
    }

    setHidden(isToBeHidden) {
        if (isToBeHidden) {
            this.projectCardElement.classList.add('hidden')
            visibleProjects.splice(visibleProjects.indexOf(this), 1)
            hiddenProjects.push(this)
        } else {
            this.projectCardElement.classList.remove('hidden')
            hiddenProjects.splice(hiddenProjects.indexOf(this), 1)
            visibleProjects.push(this)
        }
    }
}

function addProjectCard(projectDatapoint) {
    // Create the main parent container element with class "project-card"
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');

    // Create the "role-icons" container and its child elements
    const roleIconsContainer = document.createElement('div');
    roleIconsContainer.classList.add('role-icons');

    const roleIcons = projectDatapoint.roles;
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
    image.src = 'data/' + projectDatapoint.imgfilename;
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
        const response = await fetch('data/projects.json');
        const data = await response.json();

        // Convert JSON data into instances of the projectData class
        const projects = data.map(item => new projectData(
            item.roles,
            item.imgfilename,
            item.title,
            item.description,
            item.techs
        ));

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
        visibleProjects.push(project)
        project.projectCardElement = addProjectCard(project)
    });
})();

// handle role choosing
roleChoiceElements.forEach((element) => {
    // initialize all roleChoiceElements with the none-selected qualities
    element.classList.add('none-selected');

    element.addEventListener('click', () => {
        // convert the emoji lol
        let emoji = ''
        switch (element.firstElementChild.textContent) {
            case '🏓game designer🏓':
                emoji = '🏓'
                break;
            case '🔮programmer🔮':
                emoji = '🔮'
                break;
            case '🎷composer🎷':
                emoji = '🎷'
                break;
            case '🦚3D artist🦚':
                emoji = '🦚'
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
            spotlightedRoles.push(emoji)

            // filter out the visible projects
            visibleProjects.forEach((project) => {
                if (!project.roles.includes(emoji)) {
                    project.setHidden(true)
                }
            });
        } else {
            spotlightedRoles.splice(spotlightedRoles.indexOf(emoji), 1)

            // filter back in the hidden projects
            hiddenProjects.forEach((project) => {
                projectHasAllTheRoles = true
                spotlightedRoles.forEach((role) => {
                    if (!project.roles.includes(role)) {
                        projectHasAllTheRoles = false;
                    }
                })
                if (projectHasAllTheRoles) {
                    project.setHidden(false)
                }
            });
        }

        // if we have un-spotlighted the last spotlighted roleChoiceElement...
        if (spotlightedRoles.length === 0) {
            setNoneSelectedState(true);
        }

        console.log(visibleProjects)
        console.log(hiddenProjects)
        console.log(spotlightedRoles)
    });
})