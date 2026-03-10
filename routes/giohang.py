from flask import Blueprint, render_template, session, redirect
from sqlalchemy import text
from extensions import db

giohang_bp = Blueprint("giohang", __name__)

@giohang_bp.route("/giohang")
def giohang():
    if "ma_nguoi_mua" not in session:
        return redirect("/dangnhap")
    ma = session["ma_nguoi_mua"]
    sql = """
    SELECT 
        g.ma_acc,
        a.gia,
        a.trang_thai
    FROM AccTrongGio g
    JOIN Acc a ON g.ma_acc = a.ma_acc
    WHERE g.ma_nguoi_mua = :ma
    ORDER BY g.ma_acc DESC
    """
    dsacc = db.session.execute(text(sql), {"ma": ma}).fetchall()
    soluong = len(dsacc)
    return render_template(
        "giohang.html",
        dsacc=dsacc,
        soluong=soluong
    )