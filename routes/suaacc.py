from flask import Blueprint, request, jsonify
from extensions import db
import os
from sqlalchemy import text

suaacc_bp = Blueprint("suaacc_bp", __name__)

@suaacc_bp.route("/suaacc", methods=["POST"])
def suaacc():
    """
    Sửa thông tin acc và thêm ảnh
    ---
    tags:
      - Acc
    consumes:
      - multipart/form-data
    parameters:
      - name: ma
        in: formData
        type: integer
        required: true
        example: 5
        description: Mã acc cần sửa

      - name: mota
        in: formData
        type: string
        required: true
        example: Acc VIP full đồ

      - name: gia
        in: formData
        type: string
        required: true
        example: "15000000"

      - name: anh
        in: formData
        type: file
        required: false
        description: Upload nhiều ảnh acc

    responses:
      200:
        description: Cập nhật acc thành công
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    ma = request.form.get("ma")
    mota = request.form.get("mota")
    gia = int(request.form.get("gia").replace(".", ""))
    anh = request.files.getlist("anh")

    sql_update = """
        UPDATE Acc
        SET mo_ta = :mo_ta,
            gia = :gia
        WHERE ma_acc = :ma_acc
    """

    db.session.execute(text(sql_update), {"mo_ta": mota, "gia": gia, "ma_acc": ma})
    db.session.commit()

    if len(anh) > 0:
        sql_count = "SELECT COUNT(*) FROM AnhAcc WHERE ma_acc = :ma_acc"
        result = db.session.execute(text(sql_count), {"ma_acc": ma})
        so_anh_hien_tai = result.scalar()

        thu_tu = so_anh_hien_tai
        thu_muc_dich = os.path.join("static", "images", "anhacc")
        os.makedirs(thu_muc_dich, exist_ok=True)

        for file in anh:
            if file.filename == "":
                continue

            thu_tu += 1
            _, ext = os.path.splitext(file.filename)

            ten_moi = f"{ma}_{thu_tu}{ext}"
            duong_dan_moi = os.path.join(thu_muc_dich, ten_moi)
            duong_dan = f"/static/images/anhacc/{ten_moi}"

            file.save(duong_dan_moi)

            sql_insert = """
                INSERT INTO AnhAcc (ma_acc, duong_dan, thu_tu)
                VALUES (:ma_acc, :duong_dan, :thu_tu)
            """

            db.session.execute(
                text(sql_insert),
                {"ma_acc": ma, "duong_dan": duong_dan, "thu_tu": thu_tu}
            )

        db.session.commit()

    return jsonify({"status": "success"})