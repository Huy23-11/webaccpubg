from flask import Blueprint, jsonify
from extensions import db

lienketanh_acc = Blueprint("lienketanh_acc", __name__)

@lienketanh_acc.route("/anhacc/<int:ma_acc>")
def lay_anh_acc(ma_acc):
    sql = """
        SELECT ma_anh, thu_tu
        FROM AnhAcc
        WHERE ma_acc = :ma_acc
        ORDER BY thu_tu ASC
    """
    result = db.session.execute(sql, {"ma_acc": ma_acc})
    ket_qua = []
    for i in result:
        ten_file = f"{ma_acc}_{i.thu_tu}.png"
        duong_dan = f"/static/images/anhacc/{ten_file}"
        ket_qua.append({
            "ma_anh": i.ma_anh,
            "ma_acc": ma_acc,
            "thu_tu": row.thu_tu,
            "url": duong_dan
        })
    return jsonify(ket_qua)