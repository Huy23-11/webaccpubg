document.addEventListener('DOMContentLoaded',function(){
    const danhsachnuttich = document.querySelectorAll('.bang .hang input[type="checkbox"]');
    danhsachnuttich.forEach(nuttich=>{
        nuttich.addEventListener('change',function(){
            const soluongdatich = document.querySelectorAll('.bang .hang input[type="checkbox"]:checked').length;
            const dachon = document.querySelector('.linhtinh .trai .dachon');
            dachon.textContent = `Đã chọn ${soluongdatich} hàng`;
        });
    });
    const danhsachnguoimua = document.querySelectorAll('.bang .hang');
    const nganhang = document.querySelectorAll('.bang hr');
    let tranghientai=1;
    const tongsohang = danhsachnguoimua.length;
    const tongsotrang = Math.ceil(tongsohang/5);
    function hientrang(trang){
        for(let i=0;i<tongsohang;i++){
            danhsachnguoimua[i].style.display='none';
            nganhang[i].style.display='none';
        }
        const batdau = (trang-1)*5;
        const ketthuc = Math.min(batdau+5,tongsohang);
        for(let i=batdau;i<ketthuc;i++){
            danhsachnguoimua[i].style.display='flex';
            nganhang[i].style.display='block';
        }
        const sotrang = document.querySelector('.bang .cuoibang span');
        sotrang.textContent=`Trang ${trang}/${tongsotrang}`;
    }
    const nuttrangtruoc = document.querySelector('.bang .cuoibang .trangtruoc');
    const nuttrangsau = document.querySelector('.bang .cuoibang .trangsau');
    nuttrangtruoc.addEventListener('click',function(){
        if(tranghientai>1){
            tranghientai--;
            hientrang(tranghientai);
        }   
    })
    nuttrangsau.addEventListener('click',function(){
        if(tranghientai<tongsotrang){
            tranghientai++;
            hientrang(tranghientai);
        }
    })
    hientrang(tranghientai);
})