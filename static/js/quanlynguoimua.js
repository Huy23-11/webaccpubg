document.addEventListener('DOMContentLoaded',function(){
    const danhsachnuttich = document.querySelectorAll('.bang .hang input[type="checkbox"]');
    danhsachnuttich.forEach(nuttich=>{
        nuttich.addEventListener('change',function(){
            const soluongdatich = document.querySelectorAll('.bang .hang input[type="checkbox"]:checked').length;
            const dachon = document.querySelector('.linhtinh .trai .dachon');
            dachon.textContent = `Đã chọn ${soluongdatich} hàng`;
        });
    });
    let danhsachnguoimua = Array.from(document.querySelectorAll('.bang .hang'));
    let tranghientai = 1;
    const tongsohang = danhsachnguoimua.length
    let tongsotrang = Math.ceil(tongsohang/5)
    const sotrang = document.querySelector('.bang .cuoibang span');
    function hientrang(trang){
        for(let i=0;i<tongsohang;i++){
            danhsachnguoimua[i].style.display='none';
        }
        const batdau = (trang-1)*5;
        const ketthuc = Math.min(batdau+5,tongsohang);
        for(let i=batdau;i<ketthuc;i++){
            danhsachnguoimua[i].style.display='flex';
        }
        sotrang.textContent = `Trang ${trang}/${tongsotrang}`;
    }
    const nuttrangtruoc = document.querySelector('.bang .cuoibang .trangtruoc');
    const nuttrangsau = document.querySelector('.bang .cuoibang .trangsau');
    nuttrangtruoc.addEventListener('click',function(){
        if(tranghientai>1){
            tranghientai--;
            hientrang(tranghientai);
        }   
    })
    nuttrangsau.addEventListener('click',function(){
        if(tranghientai<tongsotrang){
            tranghientai++;
            hientrang(tranghientai);
        }
    })
    hientrang(tranghientai);
    //Xóa người mua -------------------------------------------------
    const bang = document.querySelector(".bang");
    bang.addEventListener("click", function(e){
        if(!e.target.classList.contains("fa-delete-left")) return;
        const nut = e.target;
        if(!confirm("Bạn có chắc muốn xóa người mua này?")) return;
        const manguoimua = nut.dataset.ma;
        fetch('/xoanguoimua',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                ma_nguoi_mua: manguoimua
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === "success"){
                const hang = nut.closest(".hang");
                const hr = hang.nextElementSibling;
                if(hr.tagName === "HR"){
                    hr.remove()
                }
                hang.remove()
                location.reload()
            }
        });
    });
    //sửa số dư---------------------------------------------------
    const popup = document.querySelector(".popupsodu");
    const spanTen = document.querySelector(".popupsodu .soducua");
    const inputSoDu = document.querySelector(".popupsodu input");
    const btnLuu = document.querySelector(".popupsodu .luusodu");
    let maNguoiMuaDangSua = null;
    popup.style.display = "none";
    const danhsachnutsua = document.querySelectorAll(".fa-solid.fa-pen");
    danhsachnutsua.forEach(nut => {
        nut.addEventListener("click", function(){
            const ma = this.dataset.ma;
            fetch("/popupsodunguoimua",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({
                    ma_nguoi_mua: ma
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data.status === "success"){
                    maNguoiMuaDangSua = ma;
                    spanTen.textContent = `Số dư của: ${data.ten}`;
                    inputSoDu.value = Number(data.so_du).toLocaleString("vi-VN");
                    popup.style.display = "flex";
                }
            });
        });
    });
    // lưu số dư--------------------------------
    btnLuu.addEventListener("click", function(){
        const sodumoi = inputSoDu.value.replace(/\./g,'');
        fetch("/suasodu",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                ma_nguoi_mua: maNguoiMuaDangSua,
                so_du_moi: sodumoi
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === "success"){
                popup.style.display = "none";
                location.reload();
            }
        });
    });
    //Chuyển hướng
    const doanhthu = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(1)")
    doanhthu.addEventListener('click',function(){
        window.location.href = "/doanhthu"
    })
    const quanlyacc = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(3)")
    quanlyacc.addEventListener('click',function(){
        window.location.href = "/quanlyacc"
    })
    // Sắp xếp
    const nutsapxep = document.querySelector(".linhtinh .trai .sapxep")
    nutsapxep.addEventListener("click",function(){
        danhsachnguoimua.sort((b,a)=>{
            return a.dataset.naptong - b.dataset.naptong
        })
        const container = document.querySelector(".bang .dsnguoimua")
        danhsachnguoimua.forEach(nguoimua =>{
            container.appendChild(nguoimua)
        })
        hientrang(1)
    })
    // Tìm kiếm
    const inputten = document.querySelector(".linhtinh input")
    inputten.addEventListener("keydown",function(e){
        if(e.key === "Enter"){
            danhsachnguoimua.forEach(nguoimua=>{
                const ten = nguoimua.dataset.ten
                if(ten === inputten.value) nguoimua.style.display = "flex"
                else nguoimua.style.display = "none"
            })
            tranghientai = 1
            tongsotrang = 1
            sotrang.textContent = `Trang ${tranghientai}/${tongsotrang}`
        }
    })
})