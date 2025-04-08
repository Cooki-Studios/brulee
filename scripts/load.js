setTimeout(() => {
    document.getElementById("loading-error").textContent = "Loading is taking a while. Please check your internet connection or try again later.";
    document.getElementById("loading-error").setAttribute("data-text", "Loading is taking a while. Please check your internet connection or try again later.");
    document.getElementById("loading-error").style.display = "block";
    document.getElementById("loading-error").style.opacity = "1";
}, 0)