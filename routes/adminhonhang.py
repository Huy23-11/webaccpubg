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
    
    return render_template(
        "adminlsgiaodich.html",
        danh_sach=danh_sach,
        top3=top3,
        top_nap=top_nap, 
        recent=recent
    )