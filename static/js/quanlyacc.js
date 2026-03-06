document.addEventListener('DOMContentLoaded',function(){
    const danhsachnuttich = document.querySelectorAll('.bang .hang .nuttichhang');

    danhsachnuttich.forEach(nuttich => {
        nuttich.addEventListener('change', function () {
            const hang = this.closest('.hang');
            const maAcc = hang.querySelector('[data-id]')?.dataset.id;
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
                if(maAcc){
                    fetch('/', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            ma_acc: maAcc,
                            trang_thai: data
                        })
                    })
                    .then(res => res.json())
                    .then(data => console.log(data))
                    .catch(err => console.error(err));
                }
            }
            const soluongdatich = document.querySelectorAll('.bang .hang .nuttichhang:checked').length;
            const dachon = document.querySelector('.linhtinh .trai .dachon');
            dachon.textContent = `Đã chọn ${soluongdatich} hàng`;
        });
    });

    // xử lý khi nhấn nút sửa---------------------------------------------------------------
    const danhsachnutsua = document.querySelectorAll('.bang .hang .fa-solid.fa-pen');
    const menusua = document.querySelector('.bang .suaacc');
    const ngoaimenu = document.querySelector('.ngoaibangmenu');
    const divCacAnh = document.querySelector('.cacanhtheoacc');
    let maaccdangsua = null;
    divCacAnh.style.display = 'none';
    divCacAnh.innerHTML = '';
    danhsachnutsua.forEach(nutsua=>{
        nutsua.addEventListener('click',function(){
            maaccdangsua = this.dataset.ma;
            const mota = this.dataset.mota || '';
            const gia = this.dataset.gia || 0;
            const anh = this.dataset.anh || '';
            document.getElementById('input-mota').value = mota;
            document.getElementById('input-gia').value = Number(gia).toLocaleString('vi-VN');
            document.getElementById('input-anh').value = anh;
            menusua.style.display='flex';
            ngoaimenu.style.display='block';
            //Gửi dữ liệu khi nhấn nút sửa -------------------------------------------------------------------------------
            const btn = document.querySelector(".anh div");
            btn.addEventListener("click", function() {
                const mota = document.querySelector(".suamota input").value;
                const gia = document.querySelector(".suagia input").value;
                const anh = document.querySelector(".anh input").value;
                fetch("/suaacc", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        ma: maaccdangsua,
                        mota: mota,
                        gia: gia,
                        anh: anh
                    })
                })
                .then(res => res.json())
                .then(data => console.log(data));
                menusua.style.display='none';
                ngoaimenu.style.display='none';
            });
            // Nếu nhấn vào ảnh acc trong popup để chỉnh sửa các ảnh cho acc.
            const anhSpan = document.querySelector(".suaacc .anh span");
            anhSpan.addEventListener("click", function () {
                fetch("/hienthianhacc", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ma_acc: maaccdangsua })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        const arr = data.danhsachanh || [];
                        if (arr.length) {
                            let html = '';
                            arr.forEach(anh => {
                                html += `
                                <div class="anh" data-ma="${anh.ma_anh}" style="width:98%;height:auto">
                                    <img src="${anh.duong_dan}" alt="ảnh acc" style="width:98%;height:auto;border-radius:6px">
                                    <button class="btn-xoa">Xóa</button>
                                </div>`;
                                divCacAnh.innerHTML = html;
                                divCacAnh.style.display = 'flex';
                                menusua.style.display='none';
                                const xoabtn=document.querySelector('.anh .btn-xoa');
                                xoabtn.addEventListener('click',function(){
                                    const maAnh = this.parentElement.dataset.ma;
                                    fetch('/xoaanhacc', {
                                        method: 'POST',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({ ma_anh: maAnh })
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.status === 'success') {
                                            this.parentElement.remove();
                                        }
                                    });
                                });
                            });
                        } else {
                            divCacAnh.style.display = 'none';
                            divCacAnh.innerHTML = '';
                        }
                    }
                });
            });
        });
    });
    ngoaimenu.addEventListener('click',function(){
        menusua.style.display='none';
        ngoaimenu.style.display='none';
        divCacAnh.style.display = 'none';
        divCacAnh.innerHTML = '';
    });

    // Phân trang-----------------------------------------------------------------------------------
    const danhsachnguoimua = document.querySelectorAll('.bang .hang');
    const nganhang = document.querySelectorAll('.bang hr');
    let tranghientai=1;
    const tongsohang = danhsachnguoimua.length;
    const tongsotrang = Math.ceil(tongsohang/8);
    function hientrang(trang){
        for(let i=0;i<tongsohang;i++){
            danhsachnguoimua[i].style.display='none';
            nganhang[i].style.display='none';
        }
        const batdau = (trang-1)*8;
        const ketthuc = Math.min(batdau+8,tongsohang);
        for(let i=batdau;i<ketthuc;i++){
            danhsachnguoimua[i].style.display='flex';
            nganhang[i].style.display='block';
        }
        const sotrang = document.querySelector('.bang .cuoibang span');
        sotrang.textContent=`Trang ${trang}/${tongsotrang}`;
    }
    const nuttrangtruoc = document.querySelector('.bang .cuoibang .trangtruoc');
    const nuttrangsau = document.querySelector('.bang .cuoibang .trangsau')
    nuttrangtruoc.addEventListener('click',function(){
        if(tranghientai>1){
            tranghientai--;
            hientrang(tranghientai);
        }
    });
    nuttrangsau.addEventListener('click',function(){
        if(tranghientai<tongsotrang){
            tranghientai++;
            hientrang(tranghientai);
        }
    });
    hientrang(tranghientai);

    // Xử lý khi nhấn dấu cộng: thêm hàng mới -----------------------------------------------------------------
    const daucong = document.querySelector('.linhtinh .trai .fa-solid.fa-plus');
    daucong.addEventListener('click',function(){
        const bang = document.querySelector('.bang');
        const hangmoi = document.createElement('div');
        hangmoi.classList.add('hang');
        hangmoi.innerHTML = `
            <input class="nuttichhang" type="checkbox">
            <span class="cot1">#000</span>
            <input class="cot2" type="checkbox" disabled>
            <input class="cot3" type="checkbox" disabled>
            <input class="cot4" type="checkbox" disabled>
            <input class="cot5" type="checkbox" disabled>
            <span class="cot6">0đ</span>
            <i class="fa-solid fa-delete-left"></i>
            <i class="fa-solid fa-pen"></i>
        `;
        const hr = document.createElement('hr');
        const hangdautien = document.querySelector('.bang .hang');
        bang.insertBefore(hangmoi, hangdautien);
        bang.insertBefore(hr, hangdautien);

        // Sự kiện tích các nút cho hàng mới ---------------------------------------------------------------
        const nuttich = hangmoi.querySelector('.nuttichhang');
        nuttich.addEventListener('change', function () {
            const cacnutcon = hangmoi.querySelectorAll('input[type="checkbox"]:not(.nuttichhang)');
            if (this.checked) {
                cacnutcon.forEach(cb => cb.disabled = false);
            } 
            else {
                cacnutcon.forEach(cb => cb.disabled = true);
            }
            const soluongdatich = document.querySelectorAll('.bang .hang .nuttichhang:checked').length;
            const dachon = document.querySelector('.linhtinh .trai .dachon');
            dachon.textContent = `Đã chọn ${soluongdatich} hàng`;
        });

        //Sự kiện khi nhấn nút sửa cho hàng mới ---------------------------------------------------------------
        const nutsua = hangmoi.querySelector('.fa-pen');
        nutsua.addEventListener('click',function(){
            document.getElementById('input-mota').value = '...';
            document.getElementById('input-gia').value = '';
            document.getElementById('input-anh').value = '';
            menusua.style.display='flex';
            ngoaimenu.style.display='block';
        });

        //Sự kiện xóa cho hàng mới-----------------------------------------------------------------------------------
        const nutxoamoi = hangmoi.querySelector('.fa-delete-left');
        nutxoamoi.addEventListener('click', function(){
            const hr = hangmoi.nextElementSibling;
            hangmoi.remove();
            if(hr && hr.tagName === "HR"){
                hr.remove();
            }
            const soluongdatich = document.querySelectorAll('.bang .hang .nuttichhang:checked').length;
            const dachon = document.querySelector('.linhtinh .trai .dachon');
            dachon.textContent = `Đã chọn ${soluongdatich} hàng`;
        });
    });

    //Xóa acc--------------------------------------------------------------------------------------------------
    const danhsachnutxoa = document.querySelectorAll('.bang .hang .fa-delete-left');
    danhsachnutxoa.forEach(nutxoa => {
        nutxoa.addEventListener('click', function(){
            if(!confirm("Bạn có chắc muốn xóa hàng này không?")) return;
            const hang = this.closest('.hang');
            const hr = hang.nextElementSibling;
            hang.remove();
            if(hr && hr.tagName === "HR"){
                hr.remove();
            }
            const soluongdatich = document.querySelectorAll('.bang .hang .nuttichhang:checked').length;
            const dachon = document.querySelector('.linhtinh .trai .dachon');
            dachon.textContent = `Đã chọn ${soluongdatich} hàng`;
        });
    });
});