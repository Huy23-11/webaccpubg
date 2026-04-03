document.addEventListener("DOMContentLoaded", function() {
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

    //Đăng nhập
    document.querySelector(".nut").onclick = async function() {
        const taikhoan = document.querySelector(".nhaptk input").value
        const matkhau = document.querySelector(".nhapmk input").value
        const res = await fetch("/dangnhap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tai_khoan: taikhoan,
                mat_khau: matkhau
            })
        })
        const kq = await res.json()
        if (kq.status === "success" || kq.status === "success2") {
            localStorage.setItem("token", kq.token); 
            if (kq.status === "success") {
                window.location.href = "/"
            } else {
                window.location.href = "/quanlyacc"
            }
        } else {
            alert("Sai tài khoản hoặc mật khẩu")
        }
    }
})