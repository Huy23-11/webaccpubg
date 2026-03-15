document.addEventListener('DOMContentLoaded',function(){
    const danhsachnuttich = document.querySelectorAll('.bang .hang .nuttichhang');
    const sotrang = document.querySelector('.bang .cuoibang span');
    danhsachnuttich.forEach(nuttich => {
        nuttich.addEventListener('change', function () {
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
                console.log(data);
                if(maAcc){
                    fetch('/suatrangthaitimkiemacc', {
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
        });
    });
    // popup ảnh------------------------------------------------------------
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
                    });
                    divCacAnh.innerHTML = html;
                    divCacAnh.style.display = 'flex';
                    menusua.style.display='none';
                } else {
                    divCacAnh.style.display = 'none';
                    divCacAnh.innerHTML = '';
                }
            }
        });
    });
    //Xóa ảnh--------------------------------------------------------
    divCacAnh.addEventListener("click", function(e){
        if(e.target.classList.contains("btn-xoa")){
            const maAnh = e.target.parentElement.dataset.ma;
            fetch('/xoaanhacc', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ ma_anh: maAnh })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    e.target.parentElement.remove();
                }
            });
        }
    });

    //Gửi dữ liệu sửa
    const btn = document.querySelector(".suaacc .nutsua");
    btn.addEventListener("click", function() {
        const mota = document.querySelector(".suamota input").value;
        const gia = document.querySelector(".suagia input").value;
        const fileanh = document.querySelector(".anh input").files;
        const formdata = new FormData();
        formdata.append("ma", maaccdangsua);
        formdata.append("mota",mota);
        formdata.append("gia",gia);
        for(let i=0;i<fileanh.length;i++){
            formdata.append("anh",fileanh[i]);
        }
        fetch("/suaacc", {
            method: "POST",
            body: formdata
        })
        .then(res => res.json())
        .then(data => console.log(data));
        menusua.style.display='none';
        ngoaimenu.style.display='none';
        location.reload();
    });

    ngoaimenu.addEventListener('click',function(){
        menusua.style.display='none';
        ngoaimenu.style.display='none';
        divCacAnh.style.display = 'none';
        divCacAnh.innerHTML = '';
    });

    //Phân trang ------------------------------------
    let danhsachnguoimua = Array.from(document.querySelectorAll('.bang .hang'))
    let tranghientai = 1;
    const tongsohang = danhsachnguoimua.length;
    let tongsotrang = Math.ceil(tongsohang/8);
    function hientrang(trang){
        for(let i=0;i<danhsachnguoimua.length;i++){
            danhsachnguoimua[i].style.display='none';
        }
        const batdau = (trang-1)*8;
        const ketthuc = Math.min(batdau+8,tongsohang);
        for(let i=batdau;i<ketthuc;i++){
            danhsachnguoimua[i].style.display='flex';
        }
        sotrang.textContent=`Trang ${trang}/${tongsotrang}`;
    }
    const nuttrangtruoc = document.querySelector('.bang .cuoibang .trangtruoc');
    const nuttrangsau = document.querySelector('.bang .cuoibang .trangsau');
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

    //xóa acc---------------------------------------------
    const danhsachnutxoa = document.querySelectorAll('.bang .hang .fa-delete-left');
    danhsachnutxoa.forEach(nutxoa => {
        nutxoa.addEventListener('click', function(){
            if(!confirm("Bạn có chắc muốn xóa hàng này không?")) return;
            fetch("/xoaacc",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body:JSON.stringify({ma_acc: nutxoa.dataset.ma})
            })
            .then(res => res.json())
            .then(data => {
                if(data.status === "success"){
                    const acc = this.closest(".hang")
                    const HR = acc.nextElementSibling
                    acc.remove()
                    if(HR.tagName === "HR"){
                        HR.remove()
                    } 
                    location.reload()
                }
            })
        });
    });
    const soluongdatich = document.querySelectorAll('.bang .hang .nuttichhang:checked').length;
    const dachon = document.querySelector('.linhtinh .trai .dachon');
    dachon.textContent = `Đã chọn ${soluongdatich} hàng`;
    
    //Thêm acc -------------------------------------------------
    const nutthemacc = document.querySelector(".fa-solid.fa-plus")
    nutthemacc.addEventListener('click', function(){
        fetch("/themacc",{
            method: 'POST'
        })
        .then(res => res.json())
        .then(data=>{
            if(data.status === "success"){
                location.reload()
            }
        })
    })

    //Sửa trạng thái acc------------------------------
    const dsnuttrangthai = document.querySelectorAll(".bang .hang .trangthai")
    dsnuttrangthai.forEach(nuttrangthai =>nuttrangthai.addEventListener('click',function(){
        const acc = this.closest(".hang")
        fetch("/suatrangthaiacc",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ma_acc: acc.dataset.ma,
                trang_thai: acc.dataset.trangthai
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.status === 'success')location.reload()
        })
    }))
    //Chuyển hướng
    const doanhthu = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(1)")
    doanhthu.addEventListener('click',function(){
        window.location.href = "/doanhthu"
    })
    const quanlynguoimua = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(2)")
    quanlynguoimua.addEventListener('click',function(){
        window.location.href = "/quanlynguoimua"
    })
    //Sắp xếp
    const nutsapxep = document.querySelector(".linhtinh .trai .sapxep")
    nutsapxep.addEventListener('click',function(){
        danhsachnguoimua.sort((a,b) => {
            return a.dataset.gia - b.dataset.gia
        })
        const container = document.querySelector(".bang .dsacc")
        danhsachnguoimua.forEach(acc=>{
            container.appendChild(acc)
        })
        hientrang(1)
    })
    // Tìm kiếm
    const inputma = document.querySelector(".linhtinh input")
    inputma.addEventListener("keydown",function(e){
        if(e.key === "Enter"){
            danhsachnguoimua.forEach(acc=>{
                const maacc = parseInt(acc.dataset.ma)
                if(maacc === parseInt(inputma.value)) acc.style.display = "flex"
                else acc.style.display = "none"
            })
            tranghientai = 1
            tongsotrang = 1
            sotrang.textContent = `Trang ${tranghientai}/${tongsotrang}`
        }
    })
});
