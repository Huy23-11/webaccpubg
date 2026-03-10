from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text

suatrangthaitimkiemacc_bp = Blueprint("suatrangthaitimkiemacc", __name__)

@suatrangthaitimkiemacc_bp.route("/suatrangthaitimkiemacc", methods=["POST"])
def suatrangthaitimkiemacc():
    data = request.get_json()
    ma_acc=data.get("ma_acc")
    trang_thai=data.get("trang_thai")
    sql_update = """
        UPDATE Acc
        SET sieu_xe = :x, 
            bape = :y,
            mu_dinh = :z,
            gang_tay = :w
        WHERE ma_acc = :ma_acc
    """
    db.session.execute(text(sql_update), {"x": trang_thai[0], "y": trang_thai[1], "z": trang_thai[2], "w": trang_thai[3], "ma_acc": ma_acc})
    db.session.commit()
    print()
    return jsonify({"status": "success"})