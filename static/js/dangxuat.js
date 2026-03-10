document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".fa-arrow-right-from-bracket").onclick = async function(){
        await fetch("/dangxuat")
        location.reload()
    }
})