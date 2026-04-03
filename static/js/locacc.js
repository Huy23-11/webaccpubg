document.addEventListener("DOMContentLoaded", function(){
    const accs = document.querySelectorAll(".danhsachacc .acc")
    const soacc = accs.length
    const nutbape = document.getElementById("bape")
    const nutsieuxe = document.getElementById("sieuxe")
    const nutmudinh = document.getElementById("mudinh")
    const nutgangbang = document.getElementById("gangbang")
    const nutSapXep = document.querySelector(".sapxep")
    let dsacchien = []
    let tongsotrang = Math.ceil(soacc/6)
    let trang = 1
    let soacchien = soacc
    const nuttruoc = document.querySelector('.trang .fa-angle-left');
    const nutsau = document.querySelector('.trang .fa-angle-right');
    const tranghientai = document.querySelector('.trang div');
    function hienacc(){
        for(let i = 0; i < soacc; i++){
            accs[i].style.display= "none";
        }
        const batdau = (trang - 1) * 6;
        const ketthuc = Math.min(batdau + 6, soacchien);
        for(let i = batdau; i < ketthuc; i++){
            dsacchien[i].style.display= "flex";
        }
        tranghientai.textContent = `Trang ${trang}/${tongsotrang}`;
    }
    nutSapXep.addEventListener("click", function(){
        dsacchien.sort(function(a, b){
            return parseInt(a.dataset.gia) - parseInt(b.dataset.gia);
        });
        const container = document.querySelector(".danhsachacc");
        dsacchien.forEach(acc => container.appendChild(acc));
        hienacc()
    });
    nutbape.addEventListener("click",function(){
        dsacchien = []
        const soLuongSpan = document.querySelector(".linhtinh span:nth-child(2)")
        accs.forEach(acc=>{
            if(acc.dataset.bape === "True"){
                dsacchien.push(acc)
            }
        })
        soacchien = dsacchien.length;
        soLuongSpan.textContent = `Số lượng: ${soacchien}`
        tongsotrang = Math.ceil(soacchien/6)
        trang = 1
        hienacc()
    })
    nutsieuxe.addEventListener("click",function(){
        dsacchien = []
        const soLuongSpan = document.querySelector(".linhtinh span:nth-child(2)")
        accs.forEach(acc=>{
            if(acc.dataset.sieuxe === "True"){
                dsacchien.push(acc)
            }
        })
        soacchien = dsacchien.length;
        soLuongSpan.textContent = `Số lượng: ${soacchien}`
        tongsotrang = Math.ceil(soacchien/6)
        trang = 1
        hienacc()
    })
    nutmudinh.addEventListener("click",function(){
        dsacchien = []
        const soLuongSpan = document.querySelector(".linhtinh span:nth-child(2)")
        accs.forEach(acc=>{
            if(acc.dataset.mudinh === "True"){
                dsacchien.push(acc)
            }
        })
        soacchien = dsacchien.length;
        soLuongSpan.textContent = `Số lượng: ${soacchien}`
        tongsotrang = Math.ceil(soacchien/6)
        trang = 1
        hienacc()
    })
    nutgangbang.addEventListener("click",function(){
        dsacchien = []
        const soLuongSpan = document.querySelector(".linhtinh span:nth-child(2)")
        accs.forEach(acc=>{
            if(acc.dataset.gangtay === "True"){
                dsacchien.push(acc)
            }
        })
        soacchien = dsacchien.length;
        soLuongSpan.textContent = `Số lượng: ${soacchien}`
        tongsotrang = Math.ceil(soacchien/6)
        trang = 1
        hienacc()
    })
    nuttruoc.addEventListener('click', function(){
        if(trang > 1){
            trang--;
            hienacc();
        }
    });
    nutsau.addEventListener('click', function(){
        if(trang < tongsotrang){
            console.log(trang)
            console.log(tongsotrang)
            trang++;
            hienacc();
        }
    });

    // Lọc theo giá
    const boLoc = document.querySelectorAll(".timtheogia div");
    const soLuongSpan = document.querySelector(".linhtinh span:nth-child(2)");
    boLoc.forEach(div => {
        div.addEventListener("click", function () {
            const text = this.innerText.trim()
            dsacchien = []
            accs.forEach(acc => {
                const gia = parseInt(acc.dataset.gia);
                let hien = false;
                if (text === "Tất cả") hien = true;
                else if (text === "Dưới 5m" && gia < 5000000) hien = true;
                else if (text === "5m-10m" && gia >= 5000000 && gia < 10000000) hien = true;
                else if (text === "10m-20m" && gia >= 10000000 && gia < 20000000) hien = true;
                else if (text === "20m-30m" && gia >= 20000000 && gia < 30000000) hien = true;
                else if (text === "Trên 30m" && gia >= 30000000) hien = true;
                if(hien) dsacchien.push(acc);
            });
            soacchien = dsacchien.length;
            soLuongSpan.textContent = "Số lượng: " + soacchien;
            trang = 1;
            tongsotrang = Math.ceil(soacchien / 6);
            hienacc();
        });
    });
    const input = document.querySelector(".thanhtimkiem input")
    const nuttimkiem = document.querySelector(".thanhtimkiem .fa-solid.fa-magnifying-glass")
    input.addEventListener("keydown",function(e){
        if(e.key === 'Enter'){
            const ma = parseInt(input.value)
            dsacchien.forEach(acc=>{
                if(parseInt(acc.dataset.ma) === ma){
                    acc.style.display = "flex"
                }
                else acc.style.display = "none"
            })
            trang = 1
            tongsotrang = 1
            soacchien = 1
            soLuongSpan.textContent = `Số lượng: 1`
            tranghientai.textContent = `Trang ${trang}/${tongsotrang}`;
        }
    })
    nuttimkiem.addEventListener("click", function(){
        const ma = parseInt(input.value)
        dsacchien.forEach(acc=>{
            if(parseInt(acc.dataset.ma) === ma){
                acc.style.display = "flex"
            }
            else acc.style.display = "none"
        })
        trang = 1
        tongsotrang = 1
        soacchien = 1
        soLuongSpan.textContent = `Số lượng: 1`
        tranghientai.textContent = `Trang ${trang}/${tongsotrang}`;
    })
});