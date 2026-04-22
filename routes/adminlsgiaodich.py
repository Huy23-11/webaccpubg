from flask import Blueprint, render_template, session, redirect, jsonify
from extensions import db
from sqlalchemy import text
from routes.auth_decorator import admin_required

adminlsgiaodich_bp = Blueprint("adminlsgiaodich_bp", __name__)

@adminlsgiaodich_bp.route("/adminlsgiaodich")
def adminlsgiaodich():
    if "role" not in session or session["role"] != "admin":
        return redirect("/dangnhap")
    sql = """
        SELECT 
            nm.ten AS nguoi_mua,
            gd.loai,
            gd.so_du_truoc,
            gd.so_tien,
            gd.so_du_sau,
            gd.thoi_diem
        FROM GiaoDich gd
        JOIN NguoiMua nm ON gd.ma_nguoi_mua = nm.ma_nguoi_mua
        ORDER BY gd.thoi_diem DESC
    """

    result = db.session.execute(text(sql))
    
    danh_sach = [dict(row._mapping) for row in result]
    
    sql = """
        SELECT TOP 3
            nm.ten,
            SUM(gd.so_tien) AS tong_tien
        FROM GiaoDich gd
        JOIN NguoiMua nm ON gd.ma_nguoi_mua = nm.ma_nguoi_mua
        WHERE gd.loai = 'MUA'
        GROUP BY nm.ten
        ORDER BY tong_tien DESC
    """

    result = db.session.execute(text(sql))
    top3 = [dict(row._mapping) for row in result]

    sql_nap = """
        SELECT TOP 3
            nm.ten,
            SUM(gd.so_tien) AS tong_nap
        FROM GiaoDich gd
        JOIN NguoiMua nm ON gd.ma_nguoi_mua = nm.ma_nguoi_mua
        WHERE gd.loai = 'NAP'
        GROUP BY nm.ten
        ORDER BY tong_nap DESC
    """

    sql_recent = """
        SELECT TOP 3
            nm.ten,
            gd.so_tien,
            gd.loai,
            gd.thoi_diem
        FROM GiaoDich gd
        JOIN NguoiMua nm ON gd.ma_nguoi_mua = nm.ma_nguoi_mua
        ORDER BY gd.thoi_diem DESC
    """

    top_nap = [dict(row._mapping) for row in db.session.execute(text(sql_nap))]
    recent = [dict(row._mapping) for row in db.session.execute(text(sql_recent))]

    while len(top_nap) < 3:
        top_nap.append({"ten": "-", "tong_nap": 0})

    while len(recent) < 3:
        recent.append({
            "ten": "-",
            "so_tien": 0,
            "loai": "",
            "thoi_diem": None
        })
    sql1 = """
        SELECT 
            nm.ten AS nguoi_mua,
            'MUA' AS loai,
            dm.ma_acc,
            acc.gia AS so_tien,
            'SUCCESS' AS trang_thai,
            dm.thoi_diem
        FROM DonMuaAcc dm
        JOIN NguoiMua nm ON dm.ma_nguoi_mua = nm.ma_nguoi_mua
        JOIN Acc acc ON dm.ma_acc = acc.ma_acc

        UNION ALL

        -- Đơn nạp tiền
        SELECT 
            nm.ten AS nguoi_mua,
            'NAP' AS loai,
            NULL AS ma_acc,
            dn.so_tien,
            dn.trang_thai,
            dn.thoi_diem
        FROM DonNapTien dn
        JOIN NguoiMua nm ON dn.ma_nguoi_mua = nm.ma_nguoi_mua

        ORDER BY thoi_diem DESC
    """

    result = db.session.execute(text(sql1)).mappings().all()

    danh_sach_don = []

    for row in result:
        loai = row["loai"]
        trang_thai_raw = row["trang_thai"]
        so_tien = row["so_tien"] or 0

        if loai == "MUA":
            trang_thai = "Thành công"
        else:
            if trang_thai_raw == "PENDING":
                trang_thai = "Chờ xử lý"
            elif trang_thai_raw == "SUCCESS":
                trang_thai = "Thành công"
            else:
                trang_thai = "Thất bại"

        if loai == "MUA":
            bien_dong = -so_tien
        else:
            if trang_thai_raw == "SUCCESS":
                bien_dong = so_tien
            else:
                bien_dong = 0 

        danh_sach_don.append({
            "nguoi_mua": row["nguoi_mua"],
            "loai": loai,
            "ma_acc": row["ma_acc"],
            "so_tien": so_tien,
            "bien_dong": bien_dong,
            "trang_thai": trang_thai,
            "thoi_diem": row["thoi_diem"]
        })
    print(danh_sach_don)
    return render_template(
        "adminlsgiaodich.html",
        
        danh_sach=danh_sach,
        top3=top3,
        top_nap=top_nap, 
        recent=recent
    )