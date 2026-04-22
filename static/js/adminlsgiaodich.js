document.addEventListener('DOMContentLoaded',function(){
    const max_height = 158
    const token = localStorage.getItem("token");

    async function fetchWithAuth(url) {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
        if (res.status === 401) {
            alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
            window.location.href = "/dangnhap";
            return null;
        }
        return await res.json();
    }
    //Cập nhật số lượng 
    const soluonggd = document.querySelector(".soluonggd");

    function capnhatsoluong() {
        soluonggd.textContent = `Tổng: ${dsa.length} giao dịch`;
    }
    // Phân trang -----------------------------------------------------------------
    let danhsachnguoimua = Array.from(document.querySelectorAll('.bang .hang'));
    let dsa = [...danhsachnguoimua]; // danh sách hiện tại (ban đầu = tất cả)

    let tranghientai = 1;
    let tongsotrang = Math.ceil(dsa.length / 10);
    const sotrang = document.querySelector('.bang .cuoibang span');
    // ===== HIỂN TRANG =====
    function hientrang(trang, dsa) {
        // Ẩn hết tất cả
        danhsachnguoimua.forEach(hang => hang.style.display = 'none');

        const batdau = (trang - 1) * 10;
        const ketthuc = Math.min(batdau + 10, dsa.length);

        for (let i = batdau; i < ketthuc; i++) {
            dsa[i].style.display = 'flex';
        }

        sotrang.textContent = `Trang ${trang}/${tongsotrang}`;
    }

    // ===== PHÂN TRANG =====
    const nuttrangtruoc = document.querySelector('.bang .cuoibang .trangtruoc');
    const nuttrangsau = document.querySelector('.bang .cuoibang .trangsau');

    nuttrangtruoc.addEventListener('click', function () {
        if (tranghientai > 1) {
            tranghientai--;
            hientrang(tranghientai, dsa);
        }
    });

    nuttrangsau.addEventListener('click', function () {
        if (tranghientai < tongsotrang) {
            tranghientai++;
            hientrang(tranghientai, dsa);
        }
    });
    hientrang(tranghientai, dsa);
    capnhatsoluong()
    //Chuyển hướng
    const doanhthu = document.querySelector(".bangmenu .danhsachchucnang .doanhthu")
    doanhthu.addEventListener('click', function () {
        window.location.href = "/doanhthu"
    })
    const quanlyacc = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(3)")
    quanlyacc.addEventListener('click',function(){
        window.location.href = "/quanlyacc"
    })
    const quanlynguoimua = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(2)")
    quanlynguoimua.addEventListener('click',function(){
        window.location.href = "/quanlynguoimua"
    })
    const giaodich = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(4)")
    giaodich.addEventListener('click',function(){
        window.location.href = "/adminlsgiaodich"
    })
    //Lọc -------------------------------------------
    const locall = document.querySelector(".locall");
    const locmua = document.querySelector(".locmua");
    const locnap = document.querySelector(".locnap");

    const container = document.querySelector(".dsgiaodich");

    // ===== HÀM RENDER =====
    function render() {
        container.innerHTML = "";
        dsa.forEach(item => container.appendChild(item));

        tongsotrang = Math.ceil(dsa.length / 8) || 1;
        tranghientai = 1;

        hientrang(tranghientai, dsa);
        capnhatsoluong()
    }

    // ===== RESET ACTIVE BUTTON =====
    function resetActive() {
        document.querySelectorAll(".bolocloai button").forEach(btn => {
            btn.classList.remove("active");
        });
    }

    // ===== ALL =====
    locall.addEventListener("click", function () {
        resetActive();
        this.classList.add("active");

        dsa = [...danhsachnguoimua];
        render();
    });

    // ===== MUA =====
    locmua.addEventListener("click", function () {
        resetActive();
        this.classList.add("active");

        dsa = danhsachnguoimua.filter(item => item.dataset.loai === "MUA");
        render();
    });

    // ===== NẠP =====
    locnap.addEventListener("click", function () {
        resetActive();
        this.classList.add("active");

        dsa = danhsachnguoimua.filter(item => item.dataset.loai === "NAP");
        render();
    });

    // Tìm kiếm theo tên người mua ------------------------------
    function boDau(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // xóa dấu
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    }

    const inputten = document.querySelector(".linhtinh input");

    inputten.addEventListener("input", function () {
        const keyword = boDau(inputten.value.toLowerCase().trim());

        if (keyword === "") {
            dsa = [...danhsachnguoimua];
        } else {
            dsa = danhsachnguoimua.filter(item => {
                const ten = boDau(
                    item.querySelector(".cot1").textContent.toLowerCase()
                );
                return ten.includes(keyword);
            });
        }

        const container = document.querySelector(".dsgiaodich");
        container.innerHTML = "";
        dsa.forEach(item => container.appendChild(item));

        tongsotrang = Math.ceil(dsa.length / 8) || 1;
        tranghientai = 1;

        capnhatsoluong();
        hientrang(tranghientai, dsa);
    });
})