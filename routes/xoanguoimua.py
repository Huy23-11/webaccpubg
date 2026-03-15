from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text

xoanguoimua_bp = Blueprint("xoanguoimua_bp",__name__)

@xoanguoimua_bp.route("/xoanguoimua", methods = ["POST"])
def xoanguoimua():
    """
    Xóa người mua
    ---
    tags:
      - NguoiMua
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            ma_nguoi_mua:
              type: integer
              example: 3
              description: Mã người mua cần xóa
    responses:
      200:
        description: Xóa người mua thành công
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    data = request.get_json()
    ma = data.get("ma_nguoi_mua")

    sql = """
        DELETE FROM NguoiMua
        WHERE ma_nguoi_mua = :ma
    """

    db.session.execute(text(sql), {"ma": ma})
    db.session.commit()

    return jsonify({"status": "success"})