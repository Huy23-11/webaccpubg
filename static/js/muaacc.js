document.addEventListener("DOMContentLoaded",function(){
    const nutmua = document.querySelector(".thongtinchuacc .dong4 .nutmua")
    const popuptkmk = document.querySelector(".popuptkmk")
    const ngoaibangmenu = document.querySelector(".ngoaibangmenu")
    ngoaibangmenu.addEventListener("click",function(){
        ngoaibangmenu.style.display = "none"
        popuptkmk.style.display = "none"
    })
    nutmua.addEventListener('click',function(){
        const manguoimua = this.dataset.manguoimua
        const maacc = this.dataset.maacc
        fetch("/muaacc",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ma_nguoi_mua: manguoimua,
                ma_acc: maacc
            })
        })
        .then(res=>res.json())
        .then(data =>{
            if(data.status === "success"){
                popuptkmk.style.display = "flex"
                ngoaibangmenu.style.display = "block"
            }
            else if(data.status === "fail"){
                alert("Số dư không đủ!")
            }
            else if(data.status === 'unlogin'){
                window.location.href = "/dangnhap"
            }
        })
    })
})