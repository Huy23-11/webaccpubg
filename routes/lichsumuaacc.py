from flask import Blueprint, render_template, session, redirect
from sqlalchemy import text
from extensions import db

lichsumuaacc_bp = Blueprint("lichsumuaacc_bp", __name__)

@lichsumuaacc_bp.route("/lichsumuaacc")
def lichsumuaacc():
    if "ma_nguoi_mua" not in session:
        return redirect("/dangnhap")
    ma = session["ma_nguoi_mua"]
    sql = """
    SELECT 
        a.ma_acc,
        a.gia,
        d.thoi_diem
    FROM DonMuaAcc d
    JOIN Acc a ON d.ma_acc = a.ma_acc
    WHERE d.ma_nguoi_mua = :ma
    ORDER BY d.thoi_diem DESC
    """
    dsacc = db.session.execute(text(sql), {"ma": ma}).fetchall()
    soluong = len(dsacc)
    gia_max = max([acc.gia for acc in dsacc], default=0)
    print(gia_max)
    return render_template(
        "lichsumuaacc.html",
        dsacc=dsacc,
        soluong=soluong,
        gia_max=gia_max
    )