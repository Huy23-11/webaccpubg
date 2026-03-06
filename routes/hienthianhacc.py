from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text

hienthianhacc_bp = Blueprint("hienthianhacc_bp", __name__)

@hienthianhacc_bp.route("/hienthianhacc", methods=["POST"])
def hienthianhacc():
    data = request.get_json()
    ma_acc = data.get("ma_acc")

    query = text("""
        SELECT ma_anh,duong_dan
        FROM AnhAcc
        WHERE ma_acc = :ma_acc
        ORDER BY thu_tu
    """)

    result = db.session.execute(query, {"ma_acc": ma_acc})

    danhsachanh = [{"ma_anh": row[0], "duong_dan": row[1]} for row in result]

    return jsonify({
        "status": "success",
        "danhsachanh": danhsachanh
    })