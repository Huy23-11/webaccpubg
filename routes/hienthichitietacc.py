from flask import Blueprint,render_template, session
from sqlalchemy import text
from extensions import db

hienthichitietacc_bp = Blueprint("hienthichitietacc_bp",__name__)

@hienthichitietacc_bp.route("/chitietacc/<int:ma_acc>")
def hienthichitietacc(ma_acc):
    if "ma_nguoi_mua" not in session:
        sql_layacc = """
            SELECT a.*
            FROM Acc a WHERE ma_acc = :ma_acc
        """
        acc = db.session.execute(text(sql_layacc), {"ma_acc": ma_acc}).fetchone()
        sql_layanh = """
            SELECT aa.ma_anh, aa.duong_dan
            FROM AnhAcc aa
            WHERE aa.ma_acc = :ma_acc 
            ORDER BY aa.ma_anh
        """
        dsanh = db.session.execute(text(sql_layanh), {"ma_acc": ma_acc}).fetchall()
        nguoimua = {"ma_nguoi_mua": 0, "ten": "User", "so_du": 0}
        return render_template("chitietacc.html", acc=acc, dsanh = dsanh, nguoimua = nguoimua)
    
    sql_layacc = """
        SELECT a.*
        FROM Acc a WHERE ma_acc = :ma_acc
    """
    acc = db.session.execute(text(sql_layacc), {"ma_acc": ma_acc}).fetchone()
    sql_layanh = """
        SELECT aa.ma_anh, aa.duong_dan
        FROM AnhAcc aa
        WHERE aa.ma_acc = :ma_acc 
        ORDER BY aa.ma_anh
    """
    dsanh = db.session.execute(text(sql_layanh), {"ma_acc": ma_acc}).fetchall()
    ma = session["ma_nguoi_mua"]
    sql = """
        SELECT nm.ma_nguoi_mua, nm.ten, nm.so_du
        FROM NguoiMua nm
        WHERE nm.ma_nguoi_mua = :ma
    """
    nguoimua = db.session.execute(text(sql),{"ma": ma}).fetchone()
    return render_template("chitietacc.html", acc=acc, dsanh = dsanh, nguoimua = nguoimua)