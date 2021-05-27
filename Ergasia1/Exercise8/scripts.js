if (document.URL.includes("index.html") || document.URL.includes("login.html")) {

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

if (document.URL.includes("index.html")) {
    var startP = document.querySelector("#starter");
    startP.addEventListener("mouseover", mouseOver);
    startP.addEventListener("mouseout", mouseOut);
}

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

const webURL = document.querySelectorAll('#container a, .important-links a');
webURL.forEach(element =>
    element.addEventListener('click', () => {
        window.open(element, '_blank').focus();
        event.preventDefault();
    }));

if (document.URL.includes("login.html")) {
    window.onload = function() {
        document.getElementById("previous-one").addEventListener("click", function() {
            document.getElementById("user").style.display = "none";
            document.getElementById("profile").style.display = "block";
            document.getElementById("step2").classList.remove("active");
        })
        document.getElementById("previous-two").addEventListener("click", function() {
            document.getElementById("questions").style.display = "none";
            document.getElementById("user").style.display = "block";
            document.getElementById("step3").classList.remove("active");
        })
    }

    function validateProfile() {
        let uname = document.forms["myForm"]["username"];
        let mail = document.forms["myForm"]["email"];
        let pass = document.forms["myForm"]["pass"];
        let cpass = document.forms["myForm"]["cpass"];
        var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        uname.setCustomValidity("");
        mail.setCustomValidity("");
        pass.setCustomValidity("");
        cpass.setCustomValidity("");
        if (uname.value == null || uname.value == "") {
            uname.setCustomValidity("Username can't be left blank");
            uname.reportValidity();
            return false;
        } else if (uname.validity.patternMismatch) {
            uname.setCustomValidity("Only English letters or numbers allowed");
            uname.reportValidity();
            return false;
        }else if (mail.value.indexOf("@") < 1 || mail.value.lastIndexOf(".") < mail.value.indexOf("@") + 2 || mail.value.lastIndexOf(".") + 2 >= mail.value.length || mail.value == null || mail.value == "") {
            mail.setCustomValidity("Wrong mail format");
            mail.reportValidity();
            return false;
        } else if (pass.value == null || pass.value == "") {
            pass.setCustomValidity("Password can't be left blank");
            pass.reportValidity();
            return false;
        } else if (cpass.value == null || cpass.value == "") {
            cpass.setCustomValidity("You need to confirm your password");
            cpass.reportValidity();
            return false;
        } else if (!pass.value.match(passw)) {
            pass.setCustomValidity("Need at least 6 characters, one number, one uppercase, one lowercase");
            pass.reportValidity();
            return false;
        } else if (pass.value !== cpass.value) {
            cpass.setCustomValidity("Passwords must match");
            cpass.reportValidity();
            return false;
        } else {
            document.getElementById("profile").style.display = "none";
            document.getElementById("user").style.display = "block";
            document.getElementById("step2").classList.add("active");
        }
    }

    function validateUser() {
        let fname = document.forms["myForm"]["fname"];
        let lname = document.forms["myForm"]["lname"];
        let birth = document.forms["myForm"]["birth-date"];
        let address = document.forms["myForm"]["address"];
        let country = document.forms["myForm"]["country"];
        let tel = document.forms["myForm"]["phonenumber"];
        fname.setCustomValidity("");
        lname.setCustomValidity("");
        birth.setCustomValidity("");
        country.setCustomValidity("");
        address.setCustomValidity("");
        tel.setCustomValidity("");
        if (fname.value == null || fname.value == "") {
            fname.setCustomValidity("First Name can't be left blank");
            fname.reportValidity();
            return false;
        } else if (fname.validity.patternMismatch) {
            fname.setCustomValidity("Only Greek/English letters allowed");
            fname.reportValidity();
            return false;
        }else if (lname.value == null || lname.value == "") {
            lname.setCustomValidity("Last Name can't be left blank");
            lname.reportValidity();
            return false;
        } else if (lname.validity.patternMismatch) {
            lname.setCustomValidity("Only Greek/English letters allowed");
            lname.reportValidity();
            return false;
        }else if (birth.value == null || birth.value == "") {
            birth.setCustomValidity("Birth Date can't be left blank");
            birth.reportValidity();
            return false;
        } else if (address.value == null || address.value == "") {
            address.setCustomValidity("Address field can't be left blank");
            address.reportValidity();
            return false;
        } else if (country.value == null || country.value == "") {
            country.setCustomValidity("Country field can't be left blank");
            country.reportValidity();
            return false;
        } else if (tel.value == null || tel.value == "" || tel.value.length != 10) {
            tel.setCustomValidity("Wrong format, need: 0123456789");
            tel.reportValidity();
            return false;
        } else {
            document.getElementById("user").style.display = "none";
            document.getElementById("questions").style.display = "block";
            document.getElementById("step3").classList.add("active");
        }
    }

    function validateForm() {
        var url = "http://localhost/rrrr/register.php";
        alert("Your form has been submitted");
        document.getElementById("myForm").action = url;
    }
}