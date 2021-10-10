const logButton = document.querySelector("#log-in")
const startP = document.querySelector("#starter");
const webURL = document.querySelectorAll('#container a, .important-links a');

logButton.addEventListener("click", function() {
    alert("Under Construction!");
});

if (document.URL.includes("index.html")) {
    startP.addEventListener("mouseover", mouseOver);
    startP.addEventListener("mouseout", mouseOut);

    document.addEventListener("DOMContentLoaded", function() {
        const images = [
            "url('../@Resources/bg40.png')",
            "url('../@Resources/bg41.png')",
            "url('../@Resources/bg42.png')",
            "url('../@Resources/bg43.png')",
            "url('../@Resources/bg44.png')",
            "url('../@Resources/bg45.png')",
            "url('../@Resources/bg46.png')",
        ]

        var d = new Date();
        var day = d.getDay();

        switch (day) {
            case 0:
                document.body.style["background-image"] = images[0];
                break;
            case 1:
                document.body.style["background-image"] = images[1];
                break;
            case 2:
                document.body.style["background-image"] = images[2];
                break;
            case 3:
                document.body.style["background-image"] = images[3];
                break;
            case 4:
                document.body.style["background-image"] = images[4];
                break;
            case 5:
                document.body.style["background-image"] = images[5];
                break;
            case 6:
                document.body.style["background-image"] = images[6];
                break;
            default:
                document.body.style["background-image"] = images[0];
        }
    });
}

webURL.forEach(element =>
    element.addEventListener('click', () => {
        window.open(element, '_blank').focus();
        event.preventDefault();
    }));

function mouseOver() {
    startP.innerHTML = "Click Here!";
    startP.style.color = "white";
    startP.style.backgroundColor = "#ff880000";
}

function mouseOut() {
    startP.innerHTML = "Get Started!";
    startP.style.color = "black";
    startP.style.backgroundColor = "white";
}