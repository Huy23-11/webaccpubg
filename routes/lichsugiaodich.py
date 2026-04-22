from flask import Blueprint, request, render_template, session, redirect, jsonify
from sqlalchemy import text
from extensions import db

lichsugiaodich_bp = Blueprint("lichsugiaodich", __name__)

@lichsugiaodich_bp.route("/lichsugiaodich")
def lichsugiaodich():

    ma = session["ma_nguoi_mua"]

    # ===== DANH SÁCH =====
    sql = """
    SELECT 
        g.ma AS id,
        g.ma_giao_dich,
        g.so_du_truoc,
        g.so_tien,
        g.so_du_sau,
        g.noi_dung,
        n.tai_khoan,
        g.thoi_diem,
        g.loai
    FROM GiaoDich g
    LEFT JOIN NguoiMua n ON g.ma_nguoi_mua = n.ma_nguoi_mua
    WHERE g.ma_nguoi_mua = :ma
    ORDER BY g.thoi_diem DESC
    """

    ds = db.session.execute(text(sql), {"ma": ma}).fetchall()

    # ===== ĐÃ NẠP + ĐÃ TIÊU =====
    sql_tong = """
    SELECT 
        SUM(CASE WHEN loai = 'NAP' THEN so_tien ELSE 0 END) AS da_nap,
        SUM(CASE WHEN loai = 'MUA' THEN so_tien ELSE 0 END) AS da_tieu
    FROM GiaoDich
    WHERE ma_nguoi_mua = :ma
    """

    tong = db.session.execute(text(sql_tong), {"ma": ma}).fetchone()

    # ===== SỐ DƯ =====
    sql_sodu = """
    SELECT TOP 1 so_du_sau
    FROM GiaoDich
    WHERE ma_nguoi_mua = :ma
    ORDER BY thoi_diem DESC
    """

    sodu = db.session.execute(text(sql_sodu), {"ma": ma}).scalar()
    vip = 0
    if "ma_nguoi_mua" in session:
        ma_nguoi_mua = session["ma_nguoi_mua"]
        sqlvip = """
        SELECT vip
        FROM NguoiMua
        WHERE ma_nguoi_mua = :ma
        """
        vip = db.session.execute(text(sqlvip), {"ma": ma_nguoi_mua}).scalar()
    return render_template(
        "lichsugiaodich.html",
        ds=ds,
        soluong=tong.da_nap or 0,
        gia_max=tong.da_tieu or 0,
        datieu=sodu or 0,
        vip=vip
    )