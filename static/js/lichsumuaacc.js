document.addEventListener("DOMContentLoaded", function() {
    const danhsachacctronggio = document.querySelectorAll('.danhsachacctronggio .acctronggio');
    const soacctronggio = danhsachacctronggio.length;
    const hienthisoacctronggio = document.querySelector('.divto2 .bentrai .soluong .soluong1 .giatri');
    hienthisoacctronggio.textContent = `${soacctronggio}`;
    //Xong phần hiển thị số lượng acc trong giỏ hàng----------------------------------------------------------------------------
    const soacc1trang = 5;
    let tongsotrang = Math.ceil(soacctronggio / soacc1trang);
    const hienthitranghientai = document.querySelector('.trang div');
    function hienthi(trang){
        danhsachacctronggio.forEach(acc=>{
            acc.style.display="none";
        })
        const batdau = (trang-1)*soacc1trang;
        const ketthuc = Math.min(batdau + soacc1trang, soacctronggio);
        for(let i=batdau; i<ketthuc; i++){
            danhsachacctronggio[i].style.display="flex";
        }
        hienthitranghientai.textContent = `Trang ${trang}/${tongsotrang}`;
    }
    let tranghientai = 1;
    hienthi(tranghientai);
    //Xong phần hiện thị danh sách acc theo trang-------------------------------------------------------------------------------------
    const nuttrangtruoc = document.querySelector('.trang .fa-solid.fa-angle-left');
    const nuttrangsau = document.querySelector('.trang .fa-solid.fa-angle-right');
    nuttrangtruoc.addEventListener('click', function(){
        if(tranghientai > 1){
            tranghientai -= 1;
            hienthi(tranghientai);
        }
    });
    nuttrangsau.addEventListener('click', function(){
        if(tranghientai < tongsotrang){
            tranghientai += 1;
            hienthi(tranghientai);
        }
    });
    //Xong phần chuyển trang----------------------------------------------------------------------------
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
    const nuttrangchu = document.querySelector('.chucnang .trangchu');
    const nutlichsumuaacc = document.querySelector('.chucnang .lichsumuaacc');
    const nutnaptien = document.querySelector('.chucnang .naptien');
    const nutgiohang = document.querySelector('.chucnang .giohang');
    nuttrangchu.addEventListener('click', function(){
        window.location.href = "/";
    });
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
    //Xem tài khoản mật khẩu
    const popuptkmk = document.querySelector(".popuptkmk")
    const dsnutxem = document.querySelectorAll(".danhsachacctronggio .acctronggio .benphai")
    dsnutxem.forEach(nutxem=>{
        nutxem.addEventListener('click',function(){
            popuptkmk.style.display = "flex"
            ngoaibangmenu.style.display = "block"
        })
    })
    ngoaibangmenu.addEventListener("click",function(){
        ngoaibangmenu.style.display = "none"
        popuptkmk.style.display = "none"
    })
    const inputma = document.querySelector(".divto2 .thanhtimkiem input")
    inputma.addEventListener("keydown",function(e){
        if(e.key === "Enter"){
            danhsachacctronggio.forEach(acc=>{
                const maacc = parseInt(acc.dataset.maacc)
                if(maacc === parseInt(inputma.value)) acc.style.display = "flex"
                else acc.style.display = "none"
            })
            tranghientai = 1
            tongsotrang = 1
            hienthitranghientai.textContent = `Trang ${tranghientai}/${tongsotrang}`
        }
    })
    //Xem ảnh lớn----------------------
    const modal = document.querySelector(".modal");
    const modalImg = document.querySelector(".modal-img");
    const nutDong = document.querySelector(".dong");

    document.querySelectorAll(".overlay div").forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();

            const img = this.closest(".anh-wrapper").querySelector("img");
            modal.style.display = "flex";
            modalImg.src = img.src;
        });
    });

    nutDong.onclick = () => modal.style.display = "none";

    modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = "none";
    };
})