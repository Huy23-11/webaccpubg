from flask import Blueprint, render_template, session, redirect
from sqlalchemy import text
from extensions import db

trangnaptien_bp = Blueprint("trangnaptien_bp", __name__)

@trangnaptien_bp.route("/trangnaptien")
def trangnaptien():
    if "ma_nguoi_mua" not in session:
        return redirect("/dangnhap")
    ma = session["ma_nguoi_mua"]
    sql = """
    SELECT 
        nm.ma_nguoi_mua,
        nm.ten,
        nm.so_du,
        nm.qr_nap_tien
    FROM NguoiMua nm
    WHERE nm.ma_nguoi_mua = :ma
    """
    user = db.session.execute(text(sql), {"ma": ma}).fetchone()
    return render_template(
        "trangnaptien.html",
        user=user
    )