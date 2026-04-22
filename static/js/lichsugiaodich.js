document.addEventListener("DOMContentLoaded", function() {

    const nutmenu = document.querySelector('.fa-list');
    const bangmenu = document.querySelector('.bangmenu');
    const ngoaibangmenu = document.querySelector('.ngoaibangmenu');

    nutmenu.addEventListener('click', function(){
        bangmenu.classList.add("hien");
        ngoaibangmenu.style.display = "block";
    });

    ngoaibangmenu.addEventListener('click', function(e){
        bangmenu.classList.remove("hien");
        ngoaibangmenu.style.display = "none";
    });

    // ===== ICON CÁ NHÂN =====
    const nutcanhan = document.querySelector('.fa-user');
    const bangcanhan = document.querySelector('.iconcanhan');

    nutcanhan.addEventListener('click', function(){
        bangcanhan.classList.add("hien");
        ngoaibangmenu.style.display = "block";
    });

    ngoaibangmenu.addEventListener('click', function(e){
        bangcanhan.classList.remove("hien");
        ngoaibangmenu.style.display = "none";
    });

    // ===== NAV =====
    const nuttrangchu = document.querySelector('.chucnang .trangchu');
    const nutlichsumuaacc = document.querySelector('.lichsumuaacc');
    const nutnaptien = document.querySelector('.naptien');
    const nutgiohang = document.querySelector('.giohang');
    const nutlichsugiaodich = document.querySelector('.lichsugiaodich');

    nutlichsugiaodich.addEventListener('click', function(){
        window.location.href = "/lichsugiaodich";
    });

    nuttrangchu.addEventListener('click', function(){
        window.location.href = "/";
    });

    nutlichsumuaacc.addEventListener('click', function(){
        window.location.href = "/lichsumuaacc";
    });

    nutnaptien.addEventListener('click', function(){
        window.location.href = "/trangnaptien";
    });

    nutgiohang.addEventListener('click', function(){
        window.location.href = "/giohang";
    });

    const nutdangnhap = document.querySelector('.dangnhap');
    const nuttaotaikhoan = document.querySelector('.taotaikhoan');
    const nutdoimatkhau = document.querySelector('.doimatkhau');

    nutdangnhap.addEventListener('click', function(){
        window.location.href = "/dangnhap";
    });

    nuttaotaikhoan.addEventListener('click', function(){
        window.location.href = "/dangky";
    });

    nutdoimatkhau.addEventListener('click', function(){
        window.location.href = "/doimatkhau";
    });

    // ===== DATA =====
    let danhsachgoc = Array.from(document.querySelectorAll(".bang-giaodich tbody tr"));
    let dsa = [...danhsachgoc];

    let tranghientai = 1;
    let tongsotrang = 1;

    const sotrang = document.querySelector(".sotrang");

    // ===== HIỂN THỊ =====
    function hientrang(trang, dsa) {
        danhsachgoc.forEach(tr => tr.style.display = "none");

        const batdau = (trang - 1) * 8;
        const ketthuc = Math.min(batdau + 8, dsa.length);

        for (let i = batdau; i < ketthuc; i++) {
            dsa[i].style.display = "";
        }

        sotrang.textContent = `Trang ${trang}/${tongsotrang}`;
    }

    // ===== RENDER =====
    function render() {
        const tbody = document.querySelector(".bang-giaodich tbody");
        tbody.innerHTML = "";
        dsa.forEach(tr => tbody.appendChild(tr));

        tongsotrang = Math.ceil(dsa.length / 8) || 1;
        tranghientai = 1;

        hientrang(tranghientai, dsa);
    }

    // ===== FILTER THEO TIỀN =====
    document.querySelector(".nutloc").addEventListener("click", function () {
        const min = document.querySelector(".tienmin").value || 0;
        const max = document.querySelector(".tienmax").value || Infinity;

        dsa = danhsachgoc.filter(tr => {
            const tien = Number(tr.dataset.tien);
            return tien >= min && tien <= max;
        });

        render();
    });

    // ===== PHÂN TRANG =====
    document.querySelector(".trangtruoc").addEventListener("click", function () {
        if (tranghientai > 1) {
            tranghientai--;
            hientrang(tranghientai, dsa);
        }
    });

    document.querySelector(".trangsau").addEventListener("click", function () {
        if (tranghientai < tongsotrang) {
            tranghientai++;
            hientrang(tranghientai, dsa);
        }
    });

    // ===== 🔥 THÊM SEARCH THEO MÃ (MỚI) =====
    const inputtimkiem = document.querySelector(".timkiem");

    inputtimkiem.addEventListener("input", function () {
        const keyword = inputtimkiem.value.trim().toLowerCase();

        if (keyword === "") {
            dsa = [...danhsachgoc];
        } else {
            dsa = danhsachgoc.filter(tr => {
                const ma = tr.querySelector(".ma").textContent.toLowerCase();
                return ma.includes(keyword);
            });
        }

        render();
    });

    // ===== INIT =====
    render();

    const tbody = document.querySelector(".bang-giaodich");

    console.log(tbody.offsetHeight);
    console.log(tbody.scrollHeight);

    const tdList = document.querySelectorAll("td");

    tdList.forEach((td, i) => {
        console.log(i, td.offsetHeight);
    });

});