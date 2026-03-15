from flask import Blueprint, render_template, session, redirect
from sqlalchemy import text
from extensions import db

dsnguoimua_bp = Blueprint("dsnguoimua_bp",__name__)

@dsnguoimua_bp.route("/quanlynguoimua")
def dsnguoimua():
    if "role" not in session or session["role"] != "admin":
        return redirect("/dangnhap")
    sql = """
    SELECT 
        nm.ma_nguoi_mua,
        nm.ten,
        nm.email,
        nm.so_du,

        -- tháng này đã mua
        (   SELECT COUNT(*)
            FROM DonMuaAcc dm
            WHERE dm.ma_nguoi_mua = nm.ma_nguoi_mua
            AND MONTH(dm.thoi_diem) = MONTH(GETDATE())
            AND YEAR(dm.thoi_diem) = YEAR(GETDATE())
        ) AS mua_thang,

        -- tháng này đã nạp
        (   SELECT ISNULL(SUM(dn.so_tien),0)
            FROM DonNapTien dn
            WHERE dn.ma_nguoi_mua = nm.ma_nguoi_mua
            AND dn.trang_thai = 'SUCCESS'
            AND MONTH(dn.thoi_diem) = MONTH(GETDATE())
            AND YEAR(dn.thoi_diem) = YEAR(GETDATE())
        ) AS nap_thang,

        -- tổng đã mua
        (   SELECT COUNT(*)
            FROM DonMuaAcc dm
            WHERE dm.ma_nguoi_mua = nm.ma_nguoi_mua
        ) AS mua_tong,

        -- tổng đã nạp
        (   SELECT ISNULL(SUM(dn.so_tien),0)
            FROM DonNapTien dn
            WHERE dn.ma_nguoi_mua = nm.ma_nguoi_mua
            AND dn.trang_thai = 'SUCCESS'
        ) AS nap_tong

    FROM NguoiMua nm
    ORDER BY nm.ma_nguoi_mua DESC
    """

    dsnguoi = db.session.execute(text(sql)).fetchall()
    #mua nhiều nhất tháng ----------------------------------------------------------------------
    sql_muathang = """
        SELECT TOP 1 N.ten, COUNT(*) AS soluong
        FROM DonMuaAcc D
        JOIN NguoiMua N ON N.ma_nguoi_mua = D.ma_nguoi_mua
        WHERE MONTH(D.thoi_diem) = MONTH(GETDATE())
        AND YEAR(D.thoi_diem) = YEAR(GETDATE())
        GROUP BY N.ten
        ORDER BY soluong DESC
    """
    muathang = db.session.execute(text(sql_muathang)).fetchone()

    #nạp nhiều nhất tháng-------------------------------------------------------------------------
    sql_napthang = """
        SELECT TOP 1 N.ten, SUM(D.so_tien) AS tongtien
        FROM DonNapTien D
        JOIN NguoiMua N ON N.ma_nguoi_mua = D.ma_nguoi_mua
        WHERE D.trang_thai = 'SUCCESS'
        AND MONTH(D.thoi_diem) = MONTH(GETDATE())
        AND YEAR(D.thoi_diem) = YEAR(GETDATE())
        GROUP BY N.ten
        ORDER BY tongtien DESC
    """
    napthang = db.session.execute(text(sql_napthang)).fetchone()

    #mua nhiều nhất ----------------------------------------------------------------------------------
    sql_muanhieu = """
        SELECT TOP 1 N.ten, COUNT(*) AS soluong
        FROM DonMuaAcc D
        JOIN NguoiMua N ON N.ma_nguoi_mua = D.ma_nguoi_mua
        GROUP BY N.ten
        ORDER BY soluong DESC
    """
    muanhieu = db.session.execute(text(sql_muanhieu)).fetchone()
    
    #nạp nhiều nhất -----------------------------------------------------------------------
    sql_napnhieu = """
        SELECT TOP 1 N.ten, SUM(D.so_tien) AS tongtien
        FROM DonNapTien D
        JOIN NguoiMua N ON N.ma_nguoi_mua = D.ma_nguoi_mua
        WHERE D.trang_thai = 'SUCCESS'
        GROUP BY N.ten
        ORDER BY tongtien DESC
    """
    napnhieu = db.session.execute(text(sql_napnhieu)).fetchone()

    return render_template(
        "quanlynguoimua.html",
        dsnguoi = dsnguoi,
        muathang = muathang,
        napthang = napthang,
        muanhieu = muanhieu,
        napnhieu = napnhieu
    )