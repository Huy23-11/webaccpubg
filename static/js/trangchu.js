document.addEventListener("DOMContentLoaded", function() {
    const danhsachacc = document.querySelectorAll('.danhsachacc .acc');
    const soacc = danhsachacc.length;
    const tranghientai = document.querySelector('.trang div');
    const tongsotrang = Math.ceil(soacc / 6);
    let sotrang = 1;
    const soLuongSpan = document.querySelector(".linhtinh span:nth-child(2)");
    soLuongSpan.textContent = "Số lượng: " + soacc
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

    //Chuyển hướng chi tiết acc------------------------------
    const dsnutchuyenhuongchitietacc = document.querySelectorAll(".acc .thongtinacc .dong3 .chitiet")
    dsnutchuyenhuongchitietacc.forEach(nutchuyenhuongchitietacc => nutchuyenhuongchitietacc.addEventListener('click', function(){
        const acc = this.closest(".acc")
        const ma_acc = acc.dataset.ma
        window.location.href = `/chitietacc/${ma_acc}`
        fetch("/congsoluotxem",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ma_acc: ma_acc 
            })
        })
    }))
    //Copy mã acc----------
    const dsnutcopy = document.querySelectorAll(".saochep")
    dsnutcopy.forEach(nutcopy => {
        nutcopy.addEventListener("click",function(){
            const cha = this.closest(".acc")
            navigator.clipboard.writeText(cha.dataset.ma)
        })
    })
})