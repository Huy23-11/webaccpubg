document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem("token");

    async function fetchWithAuth(url, options = {}) {
        const headers = options.headers || {};
        headers["Authorization"] = "Bearer " + token;
        if (!(options.body instanceof FormData)) {
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

    // Xử lý Checkbox trạng thái tìm kiếm -----------------------------------------
    const danhsachnuttich = document.querySelectorAll('.bang .hang .nuttichhang');
    const sotrang = document.querySelector('.bang .cuoibang span');

    danhsachnuttich.forEach(nuttich => {
        nuttich.addEventListener('change', async function () {
            const hang = this.closest('.hang');
            const maAcc = hang.dataset.ma;
            const cacnutcon = hang.querySelectorAll('input[type="checkbox"]:not(.nuttichhang)');
            
            if (this.checked) {
                cacnutcon.forEach(cb => cb.disabled = false);
            } 
            else {
                const data = [];
                cacnutcon.forEach(cb => {
                    data.push(cb.checked ? 1 : 0);
                    cb.disabled = true;
                });
                if (maAcc) {
                    const res = await fetchWithAuth('/suatrangthaitimkiemacc', {
                        method: 'POST',
                        body: JSON.stringify({
                            ma_acc: maAcc,
                            trang_thai: data
                        })
                    });
                    if (res) {
                        const resData = await res.json();
                        console.log(resData);
                    }
                }
            }
            updateSoLuongDaTich();
        });
    });

    function updateSoLuongDaTich() {
        const soluongdatich = document.querySelectorAll('.bang .hang .nuttichhang:checked').length;
        const dachon = document.querySelector('.linhtinh .trai .dachon');
        if (dachon) dachon.textContent = `Đã chọn ${soluongdatich} hàng`;
    }

    // Xử lý khi nhấn nút sửa (Bút chì) -------------------------------------------
    const danhsachnutsua = document.querySelectorAll('.bang .hang .fa-solid.fa-pen');
    const menusua = document.querySelector('.bang .suaacc');
    const ngoaimenu = document.querySelector('.ngoaibangmenu');
    const divCacAnh = document.querySelector('.cacanhtheoacc');
    let maaccdangsua = null;

    divCacAnh.style.display = 'none';
    divCacAnh.innerHTML = '';

    danhsachnutsua.forEach(nutsua => {
        nutsua.addEventListener('click', function () {
            maaccdangsua = this.dataset.ma;
            const mota = this.dataset.mota || '';
            const gia = this.dataset.gia || 0;
            const anh = this.dataset.anh || '';
            const tk = this.dataset.taikhoan || '';
            const mk = this.dataset.matkhau || '';
            document.getElementById('input-mota').value = mota;
            document.getElementById('input-gia').value = Number(gia).toLocaleString('vi-VN');
            document.getElementById('input-anh').value = anh;
            document.getElementById('input-tk').value = tk;
            document.getElementById('input-mk').value = mk;
            menusua.style.display = 'flex';
            ngoaimenu.style.display = 'block';
        });
    });

    // Popup xem danh sách ảnh ----------------------------------------------------
    const anhSpan = document.querySelector(".suaacc .anh > div");
    anhSpan.addEventListener("click", async function () {
        const res = await fetchWithAuth("/hienthianhacc", {
            method: "POST",
            body: JSON.stringify({ ma_acc: maaccdangsua })
        });

        if (res) {
            const data = await res.json();
            if (data.status === 'success') {
                const arr = data.danhsachanh || [];
                if (arr.length) {
                    let html = '';
                    arr.forEach(anh => {
                        html += `
                        <div class="anh-wrapper" data-ma="${anh.ma_anh}">
                            <img src="${anh.duong_dan}">
                            <div class="overlay">
                                <div class="xoa">
                                    <i class="fa-solid fa-trash-can"></i>
                                    <span class="xoa1">Xóa</span>
                                </div>
                            </div>
                        </div>`;
                    });
                    divCacAnh.innerHTML = html;
                    divCacAnh.style.display = 'flex';
                    menusua.style.display = 'none';
                } else {
                    divCacAnh.style.display = 'none';
                    divCacAnh.innerHTML = '';
                }
            }
        }
    });

    // Xóa từng ảnh trong popup ---------------------------------------------------
    divCacAnh.addEventListener("click", async function (e) {
        if (e.target.classList.contains("xoa")) {
            const maAnh = e.target.parentElement.dataset.ma;
            const res = await fetchWithAuth('/xoaanhacc', {
                method: 'POST',
                body: JSON.stringify({ ma_anh: maAnh })
            });
            if (res) {
                const data = await res.json();
                if (data.status === 'success') {
                    e.target.parentElement.remove();
                }
            }
        }
    });

    // Gửi dữ liệu sửa Account (Dùng FormData vì có File ảnh) -----------------------
    const btnSua = document.querySelector(".suaacc .nutsua");
    btnSua.addEventListener("click", async function () {
        const mota = document.querySelector(".suamota input").value;
        const gia = document.querySelector(".suagia input").value;
        const tk = document.querySelector(".suatk input").value;
        const mk = document.querySelector(".suamk input").value;
        const fileanh = document.querySelector(".anh input").files;
        
        const formdata = new FormData();
        formdata.append("ma", maaccdangsua);
        formdata.append("mota", mota);
        formdata.append("gia", gia);
        formdata.append("tk",tk);
        formdata.append("mk",mk);
        for (let i = 0; i < fileanh.length; i++) {
            formdata.append("anh", fileanh[i]);
        }

        const res = await fetchWithAuth("/suaacc", {
            method: "POST",
            body: formdata
        });

        if (res) {
            const data = await res.json();
            console.log(data);
            menusua.style.display = 'none';
            ngoaimenu.style.display = 'none';
            location.reload();
        }
    });

    ngoaimenu.addEventListener('click', function () {
        menusua.style.display = 'none';
        ngoaimenu.style.display = 'none';
        divCacAnh.style.display = 'none';
        divCacAnh.innerHTML = '';
    });

    // Phân trang -----------------------------------------------------------------
    let danhsachnguoimua = Array.from(document.querySelectorAll('.bang .hang'))
    let tranghientai = 1;
    const tongsohang = danhsachnguoimua.length;
    let tongsotrang = Math.ceil(tongsohang / 8);

    function hientrang(trang) {
        for (let i = 0; i < danhsachnguoimua.length; i++) {
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

    // Xóa Account ----------------------------------------------------------------
    const danhsachnutxoa = document.querySelectorAll('.bang .hang .fa-delete-left');
    danhsachnutxoa.forEach(nutxoa => {
        nutxoa.addEventListener('click', async function () {
            if (!confirm("Bạn có chắc muốn xóa hàng này không?")) return;
            const res = await fetchWithAuth("/xoaacc", {
                method: "POST",
                body: JSON.stringify({ ma_acc: nutxoa.dataset.ma })
            });
            if (res) {
                const data = await res.json();
                if (data.status === "success") {
                    location.reload();
                }
            }
        });
    });

    // Thêm Account mới -----------------------------------------------------------
    const nutthemacc = document.querySelector(".linhtinh .trai .nutchon .themacc")
    nutthemacc.addEventListener('click', async function () {
        const res = await fetchWithAuth("/themacc", {
            method: 'POST'
        });
        if (res) {
            const data = await res.json();
            if (data.status === "success") {
                location.reload();
            }
        }
    })

    // Sửa trạng thái Bán/Chưa bán ------------------------------------------------
    const dsnuttrangthai = document.querySelectorAll(".bang .hang .trangthai")
    dsnuttrangthai.forEach(nuttrangthai => nuttrangthai.addEventListener('click', async function () {
        const acc = this.closest(".hang")
        const res = await fetchWithAuth("/suatrangthaiacc", {
            method: "POST",
            body: JSON.stringify({
                ma_acc: acc.dataset.ma,
                trang_thai: acc.dataset.trangthai
            })
        });
        if (res) {
            const data = await res.json();
            if (data.status === 'success') location.reload();
        }
    }))

    // Chuyển hướng Menu ----------------------------------------------------------
    const doanhthu = document.querySelector(".bangmenu .danhsachchucnang .doanhthu")
    doanhthu.addEventListener('click', function () {
        window.location.href = "/doanhthu"
    })
    const quanlynguoimua = document.querySelector(".bangmenu .danhsachchucnang .quanlynguoimua")
    quanlynguoimua.addEventListener('click', function () {
        window.location.href = "/quanlynguoimua"
    })
    const quanlyacc = document.querySelector(".bangmenu .danhsachchucnang .quanlyacc")
    quanlyacc.addEventListener('click', function () {
        window.location.href = "/quanlyacc"
    })

    // Sắp xếp theo giá -----------------------------------------------------------
    const nutsapxep = document.querySelector(".linhtinh .trai .sapxep")
    nutsapxep.addEventListener('click', function () {
        danhsachnguoimua.sort((a, b) => {
            return a.dataset.gia - b.dataset.gia
        })
        const container = document.querySelector(".bang .dsacc")
        danhsachnguoimua.forEach(acc => {
            container.appendChild(acc)
        })
        hientrang(1)
    })

    // Tìm kiếm theo Mã Acc -------------------------------------------------------
    const inputma = document.querySelector(".linhtinh input")
    inputma.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            danhsachnguoimua.forEach(acc => {
                const maacc = parseInt(acc.dataset.ma)
                if (maacc === parseInt(inputma.value)) acc.style.display = "flex"
                else acc.style.display = "none"
            })
            tranghientai = 1
            tongsotrang = 1
            sotrang.textContent = `Trang ${tranghientai}/${tongsotrang}`
        }
    })

    updateSoLuongDaTich();
});