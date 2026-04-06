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
    let tranghientai = 1;
    const tongsohang = danhsachnguoimua.length;
    let tongsotrang = Math.ceil(tongsohang / 8);
    const sotrang = document.querySelector('.bang .cuoibang span');

    function hientrang(trang) {
        for (let i = 0; i < tongsohang; i++) {
            danhsachnguoimua[i].style.display = 'none';
        }
        const batdau = (trang - 1) * 8;
        const ketthuc = Math.min(batdau + 8, tongsohang);
        for (let i = batdau; i < ketthuc; i++) {
            danhsachnguoimua[i].style.display = 'flex';
        }
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
    const popup = document.querySelector(".popupsodu");
    const spanTen = document.querySelector(".popupsodu .soducua");
    const inputSoDu = document.querySelector(".popupsodu input");
    const btnLuu = document.querySelector(".popupsodu .luusodu");
    let maNguoiMuaDangSua = null;
    
    if (popup) popup.style.display = "none";

    const danhsachnutsua = document.querySelectorAll(".fa-solid.fa-pen");
    danhsachnutsua.forEach(nut => {
        nut.addEventListener("click", async function () {
            const ma = this.dataset.ma;
            const res = await fetchWithAuth("/popupsodunguoimua", {
                method: "POST",
                body: JSON.stringify({
                    ma_nguoi_mua: ma
                })
            });

            if (res) {
                const data = await res.json();
                if (data.status === "success") {
                    maNguoiMuaDangSua = ma;
                    spanTen.textContent = `Số dư của: ${data.ten}`;
                    inputSoDu.value = Number(data.so_du).toLocaleString("vi-VN");
                    popup.style.display = "flex";
                }
            }
        });
    });

    // Lưu số dư mới ---------------------------------------------------------
    btnLuu.addEventListener("click", async function () {
        const sodumoi = inputSoDu.value.replace(/\./g, '');
        const res = await fetchWithAuth("/suasodu", {
            method: "POST",
            body: JSON.stringify({
                ma_nguoi_mua: maNguoiMuaDangSua,
                so_du_moi: sodumoi
            })
        });

        if (res) {
            const data = await res.json();
            if (data.status === "success") {
                popup.style.display = "none";
                location.reload();
            }
        }
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

    // Sắp xếp người mua theo tổng nạp ---------------------------------------
    const nutsapxep = document.querySelector(".linhtinh .trai .sapxep");
    if (nutsapxep) {
        nutsapxep.addEventListener("click", function () {
            danhsachnguoimua.sort((b, a) => {
                return (a.dataset.naptong || 0) - (b.dataset.naptong || 0);
            });
            const container = document.querySelector(".bang .dsnguoimua");
            danhsachnguoimua.forEach(nguoimua => {
                container.appendChild(nguoimua);
            });
            hientrang(1);
        });
    }

    // Tìm kiếm người mua theo tên -------------------------------------------
    const inputten = document.querySelector(".linhtinh input");
    if (inputten) {
        inputten.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                const searchTerm = inputten.value.toLowerCase();
                danhsachnguoimua.forEach(nguoimua => {
                    const ten = nguoimua.dataset.ten.toLowerCase();
                    if (ten.includes(searchTerm)) {
                        nguoimua.style.display = "flex";
                    } else {
                        nguoimua.style.display = "none";
                    }
                });
                tranghientai = 1;
                tongsotrang = 1;
                sotrang.textContent = `Trang ${tranghientai}/${tongsotrang}`;
            }
        });
    }
});