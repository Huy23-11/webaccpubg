document.addEventListener('DOMContentLoaded',function(){
    const danhsachnuttich = document.querySelectorAll('.bang .hang input[type="checkbox"]');
    danhsachnuttich.forEach(nuttich=>{
        nuttich.addEventListener('change',function(){
            const soluongdatich = document.querySelectorAll('.bang .hang input[type="checkbox"]:checked').length;
            const dachon = document.querySelector('.linhtinh .trai .dachon');
            dachon.textContent = `Đã chọn ${soluongdatich} hàng`;
        });
    });
    const danhsachnguoimua = document.querySelectorAll('.bang .hang');
    const nganhang = document.querySelectorAll('.bang hr');
    let trangthai = JSON.parse(localStorage.getItem("trangthai")) || new Array(danhsachnguoimua.length).fill(1);
    let tranghientai = 1;
    function hientrang(trang){
        for(let i=0;i<danhsachnguoimua.length;i++){
            danhsachnguoimua[i].style.display='none';
            nganhang[i].style.display='none';
        }
        let dsHople = [];
        for(let i=0;i<trangthai.length;i++){
            if(trangthai[i] === 1){
                dsHople.push(i);
            }
        }
        const tongsohang = dsHople.length;
        const tongsotrang = Math.ceil(tongsohang/5);
        const batdau = (trang-1)*5;
        const ketthuc = Math.min(batdau+5,tongsohang);
        for(let i=batdau;i<ketthuc;i++){
            const index = dsHople[i];
            danhsachnguoimua[index].style.display='flex';
            nganhang[index].style.display='block';
        }
        const sotrang = document.querySelector('.bang .cuoibang span');
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
                const index = Array.from(danhsachnguoimua).indexOf(hang);
                trangthai[index] = 0;
                localStorage.setItem("trangthai", JSON.stringify(trangthai));
                hientrang(tranghientai);
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
})