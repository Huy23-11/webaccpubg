document.addEventListener('DOMContentLoaded',function(){
    const socket = io()
    const max_height = 158
    const max_value = 200

    //Đã bán theo tuần -----------------------------------------
    function updateChartDB(data){
        const cot = document.querySelectorAll(".theotuan .dabantheotuan .caccot > div > div")
        data.forEach((value, index)=>{
            let height = (value / max_value) * max_height
            cot[index].style.height = height + "px"
        })
    }
    async function loadData(){
        const res = await fetch("/api/daban-theotuan")
        const json = await res.json()
        updateChartDB(json.data)
    }
    loadData()
    socket.on("update_dabantheotuan", function(msg){
        updateChartDB(msg.data)
    })

    //Doanh thu theo tuần -----------------------------------------------------
    function updateChartDTTT(data){
        const cot = document.querySelectorAll(".theotuan .doanhthutheotuan .caccot > div > div")
        data.forEach((value, index)=>{
            let height = (value / max_value) * max_height
            cot[index].style.height = height + "px"
        })
    }
    async function loadDoanhThuNap(){
        const res = await fetch("/api/doanhthu-theotuan")
        const json = await res.json()
        updateChartDTTT(json.data)
    }
    loadDoanhThuNap()
    socket.on("update_doanhthutheotuan", function(msg){
        updateChartDTTT(msg.data)
    })
    
    //Doanh thu theo năm-------------------------------------------------
    function updateChartDTTN(data){
        const cot = document.querySelectorAll(".doanhthutheonam .caccot > div > div")
        data.forEach((value,index)=>{
            let height = (value/max_value) * max_height
            cot[index].style.height = height + "px"
        })
    }
    async function loadDataNam(){
        const res = await fetch("/api/doanhthu-theonam")
        const json = await res.json()
        updateChartDTTN(json.data)
    }
    loadDataNam()
    socket.on("update_doanhthutheonam", function(msg){
        updateChartDTTN(msg.data)
    })
    //Chuyển hướng
    const quanlyacc = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(3)")
    quanlyacc.addEventListener('click',function(){
        window.location.href = "/quanlyacc"
    })
    const quanlynguoimua = document.querySelector(".bangmenu .danhsachchucnang div:nth-child(2)")
    quanlynguoimua.addEventListener('click',function(){
        window.location.href = "/quanlynguoimua"
    })
})