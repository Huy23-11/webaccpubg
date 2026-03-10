from flask import render_template, Blueprint
from extensions import db
from sqlalchemy import text
from datetime import datetime

hienthitrangchu_bp = Blueprint("hienthitrangchu_bp",__name__)

@hienthitrangchu_bp.route("/")
def trangchu():

    #Danh sách acc
    sql = """
        SELECT 
            a.*,
            anh.duong_dan
        FROM Acc a
        LEFT JOIN AnhAcc anh
            ON a.ma_acc = anh.ma_acc
            AND anh.thu_tu = 1
        WHERE a.trang_thai = 'ACTIVE'
    """
    dsacc = db.session.execute(text(sql)).fetchall()
    
    #Top nạp tháng
    sql = """
    SELECT TOP 5
        nm.ten,
        SUM(dn.so_tien) AS tong_nap
    FROM DonNapTien dn
    JOIN NguoiMua nm ON dn.ma_nguoi_mua = nm.ma_nguoi_mua
    WHERE 
        dn.trang_thai = 'SUCCESS'
        AND MONTH(dn.thoi_diem) = MONTH(GETDATE())
        AND YEAR(dn.thoi_diem) = YEAR(GETDATE())
    GROUP BY nm.ten
    ORDER BY tong_nap DESC
    """
    topnap = db.session.execute(text(sql)).fetchall()
    thang = datetime.now().month

    return render_template(
        "trangchu.html",
        topnap=topnap,
        thang=thang,
        dsacc=dsacc
    )