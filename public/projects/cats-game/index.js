let sceneCounter = 0;
let scene = `scene${sceneCounter}`;
let div = document.querySelectorAll("body > div");
let sceneTotal = div.length;

let currentGame = 1;
const openedGames = {
    platform: false,
    matching: false,
    music: false,
};

const helpText0 = "Это твой самый настоящий бортовой журнал! <br /> <br /> В нём ты сможешь отслеживать путь нашего космического приключения. По выполнению каждого из заданий тут будут появляться заметки с наблюдениями, и после чего ты получишь возможность вновь вернуться на планету после её изучения через бортовой журнал.";
const helpText1 = "Что же, задача не из простых. <br /> <br /> Нам нужна стратегия! Тебе необходимо перемещаться по ближайшим островкам и переезжать на них по стрелочкам так, чтобы в итоге остановиться ровно центре поля. Как это сделать? Давай попробуем";
const helpText2 = "Насколько у тебя хорошая память? <br /> <br /> Давай проверим! На экране отображаются пары картинок, размещенных в случайном порядке. Запоминай расположение картинок как можно быстрее и правильнее. После того как карточки перевернуться ты должен вспомнить и по очереди открывать  одинаковые между собой изображения. Будь внимателен и не расслабляйся! Каждый раз уровни будут усложняться, а количество карточек увеличиваться.";
const helpText3 = "Сохраняем спокойствие! <br /> <br /> В корабле мы в безопасности. Твоя задача состоит в том, чтобы вовремя нажимать на кнопки когда метеориты будут приближаться к отмеченной на экране черте, и тем самым разбивать их избегая столкновений. Будь осторожен - ошибаться нельзя. Ты можешь пропустить максимум три камня, иначе начнём игру заново. Доверься своему чувству ритма и вперёд!";

const body = document.querySelector("body");

const startGameButton = document.querySelector("#start-game");
const continueGameButton = document.querySelector("#continue-game");
const journalButton = document.querySelector("#journal");
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");
const helpButton = document.querySelector("#help-button");

const journalFirstGameButton = document.querySelectorAll("#scene-10 .planet-img")[0];
const journalSecondGameButton = document.querySelectorAll("#scene-10 .planet-img")[1];
const journalThirdGameButton = document.querySelectorAll("#scene-10 .planet-img")[2];
const journalBackButton = document.querySelector("#scene-10 > div > div:nth-child(2)");

const helpModal = document.querySelector("#help-modal");

const backgroundAudio = document.querySelector("#background-audio");

const matchingGameOriginalHtmlState = document.querySelector("#scene8").cloneNode(true);

const qr1_5 = document.querySelector("#qr1-5");
const qr1_9 = document.querySelector("#qr1-9");
const qr2_9 = document.querySelector("#qr2-9");
const qr1_13 = document.querySelector("#qr1-13");
const qr2_13 = document.querySelector("#qr2-13");
const qr3 = document.querySelector("#qr3");

const qrs = [qr1_5, qr1_9, qr1_13, qr2_9, qr2_13, qr3];
const journalButtons = [journalFirstGameButton, journalSecondGameButton, journalThirdGameButton];

for (let i = 0; i < div.length; i++) {
    div[i].classList.add("transition");
}

for (let i = 0; i < qrs.length; i++) {
    qrs[i].classList.add("transition");
}

checkScene();
moreCats();

startGameButton.addEventListener("click", startGame);
continueGameButton.addEventListener("click", continueGame);

journalButton.addEventListener("click", () => {
    sceneCounter = -11;
    changeScene();
});

journalFirstGameButton.addEventListener("click", () => {
    sceneCounter = 3;
    changeScene();
});

journalSecondGameButton.addEventListener("click", () => {
    sceneCounter = 7;
    changeScene();
});

journalThirdGameButton.addEventListener("click", () => {
    sceneCounter = 11;
    changeScene();
});

journalBackButton.addEventListener("click", () => {
    sceneCounter = -1;
    changeScene();
});

helpButton.addEventListener("click", () => {
    const isOpen = !helpModal.classList.contains("no-opacity");

    let helpText = "";

    if (sceneCounter === -10) {
        helpText = helpText0;
    }

    if (sceneCounter === 4) {
        helpText = helpText1;
    }

    if (sceneCounter === 8) {
        helpText = helpText2;
    }

    if (sceneCounter === 12) {
        helpText = helpText3;
    }

    helpModal.querySelector('div > p').innerHTML = helpText;

    if (!isOpen) {
        helpModal.classList.remove("hidden");
        helpModal.classList.remove("no-opacity");
    } else {
        helpModal.classList.add("no-opacity");
        
        setTimeout(() => {
            helpModal.classList.add("hidden");
        }, 2000);
    }
});

helpModal.addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("help-modal")) {
        helpModal.classList.add("no-opacity");
        
        setTimeout(() => {
            helpModal.classList.add("hidden");
        }, 2000);
    }
});

backButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (sceneCounter >= 4) {
        [...document.querySelectorAll("canvas")].map((canvas) => {
            canvas.remove();
        });
    }

    if (sceneCounter >= 8) {
        document.querySelector("#scene8").replaceWith(matchingGameOriginalHtmlState.cloneNode(true));
    }

    if (sceneCounter >= 12) {
        [...document.querySelectorAll("canvas")].map((canvas) => {
            canvas.remove();
        });
    }

    sceneCounter = -1;
    changeScene();
});

function startGame() {
    startBackgroundAudio();
    enableClick();
    changeScene();
}

function continueGame() {
    sceneCounter = currentGame - 1;

    startBackgroundAudio();
    enableClick();
    changeScene();
}

function startBackgroundAudio() {
    backgroundAudio.volume = 0.01;
    backgroundAudio.play();
}

function pauseBackgroundAudio() {
    backgroundAudio.pause();
}

function stopBackgroundAudio() {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
}

function enableClick() {
    nextButton.addEventListener("click", changeScene);
}

function disableClick() {
    nextButton.removeEventListener("click", changeScene);
}

function hideBackButton() {
    backButton.setAttribute("style", "display: none !important;");
}

function showBackButton() {
    backButton.setAttribute("style", "display: flex !important;");
}

function showNextButton() {
    nextButton.setAttribute("style", "display: flex !important;");
}

function hideNextButton() {
    nextButton.setAttribute("style", "display: none !important;");
}

function showHelpButton() {
    helpButton.setAttribute("style", "display: flex !important;");
}

function hideHelpButton() {
    helpButton.setAttribute("style", "display: none !important;");
}

function checkScene() {
    if (sceneCounter == 0) {
        for (let i = 1; i < div.length; i++) {
            div[i].classList.add("hidden");
            div[i].classList.add("no-opacity");
        }

        for (let i = 0; i < qrs.length; i++) {
            qrs[i].classList.add("hidden");
            qrs[i].classList.add("no-opacity");
            qrs[i].style.display = 'none';
        }
    }

    if (sceneCounter === 9) {
        document.getElementById("over").style.visibility = "hidden";
    }
}

function changeScene() {
    sceneCounter++;
    scene = `scene${sceneCounter}`;

    disableClick();

    for (let i = 0; i < div.length; i++) {
        if (div[i].id != scene) {
            div[i].classList.add("no-opacity");

            setTimeout(() => {
                div[i].classList.add("hidden");
            }, 2000);
        } else {
            removeClass(div[i]);
            div[i].classList.remove("hidden");

            setTimeout(() => {
                div[i].classList.remove("no-opacity");
            }, 0);
        }
    }

    if (scene != "scene4" && scene != "scene8" && scene != "scene12") {
        hideBackButton();
        hideHelpButton();
        showNextButton();
        setTimeout(() => {
            enableClick();
        }, 2000);
    } else {
        showBackButton();
        showHelpButton();
        hideNextButton();
    }

    if (scene == "scene0") {
        hideHelpButton();
        hideBackButton();
        hideNextButton();
    }

    if (scene == "scene-10") {
        hideBackButton();
        hideNextButton();
        showHelpButton();
    }

    if (sceneCounter == sceneTotal) {
        sceneCounter = 0;
    }

    // PLATFORM GAME
    if (scene == "scene4") {
        openedGames.platform = true;
        currentGame = 4;

        disableClick();
        platform();
    }

    if (scene == "scene7") {
        hideNextButton();

        setTimeout(() => {
            changeScene();
        }, 10000);
    }

    // MATCHING GAME
    if (scene == "scene8") {
        openedGames.matching = true;
        currentGame = 8;

        document.getElementById("scene8").style.zIndex = "1000";

        disableClick();
        matching();
    }

    if (scene == "scene9") {
        document.getElementById("scene8-img").style.display = "none";
    }

    if (scene == "scene11") {
        hideNextButton();

        setTimeout(() => {
            changeScene();
        }, 10000);
    }

    // MUSIC GAME
    if (scene == "scene12") {
        openedGames.music = true;
        currentGame = 12;

        disableClick();
        music();
    }

    if (scene == "scene5") {
        qr1_5.classList.remove("hidden");

        setTimeout(() => {
            qr1_5.classList.remove("no-opacity");
        }, 0);
    }

    if (scene == "scene9") {
        qr1_9.classList.remove("hidden");

        setTimeout(() => {
            qr1_9.classList.remove("no-opacity");
        }, 0);

        qr2_9.classList.remove("hidden");

        setTimeout(() => {
            qr2_9.classList.remove("no-opacity");
        }, 0);

        setTimeout(() => {
            qr1_9.style.transform = "translateX(50%)";
            qr2_9.style.transform = "translateX(-50%)";
        }, 1000);
    }

    if (scene == "scene13") {
        qr1_13.classList.remove("hidden");

        setTimeout(() => {
            document.querySelector(".merging").classList.add("planets-in");

            setTimeout(() => {
                const images = document.querySelectorAll(".merging img");
                const [j, ...planets] = [...images].reverse();

                for (let i = 0; i < planets.length; i++) {
                    planets[i].classList.add("no-opacity");
                }

                j.classList.remove("no-opacity");

            }, 1000);
        }, 2000);

        setTimeout(() => {
            qr1_13.classList.remove("no-opacity");
        }, 0);

        qr2_13.classList.remove("hidden");

        setTimeout(() => {
            qr2_13.classList.remove("no-opacity");
        }, 0);

        qr3.classList.remove("hidden");

        setTimeout(() => {
            qr3.classList.remove("no-opacity");
        }, 0);

        setTimeout(() => {
            qr1_13.style.transform = "translateX(50%)";
            qr2_13.style.transform = "translateX(50%)";
            qr3.style.transform = "translateX(-50%)";
        }, 1000);
    }

    if (scene == "scene15") {
        showBackButton();
        hideNextButton();
    }

    if (scene == "scene1") {
        resetGame();
    }

    if (scene == "scene-10") {
        journalFirstGameButton.style.display = "none";
        journalSecondGameButton.style.display = "none";
        journalThirdGameButton.style.display = "none";

        const bgImage = document.getElementById("journal-bg");

        if (openedGames.platform) {
            journalFirstGameButton.style.display = "block";
            bgImage.src = "ui/journal-bg-2.png";
        }

        if (openedGames.matching) {
            journalSecondGameButton.style.display = "block";
            bgImage.src = "ui/journal-bg-3.png";
        }

        if (openedGames.music) {
            journalThirdGameButton.style.display = "block";
            bgImage.src = "ui/journal-bg-4.png";
        }

        showBackButton();
    }
}

function resetGame() {
    qr1_9.style.transform = "translateX(0%)";
    qr2_9.style.transform = "translateX(0%)";
    qr1_13.style.transform = "translateX(0%)";
    qr2_13.style.transform = "translateX(0%)";
    qr3.style.transform = "translateX(0%)";
}

function moreCats() {
    setInterval(() => {
        if (document.title == "🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈") {
            document.title = "";
        }

        document.title = document.title + "🐈";
    }, 1000);
}

function addClass(el) {
    el.classList.add("no-opacity");

    setTimeout(() => {
        el.classList.add("hidden");
    }, 2000);
}

function removeClass(el) {
    el.classList.remove("hidden");

    setTimeout(() => {
        el.classList.remove("no-opacity");
    }, 0);
}
