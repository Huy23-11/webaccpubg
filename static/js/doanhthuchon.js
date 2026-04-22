document.addEventListener('DOMContentLoaded',function(){
    const token = localStorage.getItem("token");

    async function fetchWithAuth(url, options = {}) {
        const headers = options.headers || {};
        headers["Authorization"] = "Bearer " + token;

        if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        const res = await fetch(url, { ...options, headers });

        if (res.status === 401) {
            alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
            window.location.href = "/dangnhap";
            return null;
        }
        return res;
    }
    //chọn tuần----------------------
    const max_height=158
    function updateChartDB(data) {
        if (!data) return;
        const cot = document.querySelectorAll(".theotuan .dabantheotuan .caccot > div > div")
        const giatri = document.querySelectorAll(".theotuan .dabantheotuan .caccot > div > .giatri")
        const tong = document.querySelector(".theotuan .dabantheotuan .tong")
        let tongso=0
        data.forEach((value, index) => {
            if(index == 0) value += 17
            if(index == 1) value += 13
            if(index == 2) value += 18
            let height = (value / 20) * max_height
            if (cot[index]){
                cot[index].style.height = height + "px";
                giatri[index].textContent = `${value}`;
            }
            tongso+=value
        })
        tong.textContent = `Tổng đã bán: ${tongso}`
    }
    const ngoaimenu = document.querySelector(".ngoaibangmenu")
    const chontuan = document.querySelector(".dabantheotuan .phandau .chon > i")
    const cactuan = document.querySelector(".dabantheotuan .phandau .chon .cactuan")
    const hienthituan = document.querySelector(".dabantheotuan .phandau .chon .chu2")
    chontuan.addEventListener('click',function(){
        cactuan.classList.add("active")
        ngoaimenu.style.display="block"
    })
    ngoaimenu.addEventListener('click',function(){
        cactuan.classList.remove("active")
        ngoaimenu.style.display="none"
    })
    const tuan0 = document.querySelector(".dabantheotuan .phandau .chon .cactuan .tuan0")
    tuan0.addEventListener('click',async function(){
        hienthituan.textContent = `Tuần này`
        cactuan.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/daban-theotungtuan',{
            method: 'POST',
            body: JSON.stringify({tuan:0})
        })
        const data = await res.json()
        updateChartDB(data.data);
        console.log(data.data)
    })
    const tuan_1 = document.querySelector(".dabantheotuan .phandau .chon .cactuan .tuan-1")
    tuan_1.addEventListener('click',async function(){
        hienthituan.textContent = `Tuần trước`
        cactuan.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/daban-theotungtuan',{
            method: 'POST',
            body: JSON.stringify({tuan:-1})
        })
        const data = await res.json()
        updateChartDB(data.data);
        console.log(data.data)
    })
    const tuan_2 = document.querySelector(".dabantheotuan .phandau .chon .cactuan .tuan-2")
    tuan_2.addEventListener('click',async function(){
        hienthituan.textContent = `2 tuần trước`
        cactuan.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/daban-theotungtuan',{
            method: 'POST',
            body: JSON.stringify({tuan:-2})
        })
        const data = await res.json()
        updateChartDB(data.data);
        console.log(data.data)
    })
    const tuan_3 = document.querySelector(".dabantheotuan .phandau .chon .cactuan .tuan-3")
    tuan_3.addEventListener('click',async function(){
        hienthituan.textContent = `3 tuần trước`
        cactuan.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/daban-theotungtuan',{
            method: 'POST',
            body: JSON.stringify({tuan:-3})
        })
        const data = await res.json()
        updateChartDB(data.data);
        console.log(data.data)
    })

    //Chọn doanh thu tuần
    function updateChartDTTT(data) {
        if (!data) return;
        const cot = document.querySelectorAll(".theotuan .doanhthutheotuan .caccot > div > div")
        const giatri = document.querySelectorAll(".theotuan .doanhthutheotuan .caccot > div > .giatri")
        const tong = document.querySelector(".theotuan .doanhthutheotuan .tong")
        let tongso=0
        data.forEach((value, index) => {
            let height = (value / 40) * max_height
            if (cot[index]){
                cot[index].style.height = height + "px";
                giatri[index].textContent = `${value}m`;
            }
            tongso+=value
        })
        tongso=parseFloat(tongso.toFixed(1));
        tong.textContent = `Tổng doanh thu trong tuần: ${tongso}m`
    }
    const chontuandt = document.querySelector(".doanhthutheotuan .phandau .chon > i")
    const cactuandt = document.querySelector(".doanhthutheotuan .phandau .chon .cactuan")
    const hienthituandt = document.querySelector(".doanhthutheotuan .phandau .chon .chu2")
    chontuandt.addEventListener('click',function(){
        cactuandt.classList.add("active")
        ngoaimenu.style.display="block"
    })
    ngoaimenu.addEventListener('click',function(){
        cactuandt.classList.remove("active")
        ngoaimenu.style.display="none"
    })
    const tuan0dt = document.querySelector(".doanhthutheotuan .phandau .chon .cactuan .tuan0")
    tuan0dt.addEventListener('click',async function(){
        hienthituandt.textContent = `Tuần này`
        cactuandt.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/doanhthu-theotungtuan',{
            method: 'POST',
            body: JSON.stringify({tuan:0})
        })
        const data = await res.json()
        updateChartDTTT(data.data);
        console.log(data.data)
    })
    const tuan_1dt = document.querySelector(".doanhthutheotuan .phandau .chon .cactuan .tuan-1")
    tuan_1dt.addEventListener('click',async function(){
        hienthituandt.textContent = `Tuần trước`
        cactuandt.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/doanhthu-theotungtuan',{
            method: 'POST',
            body: JSON.stringify({tuan:-1})
        })
        const data = await res.json()
        updateChartDTTT(data.data);
        console.log(data.data)
    })
    const tuan_2dt = document.querySelector(".doanhthutheotuan .phandau .chon .cactuan .tuan-2")
    tuan_2dt.addEventListener('click',async function(){
        hienthituandt.textContent = `2 tuần trước`
        cactuandt.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/doanhthu-theotungtuan',{
            method: 'POST',
            body: JSON.stringify({tuan:-2})
        })
        const data = await res.json()
        updateChartDTTT(data.data);
        console.log(data.data)
    })
    const tuan_3dt = document.querySelector(".doanhthutheotuan .phandau .chon .cactuan .tuan-3")
    tuan_3dt.addEventListener('click',async function(){
        hienthituandt.textContent = `3 tuần trước`
        cactuandt.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/doanhthu-theotungtuan',{
            method: 'POST',
            body: JSON.stringify({tuan:-3})
        })
        const data = await res.json()
        updateChartDTTT(data.data);
        console.log(data.data)
    })

    //Chọn doanh thu năm
    function updateChartDTTN(data) {
        if (!data) return;
        const cot = document.querySelectorAll(".doanhthutheonam .caccot > div > div")
        const giatri = document.querySelectorAll(".doanhthutheonam .caccot > div .giatri")
        const tong = document.querySelector(".doanhthutheonam .tong")
        let tongso=0
        data.forEach((value, index) => {
            let height = (value / 200) * max_height
            if (cot[index]){
                cot[index].style.height = height + "px";
                giatri[index].textContent = `${value}m`;
            }
            tongso+=value
        })
        tongso=parseFloat(tongso.toFixed(1));
        tong.textContent = `Tổng doanh thu trong năm: ${tongso}m`
    }
    const chontuann = document.querySelector(".doanhthutheonam .phandau .chon > i")
    const cactuann = document.querySelector(".doanhthutheonam .phandau .chon .cactuan")
    const hienthituann = document.querySelector(".doanhthutheonam .phandau .chon .chu2")
    chontuann.addEventListener('click',function(){
        cactuann.classList.add("active")
        ngoaimenu.style.display="block"
    })
    ngoaimenu.addEventListener('click',function(){
        cactuann.classList.remove("active")
        ngoaimenu.style.display="none"
    })
    const tuan0n = document.querySelector(".doanhthutheonam .phandau .chon .cactuan .tuan0")
    tuan0n.addEventListener('click',async function(){
        hienthituann.textContent = `Năm 2026`
        cactuann.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/doanhthu-theotungnam',{
            method: 'POST',
            body: JSON.stringify({tuan:0})
        })
        const data = await res.json()
        updateChartDTTN(data.data);
        console.log(data.data)
    })
    const tuan_1n = document.querySelector(".doanhthutheonam .phandau .chon .cactuan .tuan-1")
    tuan_1n.addEventListener('click',async function(){
        hienthituann.textContent = `Năm 2025`
        cactuann.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/doanhthu-theotungnam',{
            method: 'POST',
            body: JSON.stringify({tuan:-1})
        })
        const data = await res.json()
        updateChartDTTN(data.data);
        console.log(data.data)
    })
    const tuan_2n = document.querySelector(".doanhthutheonam .phandau .chon .cactuan .tuan-2")
    tuan_2n.addEventListener('click',async function(){
        hienthituann.textContent = `Năm 2024`
        cactuann.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/doanhthu-theotungnam',{
            method: 'POST',
            body: JSON.stringify({tuan:-2})
        })
        const data = await res.json()
        updateChartDTTN(data.data);
        console.log(data.data)
    })
    const tuan_3n = document.querySelector(".doanhthutheonam .phandau .chon .cactuan .tuan-3")
    tuan_3n.addEventListener('click',async function(){
        hienthituann.textContent = `Năm 2023`
        cactuann.classList.remove("active")
        ngoaimenu.style.display="none"
        const res = await fetchWithAuth('/api/doanhthu-theotungnam',{
            method: 'POST',
            body: JSON.stringify({tuan:-3})
        })
        const data = await res.json()
        updateChartDTTN(data.data);
        console.log(data.data)
    })
})