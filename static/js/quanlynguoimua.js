document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");

    async function fetchWithAuth(url, options = {}) {
        const headers = options.headers || {};
        headers["Authorization"] = "Bearer " + token;

        if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        const res = await fetch(url, { ...options, headers });

        if (res.status === 401) {
            alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
            window.location.href = "/dangnhap";
            return null;
        }
        return res;
    }

    // Phân trang --------------------------------------------------------
    let danhsachnguoimua = Array.from(document.querySelectorAll('.bang .hang'));
    let danhsachhien = [...danhsachnguoimua];
    let tranghientai = 1;
    const tongsohang = danhsachnguoimua.length;
    let tongsohanghien = danhsachhien.length;
    let tongsotrang = Math.ceil(tongsohang / 8);
    const sotrang = document.querySelector('.bang .cuoibang span');
    const tongElm = document.querySelector(".linhtinh .trai .tong");

    function hientrang(trang) {
        let tongsohanghien = danhsachhien.length;
        let tongsotrang = Math.ceil(tongsohanghien / 8);
        for (let i = 0; i < tongsohang; i++) {
            danhsachnguoimua[i].style.display = 'none';
        }
        const batdau = (trang - 1) * 8;
        const ketthuc = Math.min(batdau + 8, tongsohanghien);
        for (let i = batdau; i < ketthuc; i++) {
            danhsachhien[i].style.display = 'flex';
        }
        tongElm.textContent = `Tổng số người mua: ${tongsohanghien}`;
        sotrang.textContent = `Trang ${trang}/${tongsotrang}`;
    }

    const nuttrangtruoc = document.querySelector('.bang .cuoibang .trangtruoc');
    const nuttrangsau = document.querySelector('.bang .cuoibang .trangsau');

    nuttrangtruoc.addEventListener('click', function () {
        if (tranghientai > 1) {
            tranghientai--;
            hientrang(tranghientai);
        }
    });

    nuttrangsau.addEventListener('click', function () {
        if (tranghientai < tongsotrang) {
            tranghientai++;
            hientrang(tranghientai);
        }
    });
    hientrang(tranghientai);

    // Xóa người mua -------------------------------------------------
    const bang = document.querySelector(".bang");
    bang.addEventListener("click", async function (e) {
        if (!e.target.classList.contains("fa-delete-left")) return;
        const nut = e.target;
        if (!confirm("Bạn có chắc muốn xóa người mua này?")) return;
        
        const manguoimua = nut.dataset.ma;
        const res = await fetchWithAuth('/xoanguoimua', {
            method: 'POST',
            body: JSON.stringify({
                ma_nguoi_mua: manguoimua
            })
        });

        if (res) {
            const data = await res.json();
            if (data.status === "success") {
                const hang = nut.closest(".hang");
                const hr = hang.nextElementSibling;
                if (hr && hr.tagName === "HR") {
                    hr.remove();
                }
                hang.remove();
                location.reload();
            }
        }
    });

    // Sửa số dư (Mở popup) ---------------------------------------------------
    const danhsachnutsua = document.querySelectorAll(".fa-solid.fa-pen");

    danhsachnutsua.forEach(nut => {
        const hang = nut.closest(".hang");
        const popup = hang.querySelector(".popupsodu");
        const inputten = popup.querySelector(".inputten");
        const inputtaikhoan = popup.querySelector(".inputtaikhoan");
        const inputmatkhau = popup.querySelector(".inputmatkhau");
        const inputsodu = popup.querySelector(".inputsodu");
        const btnLuu = popup.querySelector(".luusodu");

        nut.addEventListener("click", async function () {
            document.body.style.overflow = "hidden";

            const ngoaimenu = document.querySelector(".ngoaibangmenu");

            hang.classList.add("active");
            popup.style.display ="flex";
            ngoaimenu.style.display = "block";
            popup.classList.remove("top");

            // Lưu số dư mới ---------------------------------------------------------
            btnLuu.onclick = async function () {
                const tenmoi = inputten.value.trim();
                const taikhoanmoi = inputtaikhoan.value.trim();
                const matkhaumoi = inputmatkhau.value.trim();
                const sodumoi = inputsodu.value.replace(/\./g, '');

                const res = await fetchWithAuth("/suasodu", {
                    method: "POST",
                    body: JSON.stringify({
                        ma_nguoi_mua: nut.dataset.ma,
                        ten_moi: tenmoi,
                        tai_khoan_moi: taikhoanmoi,
                        mat_khau_moi: matkhaumoi,
                        so_du_moi: sodumoi
                    })
                });

                if (res) {
                    const data = await res.json();
                    if (data.status === "success") {
                        ngoaimenu.style.display = "none";
                        popup.style.display ="none";
                        hang.classList.remove("active");
                        document.body.style.overflow = "auto";
                        location.reload();
                    }
                }
            };
            // Click ngoài để đóng
            ngoaimenu.onclick = function () {
                ngoaimenu.style.display = "none";
                popup.style.display ="none";
                hang.classList.remove("active");
                document.body.style.overflow = "auto";
            };
        });
    });

    // Chuyển hướng Menu -----------------------------------------------------
    const doanhthu = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(1)");
    if (doanhthu) {
        doanhthu.addEventListener('click', function () {
            window.location.href = "/doanhthu";
        });
    }

    const quanlyacc = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(3)");
    if (quanlyacc) {
        quanlyacc.addEventListener('click', function () {
            window.location.href = "/quanlyacc";
        });
    }
    const giaodich = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(4)")
    giaodich.addEventListener('click',function(){
        window.location.href = "/adminlsgiaodich"
    })

    // Sắp xếpxếp--------------------------------------------------
    const sxnapthangtang = document.querySelector(".linhtinh .trai .sapxep .napthangtang");
    const sxnapthanggiam = document.querySelector(".linhtinh .trai .sapxep .napthanggiam");
    const sxtongnaptang = document.querySelector(".linhtinh .trai .sapxep .tongnaptang");
    const sxtongnapgiam = document.querySelector(".linhtinh .trai .sapxep .tongnapgiam");
    const sxsodutang = document.querySelector(".linhtinh .trai .sapxep .sodutang");
    const sxsodugiam = document.querySelector(".linhtinh .trai .sapxep .sodugiam");
    sxnapthangtang.addEventListener("click", function () {
        danhsachhien.sort((a, b) => {
            return (a.dataset.napthang || 0) - (b.dataset.napthang || 0);
        });
        const container = document.querySelector(".bang .dsnguoimua");
        danhsachhien.forEach(nguoimua => {
            container.appendChild(nguoimua);
        });
        hientrang(1);
    });
    sxnapthanggiam.addEventListener("click", function () {
        danhsachhien.sort((b, a) => {
            return (a.dataset.napthang || 0) - (b.dataset.napthang || 0);
        });
        const container = document.querySelector(".bang .dsnguoimua");
        danhsachhien.forEach(nguoimua => {
            container.appendChild(nguoimua);
        });
        hientrang(1);
    });
    sxtongnaptang.addEventListener("click", function () {
        danhsachhien.sort((a, b) => {
            return (a.dataset.naptong || 0) - (b.dataset.naptong || 0);
        });
        const container = document.querySelector(".bang .dsnguoimua");
        danhsachhien.forEach(nguoimua => {
            container.appendChild(nguoimua);
        });
        hientrang(1);
    });
    sxtongnapgiam.addEventListener("click", function () {
        danhsachhien.sort((b, a) => {
            return (a.dataset.naptong || 0) - (b.dataset.naptong || 0);
        });
        const container = document.querySelector(".bang .dsnguoimua");
        danhsachhien.forEach(nguoimua => {
            container.appendChild(nguoimua);
        });
        hientrang(1);
    });
    sxsodutang.addEventListener("click", function () {
        danhsachhien.sort((a, b) => {
            return (a.dataset.sodu || 0) - (b.dataset.sodu || 0);
        });
        const container = document.querySelector(".bang .dsnguoimua");
        danhsachhien.forEach(nguoimua => {
            container.appendChild(nguoimua);
        });
        hientrang(1);
    });
    sxsodugiam.addEventListener("click", function () {
        danhsachhien.sort((b, a) => {
            return (a.dataset.sodu || 0) - (b.dataset.sodu || 0);
        });
        const container = document.querySelector(".bang .dsnguoimua");
        danhsachhien.forEach(nguoimua => {
            container.appendChild(nguoimua);
        });
        hientrang(1);
    });
    // Tìm kiếm người mua theo tên -------------------------------------------
    function boDau(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // xóa dấu
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    }
    const inputten = document.querySelector(".linhtinh input");
    if (inputten) {
        inputten.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                const searchTerm = boDau(inputten.value.toLowerCase());

                danhsachhien = danhsachnguoimua.filter(nguoimua => {
                    const ten = boDau(nguoimua.dataset.ten.toLowerCase());
                    return ten.includes(searchTerm);
                });

                tranghientai = 1;
                hientrang(tranghientai);
            }
        });
    }
    //Sửa vip
    const dsnutsuavip = document.querySelectorAll(".fa-regular.fa-star.star")
    dsnutsuavip.forEach(nut =>{
        nut.addEventListener('click',async function(){
            const hang = this.closest(".hang")
            const vip = hang.dataset.vip
            console.log(vip)
            const manguoi=hang.dataset.ma
            const res = await fetchWithAuth('/suavip',{
                method: "POST",
                body:JSON.stringify({
                    manguoi: manguoi,
                    vip:vip
                })
            })
            const data = await res.json()
            if(data.status === "success"){
                if(vip == 0){
                    nut.classList.add("active")
                    hang.dataset.vip = 1
                }
                else if(vip == 1){
                    nut.classList.remove("active")
                    hang.dataset.vip = 0
                }
                console.log(data.status)
            }
        })
    })
    //Lọc theo vip
    const nutloc = document.querySelectorAll(".locvip span");
    
    nutloc.forEach(nut => {
        nut.addEventListener("click", function () {
            document.querySelector(".locvip .active")?.classList.remove("active");
            nut.classList.add("active");

            const type = nut.dataset.loc;

            if (type === "all") {
                danhsachhien = [...danhsachnguoimua];
            } else if (type === "vip") {
                danhsachhien = danhsachnguoimua.filter(el => el.dataset.vip == "1");
            } else if (type === "nonvip") {
                danhsachhien = danhsachnguoimua.filter(el => el.dataset.vip == "0");
            }

            tranghientai = 1;
            hientrang(tranghientai);
        });
    });
});