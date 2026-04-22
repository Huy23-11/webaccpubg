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
    const nuttrangchu = document.querySelector('.chucnang .trangchu');
    const nutlichsumuaacc = document.querySelector('.lichsumuaacc');
    const nutnaptien = document.querySelector('.naptien');
    const nutgiohang = document.querySelector('.giohang');
    const nutlichsugiaodich = document.querySelector('.lichsugiaodich');
    nutlichsugiaodich.addEventListener('click', function(){
        window.location.href = "/lichsugiaodich";
    });
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
    // Tạo đơn---------------------------------------------------
    const nut = document.querySelector(".nutnaptien")

    nut.addEventListener("click", async function(){
        const input = document.querySelector(".inputsotien")
        const so_tien = input.value
        const ma_nguoi_mua = this.dataset.manguoimua

        if(!so_tien || isNaN(so_tien)){
            alert("Nhập số tiền hợp lệ")
            return
        }

        const res = await fetch("/tao-don-nap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                so_tien: so_tien,
                ma_nguoi_mua: ma_nguoi_mua
            })
        })

        const data = await res.json()

        document.querySelector(".noidung .giatri").innerText = data.noi_dung
        const img = document.querySelector(".qrcode img")
        const mota = document.querySelector(".qrcode .mota")

        img.src = data.qr_url
        img.style.display = "block"

        mota.innerText = "Quét mã QR để thanh toán nhanh"
    })
})