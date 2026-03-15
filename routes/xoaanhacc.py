from flask import Blueprint, jsonify, request
from extensions import db
from sqlalchemy import text
import os

xoaanhacc_bp = Blueprint("xoaanhacc_bp", __name__)

@xoaanhacc_bp.route("/xoaanhacc", methods=["POST"])
def xoaanhacc():
    """
    Xóa ảnh của acc
    ---
    tags:
      - Acc
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            ma_anh:
              type: integer
              example: 12
              description: Mã ảnh cần xóa
    responses:
      200:
        description: Xóa ảnh thành công
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    data = request.get_json()
    ma_anh = data.get("ma_anh")

    sql_select = text("SELECT duong_dan FROM AnhAcc WHERE ma_anh = :ma_anh")
    result = db.session.execute(sql_select, {"ma_anh": ma_anh})
    row = result.fetchone()

    if row:
        duong_dan = row.duong_dan
        file_path = os.path.join("static", "images", "anhacc", duong_dan)

        if os.path.exists(file_path):
            os.remove(file_path)

    sql_delete = text("DELETE FROM AnhAcc WHERE ma_anh = :ma_anh")
    db.session.execute(sql_delete, {"ma_anh": ma_anh})
    db.session.commit()

    return jsonify({"status": "success"})