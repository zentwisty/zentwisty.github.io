const roleChoiceElements = document.querySelectorAll('.role-choice');
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

roleChoiceElements.forEach((element) => {
    // initialize all roleChoiceElements with the none-selected qualities
    element.classList.add('none-selected');

    element.addEventListener('click', () => {
        // if we are adding our first spotlighted roleChoiceElement...
        if (spotlightedRoles.length === 0) {
            setNoneSelectedState(false);
        }

        // add or remove the clicked element
        if (element.classList.toggle('spotlighted')) {
            spotlightedRoles.push(element)
        } else {
            spotlightedRoles.splice(spotlightedRoles.indexOf(element), 1)
        }

        // if we have un-spotlighted the last spotlighted roleChoiceElement...
        if (spotlightedRoles.length === 0) {
            setNoneSelectedState(true);
        }
    });
})