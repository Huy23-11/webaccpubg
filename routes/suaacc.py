from app import WAG
from flask import request, jsonify
from extensions import db
import os
import shutil

@WAG.route("/suaacc", methods=["POST"])
def suaacc():
    data = request.get_json()
    ma = data["ma"]
    mota = data["mota"]
    gia = data["gia"]
    anh = data["anh"]
    sql_update = """
        UPDATE Acc
        SET mo_ta = ?, 
            gia = ?
        WHERE ma_acc = ?
    """
    db.session.execute(sql_update, (mota, gia, ma))
    db.session.commit()
    if anh.strip() != "":
        sql_count = "SELECT COUNT(*) FROM AnhAcc WHERE ma_acc = ?"
        result = db.session.execute(sql_count, (ma,))
        so_anh_hien_tai = result.scalar()
        danhsach_anh = [a.strip() for a in anh.split(",") if a.strip() != ""]
        thu_tu = so_anh_hien_tai
        for duong_dan_goc in danhsach_anh:
            thu_tu += 1
            _, ext = os.path.splitext(duong_dan_goc)
            ten_moi = f"{ma}_{thu_tu}{ext}"
            thu_muc_dich = os.path.join("static", "images", "anhacc")
            os.makedirs(thu_muc_dich, exist_ok=True)
            duong_dan_moi = os.path.join(thu_muc_dich, ten_moi)
            if os.path.exists(duong_dan_goc):
                shutil.copy(duong_dan_goc, duong_dan_moi)
            sql_insert = """
                INSERT INTO AnhAcc (ma_acc, duong_dan, thu_tu)
                VALUES (?, ?, ?)
            """
            db.session.execute(sql_insert, (ma, ten_moi, thu_tu))
        db.session.commit()
    return jsonify({"status": "success"})