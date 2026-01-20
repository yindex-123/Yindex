"use strict";

let n = "";
let nBefore = "";

window.addEventListener("DOMContentLoaded", function () {
    $("header").textillate({
        loop: false,
        minDisplayTime: 2000,
        initialDelay: 2000,
        autoStart: true,
        in: {
            effect: "fadeInLeftBig",
            delayScale: 1.5,
            delay: 50,
            sync: false,
            shuffle: true
        }
    });

    $(function () {
        ScrollReveal().reveal("#btn1", { duration: 9000 });
    });

    setTimeout(function () {
        let popMessage = "いらっしゃい! おみくじ引いてって!";
        alert(popMessage);
    }, 5000);
}, false);

let soundEndflag = "0";
let w_sound;
let music;

const btn1 = document.getElementById("btn1");
const omikujiText = document.getElementById("omikujiText");
const omikujiTextImg = document.getElementById("omikujiTextImage");

btn1.addEventListener("click", function () {
    if (soundEndflag === "1") {
        soundControl("end", "");
    }

    let resultText = [
        "img/daikichi.png",
        "img/chukichi.png",
        "img/syokichi.png",
        "img/suekichi.png",
        "img/daikyo.png"
    ];

    const resultMaxSpeed = [10, 10, 8, 5, 5];
    const resultMaxSize = [30, 30, 30, 40, 30];
    const resultImage = [
        "img/star.png",
        "img/sakura_hanabira.png",
        "img/water1.png",
        "img/redleaves4.png",
        "img/snowflakes.png"
    ];

    let resultSound = [
        "sound/omikuji_sound1.mp3",
        "sound/omikuji_sound2.mp3",
        "sound/omikuji_sound3.mp3",
        "sound/omikuji_sound4.mp3",
        "sound/omikuji_sound5.mp3"
    ];

    while (n === nBefore) {
        n = Math.floor(Math.random() * resultText.length);
    }
    nBefore = n;

    omikujiTextImg.src = resultText[n];
    omikujiTextImg.classList.add("omikujiPaper");

    omikujiTextImg.addEventListener("animationend", function () {
        omikujiTextImg.classList.remove("omikujiPaper");
    }, false);

    w_sound = resultSound[n];
    soundControl("start", w_sound);
    soundEndflag = "1";

    const index = Math.floor(Math.random() * resultImage.length);

    $(document).snowfall("clear");

    $(document).snowfall({
        maxSpeed: resultMaxSpeed[index % resultMaxSpeed.length],
        minSpeed: 1,
        maxSize: resultMaxSize[index % resultMaxSize.length],
        minSize: 1,
        image: resultImage[index]
    });
}, false);

function soundControl(status, w_sound) {
    if (status === "start") {
        music = new Audio(w_sound);
        music.currentTime = 0;
        music.play();
    } else if (status === "end") {
        music.pause();
        music.currentTime = 0;
    }
}
