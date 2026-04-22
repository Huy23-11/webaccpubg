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
    let mota = null;
    let gia = null;
    let anh = null;
    let tk = null;
    let mk = null;

    divCacAnh.style.display = 'none';
    divCacAnh.innerHTML = '';

    danhsachnutsua.forEach(nutsua => {
        nutsua.addEventListener('click', function () {
            document.body.style.overflow = "hidden";
            maaccdangsua = this.dataset.ma;
            mota = this.dataset.mota || '';
            gia = this.dataset.gia || 0;
            anh = this.dataset.anh || '';
            tk = this.dataset.taikhoan || '';
            mk = this.dataset.matkhau || '';
            document.getElementById('input-mota').value = mota;
            document.getElementById('input-gia').value = Number(gia).toLocaleString('vi-VN');
            document.getElementById('input-anh').value = anh;
            document.getElementById('input-tk').value = tk;
            document.getElementById('input-mk').value = mk;
            menusua.style.display = 'flex';
            ngoaimenu.style.display = 'block';
            ngoaimenu.addEventListener('click', function () {
                menusua.style.display = 'none';
                ngoaimenu.style.display = 'none';
                divCacAnh.style.display = 'none';
                divCacAnh.innerHTML = '';
                document.body.style.overflow = "auto";
            });
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
                        <div class="anh-wrapper ${anh.thu_tu == 1 ? 'anh-chinh' : ''}" 
                            data-ma="${anh.ma_anh}" 
                            data-thu="${anh.thu_tu}">

                            <img src="${anh.duong_dan}">

                            <div class="overlay">

                                <div class="chinh ${anh.thu_tu == 1 ? 'active' : ''}">
                                    <i class="fa-solid fa-star"></i>
                                    ${anh.thu_tu == 1 ? 'Ảnh chính' : 'Đặt ảnh chính'}
                                </div>

                                ${
                                    anh.thu_tu == 1 
                                    ? '' 
                                    : `<div class="xoa">
                                            <i class="fa-solid fa-trash-can"></i>
                                            <span class="xoa1">Xóa</span>
                                    </div>`
                                }

                            </div>
                        </div>
                        `;
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
        ngoaimenu.addEventListener('click', function () {
            divCacAnh.style.display = 'none';
            divCacAnh.innerHTML = '';
            document.body.style.overflow = "hidden";
            document.getElementById('input-mota').value = mota;
            document.getElementById('input-gia').value = Number(gia).toLocaleString('vi-VN');
            document.getElementById('input-anh').value = anh;
            document.getElementById('input-tk').value = tk;
            document.getElementById('input-mk').value = mk;
            menusua.style.display = 'flex';
            ngoaimenu.style.display = 'block';
            ngoaimenu.addEventListener('click', function () {
                menusua.style.display = 'none';
                ngoaimenu.style.display = 'none';
                divCacAnh.style.display = 'none';
                divCacAnh.innerHTML = '';
                document.body.style.overflow = "auto";
            });
        });
    });

    //Đặt ảnh chính
    document.addEventListener("click", async function (e) {
        const btn = e.target.closest(".chinh");
        if (!btn) return;
        const wrapper = btn.closest(".anh-wrapper");
        const ma_anh = wrapper.dataset.ma;
        const thu_tu = parseInt(wrapper.dataset.thu);
        if (thu_tu === 1) return;
        const res1 = await fetchWithAuth("/datanhchinh", {
            method: "POST",
            body: JSON.stringify({
                ma_anh: ma_anh
            })
        });
        if (res1) {
            const data = await res1.json();
            if (data.status === "success") {
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
                                <div class="anh-wrapper ${anh.thu_tu == 1 ? 'anh-chinh' : ''}" 
                                    data-ma="${anh.ma_anh}" 
                                    data-thu="${anh.thu_tu}">

                                    <img src="${anh.duong_dan}">

                                    <div class="overlay">

                                        <div class="chinh ${anh.thu_tu == 1 ? 'active' : ''}">
                                            <i class="fa-solid fa-star"></i>
                                            ${anh.thu_tu == 1 ? 'Ảnh chính' : 'Đặt ảnh chính'}
                                        </div>

                                        ${
                                            anh.thu_tu == 1 
                                            ? '' 
                                            : `<div class="xoa">
                                                    <i class="fa-solid fa-trash-can"></i>
                                                    <span class="xoa1">Xóa</span>
                                            </div>`
                                        }

                                    </div>
                                </div>
                                `;
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
                ngoaimenu.addEventListener('click', function () {
                    divCacAnh.style.display = 'none';
                    divCacAnh.innerHTML = '';
                    document.body.style.overflow = "hidden";
                    document.getElementById('input-mota').value = mota;
                    document.getElementById('input-gia').value = Number(gia).toLocaleString('vi-VN');
                    document.getElementById('input-anh').value = anh;
                    document.getElementById('input-tk').value = tk;
                    document.getElementById('input-mk').value = mk;
                    menusua.style.display = 'flex';
                    ngoaimenu.style.display = 'block';
                    ngoaimenu.addEventListener('click', function () {
                        menusua.style.display = 'none';
                        ngoaimenu.style.display = 'none';
                        divCacAnh.style.display = 'none';
                        divCacAnh.innerHTML = '';
                        document.body.style.overflow = "auto";
                    });
                });
            }
        }
    });
    // Xóa từng ảnh trong popup ---------------------------------------------------
    divCacAnh.addEventListener("click", async function (e) {
        if (e.target.closest(".xoa")) {
            console.log(1)
            const maAnh = e.target.closest(".anh-wrapper").dataset.ma;
            const res = await fetchWithAuth('/xoaanhacc', {
                method: 'POST',
                body: JSON.stringify({ ma_anh: maAnh })
            });
            if (res) {
                const data = await res.json();
                if (data.status === 'success') {
                    e.target.closest(".anh-wrapper").remove();
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
            document.body.style.overflow = "auto";
            location.reload();
        }
    });


    // Phân trang -----------------------------------------------------------------
    let danhsachnguoimua = Array.from(document.querySelectorAll('.bang .hang'));
    let dsa = [...danhsachnguoimua]; // danh sách hiện tại (ban đầu = tất cả)

    let tranghientai = 1;
    let tongsotrang = Math.ceil(dsa.length / 8);

    // ===== HIỂN TRANG =====
    function hientrang(trang, dsa) {
        // Ẩn hết tất cả
        danhsachnguoimua.forEach(hang => hang.style.display = 'none');

        const batdau = (trang - 1) * 8;
        const ketthuc = Math.min(batdau + 8, dsa.length);

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


    // ===== FILTER =====
    function loc() {
        const min = document.querySelector(".giatu").value || 0;
        const max = document.querySelector(".giaden").value || Infinity;

        dsa = danhsachnguoimua.filter(hang => {
            const gia = Number(hang.dataset.gia);
            return gia >= min && gia <= max;
        });

        // cập nhật lại phân trang
        tongsotrang = Math.ceil(dsa.length / 8) || 1;
        tranghientai = 1;

        hientrang(tranghientai, dsa);
    }

    // nút lọc
    document.querySelector(".nutloc").addEventListener("click", loc);

    // ===== INIT =====
    hientrang(tranghientai, dsa);
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
    const giaodich = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(4)")
    giaodich.addEventListener('click',function(){
        window.location.href = "/adminlsgiaodich"
    })
    // Sắp xếp -----------------------------------------------------------
    const sxmoidang = document.querySelector(".linhtinh .trai .sapxep .moidang")
    const sxgiatang = document.querySelector(".linhtinh .trai .sapxep .giatang")
    const sxgiagiam = document.querySelector(".linhtinh .trai .sapxep .giagiam")
    const container = document.querySelector(".bang .dsacc");

    // Mới đăng
    sxmoidang.addEventListener('click', function () {
        dsa.sort((a, b) => b.dataset.ma - a.dataset.ma);

        container.innerHTML = ""; // xóa hết
        dsa.forEach(acc => container.appendChild(acc));

        tranghientai = 1;
        hientrang(tranghientai, dsa);
    });

    // Giá tăng
    sxgiatang.addEventListener('click', function () {
        dsa.sort((a, b) => a.dataset.gia - b.dataset.gia);

        container.innerHTML = "";
        dsa.forEach(acc => container.appendChild(acc));

        tranghientai = 1;
        hientrang(tranghientai, dsa);
    });

    // Giá giảm
    sxgiagiam.addEventListener('click', function () {
        dsa.sort((a, b) => b.dataset.gia - a.dataset.gia);

        container.innerHTML = "";
        dsa.forEach(acc => container.appendChild(acc));

        tranghientai = 1;
        hientrang(tranghientai, dsa);
    });
    // Tìm kiếm theo Mã Acc -------------------------------------------------------
    const inputma = document.querySelector(".linhtinh > input");

    inputma.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {

            const value = parseInt(inputma.value);

            // nếu input rỗng → trả về toàn bộ
            if (isNaN(value)) {
                dsa = [...danhsachnguoimua];
            } else {
                dsa = danhsachnguoimua.filter(acc => {
                    return parseInt(acc.dataset.ma) === value;
                });
            }

            // render lại DOM
            const container = document.querySelector(".bang .dsacc");
            container.innerHTML = "";
            dsa.forEach(acc => container.appendChild(acc));

            // cập nhật phân trang
            tongsotrang = Math.ceil(dsa.length / 8) || 1;
            tranghientai = 1;

            hientrang(tranghientai, dsa);
        }
    });
});