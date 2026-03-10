document.addEventListener("DOMContentLoaded", function () {
    const accs = document.querySelectorAll(".acc");
    const boLoc = document.querySelectorAll(".timtheogia div");
    const soLuongSpan = document.querySelector(".linhtinh span:nth-child(2)");
    function capNhatSoLuong() {
        let dem = 0;
        accs.forEach(acc => {
            if (acc.style.display !== "none") {
                dem++;
            }
        });
        soLuongSpan.textContent = "Số lượng: " + dem;
    }
    boLoc.forEach(div => {
        div.addEventListener("click", function () {
            const text = this.innerText.trim();
            accs.forEach(acc => {
                const gia = parseInt(acc.dataset.gia);
                let hien = false;
                if (text === "Tất cả") hien = true;
                else if (text === "Dưới 5m" && gia < 5000000) hien = true;
                else if (text === "5m-10m" && gia >= 5000000 && gia < 10000000) hien = true;
                else if (text === "10m-20m" && gia >= 10000000 && gia < 20000000) hien = true;
                else if (text === "20m-30m" && gia >= 20000000 && gia < 30000000) hien = true;
                else if (text === "Trên 30m" && gia >= 30000000) hien = true;
                acc.style.display = hien ? "flex" : "none";
            });
            capNhatSoLuong();
        });
    });
    capNhatSoLuong();
});