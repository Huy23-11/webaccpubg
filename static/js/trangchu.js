document.addEventListener("DOMContentLoaded", function() {
    const danhsachacc = document.querySelectorAll('.danhsachacc .acc');
    const soacc = danhsachacc.length;
    const tranghientai = document.querySelector('.trang div');
    const tongsotrang = Math.ceil(soacc / 6);
    let sotrang = 1;
    function hienacc(trang){
        for(let i = 0; i < soacc; i++){
            danhsachacc[i].style.display= "none";
        }
        const batdau = (trang - 1) * 6;
        const ketthuc = Math.min(batdau + 6, soacc);
        for(let i = batdau; i < ketthuc; i++){
            danhsachacc[i].style.display= "block";
        }
        tranghientai.textContent = `Trang ${trang}/${tongsotrang}`;
    }
    hienacc(sotrang);
    const nuttruoc = document.querySelector('.trang .fa-angle-left');
    const nutsau = document.querySelector('.trang .fa-angle-right');
    nuttruoc.addEventListener('click', function(){
        if(sotrang > 1){
            sotrang--;
            hienacc(sotrang);
        }
    });
    nutsau.addEventListener('click', function(){
        if(sotrang < tongsotrang){
            sotrang++;
            hienacc(sotrang);
        }
    });
    //Xong phần số trang----------------------------------------------------------------------------
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
    //Xong phần click icon menu ----------------------------------------------------------------------------
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
    //Xong phần click icon cá nhân ----------------------------------------------------------------------------
    const nutlichsumuaacc = document.querySelector('.lichsumuaacc');
    const nutnaptien = document.querySelector('.naptien');
    const nutgiohang = document.querySelector('.giohang');
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
})