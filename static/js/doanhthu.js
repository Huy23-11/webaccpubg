document.addEventListener('DOMContentLoaded',function(){
    const socket = io()
    const max_height = 158
    const token = localStorage.getItem("token");

    async function fetchWithAuth(url) {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
        if (res.status === 401) {
            alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
            window.location.href = "/dangnhap";
            return null;
        }
        return await res.json();
    }

    //Đã bán theo tuần -----------------------------------------
    function updateChartDB(data) {
        if (!data) return;
        const cot = document.querySelectorAll(".theotuan .dabantheotuan .caccot > div > div")
        const giatri = document.querySelectorAll(".theotuan .dabantheotuan .caccot > div > .giatri")
        data.forEach((value, index) => {
            let height = (value / 20) * max_height
            if (cot[index]){
                cot[index].style.height = height + "px";
                giatri[index].textContent = `${value}`;
            }
        })
    }
    async function loadData() {
        const json = await fetchWithAuth("/api/daban-theotuan");
        if (json) updateChartDB(json.data);
    }
    loadData()
    socket.on("update_dabantheotuan", function(msg) {
        updateChartDB(msg.data)
    })

    //Doanh thu theo tuần -----------------------------------------------------
    function updateChartDTTT(data) {
        if (!data) return;
        const cot = document.querySelectorAll(".theotuan .doanhthutheotuan .caccot > div > div")
        const giatri = document.querySelectorAll(".theotuan .doanhthutheotuan .caccot > div > .giatri")
        data.forEach((value, index) => {
            let height = (value / 40) * max_height
            if (cot[index]){
                cot[index].style.height = height + "px"
                giatri[index].textContent = `${value}`
            }
        })
    }
    async function loadDoanhThuNap() {
        const json = await fetchWithAuth("/api/doanhthu-theotuan");
        if (json) updateChartDTTT(json.data);
    }
    loadDoanhThuNap()
    socket.on("update_doanhthutheotuan", function(msg) {
        updateChartDTTT(msg.data)
    })

    //Doanh thu theo năm-------------------------------------------------
    function updateChartDTTN(data) {
        if (!data) return;
        const cot = document.querySelectorAll(".doanhthutheonam .caccot > div > div")
        const giatri = document.querySelectorAll(".doanhthutheonam .caccot > div .giatri")
        data.forEach((value, index) => {
            let height = (value / 200) * max_height
            if (cot[index]){
                cot[index].style.height = height + "px"
                giatri[index].textContent = `${value}`
            }
        })
    }
    async function loadDataNam() {
        const json = await fetchWithAuth("/api/doanhthu-theonam");
        if (json) updateChartDTTN(json.data);
    }
    loadDataNam()
    socket.on("update_doanhthutheonam", function(msg) {
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