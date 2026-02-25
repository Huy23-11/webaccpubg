document.addEventListener("DOMContentLoaded", function() {
    const danhsachacctronggio = document.querySelectorAll('.danhsachacctronggio .acctronggio');
    const soacctronggio = danhsachacctronggio.length;
    const hienthisoacctronggio = document.querySelector('.soacctronggio span');
    hienthisoacctronggio.textContent = `Số lượng acc trong giỏ hàng: ${soacctronggio}`;
    //Xong phần hiển thị số lượng acc trong giỏ hàng----------------------------------------------------------------------------
    const soacc1trang = 5;
    const tongsotrang = Math.ceil(soacctronggio / soacc1trang);
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
    danhsachacctronggio.forEach(acc=>{
        const trangthaiacc = acc.querySelector('.bentrai .trangthai');
        const nutchon = acc.querySelector('.benphai');
        if(trangthaiacc.textContent===`Còn hàng`){
        trangthaiacc.style.color = "green";
        nutchon.textContent= `Xem`;
        }
        else if(trangthaiacc.textContent===`Hết hàng`){
            trangthaiacc.style.color = "red";
            nutchon.textContent=`Xóa`;
        }
    })
    //Xong phần hiển thị trạng thái acc trong giỏ hàng----------------------------------------------------------------------------
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
})