from flask import Blueprint, render_template
from extensions import db
from sqlalchemy import text

quanlyacc = Blueprint("quanlyacc", __name__)

@quanlyacc.route("/quanlyacc")
def dsacc_quanlyacc():
    sql = """
        SELECT ma_acc, gia, ngay_dang, mo_ta, so_luot_xem,
               gang_tay, mu_dinh, sieu_xe, bape, trang_thai
        FROM Acc
        ORDER BY ma_acc ASC
    """

    result = db.session.execute(text(sql))

    danh_sach_acc = []
    for row in result:
        danh_sach_acc.append({
            "ma_acc": row.ma_acc,
            "gia": row.gia,
            "ngay_dang": row.ngay_dang,
            "mo_ta": row.mo_ta,
            "so_luot_xem": row.so_luot_xem,
            "gang_tay": row.gang_tay,
            "mu_dinh": row.mu_dinh,
            "sieu_xe": row.sieu_xe,
            "bape": row.bape,
            "trang_thai": row.trang_thai
        })

    return render_template("quanlyacc.html", dsacc=danh_sach_acc)