const categories = {
    "Mesopotamia": {
        100: ["This is the name of the region between the Tigris and Euphrates Rivers.", "What is Mesopotamia?"],
        200: ["Mesopotamians wrote using this wedge-shaped writing system.", "What is cuneiform?"],
        300: ["The first known written set of laws was called this.", "What is Hammurabi’s Code?"],
        400: ["This was the name of the Sumerian temple built to honor the gods.", "What is a ziggurat?"],
        500: ["The Mesopotamians invented this to help with transportation and pottery.", "What is the wheel?"]
    },
    "Egypt": {
        100: ["These rulers of Egypt were considered gods on Earth.", "What are pharaohs?"],
        200: ["The Egyptians developed this writing system using picture symbols.", "What are hieroglyphics?"],
        300: ["This river was essential for Egyptian civilization.", "What is the Nile River?"],
        400: ["Egyptians preserved bodies through this process.", "What is mummification?"],
        500: ["This stone helped scholars decode hieroglyphics.", "What is the Rosetta Stone?"]
    },
    "Greece": {
        100: ["This type of government means 'rule by the people.'", "What is democracy?"],
        200: ["These city-states often fought each other but came together to fight Persia.", "What are Athens and Sparta?"],
        300: ["The ancient Greeks believed in many gods, making them this.", "What is polytheistic?"],
        400: ["This philosopher taught using questioning and dialogue.", "Who is Socrates?"],
        500: ["The Greeks held these athletic competitions to honor Zeus.", "What are the Olympics?"]
    },
    "Rome": {
        100: ["This type of government elects leaders to represent the people.", "What is a republic?"],
        200: ["These Roman structures carried water to cities.", "What are aqueducts?"],
        300: ["This famous Roman general was assassinated in 44 BCE.", "Who is Julius Caesar?"],
        400: ["The Romans borrowed much of their culture from this civilization.", "What is Greece?"],
        500: ["This large arena in Rome hosted gladiator fights.", "What is the Colosseum?"]
    },
    "Vocabulary": {
        100: ["A person trained to write in ancient times.", "What is a scribe?"],
        200: ["A society with cities, government, religion, and social structure.", "What is a civilization?"],
        300: ["People who move from place to place in search of food.", "What are nomads?"],
        400: ["The spread of ideas and culture between societies.", "What is cultural diffusion?"],
        500: ["A person who studies artifacts to learn about the past.", "What is an archaeologist?"]
    }
};

let teams = {};
let currentQuestion = null;
let currentPoints = 0;
let currentButton = null; // Stores the clicked button

document.getElementById("add-team").addEventListener("click", addTeam);
document.getElementById("start-game").addEventListener("click", startGame);

function addTeam() {
    const teamInputs = document.getElementById("team-inputs");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Team Name";
    teamInputs.appendChild(input);
}

function startGame() {
    const teamInputs = document.querySelectorAll("#team-inputs input");
    if (teamInputs.length === 0) return;

    teams = {};
    const teamSelect = document.getElementById("team-select");
    teamSelect.innerHTML = "";
    document.getElementById("scores").innerHTML = "";

    teamInputs.forEach(input => {
        if (input.value.trim() !== "") {
            const name = input.value.trim();
            teams[name] = 0;

            const scoreDiv = document.createElement("div");
            scoreDiv.className = "team";
            scoreDiv.id = `team-${name}`;
            scoreDiv.innerText = `${name}: $0`;
            document.getElementById("scores").appendChild(scoreDiv);

            const option = document.createElement("option");
            option.value = name;
            option.innerText = name;
            teamSelect.appendChild(option);
        }
    });

    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";
    generateBoard();
}

function generateBoard() {
    const board = document.getElementById("jeopardy-board");
    board.innerHTML = '';

    Object.keys(categories).forEach(category => {
        let header = document.createElement("div");
        header.className = "category";
        header.innerText = category;
        board.appendChild(header);
    });

    for (let points of [100, 200, 300, 400, 500]) {
        Object.keys(categories).forEach(category => {
            let button = document.createElement("button");
            button.className = "question";
            button.innerText = `$${points}`;
            button.setAttribute("data-category", category);
            button.setAttribute("data-points", points);
            button.onclick = showQuestion;
            board.appendChild(button);
        });
    }
}

function showQuestion(event) {
    currentButton = event.target; // Store the clicked button
    const category = currentButton.getAttribute("data-category");
    const points = parseInt(currentButton.getAttribute("data-points"));

    currentQuestion = category;
    currentPoints = points;

    // Play the Jeopardy theme song
    const jeopardyTheme = document.getElementById("jeopardy-theme");
    jeopardyTheme.play();

    document.getElementById("question-text").innerText = categories[category][points][0];
    document.getElementById("popup").style.display = "block";
}

function showAnswer() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("answer-text").innerText = categories[currentQuestion][currentPoints][1];
    document.getElementById("answer-popup").style.display = "block";

    // Stop the Jeopardy theme song
    const jeopardyTheme = document.getElementById("jeopardy-theme");
    jeopardyTheme.pause();
    jeopardyTheme.currentTime = 0; // Reset audio to start
}

function updateScore(correct) {
    const team = document.getElementById("team-select").value;
    teams[team] += correct ? currentPoints : -currentPoints;
    document.getElementById(`team-${team}`).innerText = `${team}: $${teams[team]}`;

    // Close the answer pop-up after scoring
    document.getElementById("answer-popup").style.display = "none";

    // Disable the button permanently after the question has been answered
    if (currentButton) {
        currentButton.disabled = true;
        currentButton.style.backgroundColor = "#222"; // Change to a "used" style
        currentButton.style.cursor = "not-allowed";
    }
}
