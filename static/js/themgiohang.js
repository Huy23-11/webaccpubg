document.addEventListener('DOMContentLoaded', function(){
    const nutthemgio = document.querySelector(".thongtinchuacc .dong4 .nutthemgio")
    nutthemgio.addEventListener('click', function(){
        ma_nguoi_mua = nutthemgio.dataset.manguoimua
        ma_acc = nutthemgio.dataset.maacc
        fetch('/themgiohang',{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ma_nguoi_mua: ma_nguoi_mua,
                ma_acc: ma_acc
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.status === 'exist'){
                alert("Đã có trong giỏ hàng")
            }
            else if(data.status === 'success'){
                alert("Thêm giỏ hàng thành công")
            }
            else if(data.status === 'unlogin'){
                window.location.href = "/dangnhap"
            }
        })
    })
})